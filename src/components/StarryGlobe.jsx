import React, {useState, useEffect, useRef} from 'react';
import './globe.css';

const StarryGlobe = () => {
    const [stars, setStars] = useState([]);
    const[hoveredStar, setHoveredStar] = useState(null);
    const[namedStars, setNamedStars] = useState({});
    const[showNameInput, setShowNameInput] = useState(null);
    const[nameInput, setNameInput] = useState('');
    const[globeActive, setGlobeActive] = useState(false);
    const[globeRotation, setGlobeRotation] = useState(0);
    const[selectedContinent, setSelectedContinent] = useState(null);
    const[selectedCountry, setSelectedCountry] = useState(null);
    const[showCountryList, setShowCountryList] = useState(false);
    const[showSearchModal, setShowSearchModal] = useState(false);
    const[searchCriteria, setSearchCriteria] = useState({ 
      role: '', 
      experience: '', 
      specialty: ''
    });
  const[isTransitioning, setIsTransitioning] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const rotationRef = useRef(0);


    // Generate stars with cinematic positioning

    useEffect(() => {
        const generateStars = Array.from({length : 200}, (_, i) => ({


            id: i, 
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2.5 + 0.5,
            opacity : Math.random() * 0.6 + 0.4, 
            twinkleSpeed: Math.random() * 3 + 2,
            delay: Math.random() * 2
        }));
        setStars(generateStars);

    }, []);

    // Handle star interactions
    const handleStarClick = (starId) => {
        if (!namedStars[starId]) {
            setShowNameInput(starId);
        }
    };

    const handleNameSubmit = (starId) => {
        if (nameInput.trim()) {
            setNamedStars(prev => ({...prev, [starId] : nameInput.trim() }));
            setNameInput('');
            setShowNameInput(null);
        }
    };

    const handleMouseDown = (e) => {
        if (globeActive) {
            setIsDragging(true);
            setDragStart(e.clientX);
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const delta = e.clientX - dragStart;
            rotationRef.current += delta * 0.5;
            setGlobeRotation(rotationRef.current);
            setDragStart(e.clientX);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            };
        
        }
    }, [isDragging, dragStart]);


    // example of continent data structure with angles for rotation and colors for glow effects
    const continents = [
        {
            name: 'North America',
            angle: 0, 
            color: '#f59e0b',
            countries: ['United States', 'Canada', 'Mexico']
        
        },
        {
            name: 'South America', 
            angle : 60, 
            color: '#00ffea',
            countries : ['Brazil', 'Argentina', 'Colombia', 'Chile' ]
        },
        {
            name: 'Europe', 
            angle: 120,
            color: '#0088ff',
            countries: ['United Kingdom', 'France', 'Germany', 'Spain', 'Italy']
        }, 
        {
            name: 'Africa', 
            angle: 180,
            color: '#00d4ff',
            countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt']

        }, 
        {
            name: 'Asia', 
            angle: 240,
            color: '#00aaff',
            countries: ['India', 'China', 'Japan', 'South Korea', 'Thailand']

        }


    ];

    //setting up the different roles that could possibly be there
    const talentRoles = [
        'Actor/Actress', 
        'Director', 
        'Producer', 
        'ScreenWriter', 
        'Cinematographer', 
        'Editor', 
        'Production Designer', 
        'Casting Director', 
        'Talent Manager', 
        'Agent'
    ];


    const handleGlobeClick = () => {
        setGlobeActive(true);
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const handleContinentSelect = (continent) => {
        setSelectedContinent(continent);
        setShowCountryList(true);
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setShowCountryList(false);
        setShowSearchModal(true);
    };

    const getVisbleContinent = () => {
        const normalizedRotation = ((globeRotation % 360) + 360) % 360;
        return continents.find(c => {

            const diff = Math.abs(normalizedRotation - c.angle);
            return diff < 30 || diff > 330;
        });
    };

    const visibleContinent = globeActive ? getVisbleContinent() : null;

  return (
    <div className="cinema-container">
      {/* Starfield background */}
      <div className="stars-container">
        {stars.map((star) => {
          const isHovered = hoveredStar === star.id;
          const isNamed = namedStars[star.id];
          
          return (
            <div
              key={star.id}
              className={`star ${isHovered ? 'star-hovered' : ''} ${isNamed ? 'star-named' : ''}`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDuration: `${star.twinkleSpeed}s`,
                animationDelay: `${star.delay}s`,
                '--glow-intensity': star.glowIntensity
              }}
              onMouseEnter={() => setHoveredStar(star.id)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => handleStarClick(star.id)}
            >
              {isNamed && isHovered && (
                <div className="star-tooltip">
                  ⭐ {namedStars[star.id]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main content area */}
      {!globeActive && !isTransitioning ? (
        <div className="main-screen">
          {/* Cinema header */}
          <div className="cinema-header">
            <div className="cinema-icons">
              <div className="icon-light">
                <div className="light-core"></div>
                <div className="light-beam"></div>
              </div>
              
              <h1 className="cinema-title">
                <span className="title-word">LIGHTS</span>
                <span className="title-separator">•</span>
                <span className="title-word">CAMERA</span>
                <span className="title-separator">•</span>
                <span className="title-word">ACTION</span>
              </h1>
              
              <div className="icon-camera">
                <div className="camera-body"></div>
                <div className="camera-lens"></div>
              </div>
            </div>
            
            <p className="cinema-subtitle">CONNECTING TALENT WORLDWIDE</p>
          </div>

          {/* Globe display */}
          <div className={`globe-wrapper ${isTransitioning ? 'transitioning' : ''}`}>
            <div className="globe-spotlight"></div>
            
            <div className="globe-container" onClick={handleGlobeClick}>
              <div className="globe">
                {/* Globe grid lines */}
                <svg className="globe-grid" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="gridGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0088ff" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  
                  {/* Latitude lines */}
                  <circle cx="200" cy="200" r="190" fill="none" stroke="url(#gridGlow)" strokeWidth="2" />
                  <ellipse cx="200" cy="200" rx="190" ry="95" fill="none" stroke="url(#gridGlow)" strokeWidth="1.5" />
                  <ellipse cx="200" cy="200" rx="190" ry="140" fill="none" stroke="url(#gridGlow)" strokeWidth="1.5" />
                  
                  {/* Longitude lines */}
                  <line x1="200" y1="10" x2="200" y2="390" stroke="url(#gridGlow)" strokeWidth="2" />
                  <ellipse cx="200" cy="200" rx="95" ry="190" fill="none" stroke="url(#gridGlow)" strokeWidth="1.5" />
                  <ellipse cx="200" cy="200" rx="140" ry="190" fill="none" stroke="url(#gridGlow)" strokeWidth="1.5" />
                </svg>

                {/* Continents glow effect */}
                <div className="continents-layer">
                  <div className="continent-glow continent-1"></div>
                  <div className="continent-glow continent-2"></div>
                  <div className="continent-glow continent-3"></div>
                  <div className="continent-glow continent-4"></div>
                  <div className="continent-glow continent-5"></div>
                </div>

                {/* Shimmer effect */}
                <div className="globe-shimmer"></div>
              </div>

              {/* Studios banner */}
              <div className={`studios-banner ${isTransitioning ? 'transitioning' : ''}`}>
                <div className="banner-content">GLOBAL STUDIOS</div>
              </div>
            </div>

            <div className="click-prompt">
              <div className="clapperboard">
                <div className="clapper-top"></div>
                <div className="clapper-bottom"></div>
              </div>
              <p>CLICK TO EXPLORE</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Interactive spinning globe */}
      {globeActive && !isTransitioning ? (
        <div className="interactive-screen">
            <div className="interactive-header">
            <h2>FIND YOUR TALENT</h2>
            <p>Drag to rotate • Click continent to search</p>
            </div>

            <div 
            className={`interactive-globe-container ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
            >
            <div
                className="interactive-globe"
                style={{
                transform: `perspective(1000px) rotateY(${globeRotation}deg)`
                }}
            >
                {/* Rotating continents */}
                <div className="globe-continents">
                {continents.map((continent) => {
                    const isVisible = visibleContinent?.name === continent.name;
                    const rotation = continent.angle - globeRotation;
                    const normalizedRot = ((rotation % 360) + 360) % 360;
                    const opacity = Math.cos((normalizedRot * Math.PI) / 180);
                    const isInFront = opacity > 0;

                    return (
                    <div
                        key={continent.name}
                        className={`continent-marker ${isInFront ? 'in-front' : ''} ${isVisible ? 'visible' : ''}`}
                        style={{
                        transform: `rotateY(${continent.angle}deg) translateZ(200px)`,
                        opacity: isInFront ? Math.max(opacity, 0.3) : 0,
                        '--continent-color': continent.color
                        }}
                        onClick={() => isInFront && handleContinentSelect(continent)}
                    >
                        <div className="continent-glow-marker"></div>
                    </div>
                    );
                })}

                {/* Grid overlay */}
                <svg className="globe-grid interactive" viewBox="0 0 400 400">
                    <defs>
                    <linearGradient id="gridActive" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00ffea" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#0088ff" stopOpacity="0.5" />
                    </linearGradient>
                    </defs>
                    
                    {[...Array(8)].map((_, i) => (
                    <circle 
                        key={`lat-${i}`}
                        cx="200" 
                        cy="200" 
                        r={40 + i * 24} 
                        fill="none" 
                        stroke="url(#gridActive)" 
                        strokeWidth="1.5" 
                    />
                    ))}
                    {[...Array(12)].map((_, i) => (
                    <line
                        key={`long-${i}`}
                        x1="200"
                        y1="40"
                        x2="200"
                        y2="360"
                        stroke="url(#gridActive)"
                        strokeWidth="1"
                        transform={`rotate(${i * 30} 200 200)`}
                    />
                    ))}
                </svg>
                </div>
            </div>

            {/* Studios banner on active globe */}
            <div className="studios-banner active">
                <div className="banner-content">GLOBAL STUDIOS</div>
            </div>

            {/* Current continent label */}
            {visibleContinent && (
                <div className="continent-label">
                <h3>{visibleContinent.name}</h3>
                <p>CLICK TO SEARCH</p>
                </div>
            )}

            {/* Country list popup */}
            {showCountryList && selectedContinent && (
                <div 
                className="country-list"
                style={{ 
                    '--continent-color': selectedContinent.color,
                    borderColor: selectedContinent.color
                }}
                >
                <h3 style={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '24px',
                    color: selectedContinent.color,
                    marginBottom: '16px',
                    textShadow: `0 0 20px ${selectedContinent.color}`
                }}>
                    SELECT COUNTRY IN {selectedContinent.name.toUpperCase()}
                </h3>
                {selectedContinent.countries.map(country => (
                    <div
                    key={country}
                    className="country-item"
                    onClick={() => handleCountrySelect(country)}
                    >
                    {country}
                    </div>
                ))}
                <button
                    className="btn-secondary"
                    style={{ gridColumn: '1 / -1', marginTop: '8px' }}
                    onClick={() => setShowCountryList(false)}
                >
                    CANCEL
                </button>
                </div>
            )}
            </div>

            <button className="back-button" onClick={() => {
            console.log('Going back to main screen');
            setGlobeActive(false);
            setSelectedContinent(null);
            setShowCountryList(false);
            }}>
            ← BACK TO MAIN
            </button>
        </div>
        ) : null}
            

      {/* Star naming modal */}
      {showNameInput !== null && (
        <div className="modal-overlay">
          <div className="modal star-modal">
            <h3>NAME YOUR STAR</h3>
            <p className="modal-subtitle">JOIN THE CONSTELLATION OF TALENT</p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit(showNameInput)}
              placeholder="Your name"
              autoFocus
            />
            <div className="modal-buttons">
              <button className="btn-primary" onClick={() => handleNameSubmit(showNameInput)}>
                CONFIRM
              </button>
              <button className="btn-secondary" onClick={() => {
                setShowNameInput(null);
                setNameInput('');
              }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Talent search modal */}
      {showSearchModal && selectedContinent && selectedCountry && (
        <div className="modal-overlay">
          <div className="modal search-modal">
            <div className="modal-header">
              <h3>FIND TALENT IN</h3>
              <h4 style={{ color: selectedContinent.color }}>
                {selectedCountry}, {selectedContinent.name}
              </h4>
              <p className="modal-subtitle" style={{ marginTop: '16px', fontSize: '14px' }}>
                What type of professional are you looking for?
              </p>
            </div>

            <div className="search-form">
              <div className="form-group">
                <label>I'M LOOKING FOR A</label>
                <select
                  value={searchCriteria.role}
                  onChange={(e) => setSearchCriteria({...searchCriteria, role: e.target.value})}
                >
                  <option value="">Select role...</option>
                  {talentRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>EXPERIENCE LEVEL</label>
                <select
                  value={searchCriteria.experience}
                  onChange={(e) => setSearchCriteria({...searchCriteria, experience: e.target.value})}
                >
                  <option value="">Select experience...</option>
                  <option value="emerging">Emerging Talent (0-2 years)</option>
                  <option value="professional">Professional (3-7 years)</option>
                  <option value="veteran">Veteran (8-15 years)</option>
                  <option value="legendary">Legendary (15+ years)</option>
                </select>
              </div>

              <div className="form-group">
                <label>SPECIALTY / GENRE</label>
                <input
                  type="text"
                  value={searchCriteria.specialty}
                  onChange={(e) => setSearchCriteria({...searchCriteria, specialty: e.target.value})}
                  placeholder="e.g., Action, Drama, Horror, Documentary..."
                />
              </div>
            </div>

            <div className="modal-buttons">
              <button 
                className="btn-primary search-btn"
                onClick={() => {
                  console.log('Searching for:', searchCriteria, 'in', selectedCountry, selectedContinent.name);
                  setShowSearchModal(false);
                  setSelectedCountry(null);
                }}
              >
                🎬 START SEARCH
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowSearchModal(false);
                  setSelectedCountry(null);
                  setSearchCriteria({ role: '', experience: '', specialty: '' });
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarryGlobe;


// import { useEffect, useState, useRef } from "react";

// // const GlobalStudios = () => {
//     // setting up the variables 
//     const [stars, setStars] = useState([]);
//     const [rotation, setRotation] = useState(0);
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragStart, setDragStart] = useState(0);
//     const rotationRef = useRef(0);

    
//     // UI setup
//     const[showWelcome, setShowWelcome] = useState(true);
//     const[selectedContinent, setSelectedContinent] = useState(null);
//     const[selectedCountry, setSelectedCountry] = useState(null);
//     const[showCountryList, setShowCountryList] = useState(false);
//     const[showSearchModal, setShowSearchModal] = useState(false);
//     const [showCritera, setSearchCriteria] = useState({ 
//         role: '', 
//         experience: '', 
//         specialty: ''
//     });


//     //can set up contient data later on 


//     //talent roles can set that up later


//     //generating the stars 
//     useEffect(() => {
//         const generateStars = Array.from({ length: 300}, (_,i) => ({
//             id : i, 
//             x: Math.random() * 100,
//             y: Math.random() * 100,
//             size: Math.random() * 3 + 0.5,
//             opacity : Math.random() * 0.8 + 0.2, 
//             twinkleSpeed: Math.random() * 34+ 2,
//             delay: Math.random() * 3,
//             color: i % 3 === 0 ? '#ff00ff' : i % 3 === 0 ? '#ff006e' : '#a855f7'
//         }));
//         setStars(generateStars);
//     }, []);


//     //handling the drag 

//     const handleMouseDown = (e) => {
//         setIsDragging(true);
//         setDragStart(e.clientX);
//     };

//     const handleMouseMove = (e) => {
//         if (isDragging) {
//             const delta = e.clientX - dragStart;
//             rotationRef.current += delta * 0.5;
//             setDragStart(e.clientX);
//         }
//     };

//     const handleMouseUp = () => {
//         setIsDragging(false);
//     }

//     useEffect(() => {
//         if (isDragging) {
//             window.addEventListener('mousemove', handleMouseMove);
//             window.addEventListener('mouseup', handleMouseUp);
//             return () => {
//                 window.removeEventListener('mousemove', handleMouseMove);
//                 window.removeEventListener('mouseup', handleMouseUp);
//             };
//         }

//     }, [isDragging, dragStart]);

//     //calculations of how the continents can show (can show up later on)


//     //handlers
//     const handleContinentSelect = (continent) => {
//         setSelectedContinent(continent);
//         setShowCountryList(true);
//     };

//     const handleCountrySelect = (country) => {
//         setSelectedCountry(country);
//         setShowCountryList(false);
//         setShowSearchModal(true);
//     };

//     const handleSearch = () => {
//         console.log('Searching: ', setSearchCriteria, 'in', selectedCountry, selectedContinent?.name);
//         setShowSearchModal(false);
//         setSelectedCountry(null);
//         setSearchCriteria({
//             role : '', 
//             experience: '', 
//             specialty: ''

//         });
//     };

//     //render 
//     // return (
//     //     <div style 
//     // )




    



    
// }

// export default GlobalStudios;

