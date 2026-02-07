import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//the overall setup of the app
const StarryGlobe = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const globeRef = useRef(null);
  // variables to handle hover over country part
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const countryMeshesRef = useRef([]);
  const countryBordersRef = useRef(new Map());
  // ref to store pin meshes for raycasting
  const pinMeshesRef = useRef([]);

  //variables to assist with selecting on the map
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryList, setShowCountryList] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  //assisting with being able to click on the actual country
  const [hoveredCountry, setHoveredCountry] = useState(null);
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
    controls.update();

    
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

    // Country pin locations (lat, lon) — now placed AFTER globe is created
    const countryPins = [
      // North America
      { name: 'United States', lat: 39.8, lon: -98.5, continent: 'North America' },
      { name: 'Canada', lat: 56.1, lon: -106.3, continent: 'North America' },
      { name: 'Mexico', lat: 23.6, lon: -102.5, continent: 'North America' },
      // South America
      { name: 'Brazil', lat: -14.2, lon: -51.9, continent: 'South America' },
      { name: 'Argentina', lat: -38.4, lon: -63.6, continent: 'South America' },
      { name: 'Colombia', lat: 4.5, lon: -74.3, continent: 'South America' },
      { name: 'Chile', lat: -35.7, lon: -71.5, continent: 'South America' },
      // Europe
      { name: 'United Kingdom', lat: 55.4, lon: -3.4, continent: 'Europe' },
      { name: 'France', lat: 46.2, lon: 2.2, continent: 'Europe' },
      { name: 'Germany', lat: 51.2, lon: 10.4, continent: 'Europe' },
      { name: 'Spain', lat: 40.5, lon: -3.7, continent: 'Europe' },
      { name: 'Italy', lat: 41.9, lon: 12.6, continent: 'Europe' },
      // Africa
      { name: 'South Africa', lat: -30.6, lon: 22.9, continent: 'Africa' },
      { name: 'Nigeria', lat: 9.1, lon: 8.7, continent: 'Africa' },
      { name: 'Kenya', lat: -0.02, lon: 37.9, continent: 'Africa' },
      { name: 'Egypt', lat: 26.8, lon: 30.8, continent: 'Africa' },
      // Asia
      { name: 'India', lat: 20.6, lon: 79.0, continent: 'Asia' },
      { name: 'China', lat: 35.9, lon: 104.2, continent: 'Asia' },
      { name: 'Japan', lat: 36.2, lon: 138.3, continent: 'Asia' },
      { name: 'South Korea', lat: 35.9, lon: 127.8, continent: 'Asia' },
      { name: 'Thailand', lat: 15.9, lon: 100.9, continent: 'Asia' },
      // Oceania
      { name: 'Australia', lat: -25.3, lon: 133.8, continent: 'Oceania' },
      { name: 'New Zealand', lat: -40.9, lon: 174.9, continent: 'Oceania' },
      { name: 'Fiji', lat: -17.7, lon: 178.0, continent: 'Oceania' },
    ];

    // Create pin meshes on the globe — globe now exists so we can attach to it
    const pinMeshes = [];
    const pinGroup = new THREE.Group();
    globe.add(pinGroup); // Attach to globe so pins rotate with it

    countryPins.forEach(pin => {
      const phi = (90 - pin.lat) * (Math.PI / 180);
      const theta = (pin.lon + 180) * (Math.PI / 180);

      const x = -1.02 * Math.sin(phi) * Math.cos(theta);
      const y = 1.02 * Math.cos(phi);
      const z = 1.02 * Math.sin(phi) * Math.sin(theta);

      // Find continent color
      const cont = continents.find(c => c.name === pin.continent);
      const pinColor = cont ? cont.color : '#ff00ff';

      // Pin stem (thin cylinder)
      const stemGeometry = new THREE.CylinderGeometry(0.003, 0.003, 0.06, 6);
      const stemMaterial = new THREE.MeshBasicMaterial({ color: pinColor });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);

      // Pin head (sphere)
      const headGeometry = new THREE.SphereGeometry(0.018, 12, 12);
      const headMaterial = new THREE.MeshBasicMaterial({
        color: pinColor,
        transparent: true,
        opacity: 0.95
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 0.045; // On top of the stem

      // Glow ring around head
      const glowGeometry = new THREE.RingGeometry(0.02, 0.035, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: pinColor,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.y = 0.045;

      // Group the pin parts
      const pinMesh = new THREE.Group();
      pinMesh.add(stem);
      pinMesh.add(head);
      pinMesh.add(glow);

      // Position on globe surface
      pinMesh.position.set(x, y, z);

      // Orient pin to point outward from globe center
      pinMesh.lookAt(0, 0, 0);
      pinMesh.rotateX(Math.PI / 2); // Align cylinder upward from surface

      // Store data for raycasting
      pinMesh.userData = {
        isPin: true,
        countryName: pin.name,
        continentName: pin.continent
      };

      // Also tag each child so raycaster can find the parent
      pinMesh.children.forEach(child => {
        child.userData = {
          isPin: true,
          countryName: pin.name,
          continentName: pin.continent
        };
      });

      pinGroup.add(pinMesh);
      // Push the head and stem (clickable parts) into our array for raycasting
      pinMeshes.push(head);
      pinMeshes.push(stem);
    });

    // Store pin meshes in ref so click handler can access them
    pinMeshesRef.current = pinMeshes;

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
          // Draw the visible border line 
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.6,
            linewidth: 2
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          line.userData.countryName = countryName;
          group.add(line);

          // Store border reference for hover highlighting
          if (!countryBordersRef.current.has(countryName)) {
            countryBordersRef.current.set(countryName, []);
          }
          countryBordersRef.current.get(countryName).push(line);

          //Create a clickable filled mesh using triangulation
          try {
            
            // Calculate centroid of the points
            const centroid = new THREE.Vector3(0, 0, 0);
            points.forEach(p => centroid.add(p));
            centroid.divideScalar(points.length);
            // Push centroid outward to globe surface
            centroid.normalize().multiplyScalar(1.015);

            const vertices = [];
            const indices = [];

            // Add centroid as vertex 0
            vertices.push(centroid.x, centroid.y, centroid.z);

            // Add all polygon points
            points.forEach(p => {
              vertices.push(p.x, p.y, p.z);
            });

            // Create fan triangles from centroid to each edge
            for (let i = 1; i < points.length; i++) {
              indices.push(0, i, i + 1);
            }
            // Close the fan
            indices.push(0, points.length, 1);

            const meshGeometry = new THREE.BufferGeometry();
            meshGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            meshGeometry.setIndex(indices);
            meshGeometry.computeVertexNormals();

            const meshMaterial = new THREE.MeshBasicMaterial({
              color: 0xff00ff,
              transparent: true,
              opacity: 0.0,      
              side: THREE.DoubleSide,
              depthWrite: false
            });

            const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
            mesh.userData.isCountry = true;
            mesh.userData.countryName = countryName;
            group.add(mesh);

            // Store reference for raycasting
            countryMeshesRef.current.push(mesh);
          } catch (e) {
            
            console.warn('Could not create mesh for', countryName, e);
          }
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

    //handle the mouse movement
    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    // Click handler — checks BOTH pins and country meshes
    const handleClick = (e) => {
      // Update mouse position
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      // First check pins (they sit on top of the globe, so check them first)
      const pinIntersects = raycasterRef.current.intersectObjects(pinMeshesRef.current, true);

      if (pinIntersects.length > 0) {
        const hit = pinIntersects[0].object;
        const countryName = hit.userData.countryName;
        const continentName = hit.userData.continentName;

        if (countryName) {
          console.log('Clicked pin:', countryName, continentName);

          const foundContinent = continents.find(c => c.name === continentName);
          const foundCountry = foundContinent?.countries.find(c => c.name === countryName);

          if (foundContinent && foundCountry) {
            // Open the search modal directly for this country
            setSelectedContinent(foundContinent);
            setSelectedCountry(foundCountry);
            setSelectedCity('');
            setShowResults(false);
            setSearchCriteria({ role: '', experience: '', specialty: '' });
            setShowSearchModal(true);
          }
          return; // Pin was clicked, don't also check country meshes
        }
      }

      // If no pin was hit, check country meshes as fallback
      const countryIntersects = raycasterRef.current.intersectObjects(countryMeshesRef.current);

      if (countryIntersects.length > 0) {
        const clickedMesh = countryIntersects[0].object;
        if (clickedMesh.userData.isCountry) {
          const countryName = clickedMesh.userData.countryName;
          console.log('Clicked country:', countryName);

          // Find which continent this country belongs to
          let foundContinent = null;
          let foundCountry = null;

          for (const continent of continents) {
            const country = continent.countries.find(c => 
              countryName.toLowerCase().includes(c.name.toLowerCase()) ||
              c.name.toLowerCase().includes(countryName.toLowerCase())
            );
            if (country) {
              foundContinent = continent;
              foundCountry = country;
              break;
            }
          }

          if (foundContinent && foundCountry) {
            // Open the search modal directly for this country
            setSelectedContinent(foundContinent);
            setSelectedCountry(foundCountry);
            setSelectedCity('');
            setShowResults(false);
            setSearchCriteria({ role: '', experience: '', specialty: '' });
            setShowSearchModal(true);
          } else {
            // Country exists in GeoJSON but not in our continents data
            console.log(`${countryName} not in talent database yet`);
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    //adding an event listener for it 
    window.addEventListener('mousemove', handleMouseMove);

    // Hover function — checks both pins and country meshes
    function checkHover() {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      // First check pin hover
      const pinIntersects = raycasterRef.current.intersectObjects(pinMeshesRef.current, true);

      // Reset all pins to normal scale
      pinMeshesRef.current.forEach(mesh => {
        if (mesh.geometry.type === 'SphereGeometry') {
          mesh.scale.set(1, 1, 1);
        }
      });

      // Reset all country borders to default (cyan)
      countryBordersRef.current.forEach((borders) => {
        borders.forEach(border => {
          border.material.color.setHex(0x00ffff); // Cyan
          border.material.opacity = 0.6;
        });
      });

      // Check if hovering over a pin
      if (pinIntersects.length > 0) {
        const hit = pinIntersects[0].object;
        if (hit.userData.isPin) {
          // Scale up the pin head on hover
          if (hit.geometry.type === 'SphereGeometry') {
            hit.scale.set(1.5, 1.5, 1.5);
          }
          setHoveredCountry(hit.userData.countryName);
          renderer.domElement.style.cursor = 'pointer';
          return; // Pin hover takes priority, skip country mesh check
        }
      }

      // If no pin hovered, check country meshes
      const countryIntersects = raycasterRef.current.intersectObjects(countryMeshesRef.current);

      if (countryIntersects.length > 0) {
        const hoveredMesh = countryIntersects[0].object;
        if (hoveredMesh.userData.isCountry) {
          const countryName = hoveredMesh.userData.countryName;
          
          // Make country borders glow GREEN
          const borders = countryBordersRef.current.get(countryName);
          if (borders) {
            borders.forEach(border => {
              border.material.color.setHex(0x00ff00); // Green glow
              border.material.opacity = 1.0; // Full brightness
            });
          }
          
          setHoveredCountry(countryName);
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        setHoveredCountry(null);
        renderer.domElement.style.cursor = 'grab';
      }
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
      checkHover();
      
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
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);

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

        {/* Controls Info — moved to top, under subtitle */}
        <div className="text-center mt-2">
          <div className="inline-block bg-[rgba(26,0,51,0.9)] border border-fuchsia-500/40 px-6 py-2 backdrop-blur-lg rounded">
            <p className="text-xs md:text-sm tracking-wider text-fuchsia-400">
              🖱️ DRAG TO ROTATE • 🔍 SCROLL TO ZOOM • 📍 CLICK A COUNTRY TO FIND TALENT
            </p>
          </div>
        </div>
      </div>

      
      {/* Three.js Canvas */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0" 
        style={{ 
          width: '100vw', 
          height: '100vh'
        }} 
      />

      {/* Country name tooltip on hover */}
      {hoveredCountry && (
        <div 
          className="fixed z-[200] pointer-events-none px-3 py-1.5 rounded text-sm font-bold tracking-wider"
          style={{
            left: '50%',
            bottom: '40px',
            transform: 'translateX(-50%)',
            background: 'rgba(26, 0, 51, 0.95)',
            border: '1px solid #ff00ff',
            color: '#f0abfc',
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)'
          }}
        >
          📍 {hoveredCountry}
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