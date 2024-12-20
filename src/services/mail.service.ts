import * as nodemailer from "nodemailer";

class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
  }
  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      to,
      subject,
      html
    };
    await this.transporter.sendMail(mailOptions);
  }
}

const mailService = new MailService();

export { mailService };