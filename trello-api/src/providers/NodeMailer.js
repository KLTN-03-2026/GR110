import nodemailer from 'nodemailer'
import ejs from 'ejs'
import path from 'path'
import { env } from '~/config/environment'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD
  }
})

export const sendEmailService = async ({
  recipientEmail,
  customSubject,
  htmlContent = '',
  templateName = '',
  data = {}
}) => {
  console.log('sendEmailService')
  let finalHtmlContent = htmlContent

  if (templateName) {
    const templatePath = path.join(
      process.cwd(),
      'src/views',
      `${templateName}.ejs`
    )

    finalHtmlContent = await ejs.renderFile(templatePath, data)
  }

  console.log('start sending email')

  const info = await transporter.sendMail({
    from: env.EMAIL_USERNAME,
    to: recipientEmail,
    subject: customSubject,
    html: finalHtmlContent
  })

  console.log('done sending email')
  return info
}
