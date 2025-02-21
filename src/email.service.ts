import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import Handlebars from 'handlebars';
dotenv.config();

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Initialize transporter using Gmail SMTP settings
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      // host: process.env.SMTP_HOST || '',
      // secure: true,
      // port: Number(process.env.SMTP_PORT) || 465,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Method to send email
  async sendEmail(
    to: string,
    subject: string,
    options: { templateName: string; context: any },
  ): Promise<void> {
    const htmlBody = this.templateToHtml(options.templateName, options.context);

    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to,
      subject,
      html: htmlBody,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  templateToHtml(templateName, context) {
    const templatePath = resolve(
      __dirname,
      'templates',
      `${templateName}.html`,
    );
    const content = readFileSync(templatePath).toString('utf-8');
    const template = Handlebars.compile(content, {
      noEscape: true,
    });
    const intlData = {
      locales: 'en-US',
    };
    return template(context, {
      data: { intl: intlData },
    });
  }
}
