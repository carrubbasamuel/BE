const {uploadCover} = require('../middleware/midMulter');
const {uploadAvatar} = require('../middleware/midMulter');

const checkFilePresence = (nameFile) => (req, res, next) => {
  if (nameFile === 'avatar') {
    if (req.body.avatar) {
      next();
    } else {
      uploadAvatar.single('avatar')(req, res, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            statusCode: 500,
            message: 'Internal server error',
          });
        }
        if (req.file) {
          req.file.secure_url = req.file.path;
        }
        next();
      });
    }
  } else if (nameFile === 'coverImg') {
    if (req.body.image) {
      next();
    } else {
      uploadCover.single('coverImg')(req, res, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            statusCode: 500,
            message: 'Internal server error',
          });
        }
        if (req.file) {
          req.file.secure_url = req.file.path;
        }
        next();
      });
    }
  }
};

module.exports = checkFilePresence;
