
// Mock data layer — works without Supabase.
// When ready, uncomment Supabase queries.

const MOCK_PROFILES = [
  // ── NORTH AMERICA ──
  {
    id: '1', name: 'Aria Chen', role: 'Director', experience: 'veteran', specialty: 'Sci-Fi, Drama',
    city: 'Los Angeles', country: 'United States', continent: 'North America',
    bio: 'Award-winning director with over 12 years of experience in sci-fi and dramatic storytelling. Known for blending visual effects with deeply human narratives.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/ariachen', instagram: 'https://instagram.com/ariachen',
    email: 'aria.chen@email.com', website: 'https://ariachen.com',
    credits: ['Neon Horizon (2024)', 'The Last Signal (2022)', 'Echoes of Tomorrow (2020)'], years_active: 12,
  },
  {
    id: '2', name: 'Jamal Williams', role: 'Cinematographer', experience: 'professional', specialty: 'Action, Thriller',
    city: 'Atlanta', country: 'United States', continent: 'North America',
    bio: 'Cinematographer specializing in high-energy action sequences and moody thriller aesthetics.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/jamalwilliams', instagram: 'https://instagram.com/jamalwilliams_dp',
    email: 'jamal.w@email.com', website: null,
    credits: ['Velocity (2024)', 'Dark Current (2023)', 'Street Kings (2022)'], years_active: 5,
  },
  {
    id: '3', name: 'Marcus Thompson', role: 'Actor/Actress', experience: 'professional', specialty: 'Drama, Comedy',
    city: 'New York', country: 'United States', continent: 'North America',
    bio: 'Stage-trained actor with Broadway credits and a growing film career.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/marcusthompson', instagram: 'https://instagram.com/marcusacts',
    email: 'marcus.t@email.com', website: null,
    credits: ['City Lights (2024)', 'Broadway: The Visit (2023)'], years_active: 6,
  },
  {
    id: '4', name: 'Rachel Kim', role: 'Editor', experience: 'emerging', specialty: 'Drama, Indie',
    city: 'Chicago', country: 'United States', continent: 'North America',
    bio: 'Up-and-coming editor with a sharp instinct for pacing and narrative rhythm.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/rachelcuts',
    email: 'rachel.kim@email.com', website: null,
    credits: ['Rust Belt Stories (2024 — short)'], years_active: 1,
  },
  {
    id: '5', name: 'Sophie Tremblay', role: 'Producer', experience: 'veteran', specialty: 'Drama, Documentary',
    city: 'Toronto', country: 'Canada', continent: 'North America',
    bio: 'Independent producer with multiple TIFF selections and a passion for socially conscious storytelling.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/sophietremblay', instagram: null,
    email: 'sophie@tremblayfilms.ca', website: 'https://tremblayfilms.ca',
    credits: ['Northern Voices (2024)', 'The Weight of Snow (2022)'], years_active: 10,
  },
  {
    id: '6', name: 'Jean-Luc Beaumont', role: 'Cinematographer', experience: 'professional', specialty: 'Drama, Romance',
    city: 'Montreal', country: 'Canada', continent: 'North America',
    bio: 'French-Canadian cinematographer known for intimate, naturalistic lighting.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/jlbeaumont', instagram: null,
    email: 'jl@beaumont.ca', website: null,
    credits: ['Lumière d\'Hiver (2024)', 'Still Waters (2023)'], years_active: 5,
  },
  {
    id: '7', name: 'Sofia Reyes', role: 'Producer', experience: 'legendary', specialty: 'Drama, Documentary',
    city: 'Mexico City', country: 'Mexico', continent: 'North America',
    bio: 'Executive producer with 18+ years shaping Latin American cinema. Multiple festival selections including Cannes and Toronto.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/sofiareyes', instagram: null,
    email: 'sofia@reyesproductions.com', website: 'https://reyesproductions.com',
    credits: ['Tierra Prometida (2024)', 'Voices Unheard (2021)', 'The Border Within (2019)'], years_active: 18,
  },
  {
    id: '8', name: 'Carlos Vega', role: 'Director', experience: 'professional', specialty: 'Action, Thriller',
    city: 'Guadalajara', country: 'Mexico', continent: 'North America',
    bio: 'Action director with a unique visual style blending Mexican culture with modern thriller aesthetics.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/carlosvegafilm',
    email: 'carlos@vegafilms.mx', website: null,
    credits: ['Fuego Cruzado (2024)', 'La Sombra (2023)'], years_active: 7,
  },

  // ── SOUTH AMERICA ──
  {
    id: '9', name: 'Lucas Ferreira', role: 'Director', experience: 'veteran', specialty: 'Drama, Sci-Fi',
    city: 'São Paulo', country: 'Brazil', continent: 'South America',
    bio: 'Visionary director pushing the boundaries of Brazilian cinema with genre-bending narratives.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/lucasferreira', instagram: 'https://instagram.com/lucasferreira',
    email: 'lucas@ferreirafilms.br', website: null,
    credits: ['Horizonte (2024)', 'Nova Terra (2022)'], years_active: 9,
  },
  {
    id: '10', name: 'Camila Santos', role: 'Actor/Actress', experience: 'professional', specialty: 'Drama, Romance',
    city: 'Rio de Janeiro', country: 'Brazil', continent: 'South America',
    bio: 'Acclaimed actress known for emotional depth and range across film and television.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/camilasantos',
    email: 'camila.santos@email.com', website: null,
    credits: ['Amor e Fúria (2024)', 'Maré Alta (2023)'], years_active: 6,
  },
  {
    id: '11', name: 'Martín López', role: 'Screenwriter', experience: 'veteran', specialty: 'Drama, Thriller',
    city: 'Buenos Aires', country: 'Argentina', continent: 'South America',
    bio: 'Screenwriter behind some of Argentina\'s most celebrated thrillers of the past decade.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/martinlopez', instagram: null,
    email: 'martin@lopezwrites.ar', website: null,
    credits: ['El Silencio (2024)', 'Sombras del Sur (2022)'], years_active: 11,
  },
  {
    id: '12', name: 'Valentina Ruiz', role: 'Producer', experience: 'professional', specialty: 'Documentary, Drama',
    city: 'Bogotá', country: 'Colombia', continent: 'South America',
    bio: 'Documentary producer focused on Latin American social issues and cultural stories.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/valentinaruiz', instagram: null,
    email: 'valentina@ruizprod.co', website: null,
    credits: ['Voces del Río (2024)', 'Medellín Rising (2023)'], years_active: 5,
  },
  {
    id: '13', name: 'Diego Morales', role: 'Cinematographer', experience: 'emerging', specialty: 'Documentary',
    city: 'Santiago', country: 'Chile', continent: 'South America',
    bio: 'Young cinematographer capturing Chile\'s landscapes and urban stories with a fresh eye.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/diegomorales_dp',
    email: 'diego.morales@email.com', website: null,
    credits: ['Andes (2024 — short)'], years_active: 2,
  },

  // ── EUROPE ──
  {
    id: '14', name: "Liam O'Brien", role: 'Actor/Actress', experience: 'professional', specialty: 'Comedy, Drama',
    city: 'London', country: 'United Kingdom', continent: 'Europe',
    bio: 'Versatile actor trained at RADA, known for both comedic timing and dramatic depth.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/liamobrien-actor', instagram: 'https://instagram.com/liamobrienofficial',
    email: 'liam.obrien@agency.com', website: null,
    credits: ['The Understudy (2024)', 'Bright Side (2023)', 'West End: Hamlet (2022)'], years_active: 6,
  },
  {
    id: '15', name: 'Emily Clarke', role: 'Screenwriter', experience: 'veteran', specialty: 'Drama, Horror',
    city: 'Manchester', country: 'United Kingdom', continent: 'Europe',
    bio: 'BAFTA-nominated screenwriter known for psychologically intense scripts.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/emilyclarke', instagram: null,
    email: 'emily@clarkescripts.co.uk', website: 'https://clarkescripts.co.uk',
    credits: ['Dark Hollow (2024)', 'The Reckoning (2022)'], years_active: 10,
  },
  {
    id: '16', name: 'Pierre Dubois', role: 'Director', experience: 'legendary', specialty: 'Drama, Romance',
    city: 'Paris', country: 'France', continent: 'Europe',
    bio: 'Cannes Palme d\'Or nominated director with a career spanning two decades of French cinema.',
    avatar_url: null, linkedin: null, instagram: null,
    email: 'pierre@duboisfilms.fr', website: 'https://duboisfilms.fr',
    credits: ['Le Dernier Été (2024)', 'Rivière de Lumière (2021)'], years_active: 22,
  },
  {
    id: '17', name: 'Emma Larsson', role: 'Casting Director', experience: 'professional', specialty: 'Drama, Indie',
    city: 'Berlin', country: 'Germany', continent: 'Europe',
    bio: 'Berlin-based casting director working across European independent cinema.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/emmalarsson', instagram: null,
    email: 'emma@larssoncast.de', website: 'https://larssoncast.de',
    credits: ['Silent Hours (2024)', 'The Weight of Light (2023)'], years_active: 4,
  },
  {
    id: '18', name: 'Hans Mueller', role: 'Production Designer', experience: 'veteran', specialty: 'Sci-Fi, Action',
    city: 'Munich', country: 'Germany', continent: 'Europe',
    bio: 'Production designer known for creating immersive, large-scale environments for genre films.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/hansmueller', instagram: null,
    email: 'hans@muellerdesign.de', website: null,
    credits: ['Cyber Dawn (2024)', 'Fortress (2022)'], years_active: 12,
  },
  {
    id: '19', name: 'Isabel Navarro', role: 'Actor/Actress', experience: 'professional', specialty: 'Drama, Thriller',
    city: 'Madrid', country: 'Spain', continent: 'Europe',
    bio: 'Rising Spanish actress with a Goya nomination and growing international presence.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/isabelnavarro',
    email: 'isabel@navarro.es', website: null,
    credits: ['La Verdad Oculta (2024)', 'Barcelona Noir (2023)'], years_active: 5,
  },
  {
    id: '20', name: 'Marco Rossi', role: 'Cinematographer', experience: 'veteran', specialty: 'Drama, Romance',
    city: 'Rome', country: 'Italy', continent: 'Europe',
    bio: 'Italian cinematographer celebrated for painterly compositions and warm natural lighting.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/marcorossi', instagram: 'https://instagram.com/marcorossi_dp',
    email: 'marco@rossivisuals.it', website: null,
    credits: ['La Dolce Notte (2024)', 'Roman Summer (2022)'], years_active: 14,
  },
  {
    id: '21', name: 'Giulia Bianchi', role: 'Editor', experience: 'professional', specialty: 'Comedy, Drama',
    city: 'Milan', country: 'Italy', continent: 'Europe',
    bio: 'Editor with a gift for comedic timing and fluid dramatic pacing.',
    avatar_url: null, linkedin: null, instagram: null,
    email: 'giulia.bianchi@email.it', website: null,
    credits: ['Amore Mio (2024)', 'Milano Stories (2023)'], years_active: 4,
  },

  // ── AFRICA ──
  {
    id: '22', name: 'Thandi Nkosi', role: 'Director', experience: 'professional', specialty: 'Drama, Documentary',
    city: 'Cape Town', country: 'South Africa', continent: 'Africa',
    bio: 'South African director telling powerful stories about identity and resilience.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/thandinkosifilm', instagram: 'https://instagram.com/thandinkosifilm',
    email: 'thandi@nkosifilms.co.za', website: null,
    credits: ['Ubuntu (2024)', 'Table Mountain (2023)'], years_active: 6,
  },
  {
    id: '23', name: 'Kofi Mensah', role: 'Editor', experience: 'emerging', specialty: 'Documentary, Drama',
    city: 'Lagos', country: 'Nigeria', continent: 'Africa',
    bio: 'Emerging editor with a keen eye for pacing. Recent graduate of the Lagos Film Academy.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/kofimensah', instagram: 'https://instagram.com/kofiedits',
    email: 'kofi.mensah@email.com', website: null,
    credits: ['New Lagos (2024 — short)', 'Roots (2024 — documentary)'], years_active: 1,
  },
  {
    id: '24', name: 'Amina Okafor', role: 'Producer', experience: 'veteran', specialty: 'Drama, Comedy',
    city: 'Lagos', country: 'Nigeria', continent: 'Africa',
    bio: 'Nollywood producer with a track record of commercially successful and critically acclaimed films.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/aminaokafor', instagram: null,
    email: 'amina@okaforproductions.ng', website: null,
    credits: ['Eko Rising (2024)', 'Lagos Love (2023)', 'Market Day (2021)'], years_active: 9,
  },
  {
    id: '25', name: 'James Mwangi', role: 'Screenwriter', experience: 'professional', specialty: 'Thriller, Drama',
    city: 'Nairobi', country: 'Kenya', continent: 'Africa',
    bio: 'Kenyan screenwriter crafting suspenseful narratives rooted in East African culture.',
    avatar_url: null, linkedin: null, instagram: null,
    email: 'james.mwangi@email.com', website: null,
    credits: ['Nairobi Nights (2024)', 'Safari (2023)'], years_active: 4,
  },
  {
    id: '26', name: 'Layla Hassan', role: 'Director', experience: 'veteran', specialty: 'Drama, Documentary',
    city: 'Cairo', country: 'Egypt', continent: 'Africa',
    bio: 'Egyptian director exploring themes of history, identity, and modern life along the Nile.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/laylahassan', instagram: 'https://instagram.com/laylahassanfilm',
    email: 'layla@hassanfilm.eg', website: null,
    credits: ['Daughters of the Nile (2024)', 'Cairo Echoes (2022)'], years_active: 11,
  },

  // ── ASIA ──
  {
    id: '27', name: 'Priya Sharma', role: 'Screenwriter', experience: 'veteran', specialty: 'Drama, Romance',
    city: 'Mumbai', country: 'India', continent: 'Asia',
    bio: 'Screenwriter behind multiple Bollywood hits and two crossover English-language features.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/priyasharma-writer', instagram: 'https://instagram.com/priyawrites',
    email: 'priya@storyhouseindia.com', website: 'https://priyasharma.in',
    credits: ['Dil Ka Raasta (2024)', 'Between Two Worlds (2023)', 'Monsoon Letters (2021)'], years_active: 10,
  },
  {
    id: '28', name: 'Raj Patel', role: 'Director', experience: 'professional', specialty: 'Action, Drama',
    city: 'Delhi', country: 'India', continent: 'Asia',
    bio: 'Action director known for choreographing visceral fight sequences with emotional stakes.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/rajpatelfilms',
    email: 'raj@patelfilms.in', website: null,
    credits: ['Blood & Iron (2024)', 'Delhi Underworld (2023)'], years_active: 7,
  },
  {
    id: '29', name: 'Ananya Reddy', role: 'Talent Manager', experience: 'professional', specialty: 'Drama, Comedy',
    city: 'Bangalore', country: 'India', continent: 'Asia',
    bio: 'Talent manager representing some of South India\'s most promising emerging actors.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/ananyareddy', instagram: null,
    email: 'ananya@reddytalent.in', website: null,
    credits: [], years_active: 5,
  },
  {
    id: '30', name: 'Wei Chen', role: 'Producer', experience: 'legendary', specialty: 'Sci-Fi, Action',
    city: 'Beijing', country: 'China', continent: 'Asia',
    bio: 'Executive producer behind some of China\'s highest-grossing sci-fi films.',
    avatar_url: null, linkedin: null, instagram: null,
    email: 'wei.chen@email.cn', website: null,
    credits: ['Star Frontier (2024)', 'Dragon Empire (2022)'], years_active: 20,
  },
  {
    id: '31', name: 'Li Mei', role: 'Cinematographer', experience: 'veteran', specialty: 'Drama, Documentary',
    city: 'Shanghai', country: 'China', continent: 'Asia',
    bio: 'Award-winning cinematographer blending traditional Chinese aesthetics with modern techniques.',
    avatar_url: null, linkedin: null, instagram: null,
    email: 'limei@email.cn', website: null,
    credits: ['River of Dreams (2024)', 'Shanghai Noir (2022)'], years_active: 13,
  },
  {
    id: '32', name: 'Yuki Tanaka', role: 'Production Designer', experience: 'veteran', specialty: 'Sci-Fi, Animation',
    city: 'Tokyo', country: 'Japan', continent: 'Asia',
    bio: 'Production designer known for immersive world-building in anime-influenced live-action films.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/yukitanaka_design',
    email: 'yuki@tanakastudio.jp', website: 'https://tanakastudio.jp',
    credits: ['Neo Kyoto (2024)', 'Ghost Layer (2022)', 'Parallel Bloom (2020)'], years_active: 11,
  },
  {
    id: '33', name: 'Akira Sato', role: 'Director', experience: 'legendary', specialty: 'Horror, Thriller',
    city: 'Osaka', country: 'Japan', continent: 'Asia',
    bio: 'Legendary horror director whose work has defined the genre across Asia.',
    avatar_url: null, linkedin: null, instagram: null,
    email: 'akira@satofilms.jp', website: null,
    credits: ['The Hollow (2024)', 'Whispers (2021)', 'Onryo (2018)'], years_active: 25,
  },
  {
    id: '34', name: 'Jisoo Park', role: 'Actor/Actress', experience: 'professional', specialty: 'Drama, Romance',
    city: 'Seoul', country: 'South Korea', continent: 'Asia',
    bio: 'Korean actress with a rapidly growing fanbase across K-drama and film.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/jisoopark_official',
    email: 'jisoo@parkagency.kr', website: null,
    credits: ['Eternal Spring (2024)', 'Han River (2023)'], years_active: 4,
  },
  {
    id: '35', name: 'Nat Chaiprasit', role: 'Editor', experience: 'professional', specialty: 'Action, Comedy',
    city: 'Bangkok', country: 'Thailand', continent: 'Asia',
    bio: 'Thai editor known for razor-sharp action editing and comedic timing.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/natchai_edit',
    email: 'nat.chaiprasit@email.com', website: null,
    credits: ['Bangkok Rush (2024)', 'Comedy Kings (2023)'], years_active: 5,
  },

  // ── OCEANIA ──
  {
    id: '36', name: 'Jack Murray', role: 'Director', experience: 'veteran', specialty: 'Drama, Adventure',
    city: 'Sydney', country: 'Australia', continent: 'Oceania',
    bio: 'Australian director known for sweeping outback epics and intimate human dramas.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/jackmurray', instagram: 'https://instagram.com/jackmurrayfilm',
    email: 'jack@murrayfilms.com.au', website: null,
    credits: ['Red Dust (2024)', 'The Crossing (2022)'], years_active: 12,
  },
  {
    id: '37', name: 'Zoe Williams', role: 'Actor/Actress', experience: 'emerging', specialty: 'Drama, Comedy',
    city: 'Melbourne', country: 'Australia', continent: 'Oceania',
    bio: 'Fresh talent from Melbourne\'s vibrant theatre scene making waves in film.',
    avatar_url: null, linkedin: null, instagram: 'https://instagram.com/zoewilliams_act',
    email: 'zoe.williams@email.com', website: null,
    credits: ['Summer Days (2024 — short)'], years_active: 1,
  },
  {
    id: '38', name: 'Mia Cooper', role: 'Producer', experience: 'professional', specialty: 'Documentary, Drama',
    city: 'Auckland', country: 'New Zealand', continent: 'Oceania',
    bio: 'New Zealand producer championing Māori and Pacific Island stories on the world stage.',
    avatar_url: null, linkedin: 'https://linkedin.com/in/miacooper', instagram: null,
    email: 'mia@cooperfilms.nz', website: 'https://cooperfilms.nz',
    credits: ['Aotearoa (2024)', 'Pacific Voices (2023)'], years_active: 7,
  },
];

// ── SEARCH FUNCTION ──
export async function searchTalent({ country, city, role, experience, specialty }) {
  return MOCK_PROFILES.filter(p => {
    if (country && p.country !== country) return false;
    if (city && p.city !== city) return false;
    if (role && p.role !== role) return false;
    if (experience && p.experience !== experience) return false;
    if (specialty && !p.specialty.toLowerCase().includes(specialty.toLowerCase())) return false;
    return true;
  });
}

export async function getProfile(id) {
  return MOCK_PROFILES.find(p => p.id === id) || null;
}

export async function getAllProfiles() {
  return MOCK_PROFILES;
}