const express = require('express');
const bcrypt = require('bcrypt');


const SchemaUser = require('../models/SchemaUser');
const SchemaPost = require('../models/SchemaPost');
const SchemaReview = require('../models/SchemaReview');
const SchemaNotifica = require('../models/SchemaNotifica');

// Router
const router = express.Router();


const bcrypterAuth = require('../middleware/midAuthLogin');
const { verifyToken } = require('../middleware/midJWT');
const { validationNewUser, validateMiddleware } = require('../middleware/midValidationExpress');
const { sendMail, template } = require('../middleware/midNodemailer');
const checkFilePresence = require('../middleware/midCheckFilePresence');




// Login decrypting pw
router.post('/login', bcrypterAuth, (req, res) => {
  try {
    const { token, user } = req;
    if (token) {
      res.status(200).send({
        statusCode: 200,
        message: 'Login successfully',
        token,
        user
      });
    } else {
      res.status(401).send({
        statusCode: 401,
        message: 'Authentication failed',
      });
    }
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Internal server error',
      error,
    });
  }
});


router.post('/register', validationNewUser, validateMiddleware, async (req, res) => {
  try {
    const user = await SchemaUser.findOne({ email: req.body.email });

    if (user) {
      return res.status(409).json({
        statusCode: 409,
        message: 'Email already exists',
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const newUser = new SchemaUser({
        ...req.body,
        password: hash, // Hash password
      });

      await newUser.save();

      // Send email with mailgun
      const data = { username: req.body.name };
      const emailcontent = template(data);

      const mailOptions = {
        from: 'StriveBlog@estriveschool.email', // Mittente
        to: req.body.email, // Destinatario
        subject: '🎉 Welcome to Strive Blog 🚀', // Oggetto dell'email
        html: emailcontent, // Contenuto dell'email
      };

      sendMail(mailOptions);

      res.status(201).json({
        message: 'User added successfully',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});




// Delete user and related posts and reviews
router.delete('/delete', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {

    const delateReview = await SchemaReview.deleteMany({ authorId: userId });
    const deletedPosts = await SchemaPost.deleteMany({ author: userId });
    const deleteNotificas = await SchemaNotifica.deleteMany({ $or: [{ sender: userId }, { reciver: userId }] });
    const deleteLike = await SchemaPost.updateMany({ likes: userId }, { $pull: { likes: userId } });
    const deleteSave = await SchemaPost.updateMany({ saved: userId }, { $pull: { saved: userId } });
    const deletedUser = await SchemaUser.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.status(201).json({
      message: 'User and related posts deleted successfully',
      data: {
        deletedUser,
        deletedPosts,
        delateReview,
        deleteLike,
        deleteSave,
        deleteNotificas,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});



// Update user avatar
router.patch('/updateAvatar', checkFilePresence('avatar'), verifyToken, async (req, res) => {
  const userId = req.userId;
  const avatar = req.file?.secure_url;
  SchemaUser.findOne({ _id: userId }).then((user) => {
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    SchemaUser.findByIdAndUpdate(userId, { avatar }, { new: true })
      .then((user) => {
        res.status(201).json({
          statusCode: 201,
          message: 'User avatar updated successfully',
          user: {
            email: user.email,
            name: user.name,
            surname: user.surname,
            avatar: user.avatar,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
        });
      });
  });
});

const controllerPost = require('../middleware/midControllPosts')
//fetch an author
router.get('/user/:id',verifyToken, async (req, res) => {
  try {
    const user = await SchemaUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    const allPosts = await SchemaPost.find({ author: req.params.id }).populate('author', 'name surname avatar');
    const posts = controllerPost(allPosts, req);
    res.status(200).json({
      statusCode: 200,
      message: 'User fetched successfully',
      userSelected: {
        user:{
          email: user.email,
          name: user.name,
          surname: user.surname,
          avatar: user.avatar,
        },
        userPosts: posts,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});





module.exports = router;

