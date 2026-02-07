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
  const [searchCriteria, setSearchCriteria] = useState({
    role: '',
    experience: '',
    specialty: ''
  });

  // ==========================================
  // DATA
  // ==========================================
  const continents = [
    {
      name: 'North America',
      color: '#ff00ff',
      countries: ['United States', 'Canada', 'Mexico']
    },
    {
      name: 'South America',
      color: '#ff006e',
      countries: ['Brazil', 'Argentina', 'Colombia', 'Chile']
    },
    {
      name: 'Europe',
      color: '#a855f7',
      countries: ['United Kingdom', 'France', 'Germany', 'Spain', 'Italy']
    },
    {
      name: 'Africa',
      color: '#e879f9',
      countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt']
    },
    {
      name: 'Asia',
      color: '#7c3aed',
      countries: ['India', 'China', 'Japan', 'South Korea', 'Thailand']
    },
    {
      name: 'Oceania',
      color: '#f0abfc',
      countries: ['Australia', 'New Zealand', 'Fiji']
    }
  ];

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

    // ==========================================
    // CREATE GLOBE SPHERE
    // ==========================================
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

    // ==========================================
    // WIREFRAME GRID
    // ==========================================
    const wireframeGeometry = new THREE.SphereGeometry(1.01, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // ==========================================
    // LIGHTING
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xff00ff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 0.8, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // ==========================================
    // LOAD GEOJSON DATA
    // ==========================================
    fetch('/geojson/ne_110m_land.json')
      .then(response => response.json())
      .then(data => {
        const landGroup = new THREE.Group();

        data.features.forEach(feature => {
          if (feature.geometry.type === 'Polygon') {
            drawPolygon(feature.geometry.coordinates, landGroup);
          } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygon => {
              drawPolygon(polygon, landGroup);
            });
          }
        });

        scene.add(landGroup);
      })
      .catch(error => {
        console.log('GeoJSON not loaded, using wireframe only:', error);
      });

    // ==========================================
    // DRAW POLYGON FROM GEOJSON
    // ==========================================
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

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Slow auto-rotation
      if (globe) {
        globe.rotation.y += 0.001;
      }
      
      // Twinkle stars
      stars.rotation.y += 0.0002;
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ==========================================
    // HANDLE RESIZE
    // ==========================================
    const handleResize = () => {
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // CLEANUP
    // ==========================================
    return () => {
      window.removeEventListener('resize', handleResize);
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

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleContinentSelect = (continent) => {
    setSelectedContinent(continent);
    setShowCountryList(true);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryList(false);
    setShowSearchModal(true);
  };

  const handleSearch = () => {
    console.log('Searching:', searchCriteria, 'in', selectedCountry, selectedContinent?.name);
    setShowSearchModal(false);
    setSelectedCountry(null);
    setSearchCriteria({ role: '', experience: '', specialty: '' });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" style={{ width: '100w', height: '100vh', }} />

      {/* Header */}
      <header className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-50 w-full px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.3em] mb-3 text-white text-shadow-neon-strong">
          GlOBAL STUDIOS
        </h1>
        <p className="text-sm md:text-base lg:text-lg tracking-[0.2em] text-fuchsia-400 animate-pulse-slow text-shadow-fuchsia">
          GLOBAL TALENT NETWORK
        </p>
      </header>

      {/* Controls Info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[rgba(26,0,51,0.9)] border-2 border-fuchsia-500/40 px-6 py-3 backdrop-blur-lg">
          <p className="text-xs md:text-sm tracking-wider text-fuchsia-400 text-shadow-fuchsia">
            🖱️ DRAG TO ROTATE • 🔍 SCROLL TO ZOOM • 📍 RIGHT-CLICK TO PAN
          </p>
        </div>
      </div>

      {/* Continent Selection Buttons */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 space-y-3">
        {continents.map((continent, idx) => (
          <button
            key={idx}
            className="block w-full px-4 py-3 border-2 bg-[rgba(26,0,51,0.8)] backdrop-blur-sm text-white font-bold text-sm tracking-wider transition-all duration-300 hover:-translate-x-2 hover:scale-105"
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

      {/* Country List Modal */}
      {showCountryList && selectedContinent && (
        <div className="modal-overlay">
          <div 
            className="card-cyber max-w-lg w-[90vw] animate-zoom-in"
            style={{
              borderColor: selectedContinent.color,
              boxShadow: `0 0 60px ${selectedContinent.color}88, inset 0 0 40px ${selectedContinent.color}22`
            }}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 border-2 text-2xl flex items-center justify-center transition-all duration-300 hover:rotate-90"
              style={{ borderColor: selectedContinent.color, color: selectedContinent.color }}
              onClick={() => {
                setShowCountryList(false);
                setSelectedContinent(null);
              }}
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
            <p className="text-fuchsia-300 tracking-widest mb-6">SELECT A COUNTRY</p>

            <div className="country-grid mb-4">
              {selectedContinent.countries.map((country) => (
                <button
                  key={country}
                  className="p-4 border-2 bg-transparent text-white font-semibold transition-all duration-300 hover:-translate-y-1"
                  style={{ 
                    borderColor: selectedContinent.color,
                    background: `${selectedContinent.color}11`
                  }}
                  onClick={() => handleCountrySelect(country)}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && selectedContinent && selectedCountry && (
        <div className="modal-overlay">
          <div 
            className="card-cyber max-w-lg w-[90vw] animate-zoom-in"
            style={{
              borderColor: selectedContinent.color,
              boxShadow: `0 0 60px ${selectedContinent.color}88, inset 0 0 40px ${selectedContinent.color}22`
            }}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 border-2 text-2xl flex items-center justify-center transition-all hover:rotate-90"
              style={{ borderColor: selectedContinent.color, color: selectedContinent.color }}
              onClick={() => {
                setShowSearchModal(false);
                setSelectedCountry(null);
              }}
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
            <p className="text-fuchsia-300 tracking-widest mb-6">
              {selectedCountry}, {selectedContinent.name}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label 
                  className="block mb-2 text-sm tracking-widest font-semibold"
                  style={{ color: selectedContinent.color }}
                >
                  ROLE
                </label>
                <select
                  className="select-cyber"
                  style={{ borderColor: selectedContinent.color }}
                  value={searchCriteria.role}
                  onChange={(e) => setSearchCriteria({...searchCriteria, role: e.target.value})}
                >
                  <option value="">Select role...</option>
                  {talentRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label 
                  className="block mb-2 text-sm tracking-widest font-semibold"
                  style={{ color: selectedContinent.color }}
                >
                  EXPERIENCE
                </label>
                <select
                  className="select-cyber"
                  style={{ borderColor: selectedContinent.color }}
                  value={searchCriteria.experience}
                  onChange={(e) => setSearchCriteria({...searchCriteria, experience: e.target.value})}
                >
                  <option value="">Select experience...</option>
                  <option value="emerging">Emerging (0-2 years)</option>
                  <option value="professional">Professional (3-7 years)</option>
                  <option value="veteran">Veteran (8-15 years)</option>
                  <option value="legendary">Legendary (15+ years)</option>
                </select>
              </div>

              <div>
                <label 
                  className="block mb-2 text-sm tracking-widest font-semibold"
                  style={{ color: selectedContinent.color }}
                >
                  SPECIALTY / GENRE
                </label>
                <input
                  type="text"
                  className="input-cyber"
                  style={{ borderColor: selectedContinent.color }}
                  placeholder="e.g., Action, Drama, Sci-Fi..."
                  value={searchCriteria.specialty}
                  onChange={(e) => setSearchCriteria({...searchCriteria, specialty: e.target.value})}
                />
              </div>
            </div>

            <button
              className="w-full px-8 py-4 border-none text-white text-xl font-bold tracking-widest transition-all hover:-translate-y-1"
              style={{ background: `linear-gradient(135deg, ${selectedContinent.color}, ${selectedContinent.color}dd)` }}
              onClick={handleSearch}
            >
              🎬 START SEARCH
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarryGlobe;

