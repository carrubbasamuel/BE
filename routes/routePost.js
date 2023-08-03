const express = require('express');
const mongo = require('mongoose');
const SchemaPost = require('../models/SchemaPost');

const { validateMiddleware, validationNewPost } = require('../middleware/midValidationExpress');//midValidationExpress validazione post
const checkFilePresence = require('../middleware/midCheckFilePresence');// midCheckFilePresence verifica presenza file o URL sulla rotta posted
const controllerPosts = require('../middleware/midControllPosts');//midControllPosts controlla se il post è salvato o meno dall'utente loggato


const router = express.Router();




router.get('/posts', async (req, res) => {
  const { page = 1, itemForPage = 9 } = req.query;

  try {
    const totalPostsCount = await SchemaPost.countDocuments();
    const allPosts = await SchemaPost.find()
      .populate({
        path: 'author',
        select: 'name surname avatar',
      })
      .limit(itemForPage)
      .skip((page - 1) * itemForPage)
      .sort({ createdAt: -1 });

    if (allPosts.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'No posts found!',
      });
    }

    const posts = controllerPosts(allPosts, req);

    res.status(200).json({
      statusCode: 200,
      message: 'Posts retrieved successfully',
      posts,
      pagination: Math.ceil(totalPostsCount / itemForPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});






// New Post
router.post('/posted', checkFilePresence('coverImg'), validationNewPost, validateMiddleware, (req, res) => {
  const cover = req.file ? req.file.secure_url : undefined;
  const newPost = new SchemaPost({
    title: req.body.title,
    category: req.body.category,
    cover: cover || req.body.coverImg,
    readTime: {
      value: req.body.readTime,
      unit: 'minute',
    },
    content: req.body.content,
    author: req.userId,
  });



  newPost.save()
    .then((newPost) => {
      res.status(201).send({
        statusCode: 201,
        message: 'Post created successfully',
        newPost,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({
        statusCode: 500,
        message: 'Internal server error',
      });
    });
});




// Get posts by author
router.get('/MyPosts', (req, res) => {
  SchemaPost.find({ author: req.userId })
    .populate({
      path: 'author',
      select: 'name surname avatar',
    })
    .then((allPosts) => {
      if (allPosts.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          message: 'No posts found!',
        });
      }

      const posts = controllerPosts(allPosts, req);

      res.status(200).json({
        statusCode: 200,
        message: 'Posts retrieved successfully',
        posts,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    });
});


//Delate post by id
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  SchemaPost.findByIdAndDelete(id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Post not found!',
        });
      }
      res.status(200).json({
        statusCode: 200,
        message: 'Post deleted successfully',
        post,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    });
});


//Save a post 
router.patch('/save/:id', (req, res) => {
  const { id } = req.params;
  SchemaPost.findByIdAndUpdate(id, { $push: { howSave: req.userId } }, { new: true })
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Post not found!',
        });
      }
      res.status(200).json({
        statusCode: 200,
        message: 'Post saved successfully',
        post,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    });
});



//Unsave a post
router.patch('/unsave/:id', (req, res) => {
  const { id } = req.params;
  SchemaPost.findByIdAndUpdate(id, { $pull: { howSave: req.userId } }, { new: true })
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Post not found!',
        });
      }
      res.status(200).json({
        statusCode: 200,
        message: 'Post unsaved successfully',
        post,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    });
});

//Get saved posts
router.get('/saved', (req, res) => {
  SchemaPost.find({ howSave: req.userId })
    .populate({
      path: 'author',
      select: 'name surname avatar',
    })
    .then((allPosts) => {
      if (allPosts.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          message: 'No posts found!',
        });
      }

      const posts = controllerPosts(allPosts, req);

      res.status(200).json({
        statusCode: 200,
        message: 'Posts retrieved successfully',
        posts,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    });
});

router.patch('/like/:id', (req, res) => {
  const { id } = req.params;
  SchemaPost.findByIdAndUpdate(id, { $push: { likes: req.userId } }, { new: true })
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Post not found!',
        });
      }
      res.status(200).json({
        statusCode: 200,
        message: 'Post liked successfully',
        post,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    });

});

router.patch('/unlike/:id', (req, res) => {
  const { id } = req.params;
  SchemaPost.findByIdAndUpdate(id, { $pull: { likes: req.userId } }, { new: true })

    .then((post) => {
      if (!post) {

        return res.status(404).json({
          statusCode: 404,
          message: 'Post not found!',
        });
      }
      res.status(200).json({
        statusCode: 200,
        message: 'Post unliked successfully',
        post,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    });

});




module.exports = router;
