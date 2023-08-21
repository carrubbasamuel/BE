const SchemaNotifica = require('../models/SchemaNotifica');
const SchemaPost = require('../models/SchemaPost');
const SchemaUser = require('../models/SchemaUser');



const sendLike = async (post, req, res, next) => {
    const socketServer = req.app.get('socketServer');
    const connectedUsers = req.app.get('connectedUsers');

    const find = await SchemaUser.findById({ _id: post.author });

    if (find) {
        const newNotifica = new SchemaNotifica({
            postId: post._id,
            reciver: post.author,
            sender: req.userId,
            message: `${req.name} likes your post`,

        });
        await newNotifica.save();
    }
    socketServer.to(connectedUsers[post.author]).emit('like', req.name + " likes your post");
   return
};


const sendUnlike = async (idAuthor, req, res, next) => {
    const socketServer = req.app.get('socketServer');
    const connectedUsers = req.app.get('connectedUsers');
    const find = await SchemaUser.findById(idAuthor);

    if (find) {
        socketServer.to(connectedUsers[idAuthor]).emit('unlike');
       return
    }
   return
    
};


const sendComment = async (post, req, res) => {
    const socketServer = req.app.get('socketServer');
    const connectedUsers = req.app.get('connectedUsers');



 
    if(post.author.toString() === req.userId){
        return
    }

    const find = await SchemaUser.findById({ _id: post.author });

    if (find) {
        const newNotifica = new SchemaNotifica({
            postId: post._id,
            reciver: post.author,
            sender: req.userId,
            message: `${req.name} commented your post`,
        });
        await newNotifica.save();
    }
    socketServer.to(connectedUsers[post.author]).emit('comment', req.name + " commented your post");
    return
};


const sendUncomment = (idPost, req, res, next) => {
    const socketServer = req.app.get('socketServer');
    const connectedUsers = req.app.get('connectedUsers');
    SchemaNotifica.findOneAndDelete({ sender: req.userId, postId: idPost, message: req.name + " commented your post" })
    .then((notifica) => {
        console.log("Notifica eliminata" + notifica);
    })
    .then(() => {
        SchemaPost.findById(idPost).then(post => {
            socketServer.to(connectedUsers[post.author]).emit('uncomment');
            return
        })
    })

    return;
};


module.exports = {
    sendLike,
    sendUnlike,
    sendComment,
    sendUncomment,
};
