import nodemailer from "nodemailer";

class EmailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    });
  }

  async sendMail({ to, subject, text, html }) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Magic Search Cards" <magic.search@gmail.com>',
        to: to,
        subject: subject,
        text: text,
        html: html
      });
      console.log("Message sent:", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

export default new EmailSender();
