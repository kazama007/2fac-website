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

let cachedSettings: AdsSettings | null = null;

function useAdsSettings() {
  const [settings, setSettings] = useState<AdsSettings | null>(cachedSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (cachedSettings) { setSettings(cachedSettings); return; }
    fetch("/api/ads").then(r => r.json()).then(data => {
      if (data) { cachedSettings = data; setSettings(data); }
    }).catch(() => {});
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
    <div style={{ textAlign: "center", overflow: "hidden", minHeight: "90px", ...style }}>
      <ins className="adsbygoogle" style={{ display: "block", minHeight: "90px" }} data-ad-client={settings.publisherId} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
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

export function SidebarAd() {
  const { settings, mounted } = useAdsSettings();
  if (!mounted || !settings?.adsEnabled || !settings?.publisherId || !settings?.sidebarAdSlot) return null;
  return (
    <div style={{ background: "#f8fafc", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
      <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "8px", letterSpacing: "1px" }}>ADVERTISEMENT</div>
      <AdUnit slot={settings.sidebarAdSlot} />
    </div>
  );
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