"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  excerpt: string;
  published: boolean;
  created_at: string;
  cover_image?: string;
  related_tools?: string[];
  related_articles?: string[];
  works_with?: string[];
  faqs?: { q: string; a: string }[];
  seo_title?: string;
  seo_description?: string;
  author_name?: string;
  author_avatar?: string;
  cta_title?: string;
  cta_desc?: string;
  cta_button?: string;
  cta_link?: string;
  newsletter_title?: string;
  newsletter_desc?: string;
  show_steps?: boolean;
}

const ADMIN_PASSWORD = "2fac@admin123";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";
const GITHUB_REPO = "kazama007/2fac-images";
const GITHUB_BRANCH = "main";

async function uploadToGitHub(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      try {
        const res = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Upload ${fileName}`,
              content: base64,
              branch: GITHUB_BRANCH,
            }),
          }
        );
        const data = await res.json();
        if (data.content?.download_url) {
          resolve(data.content.download_url);
        } else {
          reject(new Error("Upload failed"));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsDataURL(file);
  });
}

const ALL_TOOLS = [
  { name: "2FA Code Generator", href: "/" },
  { name: "QR Code Generator", href: "/tools/qr-generator" },
  { name: "Password Generator", href: "/tools/password-generator" },
  { name: "Password Strength Checker", href: "/tools/password-strength" },
  { name: "Password Breach Checker", href: "/tools/password-breach" },
  { name: "JWT Decoder", href: "/tools/jwt-decoder" },
  { name: "Hash Generator", href: "/tools/hash-generator" },
  { name: "UUID Generator", href: "/tools/uuid-generator" },
  { name: "Base64 Encoder/Decoder", href: "/tools/base64" },
  { name: "JSON Formatter", href: "/tools/json-formatter" },
  { name: "Link Checker", href: "/tools/link-checker" },
  { name: "DNS Lookup", href: "/tools/dns-lookup" },
  { name: "IP Lookup", href: "/tools/ip-lookup" },
  { name: "WHOIS Lookup", href: "/tools/whois-lookup" },
];

const WORKS_WITH_OPTIONS = [
  { name: "Google Authenticator", emoji: "🔐" },
  { name: "Authy", emoji: "🛡️" },
  { name: "Microsoft Authenticator", emoji: "🔷" },
  { name: "1Password", emoji: "🔑" },
  { name: "Bitwarden", emoji: "🔒" },
  { name: "LastPass", emoji: "🔓" },
  { name: "Dashlane", emoji: "🛡️" },
  { name: "KeePass", emoji: "🗝️" },
];

function MenuBar({ editor }: { editor: any }) {
  if (!editor) return null;
  const uploadImage = async () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.click();
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      try {
        const url = await uploadToGitHub(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch { alert("Upload failed! Check GitHub token."); }
    };
  };
  const addLink = () => { const url = prompt("Enter URL:"); if (url) editor.chain().focus().setLink({ href: url }).run(); };
  const btn = (active?: boolean) => ({ background: active ? "#7c3aed" : "#f1f5f9", border: `1.5px solid ${active ? "#7c3aed" : "#e2e8f0"}`, color: active ? "white" : "#64748b", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "12px", fontWeight: active ? "700" : "400", minWidth: "28px" });
  const Sep = () => <div style={{ width: "1px", height: "24px", background: "#e2e8f0", margin: "0 4px" }} />;
  return (
    <div style={{ background: "#f8fafc", padding: "8px 12px", display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center", borderBottom: "1.5px solid #e2e8f0", borderRadius: "12px 12px 0 0" }}>
      <select onChange={(e) => { const val = e.target.value; if (val === "p") editor.chain().focus().setParagraph().run(); else editor.chain().focus().setHeading({ level: parseInt(val) as 1|2|3|4 }).run(); e.target.value = "p"; }} style={{ background: "#fff", border: "1.5px solid #e2e8f0", color: "#1e293b", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>
        <option value="p">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
      </select>
      <Sep />
      <button onClick={() => editor.chain().focus().toggleBold().run()} style={{ ...btn(editor.isActive("bold")), fontWeight: "bold" }}>B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} style={{ ...btn(editor.isActive("italic")), fontStyle: "italic" }}>I</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} style={{ ...btn(editor.isActive("underline")), textDecoration: "underline" }}>U</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} style={{ ...btn(editor.isActive("strike")), textDecoration: "line-through" }}>S</button>
      <Sep />
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>Color:</span>
        <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} style={{ width: "28px", height: "26px", border: "1.5px solid #e2e8f0", borderRadius: "4px", cursor: "pointer", padding: "1px" }} />
      </div>
      <Sep />
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} style={btn(editor.isActive("bulletList"))}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btn(editor.isActive("orderedList"))}>1. List</button>
      <Sep />
      <button onClick={() => editor.chain().focus().setTextAlign("left").run()} style={btn(editor.isActive({ textAlign: "left" }))}>⬅</button>
      <button onClick={() => editor.chain().focus().setTextAlign("center").run()} style={btn(editor.isActive({ textAlign: "center" }))}>↔</button>
      <button onClick={() => editor.chain().focus().setTextAlign("right").run()} style={btn(editor.isActive({ textAlign: "right" }))}>➡</button>
      <Sep />
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btn(editor.isActive("blockquote"))}>❝</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={btn(editor.isActive("codeBlock"))}>{"</>"}</button>
      <Sep />
      <button onClick={addLink} style={btn(editor.isActive("link"))}>🔗 Link</button>
      <button onClick={uploadImage} style={{ ...btn(), background: "rgba(124,58,237,0.1)", border: "1.5px solid rgba(124,58,237,0.3)", color: "#7c3aed" }}>🖼 Image</button>
      <Sep />
      <button onClick={() => editor.chain().focus().undo().run()} style={btn()}>↩</button>
      <button onClick={() => editor.chain().focus().redo().run()} style={btn()}>↪</button>
      <button onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} style={{ ...btn(), background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>Clear</button>
    </div>
  );
}

function TipTapEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color, Image.configure({ HTMLAttributes: { style: "max-width:100%;border-radius:8px;margin:12px 0;" } }), Link.configure({ openOnClick: false, HTMLAttributes: { style: "color:#7c3aed;text-decoration:underline;" } }), TextAlign.configure({ types: ["heading", "paragraph"] })],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { style: "min-height:400px;padding:20px;outline:none;font-size:15px;line-height:1.8;color:#1e293b;" } },
  });
  return (
    <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
      <style>{`.tiptap-editor h1{font-size:28px;font-weight:800;color:#1e293b;margin:20px 0 10px}.tiptap-editor h2{font-size:22px;font-weight:700;color:#1e293b;margin:18px 0 8px}.tiptap-editor h3{font-size:18px;font-weight:600;color:#1e293b;margin:14px 0 6px}.tiptap-editor p{margin:10px 0;color:#1e293b}.tiptap-editor ul,.tiptap-editor ol{padding-left:24px;margin:10px 0}.tiptap-editor li{margin:4px 0;color:#1e293b}.tiptap-editor blockquote{border-left:4px solid #7c3aed;padding-left:16px;margin:16px 0;color:#64748b;font-style:italic}.tiptap-editor pre{background:#f8fafc;color:#1e293b;padding:16px;border-radius:8px;margin:12px 0;overflow-x:auto;border:1px solid #e2e8f0}.tiptap-editor code{background:rgba(124,58,237,0.1);color:#7c3aed;padding:2px 6px;border-radius:4px}.tiptap-editor img{max-width:100%;border-radius:8px;margin:12px 0;display:block}.tiptap-editor a{color:#7c3aed;text-decoration:underline}.ProseMirror:focus{outline:none}`}</style>
      <MenuBar editor={editor} />
      <div className="tiptap-editor"><EditorContent editor={editor} /></div>
    </div>
  );
}

const emptyForm = { title: "", content: "", category: "Security", excerpt: "", coverImage: "", relatedTools: [] as string[], relatedArticles: [] as string[], worksWith: [] as string[], faqs: [] as { q: string; a: string }[], seoTitle: "", seoDescription: "", authorName: "2FA.AC Team", authorAvatar: "", ctaTitle: "Secure Your Accounts with 2FA", ctaDesc: "Enable two-factor authentication and protect your accounts from unauthorized access.", ctaButton: "Explore 2FA Tools →", ctaLink: "/tools", newsletterTitle: "Stay Updated", newsletterDesc: "Get the latest security tips and tools updates in your inbox.", showSteps: false };

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "new" | "edit" | "ads">("posts");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [newFaq, setNewFaq] = useState({ q: "", a: "" });
  const [adsSettings, setAdsSettings] = useState({ publisherId: "", headerAdSlot: "", footerAdSlot: "", sidebarAdSlot: "", inArticleAdSlot: "", adsEnabled: false });
  const [adsSaved, setAdsSaved] = useState(false);
  const [adsSaving, setAdsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  useEffect(() => {
    if (sessionStorage.getItem("admin-logged-in") === "true") setIsLoggedIn(true);
    loadPosts();
    loadAdsSettings();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
    if (error) console.error("Load error:", error);
  };

  const loadAdsSettings = async () => {
    const { data } = await supabase.from("ads_settings").select("*").eq("id", 1).single();
    if (data) {
      setAdsSettings({
        publisherId: data.publisher_id || "",
        headerAdSlot: data.header_ad_slot || "",
        footerAdSlot: data.footer_ad_slot || "",
        sidebarAdSlot: data.sidebar_ad_slot || "",
        inArticleAdSlot: data.in_article_ad_slot || "",
        adsEnabled: data.ads_enabled || false,
      });
    } else {
      // Fallback localStorage
      const saved = localStorage.getItem("ads-settings");
      if (saved) setAdsSettings(JSON.parse(saved));
    }
  };

  const saveAdsSettings = async () => {
    setAdsSaving(true);
    const { error } = await supabase.from("ads_settings").upsert({
      id: 1,
      publisher_id: adsSettings.publisherId,
      header_ad_slot: adsSettings.headerAdSlot,
      footer_ad_slot: adsSettings.footerAdSlot,
      sidebar_ad_slot: adsSettings.sidebarAdSlot,
      in_article_ad_slot: adsSettings.inArticleAdSlot,
      ads_enabled: adsSettings.adsEnabled,
    });
    setAdsSaving(false);
    if (error) { alert("Error saving: " + error.message); return; }
    // Also save to localStorage as backup
    localStorage.setItem("ads-settings", JSON.stringify(adsSettings));
    setAdsSaved(true);
    setTimeout(() => setAdsSaved(false), 2000);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setIsLoggedIn(true); sessionStorage.setItem("admin-logged-in", "true"); setLoginError(""); }
    else setLoginError("Wrong password!");
  };

  const handleCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const url = await uploadToGitHub(file);
      setForm(f => ({ ...f, coverImage: url }));
      setCoverPreview(url);
    } catch { alert("Cover image upload failed."); }
  };

  const toggleTool = (toolName: string) => setForm(f => ({ ...f, relatedTools: f.relatedTools.includes(toolName) ? f.relatedTools.filter(t => t !== toolName) : [...f.relatedTools, toolName] }));
  const toggleArticle = (articleTitle: string) => setForm(f => ({ ...f, relatedArticles: f.relatedArticles.includes(articleTitle) ? f.relatedArticles.filter(a => a !== articleTitle) : [...f.relatedArticles, articleTitle] }));
  const toggleWorksWith = (app: string) => setForm(f => ({ ...f, worksWith: f.worksWith.includes(app) ? f.worksWith.filter(w => w !== app) : [...f.worksWith, app] }));
  const addFaq = () => { if (!newFaq.q || !newFaq.a) return; setForm(f => ({ ...f, faqs: [...f.faqs, { q: newFaq.q, a: newFaq.a }] })); setNewFaq({ q: "", a: "" }); };
  const removeFaq = (i: number) => setForm(f => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }));
  const readingTime = Math.ceil(form.content.replace(/<[^>]*>/g, "").split(" ").length / 200);

  const handlePublish = async () => {
    if (!form.title || !form.content) return;
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newPost = { id: Date.now().toString(), title: form.title, slug, content: form.content, category: form.category, excerpt: form.excerpt || form.content.replace(/<[^>]*>/g, "").slice(0, 150) + "...", published: true, created_at: new Date().toISOString(), cover_image: form.coverImage, related_tools: form.relatedTools, related_articles: form.relatedArticles, works_with: form.worksWith, faqs: form.faqs, seo_title: form.seoTitle || form.title, seo_description: form.seoDescription || form.excerpt, author_name: form.authorName, author_avatar: form.authorAvatar, cta_title: form.ctaTitle, cta_desc: form.ctaDesc, cta_button: form.ctaButton, cta_link: form.ctaLink, newsletter_title: form.newsletterTitle, newsletter_desc: form.newsletterDesc, show_steps: form.showSteps };
    const { error } = await supabase.from("blog_posts").insert([newPost]);
    if (error) { alert("Error: " + error.message); return; }
    await loadPosts();
    setForm(emptyForm); setCoverPreview(""); setActiveTab("posts");
  };

  const handleUpdate = async () => {
    if (!editingPost || !form.title || !form.content) return;
    const { error } = await supabase.from("blog_posts").update({ title: form.title, content: form.content, category: form.category, excerpt: form.excerpt || form.content.replace(/<[^>]*>/g, "").slice(0, 150) + "...", cover_image: form.coverImage, related_tools: form.relatedTools, related_articles: form.relatedArticles, works_with: form.worksWith, faqs: form.faqs, seo_title: form.seoTitle, seo_description: form.seoDescription, author_name: form.authorName, author_avatar: form.authorAvatar, cta_title: form.ctaTitle, cta_desc: form.ctaDesc, cta_button: form.ctaButton, cta_link: form.ctaLink, newsletter_title: form.newsletterTitle, newsletter_desc: form.newsletterDesc, show_steps: form.showSteps }).eq("id", editingPost.id);
    if (error) { alert("Error: " + error.message); return; }
    await loadPosts(); setEditingPost(null); setActiveTab("posts");
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setForm({ title: post.title, content: post.content, category: post.category, excerpt: post.excerpt, coverImage: post.cover_image || "", relatedTools: post.related_tools || [], relatedArticles: post.related_articles || [], worksWith: post.works_with || [], faqs: post.faqs || [], seoTitle: post.seo_title || "", seoDescription: post.seo_description || "", authorName: post.author_name || "2FA.AC Team", authorAvatar: post.author_avatar || "", ctaTitle: post.cta_title || "Secure Your Accounts with 2FA", ctaDesc: post.cta_desc || "Enable two-factor authentication and protect your accounts from unauthorized access.", ctaButton: post.cta_button || "Explore 2FA Tools →", ctaLink: post.cta_link || "/tools", newsletterTitle: post.newsletter_title || "Stay Updated", newsletterDesc: post.newsletter_desc || "Get the latest security tips and tools updates in your inbox.", showSteps: post.show_steps || false });
    setCoverPreview(post.cover_image || ""); setActiveTab("edit"); setActiveSection("basic");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    await loadPosts();
  };

  const togglePublish = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const { error } = await supabase.from("blog_posts").update({ published: !post.published }).eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    await loadPosts();
  };

  const otherPosts = posts.filter(p => editingPost ? p.id !== editingPost.id : true);
  const inputStyle = { width: "100%", padding: "12px 14px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box" as const, outline: "none" };
  const sectionBtn = (key: string, label: string) => (
    <button onClick={() => setActiveSection(key)} style={{ padding: "8px 16px", background: activeSection === key ? "#7c3aed" : "#f1f5f9", color: activeSection === key ? "white" : "#64748b", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: activeSection === key ? "600" : "400" }}>{label}</button>
  );

  if (!isLoggedIn) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "20px", padding: "48px 40px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 8px 40px rgba(124,58,237,0.1)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", marginBottom: "6px" }}>Admin Panel</h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>2fa.ac Blog Management</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter admin password" autoComplete="new-password" style={{ ...inputStyle, marginBottom: "12px" }} onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
          {loginError && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{loginError}</p>}
          <button onClick={handleLogin} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>Login</button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", color: "#1a1a2e" }}>
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(124,58,237,0.1)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/logo2.png" alt="2fa.ac" style={{ height: "32px" }} />
          <span style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>Admin Panel</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a href="/blog" target="_blank" style={{ color: "#7c3aed", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>View Blog →</a>
          <a href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: "14px" }}>Homepage</a>
          <button onClick={() => { sessionStorage.removeItem("admin-logged-in"); setIsLoggedIn(false); }} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px" }}>Logout</button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
        <div style={{ width: "220px", background: "rgba(255,255,255,0.7)", borderRight: "1px solid rgba(124,58,237,0.08)", padding: "20px 16px", flexShrink: 0 }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", letterSpacing: "1px", marginBottom: "12px" }}>BLOG</div>
          {[{ key: "posts", icon: "📋", label: "All Posts" }, { key: "new", icon: "✏️", label: "New Post" }, { key: "ads", icon: "💰", label: "AdSense Settings" }].map(item => (
            <button key={item.key} onClick={() => { setActiveTab(item.key as any); if (item.key === "new") { setForm(emptyForm); setCoverPreview(""); setEditingPost(null); setActiveSection("basic"); } }} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: activeTab === item.key ? "rgba(124,58,237,0.1)" : "transparent", border: activeTab === item.key ? "1.5px solid rgba(124,58,237,0.3)" : "1.5px solid transparent", borderRadius: "8px", color: activeTab === item.key ? "#7c3aed" : "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: activeTab === item.key ? "600" : "400", marginBottom: "4px" }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
          <div style={{ marginTop: "24px", padding: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "12px", fontSize: "13px" }}>
            <div style={{ color: "#7c3aed", fontWeight: "600", marginBottom: "4px" }}>Total Posts</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b" }}>{posts.length}</div>
            <div style={{ color: "#94a3b8", fontSize: "12px" }}>{posts.filter(p => p.published).length} published</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: "28px 36px", overflow: "auto" }}>

          {/* ALL POSTS */}
          {activeTab === "posts" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0 }}>All Blog Posts</h2>
                <button onClick={() => setActiveTab("new")} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>+ New Post</button>
              </div>
              {posts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8", background: "#fff", borderRadius: "16px", border: "1px solid rgba(124,58,237,0.1)" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
                  <p style={{ marginBottom: "16px" }}>No posts yet!</p>
                  <button onClick={() => setActiveTab("new")} style={{ padding: "10px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Create First Post</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {posts.map(post => (
                    <div key={post.id} style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
                        {post.cover_image && <img src={post.cover_image} alt="" style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "6px" }} />}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>{post.title}</span>
                            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: post.published ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: post.published ? "#16a34a" : "#d97706" }}>{post.published ? "Published" : "Draft"}</span>
                            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "rgba(124,58,237,0.08)", color: "#7c3aed" }}>{post.category}</span>
                          </div>
                          <div style={{ fontSize: "13px", color: "#94a3b8" }}>{new Date(post.created_at).toLocaleDateString()} • /blog/{post.slug}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a href={`/blog/${post.slug}`} target="_blank" style={{ padding: "6px 12px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", textDecoration: "none" }}>View</a>
                        <button onClick={() => togglePublish(post.id)} style={{ padding: "6px 12px", background: post.published ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", color: post.published ? "#d97706" : "#16a34a", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>{post.published ? "Unpublish" : "Publish"}</button>
                        <button onClick={() => handleEdit(post)} style={{ padding: "6px 12px", background: "rgba(124,58,237,0.08)", color: "#7c3aed", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Edit</button>
                        <button onClick={() => handleDelete(post.id)} style={{ padding: "6px 12px", background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NEW / EDIT POST */}
          {(activeTab === "new" || activeTab === "edit") && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0 }}>{activeTab === "new" ? "✏️ New Blog Post" : "📝 Edit Post"}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", color: "#7c3aed" }}>⏱ Reading time: ~{readingTime} min</div>
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
                {sectionBtn("basic", "📄 Basic Info")}
                {sectionBtn("content", "✍️ Content")}
                {sectionBtn("tools", "🔧 Related Tools")}
                {sectionBtn("articles", "📝 Related Articles")}
                {sectionBtn("faq", "❓ FAQ")}
                {sectionBtn("seo", "🔍 SEO")}
                {sectionBtn("author", "👤 Author")}
                {sectionBtn("cta", "🎯 CTA Banner")}
              </div>

              {activeSection === "basic" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Post Title *</label>
                      <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter post title..." style={inputStyle} onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
                    </div>
                    <div>
                      <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle }}>
                        {["Security", "Authentication", "Password", "Developer", "2FA", "Network", "Tutorial", "News", "Guides"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Excerpt</label>
                    <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description shown in blog listing..." rows={3} style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "Inter, sans-serif" }} onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Cover Image</label>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <label style={{ background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.3)", color: "#7c3aed", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                        🖼 Upload Cover Image
                        <input type="file" accept="image/*" onChange={handleCoverImage} style={{ display: "none" }} />
                      </label>
                      {coverPreview && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img src={coverPreview} alt="Cover" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
                          <button onClick={() => { setCoverPreview(""); setForm({ ...form, coverImage: "" }); }} style={{ background: "rgba(239,68,68,0.08)", border: "none", color: "#ef4444", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "content" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Content *</label>
                    <button onClick={() => { const html = prompt("Paste your HTML content here:"); if (html) setForm({ ...form, content: html }); }} style={{ padding: "6px 14px", background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.3)", color: "#7c3aed", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>📥 Import HTML</button>
                  </div>
                  <TipTapEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} />
                </div>
              )}

              {activeSection === "tools" && (
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>🔧 Related Tools</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Selected: <strong style={{ color: "#7c3aed" }}>{form.relatedTools.length}</strong></p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {ALL_TOOLS.map(tool => (
                      <div key={tool.name} onClick={() => toggleTool(tool.name)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: form.relatedTools.includes(tool.name) ? "rgba(124,58,237,0.08)" : "#ffffff", border: form.relatedTools.includes(tool.name) ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0", borderRadius: "10px", cursor: "pointer" }}>
                        <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: form.relatedTools.includes(tool.name) ? "#7c3aed" : "transparent", border: form.relatedTools.includes(tool.name) ? "none" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {form.relatedTools.includes(tool.name) && <span style={{ color: "white", fontSize: "12px" }}>✓</span>}
                        </div>
                        <span style={{ fontSize: "13px", color: form.relatedTools.includes(tool.name) ? "#7c3aed" : "#64748b" }}>{tool.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "articles" && (
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>📝 Related Articles</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Selected: <strong style={{ color: "#7c3aed" }}>{form.relatedArticles.length}</strong></p>
                  {otherPosts.length === 0 ? <div style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>No other posts yet.</div> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {otherPosts.map(post => (
                        <div key={post.id} onClick={() => toggleArticle(post.title)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: form.relatedArticles.includes(post.title) ? "rgba(124,58,237,0.08)" : "#ffffff", border: form.relatedArticles.includes(post.title) ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0", borderRadius: "10px", cursor: "pointer" }}>
                          <div style={{ width: "20px", height: "20px", borderRadius: "4px", background: form.relatedArticles.includes(post.title) ? "#7c3aed" : "transparent", border: form.relatedArticles.includes(post.title) ? "none" : "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {form.relatedArticles.includes(post.title) && <span style={{ color: "white", fontSize: "12px" }}>✓</span>}
                          </div>
                          <div><div style={{ fontSize: "14px", fontWeight: "600", color: form.relatedArticles.includes(post.title) ? "#7c3aed" : "#1e293b" }}>{post.title}</div><div style={{ fontSize: "12px", color: "#94a3b8" }}>{post.category}</div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}


              {activeSection === "faq" && (
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "6px" }}>❓ FAQ</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Total: <strong style={{ color: "#7c3aed" }}>{form.faqs.length}</strong></p>
                  {form.faqs.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                      {form.faqs.map((faq, i) => (
                        <div key={i} style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "14px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", marginBottom: "4px" }}>Q: {faq.q}</div>
                              <div style={{ fontSize: "13px", color: "#64748b" }}>A: {faq.a}</div>
                            </div>
                            <button onClick={() => removeFaq(i)} style={{ background: "rgba(239,68,68,0.08)", border: "none", color: "#ef4444", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px" }}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "20px" }}>
                    <input type="text" value={newFaq.q} onChange={e => setNewFaq({ ...newFaq, q: e.target.value })} placeholder="Question..." style={{ ...inputStyle, marginBottom: "10px" }} onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
                    <textarea value={newFaq.a} onChange={e => setNewFaq({ ...newFaq, a: e.target.value })} placeholder="Answer..." rows={3} style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "Inter, sans-serif", marginBottom: "10px" }} onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
                    <button onClick={addFaq} disabled={!newFaq.q || !newFaq.a} style={{ padding: "10px 20px", background: !newFaq.q || !newFaq.a ? "#e2e8f0" : "linear-gradient(135deg, #7c3aed, #9f67ff)", color: !newFaq.q || !newFaq.a ? "#94a3b8" : "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>+ Add FAQ</button>
                  </div>
                </div>
              )}

              {activeSection === "seo" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>🔍 SEO Settings</h3>
                  <div>
                    <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>SEO Title ({form.seoTitle.length}/60)</label>
                    <input type="text" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder={form.title || "SEO title..."} style={inputStyle} onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
                    <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", marginTop: "6px" }}><div style={{ height: "100%", width: `${Math.min(form.seoTitle.length / 60 * 100, 100)}%`, background: form.seoTitle.length > 60 ? "#ef4444" : "#22c55e", borderRadius: "2px" }} /></div>
                  </div>
                  <div>
                    <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Meta Description ({form.seoDescription.length}/160)</label>
                    <textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "Inter, sans-serif" }} onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
                    <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", marginTop: "6px" }}><div style={{ height: "100%", width: `${Math.min(form.seoDescription.length / 160 * 100, 100)}%`, background: form.seoDescription.length > 160 ? "#ef4444" : "#22c55e", borderRadius: "2px" }} /></div>
                  </div>
                  <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px", fontWeight: "600" }}>GOOGLE PREVIEW</div>
                    <div style={{ fontSize: "18px", color: "#1a0dab", marginBottom: "4px" }}>{form.seoTitle || form.title || "Post Title"}</div>
                    <div style={{ fontSize: "13px", color: "#006621", marginBottom: "4px" }}>https://2fa.ac/blog/{form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</div>
                    <div style={{ fontSize: "13px", color: "#545454" }}>{form.seoDescription || form.excerpt || "Meta description..."}</div>
                  </div>
                </div>
              )}

              {activeSection === "author" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>👤 Author</h3>
                  <div><label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Author Name</label><input type="text" value={form.authorName} onChange={e => setForm({...form, authorName: e.target.value})} style={inputStyle} onFocus={e => e.currentTarget.style.border="1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border="1.5px solid #e2e8f0"} /></div>
                  <div><label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Avatar URL</label><input type="text" value={form.authorAvatar} onChange={e => setForm({...form, authorAvatar: e.target.value})} placeholder="https://..." style={inputStyle} onFocus={e => e.currentTarget.style.border="1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border="1.5px solid #e2e8f0"} /></div>
                </div>
              )}

              {activeSection === "cta" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>🎯 CTA Banner</h3>
                  <div><label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Title</label><input type="text" value={form.ctaTitle} onChange={e => setForm({...form, ctaTitle: e.target.value})} style={inputStyle} onFocus={e => e.currentTarget.style.border="1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border="1.5px solid #e2e8f0"} /></div>
                  <div><label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Description</label><textarea value={form.ctaDesc} onChange={e => setForm({...form, ctaDesc: e.target.value})} rows={3} style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "Inter, sans-serif" }} onFocus={e => e.currentTarget.style.border="1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border="1.5px solid #e2e8f0"} /></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div><label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Button Text</label><input type="text" value={form.ctaButton} onChange={e => setForm({...form, ctaButton: e.target.value})} style={inputStyle} onFocus={e => e.currentTarget.style.border="1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border="1.5px solid #e2e8f0"} /></div>
                    <div><label style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" }}>Button Link</label><input type="text" value={form.ctaLink} onChange={e => setForm({...form, ctaLink: e.target.value})} style={inputStyle} onFocus={e => e.currentTarget.style.border="1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border="1.5px solid #e2e8f0"} /></div>
                  </div>
                </div>
              )}


              <div style={{ display: "flex", gap: "12px", marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
                <button onClick={activeTab === "new" ? handlePublish : handleUpdate} disabled={!form.title || !form.content} style={{ padding: "12px 28px", background: (!form.title || !form.content) ? "#e2e8f0" : "linear-gradient(135deg, #7c3aed, #9f67ff)", color: (!form.title || !form.content) ? "#94a3b8" : "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                  {activeTab === "new" ? "🚀 Publish Post" : "💾 Update Post"}
                </button>
                <button onClick={() => { setActiveTab("posts"); setForm(emptyForm); setEditingPost(null); setCoverPreview(""); }} style={{ padding: "12px 20px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "15px", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}

          {/* ADSENSE SETTINGS */}
          {activeTab === "ads" && (
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>💰 AdSense Settings</h2>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Ye settings Supabase mein save hongi — har device pe same rahegi.</p>

              {/* Enable/Disable toggle */}
              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "16px", padding: "20px 24px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>Enable AdSense Ads</div>
                  <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>Puri website pe ads on/off karo</div>
                </div>
                <button onClick={() => setAdsSettings(a => ({ ...a, adsEnabled: !a.adsEnabled }))} style={{ padding: "10px 24px", background: adsSettings.adsEnabled ? "rgba(34,197,94,0.1)" : "#f1f5f9", border: `2px solid ${adsSettings.adsEnabled ? "rgba(34,197,94,0.4)" : "#e2e8f0"}`, color: adsSettings.adsEnabled ? "#16a34a" : "#64748b", borderRadius: "12px", cursor: "pointer", fontSize: "15px", fontWeight: "700" }}>
                  {adsSettings.adsEnabled ? "✅ Enabled" : "⭕ Disabled"}
                </button>
              </div>

              {/* Publisher ID + Slots */}
              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>AdSense Publisher ID</label>
                  <input type="text" value={adsSettings.publisherId} onChange={e => setAdsSettings(a => ({ ...a, publisherId: e.target.value }))} placeholder="ca-pub-XXXXXXXXXXXXXXXX" style={{ ...inputStyle, fontFamily: "monospace" }} onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
                </div>

                {[
                  { key: "headerAdSlot", label: "Header Ad Slot", desc: "Site ke upar dikhega" },
                  { key: "footerAdSlot", label: "Footer Ad Slot", desc: "Site ke neeche dikhega" },
                  { key: "sidebarAdSlot", label: "Sidebar Ad Slot", desc: "Blog post sidebar mein" },
                  { key: "inArticleAdSlot", label: "In-Article Ad Slot", desc: "Blog post content ke beech mein" },
                ].map(slot => (
                  <div key={slot.key} style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "2px" }}>{slot.label}</label>
                    <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "6px" }}>{slot.desc}</p>
                    <input type="text" value={(adsSettings as any)[slot.key]} onChange={e => setAdsSettings(a => ({ ...a, [slot.key]: e.target.value }))} placeholder="1234567890" style={{ ...inputStyle, fontFamily: "monospace" }} onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"} onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"} />
                  </div>
                ))}

                <button onClick={saveAdsSettings} disabled={adsSaving} style={{ marginTop: "8px", padding: "14px 32px", background: adsSaved ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer", opacity: adsSaving ? 0.7 : 1 }}>
                  {adsSaving ? "⏳ Saving..." : adsSaved ? "✅ Settings Saved!" : "💾 Save to Database"}
                </button>

                {adsSaved && (
                  <div style={{ marginTop: "12px", padding: "12px 16px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", fontSize: "13px", color: "#16a34a" }}>
                    ✅ Settings Supabase mein save ho gayi! Sare devices pe automatically update ho jayegi.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}