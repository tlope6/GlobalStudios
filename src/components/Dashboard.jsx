import React, { useState, useEffect, useMemo } from 'react';

// ── MOCK DATA ──
const TALENT_BY_CONTINENT = [
  { continent: 'North America', count: 8, color: '#ff00ff' },
  { continent: 'Europe', count: 8, color: '#a855f7' },
  { continent: 'Asia', count: 9, color: '#7c3aed' },
  { continent: 'South America', count: 5, color: '#ff006e' },
  { continent: 'Africa', count: 5, color: '#e879f9' },
  { continent: 'Oceania', count: 3, color: '#f0abfc' },
];

const ROLES_DISTRIBUTION = [
  { role: 'Director', count: 8 }, { role: 'Actor/Actress', count: 5 },
  { role: 'Producer', count: 5 }, { role: 'Cinematographer', count: 5 },
  { role: 'Screenwriter', count: 4 }, { role: 'Editor', count: 4 },
  { role: 'Production Designer', count: 2 }, { role: 'Casting Director', count: 1 },
  { role: 'Talent Manager', count: 1 }, { role: 'Agent', count: 0 },
];

const EXPERIENCE_LEVELS = [
  { level: 'Emerging', label: '0–2 yrs', count: 4, color: '#f0abfc' },
  { level: 'Professional', label: '3–7 yrs', count: 15, color: '#e879f9' },
  { level: 'Veteran', label: '8–15 yrs', count: 12, color: '#a855f7' },
  { level: 'Legendary', label: '15+ yrs', count: 5, color: '#7c3aed' },
];

const TOP_CITIES = [
  { city: 'Los Angeles', count: 1 }, { city: 'Lagos', count: 2 },
  { city: 'London', count: 1 }, { city: 'Mumbai', count: 1 },
  { city: 'Tokyo', count: 1 }, { city: 'Berlin', count: 1 },
  { city: 'Mexico City', count: 1 }, { city: 'São Paulo', count: 1 },
  { city: 'Seoul', count: 1 }, { city: 'Sydney', count: 1 },
];

const GROWTH_DATA = [
  { month: 'Sep', signups: 2 }, { month: 'Oct', signups: 3 },
  { month: 'Nov', signups: 4 }, { month: 'Dec', signups: 3 },
  { month: 'Jan', signups: 5 }, { month: 'Feb', signups: 4 },
  { month: 'Mar', signups: 6 }, { month: 'Apr', signups: 7 },
  { month: 'May', signups: 8 }, { month: 'Jun', signups: 9 },
  { month: 'Jul', signups: 11 }, { month: 'Aug', signups: 12 },
];

// ── CHART COMPONENTS  ──

const BarChart = ({ data, labelKey, valueKey, maxItems = 8, color = '#ff00ff' }) => {
  const items = data.slice(0, maxItems);
  const maxVal = Math.max(...items.map(d => d[valueKey]), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map((item, i) => {
        const pct = (item[valueKey] / maxVal) * 100;
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: '#d8b4fe', letterSpacing: '2px' }}>{item[labelKey]}</span>
              <span style={{ color: 'white', fontWeight: 700 }}>{item[valueKey]}</span>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', background: '#1a003322' }}>
              <div style={{
                height: '100%', borderRadius: '4px', width: `${pct}%`,
                background: `linear-gradient(90deg, ${color}cc, ${color})`,
                boxShadow: `0 0 8px ${color}66`,
                transition: 'width 1s ease-out',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DonutChart = ({ data, size = 160 }) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  const cx = size / 2, cy = size / 2, r = size * 0.36, sw = size * 0.12;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a003344" strokeWidth={sw} />
        {data.map((item, i) => {
          const pct = item.count / total;
          const dash = pct * circ;
          const off = -(acc * circ);
          acc += pct;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={item.color} strokeWidth={sw}
            strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={off} strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`} style={{ filter: `drop-shadow(0 0 4px ${item.color}66)` }} />;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="20" fontWeight="900">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#d8b4fe" fontSize="8" letterSpacing="2">TOTAL</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}88` }} />
            <span style={{ fontSize: '11px', color: '#d8b4fe', letterSpacing: '1px' }}>{item.label || item.level}</span>
            <span style={{ fontSize: '11px', color: 'white', fontWeight: 700, marginLeft: 'auto' }}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AreaChart = ({ data, width = 360, height = 140, color = '#ff00ff' }) => {
  const maxV = Math.max(...data.map(d => d.signups));
  const minV = Math.min(...data.map(d => d.signups));
  const pT = 16, pB = 24, pL = 8, pR = 8;
  const cW = width - pL - pR, cH = height - pT - pB;
  const pts = data.map((d, i) => ({
    x: pL + (i / (data.length - 1)) * cW,
    y: pT + cH - ((d.signups - minV) / (maxV - minV || 1)) * cH,
    ...d,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${pts[pts.length - 1].x} ${pT + cH} L ${pts[0].x} ${pT + cH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".3" />
          <stop offset="100%" stopColor={color} stopOpacity=".02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#ag)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={color} stroke="#0a0014" strokeWidth="1.5" />
          <text x={p.x} y={pT + cH + 14} textAnchor="middle" fill="#d8b4fe" fontSize="8" letterSpacing="1">{p.month}</text>
        </g>
      ))}
    </svg>
  );
};

const ContinentBars = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {data.map((item, i) => {
        const pct = (item.count / maxVal) * 100;
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: item.color, letterSpacing: '2px' }}>{item.continent}</span>
              <span style={{ color: 'white', fontWeight: 700 }}>{item.count}</span>
            </div>
            <div style={{ height: '10px', borderRadius: '5px', background: `${item.color}11` }}>
              <div style={{
                height: '100%', borderRadius: '5px', width: `${pct}%`,
                background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                boxShadow: `0 0 10px ${item.color}55`, transition: 'width 1s ease-out',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// stat cards
const StatCard = ({ label, value, icon, color = '#ff00ff' }) => (
  <div style={{
    padding: '16px', borderRadius: '10px', textAlign: 'center',
    background: 'rgba(10,0,20,0.8)', border: `1px solid ${color}33`, boxShadow: `0 0 20px ${color}11`,
  }}>
    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
    <div style={{ fontSize: '28px', fontWeight: 900, color, textShadow: `0 0 16px ${color}88` }}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#d8b4fe88', marginTop: '4px', textTransform: 'uppercase' }}>{label}</div>
  </div>
);

// section card
const Section = ({ title, children, color = '#a855f7' }) => (
  <div style={{ padding: '20px', borderRadius: '10px', background: '#0a001488', border: `1px solid ${color}22` }}>
    <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color, marginBottom: '16px', marginTop: 0 }}>
      {title}
    </h3>
    {children}
  </div>
);

// main dashboard
const AnalyticsDashboard = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => setVisible(true));
    else setVisible(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const totalTalent = TALENT_BY_CONTINENT.reduce((s, d) => s + d.count, 0);
  const accent = '#ff00ff';

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'talent', label: 'TALENT' },
    { id: 'growth', label: 'GROWTH' },
  ];

  const tabBtnStyle = (active) => ({
    padding: '8px 20px', fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
    borderRadius: '6px', cursor: 'pointer', border: 'none',
    background: active ? `linear-gradient(135deg, #ff00ff, #a855f7)` : 'transparent',
    color: active ? '#fff' : '#d8b4fe',
    ...(active ? {} : { border: '1px solid #ff00ff22' }),
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>
      {/* scrim */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'auto',
          background: 'rgba(10,0,20,0.4)', opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={handleClose}
      />

      {/* panel */}
      <div
        style={{
          position: 'absolute', top: 0, right: 0,
          height: '100%', width: '520px', maxWidth: '96vw',
          pointerEvents: 'auto', overflowY: 'auto',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(10, 0, 20, 0.97)',
          borderLeft: `2px solid ${accent}`,
          boxShadow: `-10px 0 60px ${accent}33, inset 4px 0 30px ${accent}11`,
        }}
      >
        {/* header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          padding: '20px 28px 16px', background: 'rgba(10,0,20,0.98)',
          borderBottom: `1px solid ${accent}22`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '3px', color: accent,
                textShadow: `0 0 20px ${accent}88`, margin: '0 0 4px' }}>
                📊 ANALYTICS
              </h2>
              <p style={{ fontSize: '9px', letterSpacing: '3px', color: '#d8b4fe66', margin: 0 }}>
                GLOBAL STUDIOS DATA VISUALIZATION
              </p>
            </div>
            <button onClick={handleClose}
              style={{
                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${accent}`, borderRadius: '6px', background: 'transparent',
                color: accent, fontSize: '18px', cursor: 'pointer',
              }}>✕</button>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {tabs.map(t => (
              <button key={t.id} style={tabBtnStyle(tab === t.id)} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <StatCard icon="🌐" label="Total Talent" value={totalTalent} color="#ff00ff" />
                <StatCard icon="🗺️" label="Countries" value={24} color="#a855f7" />
                <StatCard icon="🏙️" label="Cities" value={38} color="#7c3aed" />
                <StatCard icon="🎬" label="Roles" value={10} color="#e879f9" />
              </div>
              <Section title="TALENT BY CONTINENT" color="#a855f7">
                <ContinentBars data={TALENT_BY_CONTINENT} />
              </Section>
              <Section title="EXPERIENCE BREAKDOWN" color="#a855f7">
                <DonutChart data={EXPERIENCE_LEVELS} />
              </Section>
              <Section title="MONTHLY SIGN-UPS" color="#a855f7">
                <AreaChart data={GROWTH_DATA} color="#ff00ff" />
              </Section>
            </>
          )}

          {/* TALENT */}
          {tab === 'talent' && (
            <>
              <Section title="ROLE DISTRIBUTION" color="#a855f7">
                <BarChart data={ROLES_DISTRIBUTION} labelKey="role" valueKey="count" maxItems={10} color="#a855f7" />
              </Section>
              <Section title="TOP CITIES" color="#a855f7">
                <BarChart data={TOP_CITIES} labelKey="city" valueKey="count" maxItems={10} color="#ff006e" />
              </Section>
            </>
          )}

          {/* GROWTH */}
          {tab === 'growth' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <StatCard icon="📈" label="This Month" value={12} color="#ff00ff" />
                <StatCard icon="🚀" label="Growth" value="+18%" color="#a855f7" />
                <StatCard icon="⭐" label="Avg Rating" value="4.7" color="#e879f9" />
              </div>
              <Section title="NETWORK GROWTH TREND" color="#a855f7">
                <AreaChart data={GROWTH_DATA} color="#a855f7" />
              </Section>
              <Section title="REGIONAL DISTRIBUTION" color="#a855f7">
                <ContinentBars data={TALENT_BY_CONTINENT} />
              </Section>
              <Section title="EXPERIENCE MIX" color="#a855f7">
                <DonutChart data={EXPERIENCE_LEVELS} />
              </Section>
            </>
          )}
        </div>

        {/* footer */}
        <div style={{ padding: '12px 28px 20px', textAlign: 'center', borderTop: `1px solid ${accent}11` }}>
          <p style={{ fontSize: '9px', letterSpacing: '4px', color: '#d8b4fe33', textTransform: 'uppercase', margin: 0 }}>
            Global Studios Analytics · Data Visualization
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;