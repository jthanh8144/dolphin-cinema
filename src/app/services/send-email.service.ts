import mailService from '@shared/configs/email.config'

export const sendEmailCreateAdmin = (
  email: string,
  password: string,
  verifyLink: string,
) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Create admin account',
    text: `Your admin account:
    Username: ${email}
    Password: ${password}
    Please verify email in
    ${verifyLink}
    and change password in first login!`,
  }
  return mailService.sendMail(msg)
}

export const sendEmailResetPassword = (email: string, password: string) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Create admin account',
    text: `Your admin account password is reset to ${password}. Please change it after login!`,
  }
  return mailService.sendMail(msg)
}
