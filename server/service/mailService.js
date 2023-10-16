const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

class MailService {

    sendActivationMail = (to, textForEmail, link) => {
        transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Вас приветствует ОНЛАЙН ЮРИСТ',
            text: '',
            html:
                `
                    <div>
                        <h1>${textForEmail}</h1>
                        <a style={{height: 20}} href="${link}">${link}</a>
                        <p>
                        Письмо создано автоматически. Если Вы не обращались на сайт ОНЛАЙН ЮРИСТ просто проигнорируйте данное сообщение
                        </p>
                    </div>
                `
        })
    };

}

module.exports = new MailService();
