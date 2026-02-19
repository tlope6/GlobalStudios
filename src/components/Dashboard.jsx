import React, { useState, useEffect, useMemo } from 'react';

// Replace with actual Supabase client once connected
// import { supabase } from './supabaseClient';


const MOCK_TALENT_BY_CONTINENT = [
  { continent: 'North America', count: 1247, color: '#ff00ff' },
  { continent: 'Europe', count: 983, color: '#a855f7' },
  { continent: 'Asia', count: 876, color: '#7c3aed' },
  { continent: 'South America', count: 412, color: '#ff006e' },
  { continent: 'Africa', count: 389, color: '#e879f9' },
  { continent: 'Oceania', count: 215, color: '#f0abfc' },
];

const MOCK_ROLES_DISTRIBUTION = [
  { role: 'Actor/Actress', count: 1340 },
  { role: 'Director', count: 487 },
  { role: 'Producer', count: 623 },
  { role: 'Screenwriter', count: 398 },
  { role: 'Cinematographer', count: 312 },
  { role: 'Editor', count: 289 },
  { role: 'Production Designer', count: 201 },
  { role: 'Casting Director', count: 178 },
  { role: 'Talent Manager', count: 156 },
  { role: 'Agent', count: 138 },
];

const MOCK_EXPERIENCE_LEVELS = [
  { level: 'Emerging', label: '0–2 yrs', count: 1420, color: '#f0abfc' },
  { level: 'Professional', label: '3–7 yrs', count: 1185, color: '#e879f9' },
  { level: 'Veteran', label: '8–15 yrs', count: 872, color: '#a855f7' },
  { level: 'Legendary', label: '15+ yrs', count: 645, color: '#7c3aed' },
];

const MOCK_TOP_CITIES = [
  { city: 'Los Angeles', country: 'United States', count: 487 },
  { city: 'London', country: 'United Kingdom', count: 342 },
  { city: 'Mumbai', country: 'India', count: 298 },
  { city: 'New York', country: 'United States', count: 276 },
  { city: 'Toronto', country: 'Canada', count: 213 },
  { city: 'São Paulo', country: 'Brazil', count: 189 },
  { city: 'Berlin', country: 'Germany', count: 167 },
  { city: 'Tokyo', country: 'Japan', count: 154 },
  { city: 'Lagos', country: 'Nigeria', count: 143 },
  { city: 'Sydney', country: 'Australia', count: 131 },
];

const MOCK_GROWTH_DATA = [
  { month: 'Sep', signups: 142 },
  { month: 'Oct', signups: 198 },
  { month: 'Nov', signups: 231 },
  { month: 'Dec', signups: 189 },
  { month: 'Jan', signups: 312 },
  { month: 'Feb', signups: 287 },
  { month: 'Mar', signups: 356 },
  { month: 'Apr', signups: 401 },
  { month: 'May', signups: 478 },
  { month: 'Jun', signups: 523 },
  { month: 'Jul', signups: 614 },
  { month: 'Aug', signups: 691 },
];

const MOCK_GENRE_TAGS = [
  { genre: 'Drama', count: 1823 },
  { genre: 'Action', count: 1456 },
  { genre: 'Comedy', count: 1234 },
  { genre: 'Sci-Fi', count: 987 },
  { genre: 'Thriller', count: 876 },
  { genre: 'Horror', count: 654 },
  { genre: 'Documentary', count: 598 },
  { genre: 'Romance', count: 543 },
  { genre: 'Animation', count: 432 },
  { genre: 'Indie', count: 389 },
];


// Horizontal bar chart — used for roles and top cities
const BarChart = ({ data, labelKey, valueKey, maxItems = 8, accentColor = '#ff00ff' }) => {
  const items = data.slice(0, maxItems);
  const maxVal = Math.max(...items.map(d => d[valueKey]));

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const pct = (item[valueKey] / maxVal) * 100;
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-fuchsia-300 tracking-wider truncate mr-3">
                {item[labelKey]}
              </span>
              <span className="text-white font-bold tabular-nums">{item[valueKey].toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1a003322' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${accentColor}cc, ${accentColor})`,
                  boxShadow: `0 0 8px ${accentColor}66`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Donut / ring chart — used for experience breakdown
const DonutChart = ({ data, size = 180 }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const strokeWidth = size * 0.12;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* background ring */}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1a003344" strokeWidth={strokeWidth} />
        {data.map((item, i) => {
          const pct = item.count / total;
          const dashLength = pct * circumference;
          const dashOffset = -(accumulated * circumference);
          accumulated += pct;

          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{
                filter: `drop-shadow(0 0 4px ${item.color}66)`,
                transition: 'stroke-dasharray 1s ease-out',
              }}
            />
          );
        })}
        {/* center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="22" fontWeight="900">
          {total.toLocaleString()}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#d8b4fe" fontSize="9" letterSpacing="2">
          TOTAL
        </text>
      </svg>

      {/* legend */}
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}88` }} />
            <span className="text-xs text-fuchsia-300 tracking-wider">{item.label || item.level}</span>
            <span className="text-xs text-white font-bold ml-auto tabular-nums">{item.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sparkline / area chart — used for growth over time
const AreaChart = ({ data, width = 500, height = 160, accentColor = '#ff00ff' }) => {
  const maxVal = Math.max(...data.map(d => d.signups));
  const minVal = Math.min(...data.map(d => d.signups));
  const padTop = 20;
  const padBottom = 30;
  const padLeft = 10;
  const padRight = 10;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const points = data.map((d, i) => {
    const x = padLeft + (i / (data.length - 1)) * chartW;
    const y = padTop + chartH - ((d.signups - minVal) / (maxVal - minVal)) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.02" />
        </linearGradient>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const y = padTop + chartH * (1 - pct);
        return <line key={i} x1={padLeft} y1={y} x2={padLeft + chartW} y2={y} stroke="#ffffff08" strokeWidth="1" />;
      })}

      {/* filled area */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* line */}
      <path d={linePath} fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinejoin="round" filter="url(#lineGlow)" />

      {/* data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill={accentColor} stroke="#0a0014" strokeWidth="1.5" />
          {/* month label */}
          <text x={p.x} y={padTop + chartH + 16} textAnchor="middle" fill="#d8b4fe" fontSize="9" letterSpacing="1">
            {p.month}
          </text>
        </g>
      ))}
    </svg>
  );
};

// Bubble / tag cloud — used for genre specialties
const TagCloud = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count));
  const minCount = Math.min(...data.map(d => d.count));

  return (
    <div className="flex flex-wrap gap-2.5">
      {data.map((item, i) => {
        const ratio = (item.count - minCount) / (maxCount - minCount);
        const size = 0.7 + ratio * 0.55; // scale factor 0.7–1.25
        const opacity = 0.5 + ratio * 0.5;

        return (
          <div
            key={i}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider transition-transform hover:scale-110 cursor-default"
            style={{
              fontSize: `${size}rem`,
              background: `rgba(168, 85, 247, ${opacity * 0.2})`,
              border: `1px solid rgba(168, 85, 247, ${opacity * 0.6})`,
              color: `rgba(240, 171, 252, ${0.6 + ratio * 0.4})`,
              boxShadow: ratio > 0.6 ? `0 0 12px rgba(168, 85, 247, ${ratio * 0.3})` : 'none',
            }}
          >
            {item.genre}
            <span className="ml-1.5 opacity-60">{item.count.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
};

// Continent bar comparison — horizontal grouped bars with globe colors
const ContinentBars = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.count));

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const pct = (item.count / maxVal) * 100;
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="tracking-wider" style={{ color: item.color }}>{item.continent}</span>
              <span className="text-white font-bold tabular-nums">{item.count.toLocaleString()}</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: `${item.color}11` }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                  boxShadow: `0 0 10px ${item.color}55`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};


//handling the statcard
const StatCard = ({ label, value, icon, color = '#ff00ff' }) => (
  <div
    className="p-5 rounded-lg text-center"
    style={{
      background: 'rgba(10, 0, 20, 0.8)',
      border: `1px solid ${color}33`,
      boxShadow: `0 0 20px ${color}11`,
    }}
  >
    <div className="text-2xl mb-1">{icon}</div>
    <div
      className="text-3xl md:text-4xl font-black tabular-nums"
      style={{ color, textShadow: `0 0 16px ${color}88` }}
    >
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="text-xs tracking-[0.2em] text-fuchsia-300/70 mt-1.5 uppercase">{label}</div>
  </div>
);


//main dashboard components
const AnalyticsDashboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  // ─── in case of putting supabase into this ───
  // useEffect(() => {
  //   if (!isOpen) return;
  //   const fetchData = async () => {
  //     const { data: profiles } = await supabase.from('profiles').select('*');
  //     // aggregate & set state...
  //   };
  //   fetchData();
  // }, [isOpen]);

  const totalTalent = useMemo(() =>
    MOCK_TALENT_BY_CONTINENT.reduce((s, d) => s + d.count, 0),
  []);
  const totalCountries = 24;
  const totalCities = 38;

  if (!isOpen) return null;

  const panelStyle = {
    background: 'rgba(10, 0, 20, 0.95)',
    border: '2px solid #ff00ff44',
    boxShadow: '0 0 80px rgba(255, 0, 255, 0.15), inset 0 0 60px rgba(168, 85, 247, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
  };

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'talent', label: 'TALENT' },
    { id: 'growth', label: 'GROWTH' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pointer-events-none pt-[4vh]">
      {/* scrim */}
      <div
        className="absolute inset-0 pointer-events-auto transition-opacity duration-300"
        style={{ background: 'rgba(10, 0, 20, 0.6)', opacity: animateIn ? 1 : 0 }}
        onClick={onClose}
      />

      {/* panel */}
      <div
        className="relative w-[94vw] max-w-5xl max-h-[92vh] overflow-y-auto rounded-xl pointer-events-auto"
        style={{
          ...panelStyle,
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
          transition: 'opacity 0.35s ease-out, transform 0.35s ease-out',
        }}
      >
        {/* header */}
        <div className="sticky top-0 z-10 px-8 pt-6 pb-4" style={{ background: 'rgba(10, 0, 20, 0.98)', borderBottom: '1px solid #ff00ff22' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="text-2xl md:text-3xl font-black tracking-wider"
                style={{ color: '#ff00ff', textShadow: '0 0 20px #ff00ff88' }}
              >
                📊 NETWORK ANALYTICS
              </h2>
              <p className="text-xs tracking-[0.2em] text-fuchsia-300/60 mt-1">GLOBAL STUDIOS DATA VISUALIZATION</p>
            </div>
            <button
              className="w-10 h-10 border-2 text-xl flex items-center justify-center transition-all hover:rotate-90 rounded"
              style={{ borderColor: '#ff00ff', color: '#ff00ff', background: 'transparent' }}
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* tabs */}
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className="px-5 py-2 text-xs font-bold tracking-widest rounded transition-all"
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #ff00ff, #a855f7)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#d8b4fe',
                  border: activeTab === tab.id ? 'none' : '1px solid #ff00ff22',
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* body */}
        <div className="p-8">

          {/* overview tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* KPI row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon="🌐" label="Total Talent" value={totalTalent} color="#ff00ff" />
                <StatCard icon="🗺️" label="Countries" value={totalCountries} color="#a855f7" />
                <StatCard icon="🏙️" label="Cities" value={totalCities} color="#7c3aed" />
                <StatCard icon="🎬" label="Roles" value={10} color="#e879f9" />
              </div>

              {/* two-column: continent bars + experience donut */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg" style={{ background: '#0a001488', border: '1px solid #a855f722' }}>
                  <h3 className="text-sm font-bold tracking-[0.2em] text-fuchsia-400 mb-5">TALENT BY CONTINENT</h3>
                  <ContinentBars data={MOCK_TALENT_BY_CONTINENT} />
                </div>
                <div className="p-6 rounded-lg" style={{ background: '#0a001488', border: '1px solid #a855f722' }}>
                  <h3 className="text-sm font-bold tracking-[0.2em] text-fuchsia-400 mb-5">EXPERIENCE BREAKDOWN</h3>
                  <DonutChart data={MOCK_EXPERIENCE_LEVELS} />
                </div>
              </div>

              {/* growth sparkline */}
              <div className="p-6 rounded-lg" style={{ background: '#0a001488', border: '1px solid #a855f722' }}>
                <h3 className="text-sm font-bold tracking-[0.2em] text-fuchsia-400 mb-4">MONTHLY SIGN-UPS (LAST 12 MONTHS)</h3>
                <AreaChart data={MOCK_GROWTH_DATA} accentColor="#ff00ff" />
              </div>
            </div>
          )}

          {/* talent tab */}
          {activeTab === 'talent' && (
            <div className="space-y-8">
              {/* roles distribution */}
              <div className="p-6 rounded-lg" style={{ background: '#0a001488', border: '1px solid #a855f722' }}>
                <h3 className="text-sm font-bold tracking-[0.2em] text-fuchsia-400 mb-5">ROLE DISTRIBUTION</h3>
                <BarChart data={MOCK_ROLES_DISTRIBUTION} labelKey="role" valueKey="count" maxItems={10} accentColor="#a855f7" />
              </div>

              {/* top cities */}
              <div className="p-6 rounded-lg" style={{ background: '#0a001488', border: '1px solid #a855f722' }}>
                <h3 className="text-sm font-bold tracking-[0.2em] text-fuchsia-400 mb-5">TOP CITIES</h3>
                <BarChart
                  data={MOCK_TOP_CITIES.map(c => ({ label: `${c.city}, ${c.country}`, count: c.count }))}
                  labelKey="label"
                  valueKey="count"
                  maxItems={10}
                  accentColor="#ff006e"
                />
              </div>

              {/* genre tag cloud */}
              <div className="p-6 rounded-lg" style={{ background: '#0a001488', border: '1px solid #a855f722' }}>
                <h3 className="text-sm font-bold tracking-[0.2em] text-fuchsia-400 mb-5">GENRE SPECIALTIES</h3>
                <TagCloud data={MOCK_GENRE_TAGS} />
              </div>
            </div>
          )}

          {/* growth tab */}
          {activeTab === 'growth' && (
            <div className="space-y-8">
              {/* headline metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard icon="📈" label="This Month" value={691} color="#ff00ff" />
                <StatCard icon="🚀" label="Growth Rate" value="+18%" color="#a855f7" />
                <StatCard icon="⭐" label="Avg. Rating" value="4.7" color="#e879f9" />
              </div>

              {/* full-width area chart */}
              <div className="p-6 rounded-lg" style={{ background: '#0a001488', border: '1px solid #a855f722' }}>
                <h3 className="text-sm font-bold tracking-[0.2em] text-fuchsia-400 mb-4">NETWORK GROWTH TREND</h3>
                <AreaChart data={MOCK_GROWTH_DATA} accentColor="#a855f7" />
              </div>

              {/* continent + experience side by side */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg" style={{ background: '#0a001488', border: '1px solid #a855f722' }}>
                  <h3 className="text-sm font-bold tracking-[0.2em] text-fuchsia-400 mb-5">REGIONAL DISTRIBUTION</h3>
                  <ContinentBars data={MOCK_TALENT_BY_CONTINENT} />
                </div>
                <div className="p-6 rounded-lg" style={{ background: '#0a001488', border: '1px solid #a855f722' }}>
                  <h3 className="text-sm font-bold tracking-[0.2em] text-fuchsia-400 mb-5">EXPERIENCE MIX</h3>
                  <DonutChart data={MOCK_EXPERIENCE_LEVELS} />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* footer */}
        <div className="px-8 py-4 text-center" style={{ borderTop: '1px solid #ff00ff11' }}>
          <p className="text-[10px] tracking-[0.3em] text-fuchsia-300/30 uppercase">
            Global Studios Analytics · Data Visualization Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;