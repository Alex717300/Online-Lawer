const {User, Token, ChangePasswordLink} = require('../models/models');
const mailService = require('../service/mailService');
const {validationResult} = require('express-validator');
const tokenService = require('../service/tokenService');
const uuid = require('uuid');
const bcrypt = require('bcrypt');


class UserController {

    /*регистрация*/
    async registration(req, res) {
        try {
            const {name, email, password, role} = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json('Проверьте правильность заполнения полей')
            }
            const candidate = await User.findOne({where: {email}})
            if (candidate) {
                return res.status(400).json('Пользователь с таким email уже существует')
            }
            const activationLink = uuid.v4();
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({name, email, password: hashPassword, role, activationLink: activationLink});
            const userDto = (user.id, user.name, user.email, user.role, user.isActivated)
            const refreshToken = tokenService.generateRefreshJwt({userDto});
            await Token.create({refreshToken: refreshToken, userId: user.id});
            await ChangePasswordLink.create({passwordResetLink: null, userId: user.id});
            const textForEmail = "Для завершения регистрации перейдите по ссылке:"
            await mailService.sendActivationMail(email, textForEmail, `${process.env.CLIENT_URL}/activate/${activationLink}`);
            return res.json('На Вашу почту отправлено письмо. Для завершения регистрации перейдите по ссылке в письме');
        } catch (err) {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*активация*/
    async activate(req, res) {
        try {
            const {activationLink} = req.params
            const user = await User.findOne({
                where: {activationLink},
            })
            if (!user) {
                return res.status(400).json('Неккоректная ссылка активации')
            }
            if (user) {
                await User.update({
                        isActivated: true
                    },
                    {
                        where: {activationLink},
                    })
                return res.json('Почтовый ящик успешно подтвержден')
            }
        } catch {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*вход(логин)*/
    async login(req, res) {
        try {
            const {email, password} = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json('Проверьте правильность заполнения полей')
            }
            const user = await User.findOne({where: {email}})
            if (!user) {
                return res.status(400).json('Неверный email или пароль');
            }
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return res.status(400).json('Неверный email или пароль');
            }
            const userId = user.id;
            const userDto = await User.findOne({
                attributes: ['id', 'name', 'role', 'isActivated'], where: {id: userId}
            });
            const accessToken = tokenService.generateAccessJwt({userDto});
            const refreshToken = tokenService.generateRefreshJwt({userDto});
            await Token.update({refreshToken: refreshToken}, {where: {userId}});
            /*При использовании https установить sameSite: "lax", secure:true*/
            res.cookie('refreshToken', refreshToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json({accessToken, userDto});
        } catch {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };


    /*обновление токена*/
    async refresh(req, res) {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                return res.status(401).json('Вы не авторизованы!!!');
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await Token.findOne({where: {refreshToken}});
            if (!userData || !tokenFromDb) {
                return res.status(401).json('Вы не авторизованы&');
            }
            const userId = tokenFromDb.userId;
            const userDto = await User.findOne({
                attributes: ['id', 'name', 'role', 'isActivated'], where: {id: userId}
            });
            const accessToken = tokenService.generateAccessJwt({userDto});
            const newRefreshToken = tokenService.generateRefreshJwt({userDto});
            await Token.update({refreshToken: newRefreshToken}, {where: {userId}});
            res.cookie('refreshToken', newRefreshToken, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json({accessToken});
        } catch {
            return res.status(500).json('Непредвиденная ошибка')
        }
    }

    /*выход (logout)*/
    async logout(req, res) {
        try {
            const {id} = req.params;
            const userId = id;
            await Token.update({refreshToken: null}, {where: {userId}});
            res.cookie('refreshToken', userId, {maxAge: -1000, httpOnly: true});
            return res.status(200).json("Успешный выход");
        } catch {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*создание ссылки для восстановления пароля*/
    async addResetLink(req, res) {
        try {
            const {email} = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json('Проверьте правильно ли написан Ваш email')
            }
            const user = await User.findOne({where: {email}})
            if (!user) {
                return res.status(400).json('Ошибка в доступе');
            }
            const userId = user.id
            const resetLink = uuid.v4();
            await ChangePasswordLink.update({passwordResetLink: resetLink}, {where: {userId}});
            const textForEmail = "Для возможности смены пароля перейдите по ссылке:"
            await mailService.sendActivationMail(email, textForEmail, `${process.env.CLIENT_URL}/verificationResetLink/${resetLink}`);
            return res.json('На Вашу почту отправлено письмо. Для возможности смены пароля перейдите по ссылке в письме');
        } catch {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*проверка email для восстановления пароля*/
    async verificationResetLink(req, res) {
        try {
            const {passwordResetLink} = req.params
            const dayInMs = 24 * 60 * 60 * 1000
            const changePasswordLink = await ChangePasswordLink.findOne({
                where: {passwordResetLink},
            })
            if (!changePasswordLink) {
                return res.status(400).json('Неккоректная ссылка')
            }
            if (changePasswordLink) {
                const currentAgeLink = Date.parse(new Date(Date.now())) - Date.parse(changePasswordLink.updatedAt)
                if (currentAgeLink > dayInMs) {
                    return res.status(400).json('Неккоректная ссылка')
                }
                if (currentAgeLink < dayInMs) {
                    return res.json('90104028-722b-4eb0-b1e7-e307f735255b')
                }
            }
        } catch {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*смена пароля*/
    async changePassword(req, res) {
        try {
            const {email, password} = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json('Проверьте правильность заполнения полей')
            }
            const user = await User.findOne({where: {email}})
            if (!user) {
                return res.status(400).json('Проверьте правильно ли написан Ваш email');
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const userId = user.id
            if (user) {

                await User.update({password: hashPassword}, {where: {email}});

                await ChangePasswordLink.update({passwordResetLink: null}, {where: {userId}});

                return res.json('Пароль успешно изменен')
            }
        } catch {
            return res.status(500).json('Непредвиденная ошибка')
        }
    };

    /*отправка номера тлф с просьбой перезвонить*/
    async sendNumberPhone(req, res) {
        try {
            const {numberPhone} = req.body;
            const textForEmail = `Просьба позвонить: ${numberPhone}`;
            await mailService.sendActivationMail(process.env.ADMIN_EMAIL, textForEmail, ``);
            return res.json('Спасибо за обращение. Вам позвонят при первой же возможности');
        } catch {
            return res.status(500).json('Непредвиденная ошибка');
        }
    }

}


module.exports = new UserController();
