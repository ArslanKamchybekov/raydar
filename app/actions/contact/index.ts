"use server";

import nodemailer from "nodemailer";

interface EmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendEmail(data: EmailData) {

  const { name, email, message } = data;

  if (!name || !email || !message) {
    throw new Error("Missing required fields");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "arslankamcybekov7@gmail.com",
        pass: "hvxg mdfs bekl shfu",
      },
    });

    await transporter.verify().catch((error) => {
      console.error("SMTP Verification Error:", error);
      throw new Error("SMTP configuration error");
    });

    const mailOptions = {
      from: "arslankamcybekov7@gmail.com",
      replyTo: email,
      to: "arslankamcybekov7@gmail.com",
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to send email"
    );
  }
}