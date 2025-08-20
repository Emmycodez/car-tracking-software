import { sendEmail } from "@/nodemailer/sendEmail";

export const sendActivationEmail = async (email: string, activationLink: string) => {
  const subject = "Activate Your Account";
  const text = `Please click the following link to activate your account: ${activationLink}`;
     
  try {
    await sendEmail({
      to: email,
      subject,
      text,
      activationLink, // Pass the actual URL
    });
    console.log(`Activation email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send activation email to ${email}:`, error);
  }
};