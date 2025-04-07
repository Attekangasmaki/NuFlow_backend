import 'dotenv/config';
import fetch from 'node-fetch';

//import {customError} from '../middlewares/error-handler.js';

// Kubios API base URL should be set in .env
const baseUrl = process.env.KUBIOS_API_URI;

/**
* Get user data from Kubios API example
* TODO: Implement error handling
* @async
* @param {Request} req Request object including Kubios id token
* @param {Response} res
* @param {NextFunction} next
*/
const getLatestKubiosHrvValues = async (req, res, next) => {
  try {
    const { kubiosIdToken } = req.user;

    if (!kubiosIdToken) {
      const error = new Error('Missing Kubios ID token.');
      error.status = 400;
      throw error;
    }

    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT || 'Default-Agent');
    headers.append('Authorization', kubiosIdToken);

    const response = await fetch(
      baseUrl + '/result/self?from=2022-01-01T00%3A00%3A00%2B00%3A00',
      {
        method: 'GET',
        headers: headers,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`Kubios API request failed: ${response.statusText}`);
      error.status = response.status;
      error.details = errorText;
      throw error;
    }

    const data = await response.json();
    const results = data.results;

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No Kubios data found' });
    }

    // Lajitellaan uusimman perusteella
    const latest = results.sort((a, b) => new Date(b.create_timestamp) - new Date(a.create_timestamp))[0];
    const r = latest.result;

    const filtered = {
      daily_result: latest.daily_result,
      heart_rate: r.mean_hr_bpm,
      rmssd: r.rmssd_ms,
      mean_rr: r.mean_rr_ms,
      sdnn: r.sdnn_ms,
      pns_index: r.pns_index,
      sns_index: r.sns_index
    };

    return res.json(filtered);
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};




/**
* Get user info from Kubios API example
* TODO: Implement error handling
* @async
* @param {Request} req Request object including Kubios id token
* @param {Response} res
* @param {NextFunction} next
*/
const getUserInfo = async (req, res, next) => {
  try {
    const { kubiosIdToken } = req.user;

    if (!kubiosIdToken) {
      const error = new Error('Missing Kubios ID token.');
      error.status = 400;
      throw error;
    }

    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT || 'Default-Agent');
    headers.append('Authorization', kubiosIdToken);

    const response = await fetch(baseUrl + '/user/self', {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`Kubios API request failed: ${response.statusText}`);
      error.status = response.status;
      error.details = errorText;
      throw error;
    }

    const userInfo = await response.json();
    return res.json(userInfo);

  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

/* const getUserKubiosAndSave = async (req, res, next) => {
  try {
    const { kubiosIdToken, user_id } = req.user;

    if (!kubiosIdToken) {
      return res.status(400).json({ message: 'Missing Kubios ID token.' });
    }

    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT || 'Default-Agent');
    headers.append('Authorization', kubiosIdToken);

    const response = await fetch(
      'https://analysis.kubioscloud.com/v2/result/self?from=2022-01-01T00%3A00%3A00%2B00%3A00',
      {
        method: 'GET',
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Kubios API error: ${response.status}`);
    }

    const kubiosData = await response.json();

    await insertKubiosHrvData(user_id, kubiosData);

    res.status(200).json({ message: 'Kubios HRV data saved.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}; */
const getAllKubiosHrvValues = async (req, res, next) => {
  try {
    const { kubiosIdToken } = req.user;

    if (!kubiosIdToken) {
      const error = new Error('Missing Kubios ID token.');
      error.status = 400;
      throw error;
    }

    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT || 'Default-Agent');
    headers.append('Authorization', kubiosIdToken);

    const response = await fetch(
      baseUrl + '/result/self?from=2022-01-01T00%3A00%3A00%2B00%3A00',
      {
        method: 'GET',
        headers: headers,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`Kubios API request failed: ${response.statusText}`);
      error.status = response.status;
      error.details = errorText;
      throw error;
    }

    const data = await response.json();
    const results = data.results;

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No Kubios data found' });
    }

    // Poimitaan vain halutut kentät kaikista tuloksista
    const filteredResults = results.map(entry => {
      const r = entry.result;
      return {
        daily_result: entry.daily_result,
        heart_rate: r.mean_hr_bpm,
        rmssd: r.rmssd_ms,
        mean_rr: r.mean_rr_ms,
        sdnn: r.sdnn_ms,
        pns_index: r.pns_index,
        sns_index: r.sns_index
      };
    });

    return res.json(filteredResults);
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
};

const updateKubiosUserInfo = async (req, res, next) => {
  try {
    const { kubiosIdToken } = req.user;
    const updateData = req.body;

    // Varmistetaan, että Kubiosin ID token on olemassa
    if (!kubiosIdToken) {
      const error = new Error('Missing Kubios ID token.');
      error.status = 400;
      throw error;
    }

    // Varmistetaan, että päivitykselle on annettu vähintään yksi kenttä
    if (!updateData || Object.keys(updateData).length === 0) {
      const error = new Error('At least one field must be provided for update.');
      error.status = 400;
      throw error;
    }

    // Ei sallita emailin tai syntymäajan muuttamista
    if (updateData.email || updateData.birthdate) {
      const error = new Error('Email and birthdate cannot be modified.');
      error.status = 400;
      throw error;
    }

    // Määritellään tarvittavat otsikot
    const headers = new Headers();
    headers.append('Authorization', kubiosIdToken);
    headers.append('Content-Type', 'application/json');

    // Päivitetään käyttäjän tiedot Kubiosin API:ssa
    const response = await fetch('https://analysis.kubioscloud.com/v2/user/self', {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(updateData),
    });

    // Jos API-kutsu epäonnistuu, heitetään virhe
    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`Kubios update failed: ${response.statusText}`);
      error.status = response.status;
      error.details = errorText;
      throw error;
    }

    // Jos päivitys onnistuu, palautetaan päivitetty käyttäjä
    const updatedUser = await response.json();
    return res.json(updatedUser);
  } catch (err) {
    // Jos virheellä ei ole omaa statuskoodia, asetetaan oletusarvo 500
    err.status = err.status || 500;
    // Viedään virhe seuraavaan virheenkäsittelijään
    next(err);
  }
};



export { getLatestKubiosHrvValues, getAllKubiosHrvValues, getUserInfo, updateKubiosUserInfo };
