import React from 'react';

// ────────────────────────────────────────────────────────
// ProfileModal — shows a talent's full profile
// Props:
//   profile  — profile object from supabaseData.js
//   color    — accent color from the continent
//   onClose  — callback to close the modal
// ────────────────────────────────────────────────────────

const ProfileModal = ({ profile, color = '#ff00ff', onClose }) => {
  if (!profile) return null;

  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2);

  const experienceLabel = {
    emerging: 'Emerging',
    professional: 'Professional',
    veteran: 'Veteran',
    legendary: 'Legendary',
  }[profile.experience] || profile.experience;

  // social / contact links
  const links = [
    profile.linkedin && { icon: '🔗', label: 'LinkedIn', url: profile.linkedin },
    profile.instagram && { icon: '📸', label: 'Instagram', url: profile.instagram },
    profile.website && { icon: '🌐', label: 'Website', url: profile.website },
    profile.email && { icon: '✉️', label: profile.email, url: `mailto:${profile.email}` },
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pointer-events-none pt-[4vh]">
      {/* scrim */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{ background: 'rgba(10, 0, 20, 0.6)' }}
        onClick={onClose}
      />

      {/* panel */}
      <div
        className="relative w-[92vw] max-w-xl max-h-[92vh] overflow-y-auto rounded-xl pointer-events-auto p-0"
        style={{
          background: 'rgba(10, 0, 20, 0.95)',
          border: `2px solid ${color}`,
          boxShadow: `0 0 60px ${color}66, inset 0 0 40px ${color}11`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          animation: 'profileSlideUp 0.3s ease-out',
        }}
      >
        {/* close button */}
        <button
          className="absolute top-4 right-4 w-9 h-9 border-2 text-lg flex items-center justify-center rounded transition-all hover:rotate-90 z-10"
          style={{ borderColor: color, color, background: 'transparent' }}
          onClick={onClose}
        >
          ✕
        </button>

        {/* ── HEADER SECTION ── */}
        <div
          className="px-8 pt-8 pb-6 text-center"
          style={{
            background: `linear-gradient(180deg, ${color}18 0%, transparent 100%)`,
            borderBottom: `1px solid ${color}22`,
          }}
        >
          {/* avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              style={{ border: `3px solid ${color}`, boxShadow: `0 0 20px ${color}44` }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black"
              style={{
                background: `linear-gradient(135deg, ${color}55, ${color}22)`,
                border: `3px solid ${color}`,
                boxShadow: `0 0 20px ${color}44`,
                color: '#fff',
              }}
            >
              {initials}
            </div>
          )}

          {/* name */}
          <h2
            className="text-2xl md:text-3xl font-black tracking-wider mb-1"
            style={{ color, textShadow: `0 0 16px ${color}88` }}
          >
            {profile.name}
          </h2>

          {/* role + location */}
          <p className="text-sm text-fuchsia-300 tracking-widest">
            {profile.role} · {profile.city}, {profile.country}
          </p>

          {/* badges */}
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold tracking-wider"
              style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
            >
              {experienceLabel}
            </span>
            {profile.years_active && (
              <span
                className="px-3 py-1 rounded-full text-xs font-bold tracking-wider"
                style={{ background: `${color}11`, border: `1px solid ${color}33`, color: '#d8b4fe' }}
              >
                {profile.years_active} yrs active
              </span>
            )}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="px-8 py-6 space-y-6">

          {/* bio */}
          <div>
            <h3
              className="text-xs font-bold tracking-[0.2em] mb-2"
              style={{ color }}
            >
              BIO
            </h3>
            <p className="text-sm text-fuchsia-200/80 leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* specialty / genres */}
          {profile.specialty && (
            <div>
              <h3
                className="text-xs font-bold tracking-[0.2em] mb-2"
                style={{ color }}
              >
                SPECIALTIES
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.specialty.split(',').map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-wider"
                    style={{
                      background: `${color}15`,
                      border: `1px solid ${color}33`,
                      color: '#e9d5ff',
                    }}
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* credits / filmography */}
          {profile.credits && profile.credits.length > 0 && (
            <div>
              <h3
                className="text-xs font-bold tracking-[0.2em] mb-2"
                style={{ color }}
              >
                CREDITS
              </h3>
              <div className="space-y-1.5">
                {profile.credits.map((credit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-fuchsia-200/70"
                  >
                    <span style={{ color }} className="text-xs">▸</span>
                    {credit}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* connect — social links + email */}
          {links.length > 0 && (
            <div>
              <h3
                className="text-xs font-bold tracking-[0.2em] mb-3"
                style={{ color }}
              >
                CONNECT
              </h3>
              <div className="space-y-2">
                {links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all hover:scale-[1.02]"
                    style={{
                      background: `${color}0a`,
                      border: `1px solid ${color}22`,
                      color: '#e9d5ff',
                      textDecoration: 'none',
                    }}
                  >
                    <span className="text-base">{link.icon}</span>
                    <span className="tracking-wider">{link.label}</span>
                    <span className="ml-auto text-xs" style={{ color }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div
          className="px-8 py-4 text-center"
          style={{ borderTop: `1px solid ${color}11` }}
        >
          <button
            className="px-8 py-3 border-2 bg-transparent font-bold text-sm tracking-widest rounded transition-all hover:-translate-y-0.5"
            style={{ borderColor: color, color }}
            onClick={onClose}
          >
            ← BACK TO RESULTS
          </button>
        </div>
      </div>

      {/* entrance animation */}
      <style>{`
        @keyframes profileSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ProfileModal;