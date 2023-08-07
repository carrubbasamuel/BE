const SchemaNotifica = require('../models/SchemaNotifica');
const SchemaUser = require('../models/SchemaUser');


const sendLike = async (idAuthor, req, res, next) => {
    const socketServer = req.app.get('socketServer');
    const connectedUsers = req.app.get('connectedUsers');

    const find = await SchemaUser.findById(idAuthor);
    console.log(find);
    if (find) {
        const newNotifica = new SchemaNotifica({
            reciver: idAuthor,
            sender: `${req.userId} ha messo like al tuo post`,
        });
        await newNotifica.save();
    }
    socketServer.to(connectedUsers[idAuthor]).emit('mydelivered', find.name + "  ha messo like al tuo post");
    next();
};

module.exports = sendLike;
