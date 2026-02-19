import React, { useState, useEffect } from 'react';

const ProfileModal = ({ profile, color = '#ff00ff', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (profile) requestAnimationFrame(() => setVisible(true));
  }, [profile]);

  if (!profile) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const experienceLabel = {
    emerging: 'Emerging (0–2 yrs)',
    professional: 'Professional (3–7 yrs)',
    veteran: 'Veteran (8–15 yrs)',
    legendary: 'Legendary (15+ yrs)',
  }[profile.experience] || profile.experience;

  // Build contact items — display only, NOT clickable
  const contactItems = [
    profile.linkedin && { icon: '🔗', label: 'LinkedIn', value: profile.linkedin },
    profile.instagram && { icon: '📸', label: 'Instagram', value: profile.instagram },
    profile.website && { icon: '🌐', label: 'Website', value: profile.website },
    profile.email && { icon: '✉️', label: 'Email', value: profile.email },
  ].filter(Boolean);

  const labelStyle = {
    display: 'block', marginBottom: '8px', fontSize: '11px',
    letterSpacing: '3px', fontWeight: 700, color: color,
    textTransform: 'uppercase',
  };

  const badgeStyle = (bg, border) => ({
    display: 'inline-block', padding: '5px 14px', borderRadius: '999px',
    fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
    background: bg, border: `1px solid ${border}`, color: color,
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}>
      {/* scrim */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'auto',
          background: 'rgba(10,0,20,0.4)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={handleClose}
      />

      {/* slide-in panel from right */}
      <div
        style={{
          position: 'absolute', top: 0, right: 0,
          height: '100%', width: '440px', maxWidth: '94vw',
          pointerEvents: 'auto', overflowY: 'auto',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(10, 0, 20, 0.97)',
          borderLeft: `2px solid ${color}`,
          boxShadow: `-10px 0 60px ${color}44, inset 4px 0 30px ${color}11`,
        }}
      >
        {/* close */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: '20px', right: '20px', zIndex: 10,
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${color}`, borderRadius: '6px', background: 'transparent',
            color: color, fontSize: '18px', cursor: 'pointer',
          }}
        >✕</button>

        {/* ── HEADER ── */}
        <div style={{
          padding: '48px 28px 24px', textAlign: 'center',
          background: `linear-gradient(180deg, ${color}15 0%, transparent 100%)`,
          borderBottom: `1px solid ${color}18`,
        }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name}
              style={{ width: '90px', height: '90px', borderRadius: '50%', margin: '0 auto 16px',
                objectFit: 'cover', border: `3px solid ${color}`, boxShadow: `0 0 20px ${color}44` }} />
          ) : (
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: 900, color: '#fff',
              background: `linear-gradient(135deg, ${color}55, ${color}22)`,
              border: `3px solid ${color}`, boxShadow: `0 0 20px ${color}44`,
            }}>{initials}</div>
          )}

          <h2 style={{
            fontSize: '26px', fontWeight: 900, letterSpacing: '3px',
            color: color, textShadow: `0 0 16px ${color}88`, margin: '0 0 4px',
          }}>{profile.name}</h2>

          <p style={{ color: '#d8b4fe', fontSize: '13px', letterSpacing: '3px', margin: '0 0 14px' }}>
            {profile.role} · {profile.city}, {profile.country}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={badgeStyle(`${color}22`, `${color}44`)}>{experienceLabel}</span>
            {profile.years_active && (
              <span style={badgeStyle(`${color}11`, `${color}33`)}>
                {profile.years_active} yrs active
              </span>
            )}
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* bio */}
          {profile.bio && (
            <div>
              <label style={labelStyle}>BIO</label>
              <p style={{ color: '#d8b4fecc', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                {profile.bio}
              </p>
            </div>
          )}

          {/* specialties */}
          {profile.specialty && (
            <div>
              <label style={labelStyle}>SPECIALTIES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.specialty.split(',').map((s, i) => (
                  <span key={i} style={{
                    padding: '5px 14px', borderRadius: '999px', fontSize: '12px',
                    fontWeight: 700, letterSpacing: '1px',
                    background: `${color}15`, border: `1px solid ${color}33`, color: '#e9d5ff',
                  }}>{s.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* credits */}
          {profile.credits && profile.credits.length > 0 && (
            <div>
              <label style={labelStyle}>CREDITS</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {profile.credits.map((credit, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#d8b4feaa' }}>
                    <span style={{ color: color, fontSize: '11px' }}>▸</span>
                    {credit}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* connect — display only, no links */}
          {contactItems.length > 0 && (
            <div>
              <label style={labelStyle}>CONNECT</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {contactItems.map((item, i) => (
                  <div key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', borderRadius: '8px',
                      background: `${color}0a`, border: `1px solid ${color}22`,
                      color: '#e9d5ff', fontSize: '13px', letterSpacing: '1px',
                      cursor: 'default', userSelect: 'text',
                    }}
                  >
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ color: '#d8b4fe88', fontSize: '11px', letterSpacing: '2px', flexShrink: 0 }}>{item.label}</span>
                    <span style={{ marginLeft: 'auto', textAlign: 'right', wordBreak: 'break-all' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div style={{ padding: '16px 28px 28px', textAlign: 'center' }}>
          <button onClick={handleClose}
            style={{
              width: '100%', padding: '14px', border: `2px solid ${color}`,
              background: 'transparent', color: color, fontWeight: 700,
              letterSpacing: '3px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
            }}>
            ← BACK TO RESULTS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;