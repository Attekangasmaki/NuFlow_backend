import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
  console.log('Headers:', req.headers); // Debugging headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing or invalid' });
  }

  try {
    // Debugging: log the decoded token content
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decodedToken); // This should contain user data like user_id

    req.user = decodedToken; // Set the user data into the request
    console.log('authenticateToken → req.user:', req.user);
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    error.status = 403;
    next(error);
  }
};

export { authenticateToken };
