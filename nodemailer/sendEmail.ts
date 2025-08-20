"use server";

import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  text,
  activationLink,
}: {
  to: string;
  subject: string;
  text: string;
  activationLink?: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const linkToUse = activationLink || text.split(': ')[1]; // Extract URL from text if activationLink not provided

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Click this link to create your account on the car tracker software:</p>
        <a href="${linkToUse}" target="_blank" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Activate Your Account</a>
        <p>The link expires in 24 hours.</p>
        <p>If you did not request this, please ignore this email.</p>
        
        <p>If the button doesn't work, copy and paste this link:</p>
        <p>${linkToUse}</p>
      </div>
    `,
  });
}
