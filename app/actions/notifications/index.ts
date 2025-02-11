// app/actions/notifications.ts
'use server'

import { clerkClient } from "@/lib/clerk";
import { supabase } from "@/lib/supabase";
import { Alert, Item } from "@/types/types";
import nodemailer from 'nodemailer';

export async function checkMatch(newItem: Item) {
  const { data: alerts, error: alertsError } = await supabase
    .from("alerts")
    .select("*, user!inner(*)")
    .eq("enabled", true);

  if (alertsError) {
    console.error("Error fetching alerts:", alertsError);
    return;
  }

  // Check each alert for matches
  for (const alert of alerts) {
    if (isItemMatch(newItem, alert)) {
      await sendMatchNotification(alert, newItem);
    }
  }
}

function isItemMatch(item: Item, alert: Alert): boolean {
  // Required matches
  if (item.category !== alert.category || item.location_name !== alert.location) {
    return false;
  }

  // Optional attribute matches - only check if alert has specified the attribute


  console.log("Match found!");
  return true;
}

async function sendMatchNotification(alert: Alert, item: Item) {
  try {
    // Ensure we have a valid user ID
    if (!alert.userid) {
      throw new Error("No user ID found in alert");
    }

    // Get user from Clerk
    const user = await clerkClient.users.getUser(alert.userid);
    
    // Get primary email address
    const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId);
    
    if (!primaryEmail) {
      throw new Error("No primary email address found for user");
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Lost & Found" <${process.env.SMTP_USER}>`,
      to: primaryEmail.emailAddress,
      subject: `Match Found: ${item.category} at ${item.location_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">We Found a Match! 🎉</h2>
          <p>A new item has been found that matches your alert criteria:</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Item Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Category:</strong> ${item.category}</li>
              <li><strong>Location:</strong> ${item.location_name}</li>
              ${item.brand ? `<li><strong>Brand:</strong> ${item.brand}</li>` : ''}
              ${item.color ? `<li><strong>Color:</strong> ${item.color}</li>` : ''}
              ${item.size ? `<li><strong>Size:</strong> ${item.size}</li>` : ''}
              ${item.material ? `<li><strong>Material:</strong> ${item.material}</li>` : ''}
              ${item.weather ? `<li><strong>Weather:</strong> ${item.weather}</li>` : ''}
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

    // Send email
    await transporter.sendMail(mailOptions);

    // Log successful notification
    await supabase.from("notifications").insert([
      {
        userId: alert.userid,
        alertId: alert.id,
        itemId: item.id,
        type: 'EMAIL',
        status: 'SENT',
      }
    ]);

    console.log(`Notification sent for alert ${alert.id} and item ${item.id}`);

  } catch (error) {
    console.error("Error sending notification:", error);
    
    // Log failed notification
    await supabase.from("notifications").insert([
      {
        userId: alert.userid,
        alertId: alert.id,
        itemId: item.id,
        type: 'EMAIL',
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    ]);
  }
}