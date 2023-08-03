const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.KEY_JWT;


const generateToken = (user) => {
  const jwtSecretKey = process.env.KEY_JWT;
  const token = jwt.sign({
    userId: user._id,
    email: user.email
  }, jwtSecretKey, {
    expiresIn: '5h',
  });
  return token;
};



const verifyToken = (req, res, next) => {

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token');
    return res.status(401).send({ statusCode: 401, message: 'Unauthorized' });
  }
  jwt.verify(token, jwtSecretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).send({ statusCode: 401, message: 'Invalid token' });
    }
    req.userId = decodedToken.userId;
    next();
  });
};


module.exports = {
  generateToken,
  verifyToken,
};