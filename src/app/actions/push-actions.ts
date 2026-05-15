"use server";

import webpush from 'web-push';
import { createClient } from '@/lib/supabase/server';

const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@timverse.com';
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    vapidSubject,
    vapidPublicKey,
    vapidPrivateKey
  );
} else {
  console.warn("VAPID keys are not set properly. Push notifications will not work.");
}

export async function subscribeUser(subscription: any) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from('push_subscriptions').upsert({
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    }, { onConflict: 'endpoint' });

    if (error) {
      console.error('Failed to save subscription:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Subscription error:', error);
    return { success: false, error: error.message };
  }
}

export async function unsubscribeUser(endpoint: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendPushNotification(payload: { title: string; body: string; url?: string; image?: string; icon?: string }) {
  try {
    const supabase = await createClient();
    
    // Fetch all subscriptions
    const { data: subscriptions, error } = await supabase.from('push_subscriptions').select('*');
    
    if (error || !subscriptions) {
      console.error('Failed to fetch subscriptions:', error);
      return { success: false };
    }

    const payloadString = JSON.stringify(payload);

    // Send notifications in parallel
    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payloadString);
      } catch (err: any) {
        // If the subscription is no longer valid, remove it
        if (err.statusCode === 404 || err.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
        } else {
          console.error('Error sending push notification:', err);
        }
      }
    });

    await Promise.allSettled(sendPromises);

    return { success: true, count: subscriptions.length };
  } catch (error: any) {
    console.error('Send push error:', error);
    return { success: false, error: error.message };
  }
}
