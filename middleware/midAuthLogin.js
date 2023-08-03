const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SchemaUser = require('../models/SchemaUser');
const { generateToken } = require('./midJWT');




const bcrypterAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await SchemaUser.findOne({ email });

    if (!user) {
      return res.status(401).send({ statusCode: 401, message: 'Authentication failed' });
    }

    const validPassword = await bcrypt.compare(password, user.password);// Confronta la password inviata con quella salvata nel DB e la decripta per confrontarla

    if (!validPassword) {
      return res.status(401).send({ statusCode: 401, message: 'Authentication failed' });
    }

    const token = generateToken(user);

    req.token = token;
    req.user = {
      email: user.email,
      name: user.name,
      surname: user.surname,
      avatar: user.avatar,
    }
    next();
  } catch (error) {
    res.status(500).send({ statusCode: 500, message: 'Internal server error', error });
  }
};

module.exports = bcrypterAuth;
