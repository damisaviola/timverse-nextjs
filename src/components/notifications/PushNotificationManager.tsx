"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, Loader2 } from "lucide-react";
import { subscribeUser, unsubscribeUser } from "@/app/actions/push-actions";

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    } else {
      setLoading(false);
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error("Service worker registration failed", error);
    } finally {
      setLoading(false);
    }
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  async function subscribeToPush() {
    setLoading(true);
    try {
      if (!("Notification" in window)) {
        throw new Error("Browser ini tidak mendukung notifikasi.");
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("permission_denied");
      }

      const registration = await navigator.serviceWorker.ready;
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        throw new Error("Kunci VAPID tidak ditemukan. Silakan restart terminal/server dev Anda.");
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      setSubscription(sub);

      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeUser(serializedSub);
    } catch (error) {
      console.error("Failed to subscribe", error);
      if (error instanceof Error) {
        if (error.message.includes("permission_denied") || error.message.includes("permission")) {
            alert("Gagal mengaktifkan notifikasi. Pastikan Anda memberikan izin notifikasi pada browser (biasanya ikon gembok di sebelah URL).");
        } else {
            alert("Terjadi kesalahan: " + error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    setLoading(true);
    try {
      const sub = await navigator.serviceWorker.ready.then((reg) =>
        reg.pushManager.getSubscription()
      );
      if (sub) {
        await sub.unsubscribe();
        setSubscription(null);
        await unsubscribeUser(sub.endpoint);
      }
    } catch (error) {
      console.error("Failed to unsubscribe", error);
    } finally {
      setLoading(false);
    }
  }

  const handleIconClick = () => {
    if (!isSupported) {
      alert("Browser/perangkat Anda belum mendukung Web Push Notification.\n\nKhusus pengguna iPhone/iOS (iOS 16.4+), silakan tap ikon 'Share' di bawah lalu pilih 'Add to Home Screen' untuk bisa mengaktifkan notifikasi.");
      return;
    }
    
    if (subscription) {
      unsubscribeFromPush();
    } else {
      subscribeToPush();
    }
  };

  return (
    <button
      onClick={handleIconClick}
      disabled={loading}
      className={`relative p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
        subscription
          ? "bg-accent/10 text-accent hover:bg-accent/20"
          : "bg-surface-alt/50 hover:bg-surface-alt text-foreground"
      }`}
      title={subscription ? "Matikan Notifikasi" : "Aktifkan Notifikasi"}
      aria-label={subscription ? "Matikan Notifikasi" : "Aktifkan Notifikasi"}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : subscription ? (
        <>
          <BellRing size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-card"></span>
        </>
      ) : (
        <Bell size={18} />
      )}
    </button>
  );
}
