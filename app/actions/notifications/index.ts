'use server'

import { clerkClient } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { Alert, Item } from "@/types/types";
import nodemailer from 'nodemailer';

export async function checkMatch(item: Item) {
  try {
    const alerts = await prisma.alert.findMany({
      where: { enabled: true },
      include: { user: true },
    });

    for (const alert of alerts) {
      if (isItemMatch(item, alert)) {
        console.log("Item matches alert");
        await sendMatchNotification(alert, item);
      }
    }
  } catch (error) {
    console.error("Error fetching alerts:", error);
  }
}

function isItemMatch(item: Item, alert: Alert): boolean {
  if (item.category === alert.category && item.location === alert.location) {
    console.log("Item matches alert");
    return true;
  }

  if (alert.brand && item.brand !== alert.brand) {
    return false;
  }

  if (alert.colors && item.colors !== alert.colors) {
    return false;
  }

  if (alert.size && item.size !== alert.size) {
    return false;
  }

  if (alert.material && item.material !== alert.material) {
    return false;
  }

  if (alert.weather && item.weather !== alert.weather) {
    return false;
  }
  return false;
}

async function sendMatchNotification(alert: Alert, item: Item) {
  try {
    if (!alert.user_id) {
      throw new Error("No user ID found in alert");
    }

    const user = await clerkClient.users.getUser(alert.user_id);
    const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId);
    if (!primaryEmail) {
      throw new Error("No primary email address found for user");
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: "arslankamcybekov7@gmail.com",
        pass: "hvxg mdfs bekl shfu",
      },
    });

    // Verify SMTP connection before sending
    await transporter.verify().catch((error) => {
      console.error("SMTP Verification Error:", error);
      throw new Error("SMTP configuration error");
    });

    const mailOptions = {
      from: `"Lost & Found" <arslankamcybekov7@gmail.com>`,
      to: primaryEmail.emailAddress,
      subject: `Match Found: ${item.category} at ${item.location}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">We Found a Match! 🎉</h2>
          <p>A new item has been found that matches your alert criteria:</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Item Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Category:</strong> ${item.category}</li>
              <li><strong>Location:</strong> ${item.location}</li>
              ${item.brand ? `<li><strong>Brand:</strong> ${item.brand}</li>` : ''}
              ${item.colors ? `<li><strong>Color:</strong> ${item.colors}</li>` : ''}
              ${item.size ? `<li><strong>Size:</strong> ${item.size}</li>` : ''}
              ${item.material ? `<li><strong>Material:</strong> ${item.material}</li>` : ''}
              ${item.weather? `<li><strong>Weather:</strong> ${item.weather}</li>` : ''}
            </ul>
            ${item.description ? `<p><strong>Description:</strong> ${item.description}</p>` : ''}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/feed/${item.id}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              View Item Details
            </a>
          </div>

          <hr style="border: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <p style="color: #6b7280; font-size: 14px;">
            To manage your alerts, visit your 
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/alerts" 
               style="color: #2563eb; text-decoration: none;">alerts page</a>.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending notification:", error);
    // Re-throw the error so it can be handled by the caller
    throw new Error(error instanceof Error ? error.message : "Failed to send email notification");
  }
}
