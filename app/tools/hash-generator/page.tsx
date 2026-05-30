"use client";
import { useState, useEffect } from "react";
import { Navbar, Footer } from "../../shared";
import AnimatedBackground from "../../background";
import { HeaderAd, FooterAd, SidebarAd } from "../../adsense";



async function generateHash(text: string, algorithm: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function md5(input: string): string {
  function safeAdd(x: number, y: number) { const lsw = (x & 0xffff) + (y & 0xffff); return ((x >> 16) + (y >> 16) + (lsw >> 16)) << 16 | (lsw & 0xffff); }
  function bitRot(num: number, cnt: number) { return num << cnt | num >>> (32 - cnt); }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) { return safeAdd(bitRot(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b & c | ~b & d, a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b & d | c & ~d, a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
  const str = unescape(encodeURIComponent(input));
  const x: number[] = [];
  for (let i = 0; i < str.length * 8; i += 8) x[i >> 5] = (x[i >> 5] || 0) | (str.charCodeAt(i / 8) & 0xff) << i % 32;
  x[str.length * 8 >> 5] = (x[str.length * 8 >> 5] || 0) | 0x80 << str.length * 8 % 32;
  x[(str.length * 8 + 64 >>> 9 << 4) + 14] = str.length * 8;
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const [oa, ob, oc, od] = [a, b, c, d];
    a=ff(a,b,c,d,x[i],7,-680876936);d=ff(d,a,b,c,x[i+1],12,-389564586);c=ff(c,d,a,b,x[i+2],17,606105819);b=ff(b,c,d,a,x[i+3],22,-1044525330);
    a=ff(a,b,c,d,x[i+4],7,-176418897);d=ff(d,a,b,c,x[i+5],12,1200080426);c=ff(c,d,a,b,x[i+6],17,-1473231341);b=ff(b,c,d,a,x[i+7],22,-45705983);
    a=ff(a,b,c,d,x[i+8],7,1770035416);d=ff(d,a,b,c,x[i+9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,-42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
    a=ff(a,b,c,d,x[i+12],7,1804603682);d=ff(d,a,b,c,x[i+13],12,-40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);b=ff(b,c,d,a,x[i+15],22,1236535329);
    a=gg(a,b,c,d,x[i+1],5,-165796510);d=gg(d,a,b,c,x[i+6],9,-1069501632);c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i],20,-373897302);
    a=gg(a,b,c,d,x[i+5],5,-701558691);d=gg(d,a,b,c,x[i+10],9,38016083);c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+4],20,-405537848);
    a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);c=gg(c,d,a,b,x[i+3],14,-187363961);b=gg(b,c,d,a,x[i+8],20,1163531501);
    a=gg(a,b,c,d,x[i+13],5,-1444681467);d=gg(d,a,b,c,x[i+2],9,-51403784);c=gg(c,d,a,b,x[i+7],14,1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);
    a=hh(a,b,c,d,x[i+5],4,-378558);d=hh(d,a,b,c,x[i+8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16,1839030562);b=hh(b,c,d,a,x[i+14],23,-35309556);
    a=hh(a,b,c,d,x[i+1],4,-1530992060);d=hh(d,a,b,c,x[i+4],11,1272893353);c=hh(c,d,a,b,x[i+7],16,-155497632);b=hh(b,c,d,a,x[i+10],23,-1094730640);
    a=hh(a,b,c,d,x[i+13],4,681279174);d=hh(d,a,b,c,x[i],11,-358537222);c=hh(c,d,a,b,x[i+3],16,-722521979);b=hh(b,c,d,a,x[i+6],23,76029189);
    a=hh(a,b,c,d,x[i+9],4,-640364487);d=hh(d,a,b,c,x[i+12],11,-421815835);c=hh(c,d,a,b,x[i+15],16,530742520);b=hh(b,c,d,a,x[i+2],23,-995338651);
    a=ii(a,b,c,d,x[i],6,-198630844);d=ii(d,a,b,c,x[i+7],10,1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);b=ii(b,c,d,a,x[i+5],21,-57434055);
    a=ii(a,b,c,d,x[i+12],6,1700485571);d=ii(d,a,b,c,x[i+3],10,-1894986606);c=ii(c,d,a,b,x[i+10],15,-1051523);b=ii(b,c,d,a,x[i+1],21,-2054922799);
    a=ii(a,b,c,d,x[i+8],6,1873313359);d=ii(d,a,b,c,x[i+15],10,-30611744);c=ii(c,d,a,b,x[i+6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21,1309151649);
    a=ii(a,b,c,d,x[i+4],6,-145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+2],15,718787259);b=ii(b,c,d,a,x[i+9],21,-343485551);
    a=safeAdd(a,oa);b=safeAdd(b,ob);c=safeAdd(c,oc);d=safeAdd(d,od);
  }
  return [a,b,c,d].map(n=>{const h=(n<0?n+4294967296:n).toString(16).padStart(8,"0");return h.match(/../g)!.map(x=>x[1]+x[0]).join("");}).join("");
}

const algoColors: {[k:string]:string} = {"MD5":"#ef4444","SHA-1":"#f59e0b","SHA-256":"#7c3aed","SHA-384":"#3b82f6","SHA-512":"#22c55e"};

const faqs = [
  {q:"What is a hash function?",a:"A hash function converts any input into a fixed-length string. The same input always produces the same hash, but it is virtually impossible to reverse the hash back to the original input."},
  {q:"What is the difference between MD5, SHA-256, and SHA-512?",a:"MD5 produces a 128-bit hash and is considered weak. SHA-256 produces a 256-bit hash and is widely used. SHA-512 offers the highest security with a 512-bit hash."},
  {q:"Is my data safe to enter here?",a:"Yes! All hashing is done entirely in your browser using the Web Crypto API. Your data is never sent to any server."},
  {q:"What are hash functions used for?",a:"Hash functions are used for verifying file integrity, storing passwords securely, digital signatures, checksums, and cryptographic protocols."},
  {q:"Can a hash be reversed?",a:"No. Hash functions are one-way. It is computationally infeasible to reverse a hash to its original input. Simple inputs can be found using rainbow tables, which is why salting passwords is important."},
];

export default function HashGenerator() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    setMounted(true);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<{[k:string]:string}>({});
  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  const generate = async () => {
    if (!text) return;
    setLoading(true);
    const r: {[k:string]:string} = {};
    r["MD5"] = md5(text);
    r["SHA-1"] = await generateHash(text, "SHA-1");
    r["SHA-256"] = await generateHash(text, "SHA-256");
    r["SHA-384"] = await generateHash(text, "SHA-384");
    r["SHA-512"] = await generateHash(text, "SHA-512");
    setHashes(r); setLoading(false);
  };
  const copy = (hash: string, key: string) => { navigator.clipboard.writeText(hash); setCopied(key); setTimeout(() => setCopied(""), 2000); };

  return (
    <main style={{minHeight:"100vh",background:"linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)",fontFamily:"Inter, sans-serif",position:"relative"}}>
      <AnimatedBackground /><Navbar />
      <HeaderAd />
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"32px 20px 80px",position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#94a3b8",marginBottom:"20px"}}>
          <a href="/" style={{color:"#7c3aed",textDecoration:"none"}}>Home</a><span>›</span>
          <a href="/tools" style={{color:"#7c3aed",textDecoration:"none"}}>Tools</a><span>›</span>
          <span style={{color:"#1e293b",fontWeight:"500"}}>Hash Generator</span>
        </div>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"20px",marginBottom:"16px",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <div style={{width:"64px",height:"64px",background:"linear-gradient(135deg, #8b5cf6, #a78bfa)",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"30px",flexShrink:0,boxShadow:"0 8px 24px rgba(139,92,246,0.3)"}}>#️⃣</div>
            <div>
              <h1 style={{fontSize:"30px",fontWeight:"800",color:"#1e293b",margin:"0 0 4px"}}>Hash Generator</h1>
              <p style={{color:"#64748b",fontSize:"14px",margin:0}}>Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text instantly.</p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"6px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"8px 14px",fontSize:"12px",color:"#64748b"}}>🕐 Last updated: May 2025</div>
        </div>
        <div style={{display:"flex",gap:"12px",marginBottom:"28px",flexWrap:"wrap"}}>
          {[{icon:"✅",label:"100% Free"},{icon:"🚫",label:"No Signup"},{icon:"🖥️",label:"Browser-Based"},{icon:"🔒",label:"Private & Secure"}].map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"6px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"6px 12px",fontSize:"12px",color:"#64748b",fontWeight:"500"}}><span>{b.icon}</span>{b.label}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:mounted&&isMobile?"1fr":"1fr 300px",gap:"24px",alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
            <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.12)",borderRadius:"20px",padding:"32px",boxShadow:"0 4px 24px rgba(124,58,237,0.06)"}}>
              <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Enter any text, password, or data..." rows={4}
                style={{width:"100%",padding:"14px 16px",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:"12px",color:"#1e293b",fontSize:"14px",boxSizing:"border-box",outline:"none",resize:"vertical",fontFamily:"Inter, sans-serif",marginBottom:"16px"}}
                onFocus={e=>e.currentTarget.style.border="1.5px solid #7c3aed"}
                onBlur={e=>e.currentTarget.style.border="1.5px solid #e2e8f0"} />
              <button onClick={generate} disabled={loading} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg, #7c3aed, #9f67ff)",color:"white",border:"none",borderRadius:"12px",fontSize:"16px",fontWeight:"700",cursor:"pointer",marginBottom:"20px",boxShadow:"0 4px 20px rgba(124,58,237,0.35)"}}>
                {loading ? "Generating..." : "Generate Hashes"}
              </button>
              {Object.keys(hashes).length > 0 && (
                <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                  {Object.entries(hashes).map(([algo, hash]) => (
                    <div key={algo} style={{background:"#f8fafc",border:`1.5px solid ${algoColors[algo]}30`,borderRadius:"12px",padding:"16px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                        <span style={{fontSize:"13px",fontWeight:"700",color:algoColors[algo]}}>{algo}</span>
                        <button onClick={()=>copy(hash,algo)} style={{background:copied===algo?"#22c55e":"rgba(124,58,237,0.1)",border:copied===algo?"none":"1px solid rgba(124,58,237,0.3)",color:copied===algo?"white":"#7c3aed",borderRadius:"6px",padding:"4px 12px",cursor:"pointer",fontSize:"12px",fontWeight:"600"}}>
                          {copied===algo?"Copied!":"Copy"}
                        </button>
                      </div>
                      <div style={{fontFamily:"monospace",fontSize:"12px",color:"#64748b",wordBreak:"break-all"}}>{hash}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
              <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"24px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
                <h2 style={{fontSize:"16px",fontWeight:"700",color:"#1e293b",marginBottom:"12px"}}>About Hash Generator</h2>
                <p style={{fontSize:"13px",color:"#64748b",lineHeight:"1.8",margin:"0 0 10px"}}>Our Hash Generator creates cryptographic hashes from any text input instantly. Supports MD5, SHA-1, SHA-256, SHA-384, and SHA-512 algorithms all in one tool.</p>
                <p style={{fontSize:"13px",color:"#64748b",lineHeight:"1.8",margin:0}}>Perfect for developers verifying file integrity, hashing passwords, generating checksums, or learning about cryptographic hash functions.</p>
              </div>
              <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"24px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
                <h2 style={{fontSize:"16px",fontWeight:"700",color:"#1e293b",marginBottom:"12px"}}>Why Use Our Hash Generator?</h2>
                <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                  {["Supports 5 hash algorithms simultaneously","Instant hash generation — no waiting","Copy individual hashes with one click","Works entirely in your browser — 100% private","No account required — completely free"].map((b,i)=>(
                    <div key={i} style={{display:"flex",gap:"8px",alignItems:"center"}}>
                      <div style={{width:"18px",height:"18px",borderRadius:"50%",background:"rgba(34,197,94,0.1)",border:"1.5px solid rgba(34,197,94,0.4)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#16a34a",fontSize:"10px",fontWeight:"700"}}>✓</span></div>
                      <span style={{fontSize:"13px",color:"#64748b"}}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:"16px",padding:"20px",display:"flex",gap:"14px",alignItems:"flex-start"}}>
              <div style={{fontSize:"28px",flexShrink:0}}>🛡️</div>
              <div><h3 style={{fontSize:"15px",fontWeight:"700",color:"#1e293b",marginBottom:"6px"}}>Privacy & Security</h3><p style={{fontSize:"13px",color:"#64748b",lineHeight:"1.7",margin:0}}>All hashing is performed locally in your browser using the Web Crypto API. Your text or data is never sent to any server or stored anywhere.</p></div>
            </div>

            <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"24px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
              <h2 style={{fontSize:"16px",fontWeight:"700",color:"#1e293b",marginBottom:"16px"}}>Frequently Asked Questions (FAQ)</h2>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0"}}>
                {faqs.map((faq,i)=>(
                  <div key={i} style={{borderBottom:"1px solid #f1f5f9",paddingRight:i%2===0?"16px":"0",paddingLeft:i%2===1?"16px":"0",borderRight:i%2===0?"1px solid #f1f5f9":"none"}}>
                    <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",padding:"14px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                      <span style={{fontSize:"13px",fontWeight:"600",color:"#1e293b",paddingRight:"8px"}}>{faq.q}</span>
                      <span style={{color:"#7c3aed",fontSize:"16px",fontWeight:"700",flexShrink:0}}>{openFaq===i?"−":"+"}</span>
                    </button>
                    {openFaq===i && <div style={{padding:"0 0 14px",fontSize:"13px",color:"#64748b",lineHeight:"1.7"}}>{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:"linear-gradient(135deg, rgba(124,58,237,0.08), rgba(159,103,255,0.08))",border:"1px solid rgba(124,58,237,0.2)",borderRadius:"16px",padding:"24px",display:"flex",gap:"20px",alignItems:"center"}}>
              <div style={{fontSize:"44px",flexShrink:0}}>#️⃣</div>
              <div style={{flex:1}}>
                <h3 style={{fontSize:"16px",fontWeight:"700",color:"#1e293b",marginBottom:"4px"}}>Generate Cryptographic Hashes Instantly</h3>
                <p style={{fontSize:"13px",color:"#64748b",margin:"0 0 12px"}}>Use our free Hash Generator for MD5, SHA-256, and SHA-512 hashes in seconds.</p>
                <a href="/tools/jwt-decoder" style={{display:"inline-block",background:"linear-gradient(135deg, #7c3aed, #9f67ff)",color:"white",textDecoration:"none",padding:"10px 20px",borderRadius:"10px",fontSize:"13px",fontWeight:"600"}}>Try JWT Decoder →</a>
              </div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:"16px",position:mounted&&isMobile?"static":"sticky",top:"90px"}}>
            <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"20px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
              <h3 style={{fontSize:"14px",fontWeight:"700",color:"#1e293b",marginBottom:"12px"}}>🔧 Related Tools</h3>
              {[{name:"JWT Decoder",href:"/tools/jwt-decoder"},{name:"Base64 Encoder/Decoder",href:"/tools/base64"},{name:"UUID Generator",href:"/tools/uuid-generator"},{name:"JSON Formatter",href:"/tools/json-formatter"},{name:"Password Generator",href:"/tools/password-generator"}].map((tool,i,arr)=>(
                <a key={i} href={tool.href} style={{fontSize:"13px",color:"#64748b",textDecoration:"none",padding:"10px 12px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:i<arr.length-1?"1px solid #f8fafc":"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.06)";e.currentTarget.style.color="#7c3aed";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#64748b";}}>
                  <span>→ {tool.name}</span><span style={{opacity:0.4}}>›</span>
                </a>
              ))}
              <a href="/tools" style={{display:"block",textAlign:"center",marginTop:"10px",padding:"8px",background:"#f1f5f9",color:"#7c3aed",textDecoration:"none",borderRadius:"8px",fontSize:"12px",fontWeight:"600"}}>View All Tools →</a>
            </div>
            <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"20px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
              <h3 style={{fontSize:"14px",fontWeight:"700",color:"#1e293b",marginBottom:"12px"}}>📝 Related Articles</h3>
              {["What is 2FA and Why You Need It","How Hash Functions Work","Cryptography Basics"].map((article,i,arr)=>(
                <a key={i} href="/blog" style={{fontSize:"13px",color:"#64748b",textDecoration:"none",padding:"10px 12px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:i<arr.length-1?"1px solid #f8fafc":"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.06)";e.currentTarget.style.color="#7c3aed";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#64748b";}}>
                  <span>→ {article}</span><span style={{opacity:0.4}}>›</span>
                </a>
              ))}
              <a href="/blog" style={{display:"block",textAlign:"center",marginTop:"10px",padding:"8px",background:"#f1f5f9",color:"#7c3aed",textDecoration:"none",borderRadius:"8px",fontSize:"12px",fontWeight:"600"}}>View All Articles →</a>
            </div>
            <div style={{background:"rgba(124,58,237,0.06)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:"16px",padding:"18px"}}>
              <h3 style={{fontSize:"13px",fontWeight:"700",color:"#7c3aed",marginBottom:"10px"}}>⚡ Quick Info</h3>
              {[{label:"Type",value:"Free Tool"},{label:"Processing",value:"Browser-based"},{label:"Account Required",value:"No"},{label:"Data Stored",value:"None"},{label:"Algorithms",value:"5 supported"}].map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<4?"1px solid rgba(124,58,237,0.08)":"none"}}>
                  <span style={{fontSize:"12px",color:"#94a3b8"}}>{item.label}</span>
                  <span style={{fontSize:"12px",fontWeight:"600",color:"#1e293b"}}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterAd />
      <Footer />
    </main>
  );
}