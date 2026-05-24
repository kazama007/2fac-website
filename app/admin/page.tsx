"use client";
import { useState, useEffect } from "react";
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
  createdAt: string;
  coverImage?: string;
}

const ADMIN_PASSWORD = "2fac@admin123";
const IMGBB_API_KEY = "65d735ef528ad415fc3dbcb2aa933c54";

function MenuBar({ editor, apiKey }: { editor: any; apiKey: string }) {
  if (!editor) return null;

  const uploadImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) editor.chain().focus().setImage({ src: data.data.url }).run();
        else alert("Image upload failed!");
      } catch { alert("Upload failed!"); }
    };
  };

  const addLink = () => {
    const url = prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const btnStyle = (active?: boolean) => ({
    background: active ? "#7c3aed" : "#f1f5f9",
    border: `1.5px solid ${active ? "#7c3aed" : "#e2e8f0"}`,
    color: active ? "white" : "#64748b",
    borderRadius: "6px",
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: active ? "700" : "400",
    minWidth: "28px",
  });

  const Sep = () => <div style={{ width: "1px", height: "24px", background: "#e2e8f0", margin: "0 4px" }} />;

  return (
    <div style={{ background: "#f8fafc", padding: "8px 12px", display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center", borderBottom: "1.5px solid #e2e8f0", borderRadius: "12px 12px 0 0" }}>
      <select onChange={(e) => {
        const val = e.target.value;
        if (val === "p") editor.chain().focus().setParagraph().run();
        else editor.chain().focus().setHeading({ level: parseInt(val) as 1|2|3|4 }).run();
        e.target.value = "p";
      }} style={{ background: "#fff", border: "1.5px solid #e2e8f0", color: "#1e293b", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>
        <option value="p">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
      </select>
      <Sep />
      <button onClick={() => editor.chain().focus().toggleBold().run()} style={{ ...btnStyle(editor.isActive("bold")), fontWeight: "bold" }}>B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} style={{ ...btnStyle(editor.isActive("italic")), fontStyle: "italic" }}>I</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} style={{ ...btnStyle(editor.isActive("underline")), textDecoration: "underline" }}>U</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} style={{ ...btnStyle(editor.isActive("strike")), textDecoration: "line-through" }}>S</button>
      <Sep />
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>Color:</span>
        <input type="color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} style={{ width: "28px", height: "26px", border: "1.5px solid #e2e8f0", borderRadius: "4px", cursor: "pointer", padding: "1px" }} />
      </div>
      <Sep />
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive("bulletList"))}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive("orderedList"))}>1. List</button>
      <Sep />
      <button onClick={() => editor.chain().focus().setTextAlign("left").run()} style={btnStyle(editor.isActive({ textAlign: "left" }))}>⬅</button>
      <button onClick={() => editor.chain().focus().setTextAlign("center").run()} style={btnStyle(editor.isActive({ textAlign: "center" }))}>↔</button>
      <button onClick={() => editor.chain().focus().setTextAlign("right").run()} style={btnStyle(editor.isActive({ textAlign: "right" }))}>➡</button>
      <Sep />
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive("blockquote"))}>❝</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={btnStyle(editor.isActive("codeBlock"))}>{"</>"}</button>
      <Sep />
      <button onClick={addLink} style={btnStyle(editor.isActive("link"))}>🔗 Link</button>
      <button onClick={uploadImage} style={{ ...btnStyle(), background: "rgba(124,58,237,0.1)", border: "1.5px solid rgba(124,58,237,0.3)", color: "#7c3aed" }}>🖼 Image</button>
      <Sep />
      <button onClick={() => editor.chain().focus().undo().run()} style={btnStyle()}>↩</button>
      <button onClick={() => editor.chain().focus().redo().run()} style={btnStyle()}>↪</button>
      <button onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} style={{ ...btnStyle(), background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>Clear</button>
    </div>
  );
}

function TipTapEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.configure({ resizable: true, HTMLAttributes: { style: "max-width:100%;border-radius:8px;margin:12px 0;" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { style: "color:#7c3aed;text-decoration:underline;" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style: "min-height:400px;padding:20px;outline:none;font-size:15px;line-height:1.8;color:#1e293b;",
      },
    },
  });

  return (
    <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
      <style>{`
        .tiptap-editor h1 { font-size:28px; font-weight:800; color:#1e293b; margin:20px 0 10px; }
        .tiptap-editor h2 { font-size:22px; font-weight:700; color:#1e293b; margin:18px 0 8px; }
        .tiptap-editor h3 { font-size:18px; font-weight:600; color:#1e293b; margin:14px 0 6px; }
        .tiptap-editor p { margin:10px 0; color:#1e293b; }
        .tiptap-editor ul, .tiptap-editor ol { padding-left:24px; margin:10px 0; }
        .tiptap-editor li { margin:4px 0; color:#1e293b; }
        .tiptap-editor blockquote { border-left:4px solid #7c3aed; padding-left:16px; margin:16px 0; color:#64748b; font-style:italic; }
        .tiptap-editor pre { background:#f8fafc; color:#1e293b; padding:16px; border-radius:8px; margin:12px 0; overflow-x:auto; border:1px solid #e2e8f0; }
        .tiptap-editor code { background:rgba(124,58,237,0.1); color:#7c3aed; padding:2px 6px; border-radius:4px; }
        .tiptap-editor img { max-width:100%; border-radius:8px; margin:12px 0; display:block; }
        .tiptap-editor a { color:#7c3aed; text-decoration:underline; }
        .ProseMirror:focus { outline:none; }
      `}</style>
      <MenuBar editor={editor} apiKey={IMGBB_API_KEY} />
      <div className="tiptap-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "new" | "edit" | "ads">("posts");

  // Ads settings
  const [adsSettings, setAdsSettings] = useState({
    publisherId: "",
    headerAdSlot: "",
    footerAdSlot: "",
    sidebarAdSlot: "",
    inArticleAdSlot: "",
    adsEnabled: false,
  });
  const [adsSaved, setAdsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ads-settings");
    if (saved) setAdsSettings(JSON.parse(saved));
  }, []);

  const saveAdsSettings = () => {
    localStorage.setItem("ads-settings", JSON.stringify(adsSettings));
    setAdsSaved(true);
    setTimeout(() => setAdsSaved(false), 2000);
  };
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [form, setForm] = useState({ title: "", content: "", category: "Security", excerpt: "", coverImage: "" });

  useEffect(() => {
    if (sessionStorage.getItem("admin-logged-in") === "true") setIsLoggedIn(true);
    const saved = localStorage.getItem("blog-posts");
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  const savePosts = (newPosts: BlogPost[]) => { setPosts(newPosts); localStorage.setItem("blog-posts", JSON.stringify(newPosts)); };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setIsLoggedIn(true); sessionStorage.setItem("admin-logged-in", "true"); setLoginError(""); }
    else setLoginError("Wrong password!");
  };

  const handleCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) { setForm(f => ({ ...f, coverImage: data.data.url })); setCoverPreview(data.data.url); }
      else alert("Cover image upload failed.");
    } catch { alert("Upload failed."); }
  };

  const handlePublish = () => {
    if (!form.title || !form.content) return;
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newPost: BlogPost = { id: Date.now().toString(), title: form.title, slug, content: form.content, category: form.category, excerpt: form.excerpt || form.content.replace(/<[^>]*>/g, "").slice(0, 150) + "...", published: true, createdAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), coverImage: form.coverImage };
    savePosts([newPost, ...posts]);
    setForm({ title: "", content: "", category: "Security", excerpt: "", coverImage: "" });
    setCoverPreview(""); setActiveTab("posts");
  };

  const handleUpdate = () => {
    if (!editingPost || !form.title || !form.content) return;
    savePosts(posts.map(p => p.id === editingPost.id ? { ...p, title: form.title, content: form.content, category: form.category, excerpt: form.excerpt || form.content.replace(/<[^>]*>/g, "").slice(0, 150) + "...", coverImage: form.coverImage } : p));
    setEditingPost(null); setActiveTab("posts");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({ title: post.title, content: post.content, category: post.category, excerpt: post.excerpt, coverImage: post.coverImage || "" });
    setCoverPreview(post.coverImage || ""); setActiveTab("edit");
  };

  const handleDelete = (id: string) => { if (confirm("Delete this post?")) savePosts(posts.filter(p => p.id !== id)); };
  const togglePublish = (id: string) => savePosts(posts.map(p => p.id === id ? { ...p, published: !p.published } : p));

  if (!isLoggedIn) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "20px", padding: "48px 40px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 8px 40px rgba(124,58,237,0.1)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", marginBottom: "6px" }}>Admin Panel</h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>2fa.ac Blog Management</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            autoComplete="new-password"
            style={{ width: "100%", padding: "14px 16px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none", marginBottom: "12px" }}
            onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
            onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
          />
          {loginError && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{loginError}</p>}
          <button onClick={handleLogin} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" }}>Login</button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)", fontFamily: "Inter, sans-serif", color: "#1a1a2e" }}>
      {/* Top Bar */}
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
        {/* Sidebar */}
        <div style={{ width: "220px", background: "rgba(255,255,255,0.7)", borderRight: "1px solid rgba(124,58,237,0.08)", padding: "20px 16px", flexShrink: 0 }}>
          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", letterSpacing: "1px", marginBottom: "12px" }}>BLOG</div>
          {[{ key: "posts", icon: "📋", label: "All Posts" }, { key: "new", icon: "✏️", label: "New Post" }, { key: "ads", icon: "💰", label: "AdSense Settings" }].map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key as any)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: activeTab === item.key ? "rgba(124,58,237,0.1)" : "transparent", border: activeTab === item.key ? "1.5px solid rgba(124,58,237,0.3)" : "1.5px solid transparent", borderRadius: "8px", color: activeTab === item.key ? "#7c3aed" : "#64748b", cursor: "pointer", fontSize: "14px", fontWeight: activeTab === item.key ? "600" : "400", marginBottom: "4px" }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
          <div style={{ marginTop: "24px", padding: "16px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "12px", fontSize: "13px" }}>
            <div style={{ color: "#7c3aed", fontWeight: "600", marginBottom: "4px" }}>Total Posts</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b" }}>{posts.length}</div>
            <div style={{ color: "#94a3b8", fontSize: "12px" }}>{posts.filter(p => p.published).length} published</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "28px 36px", overflow: "auto" }}>
          {activeTab === "posts" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0 }}>All Blog Posts</h2>
                <button onClick={() => setActiveTab("new")} style={{ padding: "10px 20px", background: "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}>+ New Post</button>
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
                    <div key={post.id} style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
                        {post.coverImage && <img src={post.coverImage} alt="" style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "6px" }} />}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>{post.title}</span>
                            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: post.published ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: post.published ? "#16a34a" : "#d97706" }}>{post.published ? "Published" : "Draft"}</span>
                            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "rgba(124,58,237,0.08)", color: "#7c3aed" }}>{post.category}</span>
                          </div>
                          <div style={{ fontSize: "13px", color: "#94a3b8" }}>{post.createdAt} • /blog/{post.slug}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a href={`/blog/${post.slug}`} target="_blank" style={{ padding: "6px 12px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", textDecoration: "none", fontWeight: "500" }}>View</a>
                        <button onClick={() => togglePublish(post.id)} style={{ padding: "6px 12px", background: post.published ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)", color: post.published ? "#d97706" : "#16a34a", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "500" }}>{post.published ? "Unpublish" : "Publish"}</button>
                        <button onClick={() => handleEdit(post)} style={{ padding: "6px 12px", background: "rgba(124,58,237,0.08)", color: "#7c3aed", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "500" }}>Edit</button>
                        <button onClick={() => handleDelete(post.id)} style={{ padding: "6px 12px", background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "ads" && (
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>💰 AdSense Settings</h2>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Configure your Google AdSense ad slots. These will be used across the website.</p>

              {/* Enable Toggle */}
              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "16px", padding: "20px 24px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>Enable AdSense Ads</div>
                  <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>Turn ads on or off across the entire website</div>
                </div>
                <button onClick={() => setAdsSettings(a => ({ ...a, adsEnabled: !a.adsEnabled }))}
                  style={{ padding: "8px 20px", background: adsSettings.adsEnabled ? "rgba(34,197,94,0.1)" : "#f1f5f9", border: `1.5px solid ${adsSettings.adsEnabled ? "rgba(34,197,94,0.4)" : "#e2e8f0"}`, color: adsSettings.adsEnabled ? "#16a34a" : "#64748b", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                  {adsSettings.adsEnabled ? "✅ Enabled" : "⭕ Disabled"}
                </button>
              </div>

              <div style={{ background: "#ffffff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                {/* Publisher ID */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>
                    AdSense Publisher ID
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "400", marginLeft: "8px" }}>e.g. ca-pub-1234567890123456</span>
                  </label>
                  <input type="text" value={adsSettings.publisherId} onChange={e => setAdsSettings(a => ({ ...a, publisherId: e.target.value }))}
                    placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                    style={{ width: "100%", padding: "12px 14px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none", fontFamily: "monospace" }}
                    onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                    onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                  />
                </div>

                <div style={{ height: "1px", background: "#f1f5f9", margin: "20px 0" }} />
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#94a3b8", letterSpacing: "1px", marginBottom: "16px" }}>AD SLOT IDs</div>

                {/* Ad Slots */}
                {[
                  { key: "headerAdSlot", label: "Header Ad Slot", desc: "Shown at the top of every page", placeholder: "1234567890" },
                  { key: "footerAdSlot", label: "Footer Ad Slot", desc: "Shown above the footer on every page", placeholder: "0987654321" },
                  { key: "sidebarAdSlot", label: "Sidebar Ad Slot", desc: "Shown in the sidebar on tool pages", placeholder: "1122334455" },
                  { key: "inArticleAdSlot", label: "In-Article Ad Slot", desc: "Shown inside blog posts", placeholder: "5544332211" },
                ].map(slot => (
                  <div key={slot.key} style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "4px" }}>
                      {slot.label}
                      <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "400", marginLeft: "8px" }}>{slot.desc}</span>
                    </label>
                    <input type="text" value={(adsSettings as any)[slot.key]} onChange={e => setAdsSettings(a => ({ ...a, [slot.key]: e.target.value }))}
                      placeholder={slot.placeholder}
                      style={{ width: "100%", padding: "11px 14px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none", fontFamily: "monospace" }}
                      onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                      onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                    />
                  </div>
                ))}

                <button onClick={saveAdsSettings}
                  style={{ marginTop: "8px", padding: "12px 28px", background: adsSaved ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #7c3aed, #9f67ff)", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.3)", transition: "all 0.2s" }}>
                  {adsSaved ? "✅ Settings Saved!" : "💾 Save AdSense Settings"}
                </button>
              </div>

              {/* How to use */}
              <div style={{ marginTop: "20px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "14px", padding: "20px 24px" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#7c3aed", marginBottom: "10px" }}>📌 How to Use</div>
                <ol style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.8", paddingLeft: "20px", margin: 0 }}>
                  <li>Go to <strong style={{ color: "#1e293b" }}>Google AdSense</strong> → Ads → By ad unit</li>
                  <li>Create ad units for each position (Header, Footer, Sidebar, In-Article)</li>
                  <li>Copy the <strong style={{ color: "#1e293b" }}>Publisher ID</strong> (ca-pub-XXXX) and each <strong style={{ color: "#1e293b" }}>Ad Slot ID</strong></li>
                  <li>Paste them above and click Save</li>
                  <li>Also add your AdSense script to <strong style={{ color: "#1e293b" }}>app/layout.tsx</strong></li>
                </ol>
              </div>
            </div>
          )}

          {(activeTab === "new" || activeTab === "edit") && (
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "24px" }}>
                {activeTab === "new" ? "✏️ New Blog Post" : "📝 Edit Post"}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", display: "block", marginBottom: "6px" }}>Post Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter post title..."
                    style={{ width: "100%", padding: "12px 14px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                    onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                    onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", display: "block", marginBottom: "6px" }}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", outline: "none" }}>
                    {["Security", "Authentication", "Password", "Developer", "Tutorial", "News"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", display: "block", marginBottom: "6px" }}>Cover Image</label>
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

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", display: "block", marginBottom: "6px" }}>Excerpt</label>
                <input type="text" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description..."
                  style={{ width: "100%", padding: "12px 14px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  onFocus={e => e.currentTarget.style.border = "1.5px solid #7c3aed"}
                  onBlur={e => e.currentTarget.style.border = "1.5px solid #e2e8f0"}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", color: "#64748b", fontWeight: "500", display: "block", marginBottom: "8px" }}>Content *</label>
                <TipTapEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={activeTab === "new" ? handlePublish : handleUpdate} disabled={!form.title || !form.content}
                  style={{ padding: "12px 28px", background: (!form.title || !form.content) ? "#e2e8f0" : "linear-gradient(135deg, #7c3aed, #9f67ff)", color: (!form.title || !form.content) ? "#94a3b8" : "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "700", cursor: !form.title || !form.content ? "not-allowed" : "pointer", boxShadow: (!form.title || !form.content) ? "none" : "0 4px 20px rgba(124,58,237,0.35)" }}>
                  {activeTab === "new" ? "🚀 Publish Post" : "💾 Update Post"}
                </button>
                <button onClick={() => { setActiveTab("posts"); setForm({ title: "", content: "", category: "Security", excerpt: "", coverImage: "" }); setEditingPost(null); setCoverPreview(""); }}
                  style={{ padding: "12px 20px", background: "#f1f5f9", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "15px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}