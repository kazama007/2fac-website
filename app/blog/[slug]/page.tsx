"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar, Footer } from "../../shared";
import { supabase } from "../../lib/supabase";

interface BlogPost {
  id: string; title: string; slug: string; content: string; category: string; excerpt: string; published: boolean; createdAt: string; coverImage?: string; relatedTools?: string[]; relatedArticles?: string[]; worksWith?: string[]; faqs?: { q: string; a: string }[]; seoTitle?: string; seoDescription?: string; authorName?: string; authorAvatar?: string; ctaTitle?: string; ctaDesc?: string; ctaButton?: string; ctaLink?: string; newsletterTitle?: string; newsletterDesc?: string;
}

const ALL_TOOLS = [
  { name: "TOTP 2FA Generator", href: "/" },
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

const toolCategories = [
  { name: "2FA & QR", icon: "🔐", href: "/tools?category=2FA+%26+QR", count: 2 },
  { name: "Password", icon: "🔑", href: "/tools?category=Password", count: 3 },
  { name: "Developer", icon: "💻", href: "/tools?category=Developer", count: 5 },
  { name: "Network", icon: "🌐", href: "/tools?category=Network", count: 4 },
  { name: "All Tools", icon: "🔧", href: "/tools", count: 14 },
];

function extractHeadings(html: string) {
  const out: { level: number; text: string; id: string }[] = [];
  const re = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, "");
    out.push({ level: +m[1], text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") });
  }
  return out;
}

function addIds(html: string) {
  return html.replace(/<h([1-3])([^>]*)>(.*?)<\/h[1-3]>/gi, (_, l, a, t) => {
    const id = t.replace(/<[^>]+>/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `<h${l}${a} id="${id}">${t}</h${l}>`;
  });
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [activeHeading, setActiveHeading] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    setLoading(true);
    const { data: postData } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    const { data: allData } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (postData) {
      // Map DB fields to component fields
      setPost({
        ...postData,
        createdAt: postData.created_at,
        coverImage: postData.cover_image,
        relatedTools: postData.related_tools,
        relatedArticles: postData.related_articles,
        worksWith: postData.works_with,
        seoTitle: postData.seo_title,
        seoDescription: postData.seo_description,
        authorName: postData.author_name,
        authorAvatar: postData.author_avatar,
        ctaTitle: postData.cta_title,
        ctaDesc: postData.cta_desc,
        ctaButton: postData.cta_button,
        ctaLink: postData.cta_link,
        newsletterTitle: postData.newsletter_title,
        newsletterDesc: postData.newsletter_desc,
        showSteps: postData.show_steps,
      });
    }
    if (allData) setAllPosts(allData.map(p => ({ ...p, createdAt: p.created_at, coverImage: p.cover_image })));
    setLoading(false);
  };

  useEffect(() => {
    const fn = () => {
      let cur = "";
      document.querySelectorAll("h1[id],h2[id],h3[id]").forEach((el) => {
        if (el.getBoundingClientRect().top < 150) cur = el.id;
      });
      setActiveHeading(cur);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSubscribe = () => {
    if (!email) { setEmailError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Invalid email."); return; }
    setEmailError("");
    const list: string[] = JSON.parse(localStorage.getItem("newsletter-subscribers") || "[]");
    if (list.includes(email.toLowerCase())) { setEmailError("Already subscribed!"); return; }
    list.push(email.toLowerCase());
    localStorage.setItem("newsletter-subscribers", JSON.stringify(list));
    setSubscribed(true); setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  const share = (p: string) => {
    const url = window.location.href;
    const t = post?.title || "";
    if (p === "twitter") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(url)}`);
    if (p === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    if (p === "linkedin") window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(t)}`);
    if (p === "copy") { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  if (loading) return <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0f4ff,#faf5ff,#f0f9ff)", fontFamily: "Inter,sans-serif" }}><Navbar /><div style={{ textAlign: "center", padding: "80px 20px" }}><div style={{ fontSize: "40px" }}>⏳</div><p style={{ color: "#64748b" }}>Loading...</p></div><Footer /></main>;

  if (!post) return <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0f4ff,#faf5ff,#f0f9ff)", fontFamily: "Inter,sans-serif" }}><Navbar /><div style={{ textAlign: "center", padding: "80px 20px" }}><div style={{ fontSize: "60px" }}>📄</div><h1 style={{ color: "#1e293b" }}>Article Not Found</h1><a href="/blog" style={{ background: "#7c3aed", color: "white", padding: "12px 28px", borderRadius: "10px", textDecoration: "none" }}>Back to Blog</a></div><Footer /></main>;

  const headings = extractHeadings(post.content);
  const html = addIds(post.content);
  const readTime = Math.ceil(post.content.replace(/<[^>]+>/g, "").split(" ").length / 200);
  const related = post.relatedArticles?.length ? allPosts.filter(p => post.relatedArticles!.includes(p.title) && p.slug !== slug).slice(0,4) : allPosts.filter(p => p.category === post.category && p.slug !== slug).slice(0,4);
  const tools = post.relatedTools?.length ? ALL_TOOLS.filter(t => post.relatedTools!.includes(t.name)) : ALL_TOOLS.slice(0,5);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0f4ff 0%,#faf5ff 50%,#f0f9ff 100%)", fontFamily: "Inter,sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#94a3b8", marginBottom: "28px" }}>
          <a href="/" style={{ color: "#7c3aed", textDecoration: "none" }}>Home</a><span>›</span>
          <a href="/blog" style={{ color: "#7c3aed", textDecoration: "none" }}>Blog</a><span>›</span>
          <span style={{ color: "#1e293b" }}>{post.title.slice(0, 40)}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "40px" }}>
          <article>
            <div style={{ marginBottom: "14px" }}>
              <span style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed", fontSize: "11px", padding: "4px 12px", borderRadius: "6px", fontWeight: "700", textTransform: "uppercase" as const }}>{post.category}</span>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1e293b", lineHeight: "1.25", marginBottom: "14px" }}>{post.title}</h1>
            {post.excerpt && <p style={{ fontSize: "16px", color: "#64748b", lineHeight: "1.7", marginBottom: "18px" }}>{post.excerpt}</p>}
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "#64748b" }}>
                <span>👤 By {post.authorName || "2FA.AC Team"}</span>
                <span>🕐 {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span>⏱ {readTime} min read</span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {[{p:"twitter",l:"𝕏",bg:"#000"},{p:"facebook",l:"f",bg:"#1877f2"},{p:"linkedin",l:"in",bg:"#0077b5"},{p:"copy",l:copied?"✓":"🔗",bg:"#64748b"}].map(s=>(
                  <button key={s.p} onClick={()=>share(s.p)} style={{ width:"30px",height:"30px",borderRadius:"8px",background:s.bg,border:"none",cursor:"pointer",fontSize:"12px",color:"white",fontWeight:"700" }}>{s.l}</button>
                ))}
              </div>
            </div>
            {post.coverImage && <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "28px" }}><img src={post.coverImage} alt={post.title} style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} /></div>}
            {headings.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "14px", padding: "20px 24px", marginBottom: "28px" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginBottom: "14px" }}>📋 In this article</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 16px" }}>
                  {headings.map((h,i) => <a key={i} href={`#${h.id}`} style={{ fontSize: "13px", color: "#7c3aed", textDecoration: "none", display: "flex", gap: "6px" }}><span style={{ color: "#94a3b8" }}>{i+1}.</span><span>{h.text}</span></a>)}
                </div>
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: html }} style={{ lineHeight: "1.8", color: "#374151" }} />
            {post.worksWith && post.worksWith.length > 0 && (
              <div style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: "16px", padding: "24px", margin: "32px 0" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>🔗 Works With</h3>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {post.worksWith.map((app,i) => <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", color: "#1e293b" }}>{app}</div>)}
                </div>
              </div>
            )}
            {post.faqs && post.faqs.length > 0 && (
              <div style={{ margin: "32px 0" }}>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>Frequently Asked Questions</h2>
                {post.faqs.map((faq,i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "12px", overflow: "hidden", marginBottom: "8px" }}>
                    <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width:"100%",padding:"16px 20px",display:"flex",justifyContent:"space-between",background:openFaq===i?"rgba(124,58,237,0.04)":"transparent",border:"none",cursor:"pointer",textAlign:"left" as const }}>
                      <span style={{ fontSize:"14px",fontWeight:"600",color:"#1e293b" }}>{faq.q}</span>
                      <span style={{ color:"#7c3aed",fontSize:"20px",fontWeight:"700" }}>{openFaq===i?"−":"+"}</span>
                    </button>
                    {openFaq===i && <div style={{ padding:"0 20px 16px",fontSize:"14px",color:"#64748b",lineHeight:"1.7" }}>{faq.a}</div>}
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop:"32px",background:"linear-gradient(135deg,#7c3aed,#9f67ff)",borderRadius:"20px",padding:"32px",display:"flex",alignItems:"center",gap:"20px" }}>
              <div style={{ fontSize:"52px" }}>🛡️</div>
              <div style={{ flex:1,color:"white" }}>
                <h3 style={{ fontSize:"18px",fontWeight:"700",marginBottom:"6px" }}>{post.ctaTitle||"Secure Your Accounts with 2FA"}</h3>
                <p style={{ fontSize:"13px",opacity:0.85,marginBottom:"16px" }}>{post.ctaDesc||"Enable two-factor authentication and protect your accounts."}</p>
                <a href={post.ctaLink||"/tools"} style={{ background:"white",color:"#7c3aed",padding:"10px 24px",borderRadius:"10px",textDecoration:"none",fontWeight:"700",fontSize:"14px" }}>{post.ctaButton||"Explore 2FA Tools →"}</a>
              </div>
            </div>
          </article>
          <aside style={{ display:"flex",flexDirection:"column",gap:"20px",position:"sticky",top:"90px" }}>
            {headings.length > 0 && (
              <div style={{ background:"#fff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"20px" }}>
                <h3 style={{ fontSize:"14px",fontWeight:"700",color:"#1e293b",marginBottom:"14px" }}>On this page</h3>
                {headings.map((h,i) => <a key={i} href={`#${h.id}`} style={{ fontSize:"13px",color:activeHeading===h.id?"#7c3aed":"#64748b",textDecoration:"none",padding:"6px 10px",borderRadius:"6px",display:"flex",gap:"8px",background:activeHeading===h.id?"rgba(124,58,237,0.06)":"transparent",borderLeft:`2px solid ${activeHeading===h.id?"#7c3aed":"transparent"}`,fontWeight:activeHeading===h.id?"600":"400",lineHeight:"1.4",marginBottom:"2px" }}><span style={{ color:"#94a3b8",fontSize:"11px",flexShrink:0 }}>{i+1}.</span><span>{h.text}</span></a>)}
              </div>
            )}
            {related.length > 0 && (
              <div style={{ background:"#fff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"20px" }}>
                <h3 style={{ fontSize:"14px",fontWeight:"700",color:"#1e293b",marginBottom:"16px" }}>Related Articles</h3>
                {related.map((rp,i) => <a key={i} href={`/blog/${rp.slug}`} style={{ display:"flex",gap:"12px",marginBottom:"14px",textDecoration:"none" }}>
                  <div style={{ width:"48px",height:"48px",background:"rgba(124,58,237,0.08)",borderRadius:"10px",overflow:"hidden",flexShrink:0 }}>
                    {rp.coverImage?<img src={rp.coverImage} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:<div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px" }}>📄</div>}
                  </div>
                  <div><p style={{ fontSize:"13px",fontWeight:"600",color:"#1e293b",margin:"0 0 4px",lineHeight:"1.4" }}>{rp.title}</p><p style={{ fontSize:"11px",color:"#94a3b8",margin:0 }}>{new Date(rp.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p></div>
                </a>)}
              </div>
            )}
            <div style={{ background:"linear-gradient(135deg,#7c3aed,#9f67ff)",borderRadius:"16px",padding:"24px",color:"white" }}>
              <h3 style={{ fontSize:"16px",fontWeight:"700",marginBottom:"8px" }}>{post.newsletterTitle||"Stay Updated"}</h3>
              <p style={{ fontSize:"13px",opacity:0.85,marginBottom:"16px" }}>{post.newsletterDesc||"Get the latest security tips in your inbox."}</p>
              {subscribed?<div style={{ background:"rgba(255,255,255,0.2)",borderRadius:"10px",padding:"16px",textAlign:"center" as const }}><div style={{ fontSize:"28px" }}>🎉</div><p style={{ fontWeight:"700",margin:"6px 0 0" }}>Subscribed!</p></div>:<>
                <input type="email" value={email} onChange={e=>{setEmail(e.target.value);setEmailError("");}} onKeyDown={e=>e.key==="Enter"&&handleSubscribe()} placeholder="Enter your email" style={{ width:"100%",padding:"10px 14px",borderRadius:"8px",border:emailError?"2px solid #fca5a5":"none",fontSize:"13px",marginBottom:"8px",boxSizing:"border-box" as const,outline:"none" }}/>
                {emailError&&<p style={{ fontSize:"11px",color:"#fca5a5",margin:"0 0 8px" }}>{emailError}</p>}
                <button onClick={handleSubscribe} style={{ width:"100%",padding:"10px",background:"white",color:"#7c3aed",border:"none",borderRadius:"8px",fontSize:"13px",fontWeight:"700",cursor:"pointer" }}>Subscribe</button>
                <p style={{ fontSize:"11px",opacity:0.7,marginTop:"8px",textAlign:"center" as const }}>No spam, unsubscribe anytime.</p>
              </>}
            </div>
            <div style={{ background:"#fff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"20px" }}>
              <h3 style={{ fontSize:"14px",fontWeight:"700",color:"#1e293b",marginBottom:"14px" }}>🔧 Related Tools</h3>
              {tools.map((t,i) => <a key={i} href={t.href} style={{ fontSize:"13px",color:"#64748b",textDecoration:"none",padding:"9px 10px",borderRadius:"8px",display:"flex",justifyContent:"space-between",borderBottom:i<tools.length-1?"1px solid #f8fafc":"none" }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.06)";e.currentTarget.style.color="#7c3aed";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#64748b";}}><span>→ {t.name}</span><span style={{ opacity:0.4 }}>›</span></a>)}
              <a href="/tools" style={{ display:"block",textAlign:"center",marginTop:"10px",padding:"8px",background:"#f1f5f9",color:"#7c3aed",textDecoration:"none",borderRadius:"8px",fontSize:"12px",fontWeight:"600" }}>View All Tools →</a>
            </div>
            <div style={{ background:"#fff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"20px" }}>
              <h3 style={{ fontSize:"14px",fontWeight:"700",color:"#1e293b",marginBottom:"14px" }}>🔧 Tool Categories</h3>
              {toolCategories.map((cat,i) => <a key={i} href={cat.href} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 10px",borderRadius:"8px",textDecoration:"none" }} onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background="rgba(124,58,237,0.06)";}} onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background="transparent";}}>
                <div style={{ display:"flex",alignItems:"center",gap:"10px" }}><div style={{ width:"32px",height:"32px",background:"rgba(124,58,237,0.08)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px" }}>{cat.icon}</div><span style={{ fontSize:"13px",color:"#64748b",fontWeight:"500" }}>{cat.name}</span></div>
                <div style={{ display:"flex",alignItems:"center",gap:"6px" }}><span style={{ fontSize:"12px",background:"rgba(124,58,237,0.08)",color:"#7c3aed",padding:"2px 8px",borderRadius:"20px",fontWeight:"600" }}>{cat.count}</span><span style={{ opacity:0.4 }}>›</span></div>
              </a>)}
              <a href="/tools" style={{ display:"block",textAlign:"center",marginTop:"10px",padding:"9px",background:"#f1f5f9",color:"#7c3aed",textDecoration:"none",borderRadius:"8px",fontSize:"12px",fontWeight:"600" }}>View All Tools →</a>
            </div>
          </aside>
        </div>
      </div>
      <style>{`article h1{font-size:26px;font-weight:800;color:#1e293b;margin:28px 0 14px}article h2{font-size:22px;font-weight:700;color:#1e293b;margin:32px 0 12px}article h3{font-size:17px;font-weight:700;color:#1e293b;margin:24px 0 10px}article p{margin:0 0 16px;font-size:15px;line-height:1.8;color:#374151}article ul,article ol{margin:0 0 18px 24px}article li{font-size:15px;line-height:1.8;color:#374151;margin-bottom:6px}article a{color:#7c3aed;text-decoration:underline}article strong{font-weight:700;color:#1e293b}article blockquote{border-left:4px solid #7c3aed;background:rgba(124,58,237,0.05);padding:16px 20px;border-radius:0 12px 12px 0;margin:20px 0;font-style:italic;color:#64748b}article code{background:rgba(124,58,237,0.08);color:#7c3aed;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px}article pre{background:#1e293b;color:#e2e8f0;padding:20px;border-radius:12px;overflow-x:auto;margin:20px 0}article img{max-width:100%;border-radius:12px;margin:16px 0}article table{width:100%;border-collapse:collapse;margin:20px 0}article thead{background:#7c3aed}article thead th{color:white;font-weight:700;font-size:13px;padding:12px 16px;text-align:left}article tbody td{padding:12px 16px;font-size:14px;color:#374151;border-bottom:1px solid #e2e8f0}`}</style>
      <Footer />
    </main>
  );
}