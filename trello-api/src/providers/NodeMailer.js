import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import { env } from '~/config/environment'

export const sendEmailService = async ({
  recipientEmail,
  customSubject,
  htmlContent = '',
  templateName = '',
  data = {}
}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: env.EMAIL_USERNAME,
      pass: env.EMAIL_PASSWORD
    }
  })

  let finalHtmlContent = htmlContent

  if (templateName) {
    const templatePath = path.join(
      process.cwd(),
      'src/views',
      `${templateName}.ejs`
    )

    finalHtmlContent = await ejs.renderFile(templatePath, data)
  }

  const info = await transporter.sendMail({
    from: env.EMAIL_USERNAME,
    to: recipientEmail,
    subject: customSubject,
    html: finalHtmlContent
  })

  return info
}