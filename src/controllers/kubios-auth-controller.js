import 'dotenv/config';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import {v4} from 'uuid';
import {customError} from '../../middlewares/error-handler.js';
import {
  insertUser,
  selectUserByEmail,
  selectUserById,
} from '../models/user-model.js';

// Kubios API base URL should be set in .env
const baseUrl = process.env.KUBIOS_API_URI;

// Funktio, joka suorittaa kirjautumisen Kubioksen kautta
const kubiosLogin = async (username, password) => {
  const csrf = v4();
  const headers = new Headers();
  headers.append('Cookie', `XSRF-TOKEN=${csrf}`);
  headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
  const searchParams = new URLSearchParams();
  searchParams.set('username', username);
  searchParams.set('password', password);
  searchParams.set('client_id', process.env.KUBIOS_CLIENT_ID);
  searchParams.set('redirect_uri', process.env.KUBIOS_REDIRECT_URI);
  searchParams.set('response_type', 'token');
  searchParams.set('scope', 'openid');
  searchParams.set('_csrf', csrf);

  const options = {
    method: 'POST',
    headers: headers,
    redirect: 'manual',
    body: searchParams,
  };
  let response;
  try {
    response = await fetch(process.env.KUBIOS_LOGIN_URL, options);
  } catch (err) {
    console.error('Kubios login error', err);
    throw customError('Login with Kubios failed', 500);
  }
  const location = response.headers.raw().location[0];
  // console.log(location);
  // If login fails, location contains 'login?null'
  if (location.includes('login?null')) {
    throw customError(
      'Login with Kubios failed due bad username/password',
      401,
    );
  }
  // If login success, Kubios response location header
  // contains id_token, access_token and expires_in
  const regex = /id_token=(.*)&access_token=(.*)&expires_in=(.*)/;
  const match = location.match(regex);
  const idToken = match[1];
  return idToken;
};


//Hakee käyttäjän tiedot Kubioksesta
const kubiosUserInfo = async (idToken) => {
  const headers = new Headers();
  headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
  headers.append('Authorization', idToken);
  const response = await fetch(baseUrl + '/user/self', {
    method: 'GET',
    headers: headers,
  });
  const responseJson = await response.json();
  if (responseJson.status === 'ok') {
    return responseJson.user;
  } else {
    throw customError('Kubios user info failed', 500);
  }
};


// Synkronisoi Kubios-käyttäjätiedot paikalliseen tietokantaan
const syncWithLocalUser = async (kubiosUser) => {
  // Check if user exists in local db
  let userId;
  const result = await selectUserByEmail(kubiosUser.email);
  // If user with the email not found, create new user, otherwise use existing
  if (result.error) {
    // Create user
    const newUser = {
      username: kubiosUser.email,
      email: kubiosUser.email,
      // Random password, quick workaround for the required field
      password: v4(),
    };
    const newUserId = await insertUser(newUser);
    userId = newUserId;
  } else {
    userId = result.user_id;
  }
  console.log('syncWithLocalUser userId', userId);
  return userId;
};

// Controller-funktio kirjautumiseen
const postLogin = async (req, res, next) => {
  const {username, password} = req.body;
  // console.log('login', req.body);
  try {
    // Try to login with Kubios
    const kubiosIdToken = await kubiosLogin(username, password);
    const kubiosUser = await kubiosUserInfo(kubiosIdToken);
    const localUserId = await syncWithLocalUser(kubiosUser);
    // Include kubiosIdToken in the auth token used in this app
    // NOTE: What is the expiration time of the Kubios token?
    const token = jwt.sign(
      {userId: localUserId, kubiosIdToken},
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
    return res.json({
      message: 'Logged in successfully with Kubios',
      user: kubiosUser,
      user_id: localUserId,
      token,
    });
  } catch (err) {
    console.error('Kubios login error', err);
    return next(err);
  }
};

// Controller-funktio käyttäjän tietojen hakemiseen
const getMe = async (req, res) => {
  const user = await selectUserById(req.user.userId);
  res.json({user, kubios_token: req.user.kubiosIdToken});
};

export { postLogin, getMe };
