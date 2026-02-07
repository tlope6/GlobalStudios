# 🌍 Global Studios

**Global Studios** is an interactive **3D globe platform** built with **React**, **Three.js**, **SQL**, and **Supabase** that lets you **discover and connect with entertainment industry talent worldwide**.

> ✨ Spin the globe, click countries, and filter talent by **city**, **role**, **experience level**, and **specialty/genre** — all wrapped in a **neon magenta/purple UI** with a **starfield background**.

---

## 🚀 Key Features

- **Interactive 3D Globe** — Rotate, zoom, and explore a fully rendered Earth with **country borders** drawn from **GeoJSON**
- **Country Pins** — Clickable pins for every supported country, **color-coded by continent**
- **Hover Highlighting** — Borders **glow on hover**; pins **scale up** for crisp visual feedback
- **Talent Search** — Click any country to filter talent by:
  - **City**
  - **Role**
  - **Experience Level**
  - **Specialty / Genre**
- **Auth Flow** — **Sign in / create profile modal** gates search access, then **resumes where the user left off**
- **Colorful UI** — **Neon magenta/purple aesthetic**, glowing borders, animated modals, and a **starfield background**
- **Responsive** — Adapts to any screen size with **orbit controls locked** to prevent panning

---

## 🎭 Supported Roles

**Actor/Actress** · **Director** · **Producer** · **Screenwriter** · **Cinematographer** · **Editor** · **Production Designer** · **Casting Director** · **Talent Manager** · **Agent**

---

## 🗺️ Coverage

| Continent | Countries |
|----------|-----------|
| **North America** | United States, Canada, Mexico |
| **South America** | Brazil, Argentina, Colombia, Chile |
| **Europe** | United Kingdom, France, Germany, Spain, Italy |
| **Africa** | South Africa, Nigeria, Kenya, Egypt |
| **Asia** | India, China, Japan, South Korea, Thailand |
| **Oceania** | Australia, New Zealand, Fiji |

---

## 🧱 Tech Stack

- **Frontend:** React + Three.js  
- **Database:** SQL (via Supabase / Postgres)  
- **Auth & Backend:** Supabase  
- **Mapping Data:** GeoJSON (country borders)  

---

## 🛠️ Local Development

> Update these commands to match your actual setup (Vite / Next / CRA). These are the most common defaults.

```bash
# 1) Install dependencies
npm install

# 2) Start dev server
npm run dev
