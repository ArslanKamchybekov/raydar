// app/actions/notifications.ts
'use server'

import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from 'nodemailer';

type Item = {
  id: string;
  category: string;
  location_name: string;
  brand: string | null;
  color: string | null;
  size: string | null;
  material: string | null;
  weather: string | null;
  title: string;
  description: string;
  createdAt: string;
};

type Alert = {
  id: string;
  userId: string;
  category: string;
  location: string;
  brand: string | null;
  color: string | null;
  size: string | null;
  material: string | null;
  weather: string | null;
  enabled: boolean;
};

export async function checkItemMatchesAndNotify(newItem: Item) {
  // Get all enabled alerts
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
  if (alert.brand && item.brand !== alert.brand) return false;
  if (alert.color && item.color !== alert.color) return false;
  if (alert.size && item.size !== alert.size) return false;
  if (alert.material && item.material !== alert.material) return false;
  if (alert.weather && item.weather !== alert.weather) return false;

  console.log("Match found!");
  return true;
}

async function sendMatchNotification(alert: Alert, item: Item) {
    try {
      const user = await currentUser();
      if (!user?.emailAddresses?.[0]?.emailAddress) {
        console.error("No email address found for user");
        return;
      }
  
      // Create a reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        // gmail
        host: 'smtp.gmail.com',
        port: 587, // Common SMTP port
        secure: false, // Use TLS
        auth: {
          user: process.env.SMTP_USER, // Replace with your SMTP username
          pass: process.env.SMTP_PASSWORD, // Replace with your SMTP password
        },
      });
  
      // Email content
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.emailAddresses[0].emailAddress,
        subject: 'New Item Match Found!',
        html: `
          <h2>We found an item matching your alert!</h2>
          <p>A new item was posted that matches your alert criteria:</p>

          <h4>Item Details:</h4>
          <ul>
            <li>Category: ${item.category}</li>
            <li>Location: ${item.location_name}</li>
            ${item.brand ? `<li>Brand: ${item.brand}</li>` : ''}
            ${item.color ? `<li>Color: ${item.color}</li>` : ''}
            ${item.size ? `<li>Size: ${item.size}</li>` : ''}
            ${item.material ? `<li>Material: ${item.material}</li>` : ''}
            ${item.weather ? `<li>Weather: ${item.weather}</li>` : ''}
          </ul>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/feed/${item.id}">
            View Item
          </a>
          
          <p>
            <small>
              To manage your alerts, visit your 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/alerts">alerts page</a>.
            </small>
          </p>
        `,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      // Log the notification
      await supabase.from("notifications").insert([
        {
          userId: alert.userId,
          alertId: alert.id,
          itemId: item.id,
          type: 'EMAIL',
          status: 'SENT',
        }
      ]);
  
    } catch (error) {
      console.error("Error sending notification:", error);
      
      // Log failed notification
      await supabase.from("notifications").insert([
        {
          userId: alert.userId,
          alertId: alert.id,
          itemId: item.id,
          type: 'EMAIL',
          status: 'FAILED',
          error: error,
        }
      ]);
    }
  }
  