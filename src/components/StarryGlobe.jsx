import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const StarryGlobe = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const globeRef = useRef(null);

  
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryList, setShowCountryList] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  const [searchCriteria, setSearchCriteria] = useState({
    role: '',
    experience: '',
    specialty: ''
  });

  //data for the overall continents
  const continents = [
    {
      name: 'North America',
      color: '#ff00ff',
      countries: [
        { name: 'United States', cities: ['Los Angeles', 'New York', 'Atlanta', 'Chicago'] },
        { name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal'] },
        { name: 'Mexico', cities: ['Mexico City', 'Guadalajara'] }
      ]
    },
    {
      name: 'South America',
      color: '#ff006e',
      countries: [
        { name: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro'] },
        { name: 'Argentina', cities: ['Buenos Aires'] },
        { name: 'Colombia', cities: ['Bogotá', 'Medellín'] },
        { name: 'Chile', cities: ['Santiago'] }
      ]
    },
    {
      name: 'Europe',
      color: '#a855f7',
      countries: [
        { name: 'United Kingdom', cities: ['London', 'Manchester'] },
        { name: 'France', cities: ['Paris', 'Lyon'] },
        { name: 'Germany', cities: ['Berlin', 'Munich'] },
        { name: 'Spain', cities: ['Madrid', 'Barcelona'] },
        { name: 'Italy', cities: ['Rome', 'Milan'] }
      ]
    },
    {
      name: 'Africa',
      color: '#e879f9',
      countries: [
        { name: 'South Africa', cities: ['Cape Town', 'Johannesburg'] },
        { name: 'Nigeria', cities: ['Lagos', 'Abuja'] },
        { name: 'Kenya', cities: ['Nairobi'] },
        { name: 'Egypt', cities: ['Cairo'] }
      ]
    },
    {
      name: 'Asia',
      color: '#7c3aed',
      countries: [
        { name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore'] },
        { name: 'China', cities: ['Beijing', 'Shanghai'] },
        { name: 'Japan', cities: ['Tokyo', 'Osaka'] },
        { name: 'South Korea', cities: ['Seoul'] },
        { name: 'Thailand', cities: ['Bangkok'] }
      ]
    },
    {
      name: 'Oceania',
      color: '#f0abfc',
      countries: [
        { name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane'] },
        { name: 'New Zealand', cities: ['Auckland', 'Wellington'] },
        { name: 'Fiji', cities: ['Suva'] }
      ]
    }
  ];


  //categories of possible roles a person could be while using this
  const talentRoles = [
    'Actor/Actress', 'Director', 'Producer', 'Screenwriter',
    'Cinematographer', 'Editor', 'Production Designer',
    'Casting Director', 'Talent Manager', 'Agent'
  ];

  // three.js file founded on line to be able to incoporate the 3D globe portion of it
  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const w = currentMount.clientWidth;
    const h = currentMount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0014);
    scene.fog = new THREE.FogExp2(0x0a0014, 0.15);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 2;
    controls.maxDistance = 5;
    
    
    //to lock the globe in its place 
    controls.enablePan = false; //help not move the globe too much 
    controls.target.set(0, 0, 0);
    controls.update()

    
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true
    });

    const starsVertices = [];
    const starsColors = [];
    const colors = [
      new THREE.Color(0xff00ff), // Magenta
      new THREE.Color(0xff006e), // Pink
      new THREE.Color(0xa855f7), // Purple
      new THREE.Color(0xf0abfc)  // Light pink
    ];

    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      starsVertices.push(x, y, z);

      const color = colors[Math.floor(Math.random() * colors.length)];
      starsColors.push(color.r, color.g, color.b);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    //creating the overall globe
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Globe material with cyberpunk colors
    const globeMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a0033,
      emissive: 0x0a0014,
      emissiveIntensity: 0.5,
      shininess: 30,
      transparent: true,
      opacity: 0.95
    });
    
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeRef.current = globe;
    scene.add(globe);

    //wireframing of the globe
    const wireframeGeometry = new THREE.SphereGeometry(1.01, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    //setting up the lighting for the overall apperance
    const ambientLight = new THREE.AmbientLight(0xff00ff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 0.8, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    //loading the geojson data for the 3d globe to make it accurate
    const countryGroup = new THREE.Group();
    scene.add(countryGroup);

    fetch('/geojson/countries.json')
      .then(response => response.json())
      .then(data => {
        console.log('GeoJSON loaded:', data.features.length, 'countries');
        
        data.features.forEach((feature, index) => {
          const countryName = 
          feature.properties.ADMIN || 
          feature.properties.NAME || 
          feature.properties.name ||
          feature.properties.NAME_LONG ||
          feature.properties.SOVEREIGNT || 
          `Country ${index}`;
          
          
          if (feature.geometry.type === 'Polygon') {
            drawCountry(feature.geometry.coordinates, countryName, countryGroup);
          } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygon => {
              drawCountry(polygon, countryName, countryGroup);
            });
          }
        });
      })
      .catch(error => {
        console.log('GeoJSON not loaded:', error);
        // Fallback to land data
        fetch('/geojson/ne_110m_land.json')
          .then(response => response.json())
          .then(data => {
            data.features.forEach((feature, index) => {
              if (feature.geometry.type === 'Polygon') {
                drawCountry(feature.geometry.coordinates, `Land ${index}`, countryGroup);
              } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach(polygon => {
                  drawCountry(polygon, `Land ${index}`, countryGroup);
                });
              }
            });
          })
          .catch(err => console.log('No GeoJSON available:', err));
      });

      //adding the element to hover over the country and light it up
      function drawCountry(coordinates, countryName, group) {
        coordinates.forEach(ring => {
          const points = [];

          ring.forEach(([lon, lat]) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);

            const x = -1.015 * Math.sin(phi) * Math.cos(theta);
            const y = 1.015 * Math.cos(phi);
            const z = 1.015 * Math.sin(phi) * Math.sin(theta);
            
            points.push(new THREE.Vector3(x, y, z));
          });
          
          if (points.length > 3) {
            // Just draw the border line
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
              color: 0x00ffff,
              transparent: true,
              opacity: 0.6,
              linewidth: 2
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            group.add(line);
          }
        });
      }

    //drawing a polygon from  geojson
    function drawPolygon(coordinates, group) {
      coordinates.forEach(ring => {
        const points = [];
        
        ring.forEach(([lon, lat]) => {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          
          const x = -1.005 * Math.sin(phi) * Math.cos(theta);
          const y = 1.005 * Math.cos(phi);
          const z = 1.005 * Math.sin(phi) * Math.sin(theta);
          
          points.push(new THREE.Vector3(x, y, z));
        });

        if (points.length > 2) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffaa,
            transparent: true,
            opacity: 0.7,
            linewidth: 2
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          group.add(line);
        }
      });
    }

   //animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Slow auto-rotation
      if (globe) {
        globe.rotation.y += 0.001;
      }
      
      // Twinkle stars
      stars.rotation.y += 0.0002;

      // calling the hover function
      // checkHover();
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    //adjusting the sizing based on where the user is looking at it
    const handleResize = () => {
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    //cleaning up the animation to make sure its properly working out
    return () => {
      window.removeEventListener('resize', handleResize);
      // window.removeEventListener('mousemove', handleMouseMove);

      cancelAnimationFrame(animationId);
      currentMount.removeChild(renderer.domElement);
      
      // Dispose of Three.js objects
      starsGeometry.dispose();
      starsMaterial.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  //handlers to see the continent and corporating with it
  const handleContinentSelect = (continent) => {
    setSelectedContinent(continent);
    setSelectedCountry(null);
    setSelectedCity('');
    setShowResults(false);
    setSearchCriteria({ role: '', experience: '', specialty: '' });
    setShowCountryList(true);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedCity('');
    setShowCountryList(false);
    setShowSearchModal(true);
  };

  const handleSearch = () => {
    console.log('Searching:', searchCriteria, 'in', selectedCountry?.name || selectedCountry, selectedCity, selectedContinent?.name);
    // show results popup instead of closing everything
    setShowSearchModal(false);
    setShowResults(true);
  };

  // close everything and reset
  const handleCloseAll = () => {
    setShowCountryList(false);
    setShowSearchModal(false);
    setShowResults(false);
    setSelectedContinent(null);
    setSelectedCountry(null);
    setSelectedCity('');
    setSearchCriteria({ role: '', experience: '', specialty: '' });
  };

  // go back from results to refine the search
  const handleRefineSearch = () => {
    setShowResults(false);
    setShowSearchModal(true);
  };

  // mock results for demo
  const mockResults = [
    { name: 'Aria Chen', role: searchCriteria.role || 'Multi-disciplinary', city: selectedCity || selectedCountry?.cities?.[0] || '—' },
    { name: 'Jamal Williams', role: searchCriteria.role || 'Multi-disciplinary', city: selectedCity || selectedCountry?.cities?.[0] || '—' },
    { name: 'Sofia Reyes', role: searchCriteria.role || 'Multi-disciplinary', city: selectedCity || selectedCountry?.cities?.[0] || '—' },
    { name: 'Liam O\'Brien', role: searchCriteria.role || 'Multi-disciplinary', city: selectedCity || selectedCountry?.cities?.[0] || '—' },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0a0014' }}>

      {/* curved banner + header  */}
      <div className="relative z-20 pt-6 pb-2">
        {/* Curved Banner on Globe */}
        <div className="flex justify-center">
          <svg width="620" height="90" viewBox="0 0 620 90" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_30px_rgba(255,0,255,0.8)]" style={{ maxWidth: '90vw' }}>
            <defs>
              <path id="textCurve" d="M 40,75 Q 310,15 580,75" fill="none"/>
              
              <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.9"/>
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95"/>
                <stop offset="100%" stopColor="#ff006e" stopOpacity="0.9"/>
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <path d="M 40,75 Q 310,15 580,75 L 580,88 Q 310,28 40,88 Z" 
                  fill="url(#bannerGrad)" 
                  opacity="0.85"
                  filter="url(#glow)"/>
            
            <text 
              fill="white" 
              fontSize="34" 
              fontWeight="900" 
              letterSpacing="10"
              fontFamily="Orbitron, Rajdhani, Arial Black, sans-serif"
              filter="url(#glow)">
              <textPath href="#textCurve" startOffset="50%" textAnchor="middle">
                GLOBAL STUDIOS
              </textPath>
            </text>
          </svg>
        </div>
        
        {/* Header subtitle */}
        <div className="text-center mt-1">
          <p className="text-sm md:text-base tracking-[0.2em] text-fuchsia-400 animate-pulse">
            GLOBAL TALENT NETWORK
          </p>
        </div>
      </div>

      
      {/* Three.js Canvas — */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0" 
        style={{ 
          width: '100w', 
          height : '100vh'
        }} 
      />

      {/* Controls Info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[rgba(26,0,51,0.9)] border-2 border-fuchsia-500/40 px-6 py-3 backdrop-blur-lg rounded">
          <p className="text-xs md:text-sm tracking-wider text-fuchsia-400">
            🖱️ DRAG TO ROTATE • 🔍 SCROLL TO ZOOM • 📍 SELECT A CONTINENT TO FIND TALENT
          </p>
        </div>
      </div>

      {/* Continent Selection Buttons */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 space-y-3">
        {continents.map((continent, idx) => (
          <button
            key={idx}
            className="block w-full px-4 py-3 border-2 bg-[rgba(26,0,51,0.8)] backdrop-blur-sm text-white font-bold text-sm tracking-wider transition-all duration-300 hover:-translate-x-2 hover:scale-105 rounded"
            style={{
              borderColor: continent.color,
              boxShadow: `0 0 10px ${continent.color}44`
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = `0 0 20px ${continent.color}88`;
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = `0 0 10px ${continent.color}44`;
            }}
            onClick={() => handleContinentSelect(continent)}
          >
            {continent.name}
          </button>
        ))}
      </div>

      {/* country list modal */}
      {showCountryList && selectedContinent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center">
          <div 
            className="relative max-w-lg w-[90vw] p-8 rounded-lg"
            style={{
              background: '#0f0020',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: selectedContinent.color,
              boxShadow: `0 0 60px ${selectedContinent.color}88, inset 0 0 40px ${selectedContinent.color}22`
            }}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 border-2 text-2xl flex items-center justify-center transition-all duration-300 hover:rotate-90 rounded"
              style={{ borderColor: selectedContinent.color, color: selectedContinent.color, background: 'transparent' }}
              onClick={handleCloseAll}
            >
              ✕
            </button>

            <h2 
              className="text-3xl md:text-4xl font-black tracking-wider mb-2"
              style={{ 
                color: selectedContinent.color,
                textShadow: `0 0 20px ${selectedContinent.color}`
              }}
            >
              {selectedContinent.name}
            </h2>
            <p className="text-fuchsia-300 tracking-widest mb-6 text-sm">SELECT A COUNTRY</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {selectedContinent.countries.map((country) => (
                <button
                  key={country.name}
                  className="p-4 border-2 bg-transparent text-white font-semibold transition-all duration-300 hover:-translate-y-1 rounded"
                  style={{ 
                    borderColor: `${selectedContinent.color}88`,
                    background: `${selectedContinent.color}0c`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = selectedContinent.color;
                    e.currentTarget.style.background = `${selectedContinent.color}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${selectedContinent.color}88`;
                    e.currentTarget.style.background = `${selectedContinent.color}0c`;
                  }}
                  onClick={() => handleCountrySelect(country)}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* search/filter modal */}
      {showSearchModal && selectedContinent && selectedCountry && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center">
          <div 
            className="relative max-w-lg w-[90vw] p-8 rounded-lg max-h-[90vh] overflow-y-auto"
            style={{
              background: '#0f0020',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: selectedContinent.color,
              boxShadow: `0 0 60px ${selectedContinent.color}88, inset 0 0 40px ${selectedContinent.color}22`
            }}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 border-2 text-2xl flex items-center justify-center transition-all hover:rotate-90 rounded"
              style={{ borderColor: selectedContinent.color, color: selectedContinent.color, background: 'transparent' }}
              onClick={handleCloseAll}
            >
              ✕
            </button>

            <h2 
              className="text-3xl md:text-4xl font-black tracking-wider mb-2"
              style={{ 
                color: selectedContinent.color,
                textShadow: `0 0 20px ${selectedContinent.color}`
              }}
            >
              FIND TALENT
            </h2>
            <p className="text-fuchsia-300 tracking-widest mb-6 text-sm">
              {selectedCountry.name} · {selectedContinent.name}
            </p>

            <div className="space-y-4 mb-6">
              {/* City / Region picker — pin a specific location */}
              <div>
                <label 
                  className="block mb-2 text-sm tracking-widest font-semibold"
                  style={{ color: selectedContinent.color }}
                >
                  📍 CITY / REGION
                </label>
                <select
                  className="w-full p-3 bg-[#0a0018] border-2 rounded text-white outline-none"
                  style={{ borderColor: `${selectedContinent.color}55` }}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = selectedContinent.color}
                  onBlur={(e) => e.target.style.borderColor = `${selectedContinent.color}55`}
                >
                  <option value="">All cities...</option>
                  {selectedCountry.cities && selectedCountry.cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Role — who are they */}
              <div>
                <label 
                  className="block mb-2 text-sm tracking-widest font-semibold"
                  style={{ color: selectedContinent.color }}
                >
                  ROLE
                </label>
                <select
                  className="w-full p-3 bg-[#0a0018] border-2 rounded text-white outline-none"
                  style={{ borderColor: `${selectedContinent.color}55` }}
                  value={searchCriteria.role}
                  onChange={(e) => setSearchCriteria({...searchCriteria, role: e.target.value})}
                  onFocus={(e) => e.target.style.borderColor = selectedContinent.color}
                  onBlur={(e) => e.target.style.borderColor = `${selectedContinent.color}55`}
                >
                  <option value="">Select role...</option>
                  {talentRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Experience — what level are they looking for */}
              <div>
                <label 
                  className="block mb-2 text-sm tracking-widest font-semibold"
                  style={{ color: selectedContinent.color }}
                >
                  EXPERIENCE
                </label>
                <select
                  className="w-full p-3 bg-[#0a0018] border-2 rounded text-white outline-none"
                  style={{ borderColor: `${selectedContinent.color}55` }}
                  value={searchCriteria.experience}
                  onChange={(e) => setSearchCriteria({...searchCriteria, experience: e.target.value})}
                  onFocus={(e) => e.target.style.borderColor = selectedContinent.color}
                  onBlur={(e) => e.target.style.borderColor = `${selectedContinent.color}55`}
                >
                  <option value="">Select experience...</option>
                  <option value="emerging">Emerging (0-2 years)</option>
                  <option value="professional">Professional (3-7 years)</option>
                  <option value="veteran">Veteran (8-15 years)</option>
                  <option value="legendary">Legendary (15+ years)</option>
                </select>
              </div>

              {/* Specialty — what are they looking for */}
              <div>
                <label 
                  className="block mb-2 text-sm tracking-widest font-semibold"
                  style={{ color: selectedContinent.color }}
                >
                  SPECIALTY / GENRE
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-[#0a0018] border-2 rounded text-white outline-none"
                  style={{ borderColor: `${selectedContinent.color}55` }}
                  placeholder="e.g., Action, Drama, Sci-Fi..."
                  value={searchCriteria.specialty}
                  onChange={(e) => setSearchCriteria({...searchCriteria, specialty: e.target.value})}
                  onFocus={(e) => e.target.style.borderColor = selectedContinent.color}
                  onBlur={(e) => e.target.style.borderColor = `${selectedContinent.color}55`}
                />
              </div>
            </div>

            <button
              className="w-full px-8 py-4 border-none text-white text-xl font-bold tracking-widest transition-all hover:-translate-y-1 rounded"
              style={{ background: `linear-gradient(135deg, ${selectedContinent.color}, ${selectedContinent.color}dd)` }}
              onClick={handleSearch}
            >
              🎬 START SEARCH
            </button>
          </div>
        </div>
      )}

      {/* results modal */}
      {showResults && selectedContinent && selectedCountry && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center">
          <div 
            className="relative max-w-lg w-[90vw] p-8 rounded-lg max-h-[90vh] overflow-y-auto"
            style={{
              background: '#0f0020',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: selectedContinent.color,
              boxShadow: `0 0 60px ${selectedContinent.color}88, inset 0 0 40px ${selectedContinent.color}22`
            }}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 border-2 text-2xl flex items-center justify-center transition-all hover:rotate-90 rounded"
              style={{ borderColor: selectedContinent.color, color: selectedContinent.color, background: 'transparent' }}
              onClick={handleCloseAll}
            >
              ✕
            </button>

            <h2 
              className="text-2xl md:text-3xl font-black tracking-wider mb-1"
              style={{ 
                color: selectedContinent.color,
                textShadow: `0 0 16px ${selectedContinent.color}`
              }}
            >
              RESULTS
            </h2>
            <p className="text-fuchsia-300 tracking-widest mb-5 text-sm">
              {selectedCountry.name} {selectedCity && `· ${selectedCity}`} · {selectedContinent.name}
            </p>

            {/* Result cards */}
            <div className="space-y-3 mb-6">
              {mockResults.map((person, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg"
                  style={{ 
                    background: `${selectedContinent.color}0a`,
                    border: `1px solid ${selectedContinent.color}33`
                  }}
                >
                  {/* avatar placeholder */}
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${selectedContinent.color}88, ${selectedContinent.color}33)` }}
                  >
                    {person.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base">{person.name}</div>
                    <div className="text-xs text-fuchsia-300 tracking-wider">
                      {person.role} · {person.city}
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 border-2 bg-transparent font-bold text-xs tracking-widest rounded transition-all hover:scale-105"
                    style={{ borderColor: selectedContinent.color, color: selectedContinent.color }}
                  >
                    VIEW
                  </button>
                </div>
              ))}
            </div>

            {/* Refine search button — go back to filter popup */}
            <button
              className="w-full px-6 py-3 border-2 bg-transparent font-bold tracking-widest transition-all hover:-translate-y-1 rounded"
              style={{ borderColor: selectedContinent.color, color: selectedContinent.color }}
              onClick={handleRefineSearch}
            >
              ← REFINE SEARCH
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarryGlobe;