// ============================================================
// CENTRAL TOOLS LIST — Single source of truth
// To add a new tool: bas yahan ek object add karo!
// Sab jagah automatically update ho jayega:
// Homepage, Tools page, Navbar dropdown, About page,
// Admin panel, Sitemap — sab!
// ============================================================

export interface Tool {
  icon: string;
  name: string;
  desc: string;
  href: string;
  category: "Authentication" | "Password" | "Developer" | "Security";
  sitemapPriority?: number;
}

export const TOOLS: Tool[] = [
  // ── Authentication ──────────────────────────────────────
  {
    icon: "🔐",
    name: "2FA Code Generator",
    desc: "Generate OTP codes like Google Authenticator",
    href: "/",
    category: "Authentication",
    sitemapPriority: 1.0,
  },
  {
    icon: "📱",
    name: "QR Code Generator",
    desc: "Generate QR codes for authenticator apps",
    href: "/tools/qr-generator",
    category: "Authentication",
  },

  // ── Password ─────────────────────────────────────────────
  {
    icon: "🔑",
    name: "Password Generator",
    desc: "Generate strong secure passwords",
    href: "/tools/password-generator",
    category: "Password",
  },
  {
    icon: "💪",
    name: "Password Strength",
    desc: "Check how strong your password is",
    href: "/tools/password-strength",
    category: "Password",
  },
  {
    icon: "🔓",
    name: "Password Breach Checker",
    desc: "Check if your password was leaked in a data breach",
    href: "/tools/password-breach",
    category: "Password",
  },

  // ── Developer ────────────────────────────────────────────
  {
    icon: "🔍",
    name: "JWT Decoder",
    desc: "Decode and verify JWT tokens",
    href: "/tools/jwt-decoder",
    category: "Developer",
  },
  {
    icon: "#️⃣",
    name: "Hash Generator",
    desc: "Generate MD5, SHA-256, SHA-512 hashes",
    href: "/tools/hash-generator",
    category: "Developer",
  },
  {
    icon: "🆔",
    name: "UUID Generator",
    desc: "Generate unique IDs instantly",
    href: "/tools/uuid-generator",
    category: "Developer",
  },
  {
    icon: "📝",
    name: "Base64 Encoder",
    desc: "Encode and decode Base64 text",
    href: "/tools/base64",
    category: "Developer",
  },
  {
    icon: "📋",
    name: "JSON Formatter",
    desc: "Format and validate JSON data",
    href: "/tools/json-formatter",
    category: "Developer",
  },

  // ── Security ─────────────────────────────────────────────
  {
    icon: "⚡",
    name: "Internet Speed Test",
    desc: "Check your download speed, upload speed, ping and jitter",
    href: "/tools/speed-test",
    category: "Security",
  },
  {
    icon: "🔴",
    name: "WebRTC Leak Test",
    desc: "Check if your browser leaks real IP through WebRTC",
    href: "/tools/webrtc-leak",
    category: "Security",
  },
  {
    icon: "🔍",
    name: "DNS Leak Test",
    desc: "Check if your VPN is leaking DNS queries to ISP",
    href: "/tools/dns-leak-test",
    category: "Security",
  },
  {
    icon: "🔗",
    name: "Link Checker",
    desc: "Check links for scams and phishing",
    href: "/tools/link-checker",
    category: "Security",
  },
  {
    icon: "🌐",
    name: "DNS Lookup",
    desc: "Check domain DNS records",
    href: "/tools/dns-lookup",
    category: "Security",
  },
  {
    icon: "📍",
    name: "IP Lookup",
    desc: "Find location of any IP address",
    href: "/tools/ip-lookup",
    category: "Security",
  },
  {
    icon: "🏢",
    name: "WHOIS Lookup",
    desc: "Check domain owner and registration info",
    href: "/tools/whois-lookup",
    category: "Security",
  },
];

// ── Helpers ──────────────────────────────────────────────────

export const TOOL_COUNT = TOOLS.length;

export const TOOLS_BY_CATEGORY = {
  Authentication: TOOLS.filter(t => t.category === "Authentication"),
  Password: TOOLS.filter(t => t.category === "Password"),
  Developer: TOOLS.filter(t => t.category === "Developer"),
  Security: TOOLS.filter(t => t.category === "Security"),
};

export const CATEGORY_META = {
  Authentication: { color: "#7c3aed", icon: "🔐" },
  Password:       { color: "#3b82f6", icon: "🔑" },
  Developer:      { color: "#7c3aed", icon: "👨‍💻" },
  Security:       { color: "#ef4444", icon: "🛡️" },
};

// Admin panel ke liye — name + href only
export const TOOLS_FOR_ADMIN = TOOLS
  .filter(t => t.href !== "/") // homepage tool skip (2FA generator)
  .map(t => ({ name: t.name, href: t.href }));
