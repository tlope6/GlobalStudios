import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import AnalyticsDashboard from './Dashboard';
import ProfileModal from './ProfileModal';
import { searchTalent } from './api/supabaseData';

//using react portal to be able to warp the whole layout better and work better
const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const StarryGlobe = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const globeRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const countryMeshesRef = useRef([]);
  const countryBordersRef = useRef(new Map());
  const pinMeshesRef = useRef([]);

  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showResultsPanel, setShowResultsPanel] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({ role: '', experience: '', specialty: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [panelAnimated, setPanelAnimated] = useState(false);

  const continents = [
    { name: 'North America', color: '#ff00ff', countries: [
      { name: 'United States', cities: ['Los Angeles', 'New York', 'Atlanta', 'Chicago'] },
      { name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal'] },
      { name: 'Mexico', cities: ['Mexico City', 'Guadalajara'] }
    ]},
    { name: 'South America', color: '#ff006e', countries: [
      { name: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro'] },
      { name: 'Argentina', cities: ['Buenos Aires'] },
      { name: 'Colombia', cities: ['Bogotá', 'Medellín'] },
      { name: 'Chile', cities: ['Santiago'] }
    ]},
    { name: 'Europe', color: '#a855f7', countries: [
      { name: 'United Kingdom', cities: ['London', 'Manchester'] },
      { name: 'France', cities: ['Paris', 'Lyon'] },
      { name: 'Germany', cities: ['Berlin', 'Munich'] },
      { name: 'Spain', cities: ['Madrid', 'Barcelona'] },
      { name: 'Italy', cities: ['Rome', 'Milan'] }
    ]},
    { name: 'Africa', color: '#e879f9', countries: [
      { name: 'South Africa', cities: ['Cape Town', 'Johannesburg'] },
      { name: 'Nigeria', cities: ['Lagos', 'Abuja'] },
      { name: 'Kenya', cities: ['Nairobi'] },
      { name: 'Egypt', cities: ['Cairo'] }
    ]},
    { name: 'Asia', color: '#7c3aed', countries: [
      { name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore'] },
      { name: 'China', cities: ['Beijing', 'Shanghai'] },
      { name: 'Japan', cities: ['Tokyo', 'Osaka'] },
      { name: 'South Korea', cities: ['Seoul'] },
      { name: 'Thailand', cities: ['Bangkok'] }
    ]},
    { name: 'Oceania', color: '#f0abfc', countries: [
      { name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane'] },
      { name: 'New Zealand', cities: ['Auckland', 'Wellington'] },
      { name: 'Fiji', cities: ['Suva'] }
    ]},
  ];

  const talentRoles = [
    'Actor/Actress', 'Director', 'Producer', 'Screenwriter',
    'Cinematographer', 'Editor', 'Production Designer',
    'Casting Director', 'Talent Manager', 'Agent'
  ];

  // ── PANEL OPEN / CLOSE ──
  const openSearchPanel = (continent, country) => {
    setSelectedContinent(continent);
    setSelectedCountry(country);
    setSelectedCity('');
    setShowResultsPanel(false);
    setSearchResults([]);
    setSelectedProfile(null);
    setSearchCriteria({ role: '', experience: '', specialty: '' });
    setShowSearchPanel(true);
    requestAnimationFrame(() => setPanelAnimated(true));
  };

  const closeAllPanels = () => {
    setPanelAnimated(false);
    setTimeout(() => {
      setShowSearchPanel(false);
      setShowResultsPanel(false);
      setSelectedContinent(null);
      setSelectedCountry(null);
      setSelectedCity('');
      setSearchCriteria({ role: '', experience: '', specialty: '' });
      setSearchResults([]);
      setSelectedProfile(null);
    }, 300);
  };

  // ── THREE.JS ──
  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    const w = currentMount.clientWidth, h = currentMount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0014);
    scene.fog = new THREE.FogExp2(0x0a0014, 0.15);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.05; controls.rotateSpeed = 0.5;
    controls.minDistance = 2; controls.maxDistance = 5; controls.enablePan = false;
    controls.target.set(0, 0, 0); controls.update();

    // Stars
    const starsGeo = new THREE.BufferGeometry();
    const starsMat = new THREE.PointsMaterial({ size: 0.02, vertexColors: true });
    const sv = [], sc2 = [];
    const sColors = [new THREE.Color(0xff00ff), new THREE.Color(0xff006e), new THREE.Color(0xa855f7), new THREE.Color(0xf0abfc)];
    for (let i = 0; i < 3000; i++) {
      sv.push((Math.random()-0.5)*50, (Math.random()-0.5)*50, (Math.random()-0.5)*50);
      const c = sColors[Math.floor(Math.random()*sColors.length)]; sc2.push(c.r, c.g, c.b);
    }
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(sv, 3));
    starsGeo.setAttribute('color', new THREE.Float32BufferAttribute(sc2, 3));
    const stars = new THREE.Points(starsGeo, starsMat); scene.add(stars);

    const globeGeo = new THREE.SphereGeometry(1, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({ color: 0x1a0033, emissive: 0x0a0014, emissiveIntensity: 0.5, shininess: 30, transparent: true, opacity: 0.95 });
    const globe = new THREE.Mesh(globeGeo, globeMat); globeRef.current = globe; scene.add(globe);

    const wfGeo = new THREE.SphereGeometry(1.01, 32, 32);
    const wfMat = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.3 });
    scene.add(new THREE.Mesh(wfGeo, wfMat));

    scene.add(new THREE.AmbientLight(0xff00ff, 0.5));
    const pl1 = new THREE.PointLight(0xff00ff, 1, 100); pl1.position.set(5,5,5); scene.add(pl1);
    const pl2 = new THREE.PointLight(0xa855f7, 0.8, 100); pl2.position.set(-5,-5,-5); scene.add(pl2);

    // Pins
    const countryPins = [
      { name:'United States',lat:39.8,lon:-98.5,continent:'North America' },{ name:'Canada',lat:56.1,lon:-106.3,continent:'North America' },
      { name:'Mexico',lat:23.6,lon:-102.5,continent:'North America' },{ name:'Brazil',lat:-14.2,lon:-51.9,continent:'South America' },
      { name:'Argentina',lat:-38.4,lon:-63.6,continent:'South America' },{ name:'Colombia',lat:4.5,lon:-74.3,continent:'South America' },
      { name:'Chile',lat:-35.7,lon:-71.5,continent:'South America' },{ name:'United Kingdom',lat:55.4,lon:-3.4,continent:'Europe' },
      { name:'France',lat:46.2,lon:2.2,continent:'Europe' },{ name:'Germany',lat:51.2,lon:10.4,continent:'Europe' },
      { name:'Spain',lat:40.5,lon:-3.7,continent:'Europe' },{ name:'Italy',lat:41.9,lon:12.6,continent:'Europe' },
      { name:'South Africa',lat:-30.6,lon:22.9,continent:'Africa' },{ name:'Nigeria',lat:9.1,lon:8.7,continent:'Africa' },
      { name:'Kenya',lat:-0.02,lon:37.9,continent:'Africa' },{ name:'Egypt',lat:26.8,lon:30.8,continent:'Africa' },
      { name:'India',lat:20.6,lon:79.0,continent:'Asia' },{ name:'China',lat:35.9,lon:104.2,continent:'Asia' },
      { name:'Japan',lat:36.2,lon:138.3,continent:'Asia' },{ name:'South Korea',lat:35.9,lon:127.8,continent:'Asia' },
      { name:'Thailand',lat:15.9,lon:100.9,continent:'Asia' },{ name:'Australia',lat:-25.3,lon:133.8,continent:'Oceania' },
      { name:'New Zealand',lat:-40.9,lon:174.9,continent:'Oceania' },{ name:'Fiji',lat:-17.7,lon:178.0,continent:'Oceania' },
    ];
    const pinMeshes = []; const pinGroup = new THREE.Group(); globe.add(pinGroup);
    countryPins.forEach(pin => {
      const phi=(90-pin.lat)*(Math.PI/180), theta=(pin.lon+180)*(Math.PI/180);
      const x=-1.02*Math.sin(phi)*Math.cos(theta), y=1.02*Math.cos(phi), z=1.02*Math.sin(phi)*Math.sin(theta);
      const cont = continents.find(c=>c.name===pin.continent); const pc = cont?cont.color:'#ff00ff';
      const stem=new THREE.Mesh(new THREE.CylinderGeometry(.003,.003,.06,6),new THREE.MeshBasicMaterial({color:pc}));
      const head=new THREE.Mesh(new THREE.SphereGeometry(.018,12,12),new THREE.MeshBasicMaterial({color:pc,transparent:true,opacity:.95}));
      head.position.y=.045;
      const glow=new THREE.Mesh(new THREE.RingGeometry(.02,.035,16),new THREE.MeshBasicMaterial({color:pc,transparent:true,opacity:.4,side:THREE.DoubleSide}));
      glow.position.y=.045;
      const pm=new THREE.Group(); pm.add(stem);pm.add(head);pm.add(glow);
      pm.position.set(x,y,z); pm.lookAt(0,0,0); pm.rotateX(Math.PI/2);
      const ud={isPin:true,countryName:pin.name,continentName:pin.continent};
      pm.userData=ud; pm.children.forEach(c=>{c.userData=ud;});
      pinGroup.add(pm); pinMeshes.push(head,stem);
    });
    pinMeshesRef.current = pinMeshes;

    // GeoJSON
    const cGroup = new THREE.Group(); scene.add(cGroup);
    fetch('/geojson/countries.json').then(r=>r.json()).then(data=>{
      data.features.forEach((f,i)=>{
        const nm=f.properties.ADMIN||f.properties.NAME||f.properties.name||f.properties.NAME_LONG||f.properties.SOVEREIGNT||`Country ${i}`;
        if(f.geometry.type==='Polygon') drawC(f.geometry.coordinates,nm,cGroup);
        else if(f.geometry.type==='MultiPolygon') f.geometry.coordinates.forEach(p=>drawC(p,nm,cGroup));
      });
    }).catch(()=>{
      fetch('/geojson/ne_110m_land.json').then(r=>r.json()).then(data=>{
        data.features.forEach((f,i)=>{
          if(f.geometry.type==='Polygon') drawC(f.geometry.coordinates,`Land ${i}`,cGroup);
          else if(f.geometry.type==='MultiPolygon') f.geometry.coordinates.forEach(p=>drawC(p,`Land ${i}`,cGroup));
        });
      }).catch(()=>{});
    });

    function drawC(coords, name, grp) {
      coords.forEach(ring=>{
        const pts=[];
        ring.forEach(([lon,lat])=>{
          const p=(90-lat)*(Math.PI/180),t=(lon+180)*(Math.PI/180);
          pts.push(new THREE.Vector3(-1.015*Math.sin(p)*Math.cos(t),1.015*Math.cos(p),1.015*Math.sin(p)*Math.sin(t)));
        });
        if(pts.length>3){
          const ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x00ffff,transparent:true,opacity:.6}));
          ln.userData.countryName=name; grp.add(ln);
          if(!countryBordersRef.current.has(name)) countryBordersRef.current.set(name,[]);
          countryBordersRef.current.get(name).push(ln);
          try{
            const cen=new THREE.Vector3(); pts.forEach(p=>cen.add(p));
            cen.divideScalar(pts.length).normalize().multiplyScalar(1.015);
            const v=[cen.x,cen.y,cen.z]; pts.forEach(p=>v.push(p.x,p.y,p.z));
            const idx=[]; for(let i=1;i<pts.length;i++) idx.push(0,i,i+1); idx.push(0,pts.length,1);
            const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));
            g.setIndex(idx); g.computeVertexNormals();
            const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xff00ff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));
            m.userData={isCountry:true,countryName:name}; grp.add(m); countryMeshesRef.current.push(m);
          }catch(e){}
        }
      });
    }

    // Interaction
    const onMove=(e)=>{const r=renderer.domElement.getBoundingClientRect();mouseRef.current.x=((e.clientX-r.left)/r.width)*2-1;mouseRef.current.y=-((e.clientY-r.top)/r.height)*2+1;};
    const onClick=(e)=>{
      const r=renderer.domElement.getBoundingClientRect();
      mouseRef.current.x=((e.clientX-r.left)/r.width)*2-1;mouseRef.current.y=-((e.clientY-r.top)/r.height)*2+1;
      raycasterRef.current.setFromCamera(mouseRef.current,camera);
      const pH=raycasterRef.current.intersectObjects(pinMeshesRef.current,true);
      if(pH.length>0){const{countryName:cn,continentName:ct}=pH[0].object.userData;if(cn){
        const fc=continents.find(c=>c.name===ct),co=fc?.countries.find(c=>c.name===cn);
        if(fc&&co) window.dispatchEvent(new CustomEvent('globe-click',{detail:{continent:fc,country:co}}));return;}}
      const cH=raycasterRef.current.intersectObjects(countryMeshesRef.current);
      if(cH.length>0&&cH[0].object.userData.isCountry){const cn=cH[0].object.userData.countryName;
        let fc=null,co=null;for(const ct of continents){const c=ct.countries.find(c=>cn.toLowerCase().includes(c.name.toLowerCase())||c.name.toLowerCase().includes(cn.toLowerCase()));
        if(c){fc=ct;co=c;break;}}if(fc&&co) window.dispatchEvent(new CustomEvent('globe-click',{detail:{continent:fc,country:co}}));}
    };
    renderer.domElement.addEventListener('click',onClick); window.addEventListener('mousemove',onMove);

    function hover(){
      raycasterRef.current.setFromCamera(mouseRef.current,camera);
      const pH=raycasterRef.current.intersectObjects(pinMeshesRef.current,true);
      pinMeshesRef.current.forEach(m=>{if(m.geometry.type==='SphereGeometry')m.scale.set(1,1,1);});
      countryBordersRef.current.forEach(b=>b.forEach(l=>{l.material.color.setHex(0x00ffff);l.material.opacity=.6;}));
      if(pH.length>0&&pH[0].object.userData.isPin){const h=pH[0].object;if(h.geometry.type==='SphereGeometry')h.scale.set(1.5,1.5,1.5);
        setHoveredCountry(h.userData.countryName);renderer.domElement.style.cursor='pointer';return;}
      const cH=raycasterRef.current.intersectObjects(countryMeshesRef.current);
      if(cH.length>0&&cH[0].object.userData.isCountry){const cn=cH[0].object.userData.countryName;
        const b=countryBordersRef.current.get(cn);if(b)b.forEach(l=>{l.material.color.setHex(0x00ff00);l.material.opacity=1;});
        setHoveredCountry(cn);renderer.domElement.style.cursor='pointer';}
      else{setHoveredCountry(null);renderer.domElement.style.cursor='grab';}
    }

    let aId; const animate=()=>{aId=requestAnimationFrame(animate);if(globe)globe.rotation.y+=.001;stars.rotation.y+=.0002;hover();controls.update();renderer.render(scene,camera);};animate();
    const onResize=()=>{const w2=currentMount.clientWidth,h2=currentMount.clientHeight;camera.aspect=w2/h2;camera.updateProjectionMatrix();renderer.setSize(w2,h2);};
    window.addEventListener('resize',onResize);

    return ()=>{window.removeEventListener('resize',onResize);window.removeEventListener('mousemove',onMove);renderer.domElement.removeEventListener('click',onClick);
      cancelAnimationFrame(aId);currentMount.removeChild(renderer.domElement);starsGeo.dispose();starsMat.dispose();globeGeo.dispose();globeMat.dispose();wfGeo.dispose();wfMat.dispose();renderer.dispose();};
  },[]);

  // Globe click listener
  useEffect(()=>{
    const h=(e)=>openSearchPanel(e.detail.continent,e.detail.country);
    window.addEventListener('globe-click',h);
    return ()=>window.removeEventListener('globe-click',h);
  },[]);

  // Search
  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const results = await searchTalent({
        country: selectedCountry?.name,
        city: selectedCity || undefined,
        role: searchCriteria.role || undefined,
        experience: searchCriteria.experience || undefined,
        specialty: searchCriteria.specialty || undefined,
      });
      setSearchResults(results);
    } catch (err) { setSearchResults([]); }
    setSearchLoading(false);
    setShowSearchPanel(false);
    setShowResultsPanel(true);
  };

  const handleRefine = () => { setShowResultsPanel(false); setSelectedProfile(null); setShowSearchPanel(true); };

  const sidePanelOpen = showSearchPanel || showResultsPanel;
  const accent = selectedContinent?.color || '#ff00ff';

  return (
    <>
      {/* ══════ GLOBE ══════ */}
      <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0014' }}>
        <div className="relative z-20 pt-6 pb-2">
          <div className="flex justify-center">
            <svg width="620" height="90" viewBox="0 0 620 90" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_30px_rgba(255,0,255,0.8)]" style={{maxWidth:'90vw'}}>
              <defs>
                <path id="tc" d="M 40,75 Q 310,15 580,75" fill="none"/>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ff00ff" stopOpacity=".9"/><stop offset="50%" stopColor="#a855f7" stopOpacity=".95"/><stop offset="100%" stopColor="#ff006e" stopOpacity=".9"/></linearGradient>
                <filter id="gl"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d="M 40,75 Q 310,15 580,75 L 580,88 Q 310,28 40,88 Z" fill="url(#bg)" opacity=".85" filter="url(#gl)"/>
              <text fill="white" fontSize="34" fontWeight="900" letterSpacing="10" fontFamily="Orbitron,Rajdhani,Arial Black,sans-serif" filter="url(#gl)">
                <textPath href="#tc" startOffset="50%" textAnchor="middle">GLOBAL STUDIOS</textPath></text>
            </svg>
          </div>
          <div className="text-center mt-1"><p className="text-sm md:text-base tracking-[0.2em] text-fuchsia-400 animate-pulse">GLOBAL TALENT NETWORK</p></div>
          <div className="text-center mt-2">
            <div className="inline-block bg-[rgba(26,0,51,0.9)] border border-fuchsia-500/40 px-6 py-2 backdrop-blur-lg rounded">
              <p className="text-xs md:text-sm tracking-wider text-fuchsia-400">🖱️ DRAG TO ROTATE • 🔍 SCROLL TO ZOOM • 📍 CLICK A COUNTRY TO FIND TALENT</p>
            </div>
          </div>
          <div className="absolute top-6 right-6 z-30">
            <button className="px-5 py-2.5 rounded font-bold text-sm tracking-widest transition-all hover:scale-105"
              style={{background:'transparent',color:'#a855f7',border:'2px solid #a855f7',boxShadow:'0 0 20px rgba(168,85,247,.3)'}}
              onClick={()=>setShowDashboard(true)}>📊 ANALYTICS</button>
          </div>
        </div>
        <div ref={mountRef} className="absolute inset-0 z-0" style={{width:'100vw',height:'100vh'}}/>
        {hoveredCountry&&(
          <div className="fixed z-[200] pointer-events-none px-3 py-1.5 rounded text-sm font-bold tracking-wider"
            style={{left:'50%',bottom:'40px',transform:'translateX(-50%)',background:'rgba(26,0,51,.95)',border:'1px solid #ff00ff',color:'#f0abfc',boxShadow:'0 0 20px rgba(255,0,255,.4)'}}>
            📍 {hoveredCountry}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          RIGHT SIDE PANEL — rendered via Portal into document.body
          This guarantees it shows on top of EVERYTHING.
          ══════════════════════════════════════════════════════ */}
      {sidePanelOpen && (
        <Portal>
          <div style={{position:'fixed',inset:0,zIndex:9999,pointerEvents:'none'}}>
            {/* dim overlay — click to close */}
            <div
              style={{
                position:'absolute', inset:0, pointerEvents:'auto',
                background:'rgba(10,0,20,0.3)',
                opacity: panelAnimated ? 1 : 0,
                transition:'opacity 0.3s ease',
              }}
              onClick={closeAllPanels}
            />

            {/* slide-in panel */}
            <div
              style={{
                position:'absolute', top:0, right:0,
                height:'100%', width:'420px', maxWidth:'92vw',
                pointerEvents:'auto',
                overflowY:'auto',
                transform: panelAnimated ? 'translateX(0)' : 'translateX(100%)',
                transition:'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background:'rgba(10, 0, 20, 0.96)',
                borderLeft:`2px solid ${accent}`,
                boxShadow:`-10px 0 60px ${accent}44, inset 4px 0 30px ${accent}11`,
                backdropFilter:'blur(24px)',
                WebkitBackdropFilter:'blur(24px)',
              }}
            >
              {/* close button */}
              <button
                onClick={closeAllPanels}
                style={{
                  position:'absolute', top:'20px', right:'20px', zIndex:10,
                  width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center',
                  border:`2px solid ${accent}`, borderRadius:'6px', background:'transparent',
                  color:accent, fontSize:'18px', cursor:'pointer', transition:'transform 0.2s',
                }}
                onMouseEnter={(e)=>e.target.style.transform='rotate(90deg)'}
                onMouseLeave={(e)=>e.target.style.transform='rotate(0)'}
              >✕</button>

              {/* ── SEARCH FILTERS ── */}
              {showSearchPanel && selectedCountry && (
                <div style={{padding:'60px 28px 28px'}}>
                  <h2 style={{fontSize:'28px',fontWeight:900,letterSpacing:'3px',color:accent,textShadow:`0 0 20px ${accent}`,marginBottom:'4px'}}>
                    FIND TALENT
                  </h2>
                  <p style={{color:'#d8b4fe',fontSize:'13px',letterSpacing:'3px',marginBottom:'24px'}}>
                    {selectedCountry.name} · {selectedContinent?.name}
                  </p>

                  <div style={{display:'flex',flexDirection:'column',gap:'16px',marginBottom:'24px'}}>
                    <div>
                      <label style={{display:'block',marginBottom:'8px',fontSize:'11px',letterSpacing:'3px',fontWeight:700,color:accent}}>📍 CITY / REGION</label>
                      <select value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}
                        style={{width:'100%',padding:'12px',background:'#0a0018',border:`2px solid ${accent}44`,borderRadius:'6px',color:'white',outline:'none',fontSize:'14px'}}>
                        <option value="">All cities...</option>
                        {selectedCountry.cities?.map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{display:'block',marginBottom:'8px',fontSize:'11px',letterSpacing:'3px',fontWeight:700,color:accent}}>ROLE</label>
                      <select value={searchCriteria.role} onChange={e=>setSearchCriteria({...searchCriteria,role:e.target.value})}
                        style={{width:'100%',padding:'12px',background:'#0a0018',border:`2px solid ${accent}44`,borderRadius:'6px',color:'white',outline:'none',fontSize:'14px'}}>
                        <option value="">Select role...</option>
                        {talentRoles.map(r=><option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{display:'block',marginBottom:'8px',fontSize:'11px',letterSpacing:'3px',fontWeight:700,color:accent}}>EXPERIENCE</label>
                      <select value={searchCriteria.experience} onChange={e=>setSearchCriteria({...searchCriteria,experience:e.target.value})}
                        style={{width:'100%',padding:'12px',background:'#0a0018',border:`2px solid ${accent}44`,borderRadius:'6px',color:'white',outline:'none',fontSize:'14px'}}>
                        <option value="">Select experience...</option>
                        <option value="emerging">Emerging (0-2 years)</option>
                        <option value="professional">Professional (3-7 years)</option>
                        <option value="veteran">Veteran (8-15 years)</option>
                        <option value="legendary">Legendary (15+ years)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{display:'block',marginBottom:'8px',fontSize:'11px',letterSpacing:'3px',fontWeight:700,color:accent}}>SPECIALTY / GENRE</label>
                      <input type="text" placeholder="e.g., Action, Drama, Sci-Fi..." value={searchCriteria.specialty}
                        onChange={e=>setSearchCriteria({...searchCriteria,specialty:e.target.value})}
                        style={{width:'100%',padding:'12px',background:'#0a0018',border:`2px solid ${accent}44`,borderRadius:'6px',color:'white',outline:'none',fontSize:'14px',boxSizing:'border-box'}}/>
                    </div>
                  </div>

                  <button onClick={handleSearch}
                    style={{width:'100%',padding:'16px',border:'none',borderRadius:'6px',color:'white',fontSize:'18px',fontWeight:700,letterSpacing:'3px',cursor:'pointer',
                      background:`linear-gradient(135deg, ${accent}, ${accent}dd)`}}>
                    🎬 START SEARCH
                  </button>
                </div>
              )}

              {/* ── RESULTS ── */}
              {showResultsPanel && selectedCountry && (
                <div style={{padding:'60px 28px 28px'}}>
                  <h2 style={{fontSize:'24px',fontWeight:900,letterSpacing:'3px',color:accent,textShadow:`0 0 16px ${accent}`,marginBottom:'4px'}}>
                    RESULTS
                  </h2>
                  <p style={{color:'#d8b4fe',fontSize:'13px',letterSpacing:'3px',marginBottom:'20px'}}>
                    {selectedCountry.name} {selectedCity && `· ${selectedCity}`} · {selectedContinent?.name}
                  </p>

                  {searchLoading ? (
                    <div style={{textAlign:'center',padding:'60px 0'}}>
                      <div style={{fontSize:'24px',color:accent}}>⏳ Searching...</div>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div style={{textAlign:'center',padding:'60px 0'}}>
                      <div style={{fontSize:'16px',color:'#d8b4fe88',marginBottom:'8px'}}>No talent found.</div>
                      <div style={{fontSize:'13px',color:'#d8b4fe55'}}>Try broadening your filters.</div>
                    </div>
                  ) : (
                    <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'24px'}}>
                      {searchResults.map((person, i) => (
                        <div key={person.id||i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px',borderRadius:'10px',
                          background:`${accent}08`,border:`1px solid ${accent}28`}}>
                          <div style={{width:'44px',height:'44px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                            fontSize:'18px',fontWeight:700,flexShrink:0,background:`linear-gradient(135deg, ${accent}77, ${accent}22)`,color:'white'}}>
                            {person.name[0]}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:700,fontSize:'14px',color:'white'}}>{person.name}</div>
                            <div style={{fontSize:'11px',color:'#d8b4fe99',letterSpacing:'2px'}}>{person.role} · {person.city}</div>
                          </div>
                          <button onClick={()=>setSelectedProfile(person)}
                            style={{padding:'6px 14px',border:`2px solid ${accent}`,background:'transparent',color:accent,
                              fontSize:'11px',fontWeight:700,letterSpacing:'2px',borderRadius:'6px',cursor:'pointer'}}>
                            VIEW
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button onClick={handleRefine}
                    style={{width:'100%',padding:'14px',border:`2px solid ${accent}`,background:'transparent',color:accent,
                      fontWeight:700,letterSpacing:'3px',borderRadius:'6px',cursor:'pointer',fontSize:'14px'}}>
                    ← REFINE SEARCH
                  </button>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}

      {/* ── PROFILE MODAL (via Portal) ── */}
      {selectedProfile && (
        <Portal>
          <ProfileModal profile={selectedProfile} color={accent} onClose={()=>setSelectedProfile(null)} />
        </Portal>
      )}

      {/* ── ANALYTICS (via Portal) ── */}
      {showDashboard && (
        <Portal>
          <AnalyticsDashboard isOpen={showDashboard} onClose={()=>setShowDashboard(false)} />
        </Portal>
      )}
    </>
  );
};

export default StarryGlobe;