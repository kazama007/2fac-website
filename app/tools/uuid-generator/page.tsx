"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar, Footer } from "../../shared";
function DotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let width = canvas.width = window.innerWidth, height = canvas.height = window.innerHeight;
    const S=28,R=1.2,m={x:-999,y:-999};
    const mm=(e:MouseEvent)=>{m.x=e.clientX;m.y=e.clientY;};
    window.addEventListener("mousemove",mm);
    let id:number;
    const draw=()=>{ctx.clearRect(0,0,width,height);const c=Math.ceil(width/S)+1,r=Math.ceil(height/S)+1;for(let i=0;i<c;i++)for(let j=0;j<r;j++){const x=i*S,y=j*S,dx=m.x-x,dy=m.y-y,d=Math.sqrt(dx*dx+dy*dy);ctx.beginPath();ctx.arc(x,y,d<100?R+(1-d/100)*1.2:R,0,Math.PI*2);ctx.fillStyle=d<100?`rgba(124,58,237,${0.3+(1-d/100)*0.5})`:"rgba(148,163,184,0.25)";ctx.fill();}id=requestAnimationFrame(draw);};
    draw();
    const rs=()=>{width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight;};
    window.addEventListener("resize",rs);
    return()=>{cancelAnimationFrame(id);window.removeEventListener("mousemove",mm);window.removeEventListener("resize",rs);};
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}}/>;
}
function genUUID(){return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==="x"?r:r&0x3|0x8).toString(16);});}
const faqs=[{q:"What is a UUID?",a:"UUID (Universally Unique Identifier) is a 128-bit label used in software to uniquely identify information without requiring a central authority. Formatted as 32 hexadecimal digits separated by hyphens."},{q:"What is UUID v4?",a:"UUID v4 is generated using random numbers. It is the most commonly used UUID version for general-purpose unique identifiers in applications and databases."},{q:"How unique are UUIDs?",a:"UUID v4 has 122 random bits — 5.3 x 10^36 possible values. The probability of generating two identical UUIDs is astronomically low."},{q:"Where are UUIDs used?",a:"UUIDs are used as primary keys in databases, session identifiers, transaction IDs, file names, API request tracking, and distributed systems."},{q:"Are these UUIDs cryptographically secure?",a:"These UUIDs use Math.random() which is not cryptographically secure. For security-sensitive use cases, use crypto.randomUUID() or a server-side UUID library."}];
export default function UUIDGenerator() {
  const [uuids,setUuids]=useState<string[]>([]);
  const [count,setCount]=useState(5);
  const [copied,setCopied]=useState("");
  const [copiedAll,setCopiedAll]=useState(false);
  const [openFaq,setOpenFaq]=useState<number|null>(null);
  const generate=()=>setUuids(Array.from({length:count},()=>genUUID()));
  const copy=(u:string)=>{navigator.clipboard.writeText(u);setCopied(u);setTimeout(()=>setCopied(""),2000);};
  const copyAll=()=>{navigator.clipboard.writeText(uuids.join("\n"));setCopiedAll(true);setTimeout(()=>setCopiedAll(false),2000);};
  return (
    <main style={{minHeight:"100vh",background:"linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)",fontFamily:"Inter, sans-serif",position:"relative"}}>
      <DotsBackground/><Navbar/>
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"32px 20px 80px",position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#94a3b8",marginBottom:"20px"}}>
          <a href="/" style={{color:"#7c3aed",textDecoration:"none"}}>Home</a><span>›</span><a href="/tools" style={{color:"#7c3aed",textDecoration:"none"}}>Tools</a><span>›</span><span style={{color:"#1e293b",fontWeight:"500"}}>UUID Generator</span>
        </div>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"20px",marginBottom:"16px",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <div style={{width:"64px",height:"64px",background:"linear-gradient(135deg, #06b6d4, #22d3ee)",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"30px",flexShrink:0,boxShadow:"0 8px 24px rgba(6,182,212,0.3)"}}>🆔</div>
            <div><h1 style={{fontSize:"30px",fontWeight:"800",color:"#1e293b",margin:"0 0 4px"}}>UUID Generator</h1><p style={{color:"#64748b",fontSize:"14px",margin:0}}>Generate multiple UUID v4 unique identifiers instantly. Copy all at once, completely free.</p></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"6px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"8px 14px",fontSize:"12px",color:"#64748b"}}>🕐 Last updated: May 2025</div>
        </div>
        <div style={{display:"flex",gap:"12px",marginBottom:"28px",flexWrap:"wrap"}}>
          {[{icon:"✅",label:"100% Free"},{icon:"🚫",label:"No Signup"},{icon:"🖥️",label:"Browser-Based"},{icon:"🔒",label:"Private & Secure"}].map((b,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"6px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"6px 12px",fontSize:"12px",color:"#64748b",fontWeight:"500"}}><span>{b.icon}</span>{b.label}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:"24px",alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
            <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.12)",borderRadius:"20px",padding:"32px",boxShadow:"0 4px 24px rgba(124,58,237,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}><label style={{fontSize:"13px",color:"#64748b",fontWeight:"600"}}>Number of UUIDs</label><span style={{fontSize:"13px",fontWeight:"700",color:"#7c3aed"}}>{count}</span></div>
              <input type="range" min="1" max="20" value={count} onChange={e=>setCount(Number(e.target.value))} style={{width:"100%",accentColor:"#7c3aed",marginBottom:"16px"}}/>
              <div style={{display:"flex",gap:"8px",marginBottom:"20px"}}>
                {[1,5,10,20].map(n=>(
                  <button key={n} onClick={()=>setCount(n)} style={{flex:1,padding:"8px",background:count===n?"rgba(124,58,237,0.1)":"#f8fafc",border:count===n?"1.5px solid #7c3aed":"1.5px solid #e2e8f0",borderRadius:"8px",color:count===n?"#7c3aed":"#64748b",cursor:"pointer",fontSize:"13px",fontWeight:count===n?"600":"400"}}>{n}</button>
                ))}
              </div>
              <button onClick={generate} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg, #7c3aed, #9f67ff)",color:"white",border:"none",borderRadius:"12px",fontSize:"16px",fontWeight:"700",cursor:"pointer",marginBottom:"20px",boxShadow:"0 4px 20px rgba(124,58,237,0.35)"}}>Generate {count} UUID{count>1?"s":""}</button>
              {uuids.length>0&&(<>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                  <span style={{fontSize:"13px",color:"#64748b"}}>{uuids.length} UUID{uuids.length>1?"s":""} generated</span>
                  <button onClick={copyAll} style={{background:copiedAll?"#22c55e":"rgba(124,58,237,0.1)",border:copiedAll?"none":"1px solid rgba(124,58,237,0.3)",color:copiedAll?"white":"#7c3aed",borderRadius:"8px",padding:"6px 14px",cursor:"pointer",fontSize:"13px",fontWeight:"600"}}>{copiedAll?"All Copied!":"Copy All"}</button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                  {uuids.map((uuid,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:"10px",padding:"12px 16px",gap:"12px"}}>
                      <span style={{fontFamily:"monospace",fontSize:"14px",color:"#1e293b",flex:1}}>{uuid}</span>
                      <button onClick={()=>copy(uuid)} style={{background:copied===uuid?"#22c55e":"rgba(124,58,237,0.1)",border:copied===uuid?"none":"1px solid rgba(124,58,237,0.3)",color:copied===uuid?"white":"#7c3aed",borderRadius:"6px",padding:"4px 12px",cursor:"pointer",fontSize:"12px",fontWeight:"600",whiteSpace:"nowrap"}}>{copied===uuid?"✓":"Copy"}</button>
                    </div>
                  ))}
                </div>
              </>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
              <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"24px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
                <h2 style={{fontSize:"16px",fontWeight:"700",color:"#1e293b",marginBottom:"12px"}}>About UUID Generator</h2>
                <p style={{fontSize:"13px",color:"#64748b",lineHeight:"1.8",margin:"0 0 10px"}}>Our UUID Generator creates UUID v4 unique identifiers instantly. Generate up to 20 UUIDs at once and copy them individually or all at once.</p>
                <p style={{fontSize:"13px",color:"#64748b",lineHeight:"1.8",margin:0}}>UUIDs are essential in software development for uniquely identifying database records, API resources, and distributed system components.</p>
              </div>
              <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"24px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
                <h2 style={{fontSize:"16px",fontWeight:"700",color:"#1e293b",marginBottom:"12px"}}>Why Use Our UUID Generator?</h2>
                <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                  {["Generate up to 20 UUIDs at once","Copy all UUIDs with one click","UUID v4 standard — industry compatible","Works entirely in your browser — 100% private","No account required — completely free"].map((b,i)=>(
                    <div key={i} style={{display:"flex",gap:"8px",alignItems:"center"}}><div style={{width:"18px",height:"18px",borderRadius:"50%",background:"rgba(34,197,94,0.1)",border:"1.5px solid rgba(34,197,94,0.4)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#16a34a",fontSize:"10px",fontWeight:"700"}}>✓</span></div><span style={{fontSize:"13px",color:"#64748b"}}>{b}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{background:"rgba(34,197,94,0.04)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:"16px",padding:"20px",display:"flex",gap:"14px",alignItems:"flex-start"}}>
              <div style={{fontSize:"28px",flexShrink:0}}>🛡️</div>
              <div><h3 style={{fontSize:"15px",fontWeight:"700",color:"#1e293b",marginBottom:"6px"}}>Privacy & Security</h3><p style={{fontSize:"13px",color:"#64748b",lineHeight:"1.7",margin:0}}>All UUID generation happens locally in your browser using JavaScript. No UUIDs are sent to any server or stored anywhere.</p></div>
            </div>
            <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"24px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
              <h2 style={{fontSize:"16px",fontWeight:"700",color:"#1e293b",marginBottom:"16px"}}>Frequently Asked Questions (FAQ)</h2>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0"}}>
                {faqs.map((faq,i)=>(
                  <div key={i} style={{borderBottom:"1px solid #f1f5f9",paddingRight:i%2===0?"16px":"0",paddingLeft:i%2===1?"16px":"0",borderRight:i%2===0?"1px solid #f1f5f9":"none"}}>
                    <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",padding:"14px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                      <span style={{fontSize:"13px",fontWeight:"600",color:"#1e293b",paddingRight:"8px"}}>{faq.q}</span><span style={{color:"#7c3aed",fontSize:"16px",fontWeight:"700",flexShrink:0}}>{openFaq===i?"−":"+"}</span>
                    </button>
                    {openFaq===i&&<div style={{padding:"0 0 14px",fontSize:"13px",color:"#64748b",lineHeight:"1.7"}}>{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"linear-gradient(135deg, rgba(124,58,237,0.08), rgba(159,103,255,0.08))",border:"1px solid rgba(124,58,237,0.2)",borderRadius:"16px",padding:"24px",display:"flex",gap:"20px",alignItems:"center"}}>
              <div style={{fontSize:"44px",flexShrink:0}}>🆔</div>
              <div style={{flex:1}}>
                <h3 style={{fontSize:"16px",fontWeight:"700",color:"#1e293b",marginBottom:"4px"}}>Generate Unique Identifiers Instantly</h3>
                <p style={{fontSize:"13px",color:"#64748b",margin:"0 0 12px"}}>Use our free UUID Generator to create unique IDs for your database or API projects.</p>
                <a href="/tools/hash-generator" style={{display:"inline-block",background:"linear-gradient(135deg, #7c3aed, #9f67ff)",color:"white",textDecoration:"none",padding:"10px 20px",borderRadius:"10px",fontSize:"13px",fontWeight:"600"}}>Try Hash Generator →</a>
              </div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"16px",position:"sticky",top:"90px"}}>
            <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"20px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
              <h3 style={{fontSize:"14px",fontWeight:"700",color:"#1e293b",marginBottom:"12px"}}>🔧 Related Tools</h3>
              {[{name:"Hash Generator",href:"/tools/hash-generator"},{name:"JWT Decoder",href:"/tools/jwt-decoder"},{name:"Base64 Encoder/Decoder",href:"/tools/base64"},{name:"JSON Formatter",href:"/tools/json-formatter"},{name:"Password Generator",href:"/tools/password-generator"}].map((tool,i,arr)=>(
                <a key={i} href={tool.href} style={{fontSize:"13px",color:"#64748b",textDecoration:"none",padding:"10px 12px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:i<arr.length-1?"1px solid #f8fafc":"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.06)";e.currentTarget.style.color="#7c3aed";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#64748b";}}><span>→ {tool.name}</span><span style={{opacity:0.4}}>›</span></a>
              ))}
              <a href="/tools" style={{display:"block",textAlign:"center",marginTop:"10px",padding:"8px",background:"#f1f5f9",color:"#7c3aed",textDecoration:"none",borderRadius:"8px",fontSize:"12px",fontWeight:"600"}}>View All Tools →</a>
            </div>
            <div style={{background:"#ffffff",border:"1px solid rgba(124,58,237,0.1)",borderRadius:"16px",padding:"20px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
              <h3 style={{fontSize:"14px",fontWeight:"700",color:"#1e293b",marginBottom:"12px"}}>📝 Related Articles</h3>
              {["What is 2FA and Why You Need It","Database Primary Keys Best Practices","API Design for Developers"].map((article,i,arr)=>(
                <a key={i} href="/blog" style={{fontSize:"13px",color:"#64748b",textDecoration:"none",padding:"10px 12px",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:i<arr.length-1?"1px solid #f8fafc":"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.06)";e.currentTarget.style.color="#7c3aed";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#64748b";}}><span>→ {article}</span><span style={{opacity:0.4}}>›</span></a>
              ))}
              <a href="/blog" style={{display:"block",textAlign:"center",marginTop:"10px",padding:"8px",background:"#f1f5f9",color:"#7c3aed",textDecoration:"none",borderRadius:"8px",fontSize:"12px",fontWeight:"600"}}>View All Articles →</a>
            </div>
            <div style={{background:"rgba(124,58,237,0.06)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:"16px",padding:"18px"}}>
              <h3 style={{fontSize:"13px",fontWeight:"700",color:"#7c3aed",marginBottom:"10px"}}>⚡ Quick Info</h3>
              {[{label:"Type",value:"Free Tool"},{label:"Processing",value:"Browser-based"},{label:"Account Required",value:"No"},{label:"Data Stored",value:"None"},{label:"Version",value:"UUID v4"}].map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<4?"1px solid rgba(124,58,237,0.08)":"none"}}>
                  <span style={{fontSize:"12px",color:"#94a3b8"}}>{item.label}</span><span style={{fontSize:"12px",fontWeight:"600",color:"#1e293b"}}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  );
}
