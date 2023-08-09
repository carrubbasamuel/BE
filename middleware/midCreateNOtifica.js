const SchemaNotifica = require('../models/SchemaNotifica');
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
    next();
};


const sendUnlike = async (idAuthor, req, res, next) => {
    const socketServer = req.app.get('socketServer');
    const connectedUsers = req.app.get('connectedUsers');
    const find = await SchemaUser.findById(idAuthor);

    if (find) {
        socketServer.to(connectedUsers[idAuthor]).emit('unlike');
        next();
    }
    next();
    
};


module.exports = {
    sendLike,
    sendUnlike,
};
