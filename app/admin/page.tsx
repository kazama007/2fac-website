"use client";
import { useState, useEffect } from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
}

const ADMIN_PASSWORD = "2fac@admin123";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "new" | "edit">("posts");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "Security",
    excerpt: "",
  });

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("admin-logged-in");
    if (loggedIn === "true") setIsLoggedIn(true);
    const saved = localStorage.getItem("blog-posts");
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem("blog-posts", JSON.stringify(newPosts));
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      sessionStorage.setItem("admin-logged-in", "true");
      setLoginError("");
    } else {
      setLoginError("Wrong password!");
    }
  };

  const handlePublish = () => {
    if (!form.title || !form.content) return;
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: form.title,
      slug,
      content: form.content,
      category: form.category,
      excerpt: form.excerpt || form.content.slice(0, 150) + "...",
      published: true,
      createdAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };
    savePosts([newPost, ...posts]);
    setForm({ title: "", content: "", category: "Security", excerpt: "" });
    setActiveTab("posts");
  };

  const handleUpdate = () => {
    if (!editingPost || !form.title || !form.content) return;
    const updated = posts.map(p => p.id === editingPost.id ? {
      ...p,
      title: form.title,
      content: form.content,
      category: form.category,
      excerpt: form.excerpt || form.content.slice(0, 150) + "...",
    } : p);
    savePosts(updated);
    setEditingPost(null);
    setActiveTab("posts");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({ title: post.title, content: post.content, category: post.category, excerpt: post.excerpt });
    setActiveTab("edit");
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this post?")) {
      savePosts(posts.filter(p => p.id !== id));
    }
  };

  const togglePublish = (id: string) => {
    savePosts(posts.map(p => p.id === id ? { ...p, published: !p.published } : p));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin-logged-in");
    setIsLoggedIn(false);
  };

  // Login Page
  if (!isLoggedIn) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "8px" }}>Admin Panel</h1>
          <p style={{ color: "#a0a0b0", fontSize: "14px", marginBottom: "24px" }}>2fa.ac Blog Management</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none", marginBottom: "12px" }}
          />
          {loginError && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{loginError}</p>}
          <button onClick={handleLogin} style={{ width: "100%", padding: "14px", background: "#7c3aed", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0f0f1a", fontFamily: "Inter, sans-serif", color: "#fff" }}>

      {/* Top Bar */}
      <div style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px" }}>⚙️</span>
          <span style={{ fontSize: "18px", fontWeight: "700" }}>2fa.ac Admin Panel</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a href="/blog" target="_blank" style={{ color: "#7c3aed", textDecoration: "none", fontSize: "14px" }}>View Blog →</a>
          <a href="/" style={{ color: "#a0a0b0", textDecoration: "none", fontSize: "14px" }}>Homepage</a>
          <button onClick={handleLogout} style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>

        {/* Sidebar */}
        <div style={{ width: "220px", background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.08)", padding: "20px 16px", flexShrink: 0 }}>
          <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "600", letterSpacing: "1px", marginBottom: "12px" }}>BLOG</div>
          {[
            { key: "posts", icon: "📋", label: "All Posts" },
            { key: "new", icon: "✏️", label: "New Post" },
          ].map(item => (
            <button key={item.key} onClick={() => setActiveTab(item.key as any)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: activeTab === item.key ? "rgba(124,58,237,0.2)" : "transparent", border: activeTab === item.key ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent", borderRadius: "8px", color: activeTab === item.key ? "#fff" : "#a0a0b0", cursor: "pointer", fontSize: "14px", marginBottom: "4px" }}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}

          <div style={{ marginTop: "24px", padding: "12px", background: "rgba(124,58,237,0.1)", borderRadius: "10px", fontSize: "13px" }}>
            <div style={{ color: "#7c3aed", fontWeight: "600", marginBottom: "4px" }}>Total Posts</div>
            <div style={{ fontSize: "24px", fontWeight: "800" }}>{posts.length}</div>
            <div style={{ color: "#a0a0b0", fontSize: "12px" }}>{posts.filter(p => p.published).length} published</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "24px 32px", overflow: "auto" }}>

          {/* All Posts */}
          {activeTab === "posts" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>All Blog Posts</h2>
                <button onClick={() => setActiveTab("new")} style={{ padding: "10px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                  + New Post
                </button>
              </div>

              {posts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#a0a0b0" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
                  <p>No posts yet. Create your first post!</p>
                  <button onClick={() => setActiveTab("new")} style={{ marginTop: "12px", padding: "10px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                    Create Post
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {posts.map(post => (
                    <div key={post.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "15px", fontWeight: "600" }}>{post.title}</span>
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: post.published ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: post.published ? "#22c55e" : "#f59e0b" }}>
                            {post.published ? "Published" : "Draft"}
                          </span>
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "rgba(124,58,237,0.15)", color: "#7c3aed" }}>
                            {post.category}
                          </span>
                        </div>
                        <div style={{ fontSize: "13px", color: "#6b7280" }}>{post.createdAt} • /blog/{post.slug}</div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a href={`/blog/${post.slug}`} target="_blank" style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", cursor: "pointer", fontSize: "12px", textDecoration: "none" }}>
                          View
                        </a>
                        <button onClick={() => togglePublish(post.id)} style={{ padding: "6px 12px", background: post.published ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)", color: post.published ? "#f59e0b" : "#22c55e", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                          {post.published ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => handleEdit(post)} style={{ padding: "6px 12px", background: "rgba(124,58,237,0.2)", color: "#7c3aed", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(post.id)} style={{ padding: "6px 12px", background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* New / Edit Post */}
          {(activeTab === "new" || activeTab === "edit") && (
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px" }}>
                {activeTab === "new" ? "✏️ New Blog Post" : "📝 Edit Post"}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#a0a0b0", display: "block", marginBottom: "6px" }}>Post Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter post title..."
                    style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: "#a0a0b0", display: "block", marginBottom: "6px" }}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "white", fontSize: "14px", outline: "none" }}
                  >
                    {["Security", "Authentication", "Password", "Developer", "Tutorial", "News"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "13px", color: "#a0a0b0", display: "block", marginBottom: "6px" }}>Excerpt (short description)</label>
                <input
                  type="text"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Short description for the post..."
                  style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", color: "#a0a0b0", display: "block", marginBottom: "6px" }}>Content * (Markdown supported)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your blog post here...

# Heading 1
## Heading 2

**Bold text**, *italic text*

- List item 1
- List item 2"
                  rows={20}
                  style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "white", fontSize: "14px", boxSizing: "border-box", outline: "none", resize: "vertical", fontFamily: "monospace", lineHeight: "1.6" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={activeTab === "new" ? handlePublish : handleUpdate}
                  disabled={!form.title || !form.content}
                  style={{ padding: "12px 28px", background: "#7c3aed", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer", opacity: !form.title || !form.content ? 0.6 : 1 }}>
                  {activeTab === "new" ? "🚀 Publish Post" : "💾 Update Post"}
                </button>
                <button onClick={() => { setActiveTab("posts"); setForm({ title: "", content: "", category: "Security", excerpt: "" }); setEditingPost(null); }} style={{ padding: "12px 20px", background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "15px", cursor: "pointer" }}>
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