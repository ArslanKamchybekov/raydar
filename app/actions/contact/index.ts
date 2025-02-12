"use server";

import { clerkClient } from "@/lib/clerk";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";

interface EmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendEmail(data: EmailData) {
  // Get user from Clerk
  const user = await currentUser();

  // Check if user is authenticated
  if (!user) {
    throw new Error("You must be logged in to send messages");
  }

  const { name, email, message } = data;

  // Get primary email address
  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  );

  if (!primaryEmail) {
    throw new Error("No primary email address found for user");
  }
  if (!name || !email || !message) {
    throw new Error("Missing required fields");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.CONTACT_HOST,
      port: 465,
      secure: true, 
      auth: {
        user: "contact@raydar.tech",
        pass: "SparkHackWinner12?",
      },
    });

    // Add connection verification
    await transporter.verify().catch((error) => {
      console.error("SMTP Verification Error:", error);
      throw new Error("SMTP configuration error");
    });

    const mailOptions = {
      from: primaryEmail.emailAddress,
      to: process.env.CONTACT_EMAIL,
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
