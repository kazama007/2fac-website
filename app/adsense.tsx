"use client";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

interface AdsSettings {
  publisherId: string;
  headerAdSlot: string;
  footerAdSlot: string;
  sidebarAdSlot: string;
  inArticleAdSlot: string;
  adsEnabled: boolean;
}

// Global cache so we don't fetch multiple times
let cachedSettings: AdsSettings | null = null;

function useAdsSettings() {
  const [settings, setSettings] = useState<AdsSettings | null>(cachedSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (cachedSettings) { setSettings(cachedSettings); return; }
    // Fetch from Supabase
    supabase.from("ads_settings").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) {
        cachedSettings = data;
        setSettings(data);
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem("ads-settings");
        if (saved) { const parsed = JSON.parse(saved); cachedSettings = parsed; setSettings(parsed); }
      }
    });
  }, []);

  return { settings, mounted };
}

export function AdUnit({ slot, style }: { slot: string; style?: React.CSSProperties }) {
  const { settings, mounted } = useAdsSettings();
  useEffect(() => {
    if (mounted && settings?.adsEnabled && settings?.publisherId && slot) {
      try { (window as any).adsbygoogle = (window as any).adsbygoogle || []; (window as any).adsbygoogle.push({}); } catch {}
    }
  }, [settings, slot, mounted]);
  if (!mounted || !settings?.adsEnabled || !settings?.publisherId || !slot) return null;
  return (
    <div style={{ textAlign: "center", overflow: "hidden", ...style }}>
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={settings.publisherId} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </div>
  );
}

export function HeaderAd() {
  const { settings, mounted } = useAdsSettings();
  if (!mounted || !settings?.adsEnabled || !settings?.publisherId || !settings?.headerAdSlot) return null;
  return <AdUnit slot={settings.headerAdSlot} style={{ padding: "8px 0" }} />;
}

export function FooterAd() {
  const { settings, mounted } = useAdsSettings();
  if (!mounted || !settings?.adsEnabled || !settings?.publisherId || !settings?.footerAdSlot) return null;
  return <AdUnit slot={settings.footerAdSlot} style={{ padding: "16px 0" }} />;
}

export function InArticleAd() {
  const { settings, mounted } = useAdsSettings();
  if (!mounted || !settings?.adsEnabled || !settings?.publisherId || !settings?.inArticleAdSlot) return null;
  return (
    <div style={{ margin: "32px 0", padding: "16px", background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "12px" }}>
      <div style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center", marginBottom: "8px", letterSpacing: "1px" }}>ADVERTISEMENT</div>
      <AdUnit slot={settings.inArticleAdSlot} />
    </div>
  );
}

export function AdSenseScript() {
  const { settings, mounted } = useAdsSettings();
  if (!mounted || !settings?.adsEnabled || !settings?.publisherId) return null;
  return <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.publisherId}`} crossOrigin="anonymous" />;
}