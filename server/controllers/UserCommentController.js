const {UserComment, User} = require('../models/models');

class UserCommentController {

    /*добавление коммента*/
    async addOne(req, res) {
        try {
            let {userId, description} = req.body;
            if (!userId || !description) {
                return res.status(400).json('Bad Request');
            }
            const user = await User.findOne({where: {id: userId}});
            const role = user.role;
            const userName = user.name;
            if (role === 'USER') {
                await UserComment.create({
                    description: description,
                    userName: userName,
                    userId: userId,
                })
            }
            if (role === 'ADMIN') {
                await UserComment.create({
                    description: description,
                    userName: userName,
                    userId: userId,
                    isModeration: true,
                })
            }
            return res.json(`Комментарий успешно добавлен`);
        } catch  {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*получение всех комментов*/
    async getAll(req, res) {
        try {
            const comments = await UserComment.findAll({where: {isModeration: true}, order: [['createdAt', 'DESC']]});
            return res.json(comments);
        } catch  {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*получение комментов для модерации*/
    async getForModeration(req, res) {
        try {
            const {userId} = req.params;
            const user = await User.findOne({where: {id: userId}});
            const role = user.role;
            if (role === 'USER') {
                return res.status(403).json('Forbidden');
            }
            if (role === 'ADMIN') {
                const comments = await UserComment.findAll({
                    where: {isModeration: false},
                    order: [['createdAt', 'ASC']]
                });
                return res.json(comments);
            }
        } catch  {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*коммент прошел модерацию*/
    async updateAfterModeration(req, res) {
        try {
            let {commentId, userId} = req.body;
            const user = await User.findOne({where: {id: userId}});
            const role = user.role;
            if (role === 'USER') {
                return res.status(403).json('Forbidden');
            }
            if (role === 'ADMIN') {
                await UserComment.update({isModeration: true}, {where: {id: commentId}})
            }
            return res.json(`Комментарий прошел модерацию`)
        } catch  {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*получение комментов для редактирования (если обычный пользователь, то только свои комменты,
     а если админ, то все) */
    async getForEditor(req, res) {
        try {
            const {userId} = req.params;
            const user = await User.findOne({where: {id: userId}});
            const role = user.role;
            if (role === 'USER') {
                const comments = await UserComment.findAll({where: {userId: userId}, order: [['createdAt', 'DESC']]});
                return res.json(comments)
            }
            if (role === 'ADMIN') {
                const comments = await UserComment.findAll({order: [['createdAt', 'DESC']]});
                return res.json(comments)
            }
        } catch  {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*редактирование коммента*/
    async updateComment(req, res) {
        try {
            let {commentId, userId, description} = req.body;
            if (!commentId && !userId || !description) {
                return res.status(400).json('Bad Request');
            }
            const user = await User.findOne({where: {id: userId}});
            const role = user.role;

            if (role === 'USER') {
                await UserComment.update({
                        description: description,
                        isModeration: false,
                    },
                    {where: {id: commentId}});
            }
            if (role === 'ADMIN') {
                await UserComment.update({
                        description: description,
                        isModeration: true,
                    },
                    {where: {id: commentId}});
            }
            return res.json(`Комментарий успешно изменен`);
        } catch  {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*удаление коммента*/
    async deleteOne(req, res) {
        try {
            const {id} = req.params;
            await UserComment.destroy({where: {id}});
            return res.json(`Комментарий успешно удален`);
        } catch  {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

}

module.exports = new UserCommentController();