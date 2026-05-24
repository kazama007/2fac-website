"use client";
import { useEffect, useState } from "react";

interface AdsSettings {
  publisherId: string;
  headerAdSlot: string;
  footerAdSlot: string;
  sidebarAdSlot: string;
  inArticleAdSlot: string;
  adsEnabled: boolean;
}

// Single Ad Unit Component
export function AdUnit({ slot, style }: { slot: string; style?: React.CSSProperties }) {
  const [settings, setSettings] = useState<AdsSettings | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ads-settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (settings?.adsEnabled && settings?.publisherId && slot) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }
  }, [settings, slot]);

  if (!settings?.adsEnabled || !settings?.publisherId || !slot) return null;

  return (
    <div style={{ textAlign: "center", overflow: "hidden", ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={settings.publisherId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Header Ad
export function HeaderAd() {
  const [settings, setSettings] = useState<AdsSettings | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("ads-settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);
  if (!settings?.adsEnabled || !settings?.publisherId || !settings?.headerAdSlot) return null;
  return <AdUnit slot={settings.headerAdSlot} style={{ padding: "8px 0", background: "rgba(124,58,237,0.02)", borderBottom: "1px solid rgba(124,58,237,0.08)" }} />;
}

// Footer Ad
export function FooterAd() {
  const [settings, setSettings] = useState<AdsSettings | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("ads-settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);
  if (!settings?.adsEnabled || !settings?.publisherId || !settings?.footerAdSlot) return null;
  return <AdUnit slot={settings.footerAdSlot} style={{ padding: "16px 0", borderTop: "1px solid rgba(124,58,237,0.08)" }} />;
}

// In-Article Ad
export function InArticleAd() {
  const [settings, setSettings] = useState<AdsSettings | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("ads-settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);
  if (!settings?.adsEnabled || !settings?.publisherId || !settings?.inArticleAdSlot) return null;
  return (
    <div style={{ margin: "32px 0", padding: "16px", background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "12px" }}>
      <div style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center", marginBottom: "8px", letterSpacing: "1px" }}>ADVERTISEMENT</div>
      <AdUnit slot={settings.inArticleAdSlot} />
    </div>
  );
}

// AdSense Script Loader
export function AdSenseScript() {
  const [publisherId, setPublisherId] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ads-settings");
    if (saved) {
      const s = JSON.parse(saved);
      if (s.adsEnabled && s.publisherId) setPublisherId(s.publisherId);
    }
  }, []);

  if (!publisherId) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
    />
  );
}