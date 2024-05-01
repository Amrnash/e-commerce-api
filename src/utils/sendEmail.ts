import formData from "form-data";
import Mailgun from "mailgun.js";

//@ts-ignore
const mailgun = new Mailgun(formData);
export const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});

export async function sendEmail(to: string, confirmationLink: string) {
  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: "amrnashaat0@gmail.com",
      to: [to],
      subject: "Confirmation Link",
      html: `
    <h1>E-commerce Confirmation Link</h1>
    <p>Kindly naviagate to this link ${confirmationLink} to confirm your email</p>
    `,
    });
  } catch (err) {
    console.error(err);
  }
}
