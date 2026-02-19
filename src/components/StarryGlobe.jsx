import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import AnalyticsDashboard from './Dashboard';
import ProfileModal from './ProfileModal';
import { searchTalent } from './api/supabaseData';

const Portal = ({ children }) => ReactDOM.createPortal(children, document.body);

const StarryGlobe = () => {
  const mountRef = useRef(null);
  const globeRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const countryMeshesRef = useRef([]);
  const countryBordersRef = useRef(new Map());
  const pinMeshesRef = useRef([]);

  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [criteria, setCriteria] = useState({ role: '', experience: '', specialty: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [panelIn, setPanelIn] = useState(false);

  const continents = [
    { name:'North America', color:'#ff00ff', countries:[
      { name:'United States', cities:['Los Angeles','New York','Atlanta','Chicago'] },
      { name:'Canada', cities:['Toronto','Vancouver','Montreal'] },
      { name:'Mexico', cities:['Mexico City','Guadalajara'] }
    ]},
    { name:'South America', color:'#ff006e', countries:[
      { name:'Brazil', cities:['São Paulo','Rio de Janeiro'] },
      { name:'Argentina', cities:['Buenos Aires'] },
      { name:'Colombia', cities:['Bogotá','Medellín'] },
      { name:'Chile', cities:['Santiago'] }
    ]},
    { name:'Europe', color:'#a855f7', countries:[
      { name:'United Kingdom', cities:['London','Manchester'] },
      { name:'France', cities:['Paris','Lyon'] },
      { name:'Germany', cities:['Berlin','Munich'] },
      { name:'Spain', cities:['Madrid','Barcelona'] },
      { name:'Italy', cities:['Rome','Milan'] }
    ]},
    { name:'Africa', color:'#e879f9', countries:[
      { name:'South Africa', cities:['Cape Town','Johannesburg'] },
      { name:'Nigeria', cities:['Lagos','Abuja'] },
      { name:'Kenya', cities:['Nairobi'] },
      { name:'Egypt', cities:['Cairo'] }
    ]},
    { name:'Asia', color:'#7c3aed', countries:[
      { name:'India', cities:['Mumbai','Delhi','Bangalore'] },
      { name:'China', cities:['Beijing','Shanghai'] },
      { name:'Japan', cities:['Tokyo','Osaka'] },
      { name:'South Korea', cities:['Seoul'] },
      { name:'Thailand', cities:['Bangkok'] }
    ]},
    { name:'Oceania', color:'#f0abfc', countries:[
      { name:'Australia', cities:['Sydney','Melbourne','Brisbane'] },
      { name:'New Zealand', cities:['Auckland','Wellington'] },
      { name:'Fiji', cities:['Suva'] }
    ]},
  ];
  const roles = ['Actor/Actress','Director','Producer','Screenwriter','Cinematographer','Editor','Production Designer','Casting Director','Talent Manager','Agent'];

  const openSearch = (cont, country) => {
    setSelectedContinent(cont); setSelectedCountry(country);
    setSelectedCity(''); setShowResults(false); setResults([]);
    setProfile(null); setCriteria({ role:'', experience:'', specialty:'' });
    setShowSearch(true);
    requestAnimationFrame(() => setPanelIn(true));
  };
  const closeAll = () => {
    setPanelIn(false);
    setTimeout(() => {
      setShowSearch(false); setShowResults(false);
      setSelectedContinent(null); setSelectedCountry(null);
      setSelectedCity(''); setCriteria({ role:'', experience:'', specialty:'' });
      setResults([]); setProfile(null);
    }, 300);
  };

  // ── THREE.JS ──
  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current, w = el.clientWidth, h = el.clientHeight;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0a0014); scene.fog = new THREE.FogExp2(0x0a0014, 0.15);
    const cam = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000); cam.position.z = 3;
    const ren = new THREE.WebGLRenderer({ antialias: true }); ren.setSize(w, h); ren.setPixelRatio(window.devicePixelRatio); el.appendChild(ren.domElement);
    const ctrl = new OrbitControls(cam, ren.domElement); ctrl.enableDamping=true; ctrl.dampingFactor=0.05; ctrl.rotateSpeed=0.5; ctrl.minDistance=2; ctrl.maxDistance=5; ctrl.enablePan=false; ctrl.target.set(0,0,0); ctrl.update();

    const sGeo = new THREE.BufferGeometry(), sMat = new THREE.PointsMaterial({size:0.02,vertexColors:true});
    const sv=[], sc=[]; const sC=[new THREE.Color(0xff00ff),new THREE.Color(0xff006e),new THREE.Color(0xa855f7),new THREE.Color(0xf0abfc)];
    for(let i=0;i<3000;i++){sv.push((Math.random()-.5)*50,(Math.random()-.5)*50,(Math.random()-.5)*50);const c=sC[Math.floor(Math.random()*sC.length)];sc.push(c.r,c.g,c.b);}
    sGeo.setAttribute('position',new THREE.Float32BufferAttribute(sv,3)); sGeo.setAttribute('color',new THREE.Float32BufferAttribute(sc,3));
    const stars=new THREE.Points(sGeo,sMat); scene.add(stars);

    const gGeo=new THREE.SphereGeometry(1,64,64), gMat=new THREE.MeshPhongMaterial({color:0x1a0033,emissive:0x0a0014,emissiveIntensity:.5,shininess:30,transparent:true,opacity:.95});
    const globe=new THREE.Mesh(gGeo,gMat); globeRef.current=globe; scene.add(globe);
    const wG=new THREE.SphereGeometry(1.01,32,32), wM=new THREE.MeshBasicMaterial({color:0xff00ff,wireframe:true,transparent:true,opacity:.3});
    scene.add(new THREE.Mesh(wG,wM));
    scene.add(new THREE.AmbientLight(0xff00ff,.5));
    const l1=new THREE.PointLight(0xff00ff,1,100);l1.position.set(5,5,5);scene.add(l1);
    const l2=new THREE.PointLight(0xa855f7,.8,100);l2.position.set(-5,-5,-5);scene.add(l2);

    const pins=[{n:'United States',la:39.8,lo:-98.5,c:'North America'},{n:'Canada',la:56.1,lo:-106.3,c:'North America'},{n:'Mexico',la:23.6,lo:-102.5,c:'North America'},
      {n:'Brazil',la:-14.2,lo:-51.9,c:'South America'},{n:'Argentina',la:-38.4,lo:-63.6,c:'South America'},{n:'Colombia',la:4.5,lo:-74.3,c:'South America'},{n:'Chile',la:-35.7,lo:-71.5,c:'South America'},
      {n:'United Kingdom',la:55.4,lo:-3.4,c:'Europe'},{n:'France',la:46.2,lo:2.2,c:'Europe'},{n:'Germany',la:51.2,lo:10.4,c:'Europe'},{n:'Spain',la:40.5,lo:-3.7,c:'Europe'},{n:'Italy',la:41.9,lo:12.6,c:'Europe'},
      {n:'South Africa',la:-30.6,lo:22.9,c:'Africa'},{n:'Nigeria',la:9.1,lo:8.7,c:'Africa'},{n:'Kenya',la:-.02,lo:37.9,c:'Africa'},{n:'Egypt',la:26.8,lo:30.8,c:'Africa'},
      {n:'India',la:20.6,lo:79,c:'Asia'},{n:'China',la:35.9,lo:104.2,c:'Asia'},{n:'Japan',la:36.2,lo:138.3,c:'Asia'},{n:'South Korea',la:35.9,lo:127.8,c:'Asia'},{n:'Thailand',la:15.9,lo:100.9,c:'Asia'},
      {n:'Australia',la:-25.3,lo:133.8,c:'Oceania'},{n:'New Zealand',la:-40.9,lo:174.9,c:'Oceania'},{n:'Fiji',la:-17.7,lo:178,c:'Oceania'}];
    const pArr=[],pGrp=new THREE.Group();globe.add(pGrp);
    pins.forEach(p=>{
      const phi=(90-p.la)*(Math.PI/180),th=(p.lo+180)*(Math.PI/180);
      const x=-1.02*Math.sin(phi)*Math.cos(th),y=1.02*Math.cos(phi),z=1.02*Math.sin(phi)*Math.sin(th);
      const co=continents.find(c=>c.name===p.c),pc=co?co.color:'#ff00ff';
      const st=new THREE.Mesh(new THREE.CylinderGeometry(.003,.003,.06,6),new THREE.MeshBasicMaterial({color:pc}));
      const hd=new THREE.Mesh(new THREE.SphereGeometry(.018,12,12),new THREE.MeshBasicMaterial({color:pc,transparent:true,opacity:.95}));hd.position.y=.045;
      const gl=new THREE.Mesh(new THREE.RingGeometry(.02,.035,16),new THREE.MeshBasicMaterial({color:pc,transparent:true,opacity:.4,side:THREE.DoubleSide}));gl.position.y=.045;
      const pm=new THREE.Group();pm.add(st);pm.add(hd);pm.add(gl);pm.position.set(x,y,z);pm.lookAt(0,0,0);pm.rotateX(Math.PI/2);
      const ud={isPin:true,countryName:p.n,continentName:p.c};pm.userData=ud;pm.children.forEach(c=>{c.userData=ud;});
      pGrp.add(pm);pArr.push(hd,st);
    });
    pinMeshesRef.current=pArr;

    const cGrp=new THREE.Group();scene.add(cGrp);
    fetch('/geojson/countries.json').then(r=>r.json()).then(d=>{
      d.features.forEach((f,i)=>{const nm=f.properties.ADMIN||f.properties.NAME||f.properties.name||f.properties.NAME_LONG||f.properties.SOVEREIGNT||`C${i}`;
        if(f.geometry.type==='Polygon')drawC(f.geometry.coordinates,nm,cGrp);
        else if(f.geometry.type==='MultiPolygon')f.geometry.coordinates.forEach(p=>drawC(p,nm,cGrp));});
    }).catch(()=>{fetch('/geojson/ne_110m_land.json').then(r=>r.json()).then(d=>{d.features.forEach((f,i)=>{
      if(f.geometry.type==='Polygon')drawC(f.geometry.coordinates,`L${i}`,cGrp);
      else if(f.geometry.type==='MultiPolygon')f.geometry.coordinates.forEach(p=>drawC(p,`L${i}`,cGrp));});}).catch(()=>{});});

    function drawC(co,nm,gr){co.forEach(ring=>{const pts=[];ring.forEach(([lo,la])=>{const p=(90-la)*(Math.PI/180),t=(lo+180)*(Math.PI/180);
      pts.push(new THREE.Vector3(-1.015*Math.sin(p)*Math.cos(t),1.015*Math.cos(p),1.015*Math.sin(p)*Math.sin(t)));});
      if(pts.length>3){const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x00ffff,transparent:true,opacity:.6}));
        ln.userData.countryName=nm;gr.add(ln);if(!countryBordersRef.current.has(nm))countryBordersRef.current.set(nm,[]);countryBordersRef.current.get(nm).push(ln);
        try{const cn=new THREE.Vector3();pts.forEach(p=>cn.add(p));cn.divideScalar(pts.length).normalize().multiplyScalar(1.015);
          const v=[cn.x,cn.y,cn.z];pts.forEach(p=>v.push(p.x,p.y,p.z));const idx=[];for(let i=1;i<pts.length;i++)idx.push(0,i,i+1);idx.push(0,pts.length,1);
          const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();
          const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xff00ff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));
          m.userData={isCountry:true,countryName:nm};gr.add(m);countryMeshesRef.current.push(m);}catch(e){}}});}

    const onMv=(e)=>{const r=ren.domElement.getBoundingClientRect();mouseRef.current.x=((e.clientX-r.left)/r.width)*2-1;mouseRef.current.y=-((e.clientY-r.top)/r.height)*2+1;};
    const onClick=(e)=>{const r=ren.domElement.getBoundingClientRect();mouseRef.current.x=((e.clientX-r.left)/r.width)*2-1;mouseRef.current.y=-((e.clientY-r.top)/r.height)*2+1;
      raycasterRef.current.setFromCamera(mouseRef.current,cam);
      const pH=raycasterRef.current.intersectObjects(pinMeshesRef.current,true);
      if(pH.length>0){const{countryName:cn,continentName:ct}=pH[0].object.userData;if(cn){const fc=continents.find(c=>c.name===ct),co=fc?.countries.find(c=>c.name===cn);
        if(fc&&co)window.dispatchEvent(new CustomEvent('gc',{detail:{continent:fc,country:co}}));return;}}
      const cH=raycasterRef.current.intersectObjects(countryMeshesRef.current);
      if(cH.length>0&&cH[0].object.userData.isCountry){const cn=cH[0].object.userData.countryName;let fc=null,co=null;
        for(const ct of continents){const c=ct.countries.find(c=>cn.toLowerCase().includes(c.name.toLowerCase())||c.name.toLowerCase().includes(cn.toLowerCase()));
          if(c){fc=ct;co=c;break;}}if(fc&&co)window.dispatchEvent(new CustomEvent('gc',{detail:{continent:fc,country:co}}));}};
    ren.domElement.addEventListener('click',onClick);window.addEventListener('mousemove',onMv);

    function hov(){raycasterRef.current.setFromCamera(mouseRef.current,cam);
      const pH=raycasterRef.current.intersectObjects(pinMeshesRef.current,true);
      pinMeshesRef.current.forEach(m=>{if(m.geometry.type==='SphereGeometry')m.scale.set(1,1,1);});
      countryBordersRef.current.forEach(b=>b.forEach(l=>{l.material.color.setHex(0x00ffff);l.material.opacity=.6;}));
      if(pH.length>0&&pH[0].object.userData.isPin){const h=pH[0].object;if(h.geometry.type==='SphereGeometry')h.scale.set(1.5,1.5,1.5);
        setHoveredCountry(h.userData.countryName);ren.domElement.style.cursor='pointer';return;}
      const cH=raycasterRef.current.intersectObjects(countryMeshesRef.current);
      if(cH.length>0&&cH[0].object.userData.isCountry){const cn=cH[0].object.userData.countryName;
        const b=countryBordersRef.current.get(cn);if(b)b.forEach(l=>{l.material.color.setHex(0x00ff00);l.material.opacity=1;});
        setHoveredCountry(cn);ren.domElement.style.cursor='pointer';}
      else{setHoveredCountry(null);ren.domElement.style.cursor='grab';}}

    let aId;const anim=()=>{aId=requestAnimationFrame(anim);if(globe)globe.rotation.y+=.001;stars.rotation.y+=.0002;hov();ctrl.update();ren.render(scene,cam);};anim();
    const onRs=()=>{const w2=el.clientWidth,h2=el.clientHeight;cam.aspect=w2/h2;cam.updateProjectionMatrix();ren.setSize(w2,h2);};window.addEventListener('resize',onRs);
    return ()=>{window.removeEventListener('resize',onRs);window.removeEventListener('mousemove',onMv);ren.domElement.removeEventListener('click',onClick);
      cancelAnimationFrame(aId);el.removeChild(ren.domElement);sGeo.dispose();sMat.dispose();gGeo.dispose();gMat.dispose();wG.dispose();wM.dispose();ren.dispose();};
  },[]);

  useEffect(()=>{const h=(e)=>openSearch(e.detail.continent,e.detail.country);window.addEventListener('gc',h);return()=>window.removeEventListener('gc',h);},[]);

  const doSearch = async () => {
    setLoading(true);
    try { const r = await searchTalent({ country:selectedCountry?.name, city:selectedCity||undefined, role:criteria.role||undefined, experience:criteria.experience||undefined, specialty:criteria.specialty||undefined }); setResults(r); } catch(e){ setResults([]); }
    setLoading(false); setShowSearch(false); setShowResults(true);
  };
  const refine = () => { setShowResults(false); setProfile(null); setShowSearch(true); };

  const panelOpen = showSearch || showResults;
  const ac = selectedContinent?.color || '#ff00ff';

  //selecting styles
  const selStyle = { width:'100%', padding:'12px', background:'#0a0018', border:`2px solid ${ac}44`, borderRadius:'6px', color:'white', outline:'none', fontSize:'14px' };
  const lblStyle = { display:'block', marginBottom:'8px', fontSize:'11px', letterSpacing:'3px', fontWeight:700, color:ac };

  return (
    <>
      {/* globe layout */}
      <div style={{ position:'relative', width:'100vw', height:'100vh', overflow:'hidden', background:'#0a0014' }}>
        <div style={{ position:'relative', zIndex:20, paddingTop:'24px', paddingBottom:'8px' }}>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <svg width="620" height="90" viewBox="0 0 620 90" style={{maxWidth:'90vw',filter:'drop-shadow(0 0 30px rgba(255,0,255,0.8))'}}>
              <defs><path id="tc" d="M 40,75 Q 310,15 580,75" fill="none"/>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ff00ff" stopOpacity=".9"/><stop offset="50%" stopColor="#a855f7" stopOpacity=".95"/><stop offset="100%" stopColor="#ff006e" stopOpacity=".9"/></linearGradient>
                <filter id="gl"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <path d="M 40,75 Q 310,15 580,75 L 580,88 Q 310,28 40,88 Z" fill="url(#bg)" opacity=".85" filter="url(#gl)"/>
              <text fill="white" fontSize="34" fontWeight="900" letterSpacing="10" fontFamily="Orbitron,Rajdhani,Arial Black,sans-serif" filter="url(#gl)">
                <textPath href="#tc" startOffset="50%" textAnchor="middle">GLOBAL STUDIOS</textPath></text>
            </svg>
          </div>
          <p style={{ textAlign:'center', marginTop:'4px', fontSize:'14px', letterSpacing:'3px', color:'#c084fc' }}>GLOBAL TALENT NETWORK</p>
          <div style={{ textAlign:'center', marginTop:'8px' }}>
            <span style={{ display:'inline-block', background:'rgba(26,0,51,0.9)', border:'1px solid rgba(192,132,252,0.4)', padding:'8px 24px', borderRadius:'6px', fontSize:'12px', letterSpacing:'2px', color:'#c084fc' }}>
              🖱️ DRAG TO ROTATE • 🔍 SCROLL TO ZOOM • 📍 CLICK A COUNTRY TO FIND TALENT
            </span>
          </div>
          <div style={{ position:'absolute', top:'24px', right:'24px', zIndex:30 }}>
            <button onClick={()=>setShowDashboard(true)} style={{ padding:'10px 20px', borderRadius:'6px', fontWeight:700, fontSize:'13px', letterSpacing:'3px',
              background:'transparent', color:'#a855f7', border:'2px solid #a855f7', boxShadow:'0 0 20px rgba(168,85,247,0.3)', cursor:'pointer' }}>📊 ANALYTICS</button>
          </div>
        </div>
        <div ref={mountRef} style={{ position:'absolute', inset:0, zIndex:0, width:'100vw', height:'100vh' }}/>
        {hoveredCountry && (
          <div style={{ position:'fixed', zIndex:200, left:'50%', bottom:'40px', transform:'translateX(-50%)', pointerEvents:'none',
            padding:'6px 14px', borderRadius:'6px', fontSize:'13px', fontWeight:700, letterSpacing:'2px',
            background:'rgba(26,0,51,0.95)', border:'1px solid #ff00ff', color:'#f0abfc', boxShadow:'0 0 20px rgba(255,0,255,0.4)' }}>
            📍 {hoveredCountry}
          </div>
        )}
      </div>

      {/* set up for side panel */}
      {panelOpen && (
        <Portal>
          <div style={{ position:'fixed', inset:0, zIndex:9999, pointerEvents:'none' }}>
            <div onClick={closeAll} style={{ position:'absolute', inset:0, pointerEvents:'auto', background:'rgba(10,0,20,0.3)', opacity:panelIn?1:0, transition:'opacity .3s' }}/>
            <div style={{
              position:'absolute', top:0, right:0, height:'100%', width:'420px', maxWidth:'92vw',
              pointerEvents:'auto', overflowY:'auto',
              transform:panelIn?'translateX(0)':'translateX(100%)', transition:'transform .3s cubic-bezier(.4,0,.2,1)',
              background:'rgba(10,0,20,0.96)', borderLeft:`2px solid ${ac}`,
              boxShadow:`-10px 0 60px ${ac}44`, backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
            }}>
              <button onClick={closeAll} style={{ position:'absolute', top:20, right:20, zIndex:10, width:36, height:36,
                display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${ac}`, borderRadius:6,
                background:'transparent', color:ac, fontSize:18, cursor:'pointer' }}>✕</button>

              {/* search */}
              {showSearch && selectedCountry && (
                <div style={{ padding:'60px 28px 28px' }}>
                  <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:3, color:ac, textShadow:`0 0 20px ${ac}`, margin:'0 0 4px' }}>FIND TALENT</h2>
                  <p style={{ color:'#d8b4fe', fontSize:13, letterSpacing:3, margin:'0 0 24px' }}>{selectedCountry.name} · {selectedContinent?.name}</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:24 }}>
                    <div><label style={lblStyle}>📍 CITY / REGION</label><select style={selStyle} value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}><option value="">All cities...</option>{selectedCountry.cities?.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                    <div><label style={lblStyle}>ROLE</label><select style={selStyle} value={criteria.role} onChange={e=>setCriteria({...criteria,role:e.target.value})}><option value="">Select role...</option>{roles.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
                    <div><label style={lblStyle}>EXPERIENCE</label><select style={selStyle} value={criteria.experience} onChange={e=>setCriteria({...criteria,experience:e.target.value})}><option value="">Select experience...</option><option value="emerging">Emerging (0-2 years)</option><option value="professional">Professional (3-7 years)</option><option value="veteran">Veteran (8-15 years)</option><option value="legendary">Legendary (15+ years)</option></select></div>
                    <div><label style={lblStyle}>SPECIALTY / GENRE</label><input type="text" placeholder="e.g., Action, Drama, Sci-Fi..." value={criteria.specialty} onChange={e=>setCriteria({...criteria,specialty:e.target.value})} style={{...selStyle,boxSizing:'border-box'}}/></div>
                  </div>
                  <button onClick={doSearch} style={{ width:'100%', padding:16, border:'none', borderRadius:6, color:'white', fontSize:18, fontWeight:700, letterSpacing:3, cursor:'pointer', background:`linear-gradient(135deg,${ac},${ac}dd)` }}>🎬 START SEARCH</button>
                </div>
              )}

              {/* results */}
              {showResults && selectedCountry && (
                <div style={{ padding:'60px 28px 28px' }}>
                  <h2 style={{ fontSize:24, fontWeight:900, letterSpacing:3, color:ac, textShadow:`0 0 16px ${ac}`, margin:'0 0 4px' }}>RESULTS</h2>
                  <p style={{ color:'#d8b4fe', fontSize:13, letterSpacing:3, margin:'0 0 20px' }}>{selectedCountry.name}{selectedCity&&` · ${selectedCity}`} · {selectedContinent?.name}</p>
                  {loading ? (
                    <div style={{ textAlign:'center', padding:'60px 0' }}><div style={{ fontSize:24, color:ac }}>⏳ Searching...</div></div>
                  ) : results.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'60px 0' }}>
                      <div style={{ fontSize:16, color:'#d8b4fe88', marginBottom:8 }}>No talent found.</div>
                      <div style={{ fontSize:13, color:'#d8b4fe55' }}>Try broadening your filters.</div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:24 }}>
                      {results.map((p,i) => (
                        <div key={p.id||i} style={{ display:'flex', alignItems:'center', gap:12, padding:14, borderRadius:10, background:`${ac}08`, border:`1px solid ${ac}28` }}>
                          <div style={{ width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, flexShrink:0, background:`linear-gradient(135deg,${ac}77,${ac}22)`, color:'white' }}>{p.name[0]}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontWeight:700, fontSize:14, color:'white' }}>{p.name}</div>
                            <div style={{ fontSize:11, color:'#d8b4fe99', letterSpacing:2 }}>{p.role} · {p.city}</div>
                          </div>
                          <button onClick={()=>setProfile(p)} style={{ padding:'6px 14px', border:`2px solid ${ac}`, background:'transparent', color:ac, fontSize:11, fontWeight:700, letterSpacing:2, borderRadius:6, cursor:'pointer' }}>VIEW</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={refine} style={{ width:'100%', padding:14, border:`2px solid ${ac}`, background:'transparent', color:ac, fontWeight:700, letterSpacing:3, borderRadius:6, cursor:'pointer', fontSize:14 }}>← REFINE SEARCH</button>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}

      {/*  PROFILE */}
      {profile && (
        <Portal>
          <ProfileModal profile={profile} color={ac} onClose={()=>setProfile(null)} />
        </Portal>
      )}

      {/*  ANALYTICS  */}
      {showDashboard && (
        <Portal>
          <AnalyticsDashboard isOpen={showDashboard} onClose={()=>setShowDashboard(false)} />
        </Portal>
      )}
    </>
  );
};

export default StarryGlobe;