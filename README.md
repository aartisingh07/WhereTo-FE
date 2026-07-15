# 🗺️ Where To? — Frontend

> React + Vite client for the **Where To?** platform — a real-time collaborative platform where users can explore nearby places solo or connect in group lobbies to chat, vote on games, discover movies, and sync Pomodoro study timers## ✨ Features

- 🔐 **Google & GitHub OAuth Integration** — Passwordless registration and login sessions handled securely via Google & GitHub. Traditional password register/login forms are disabled to prevent fake profile spams.
- 🧭 **Explore Mode (Solo Place Finder)** — Browser geolocation capturing, mood filter selectors, radius indicator sliders, debounced location search autocomplete suggestions dropdown, visual category gradients for placeholder photos, and Google Maps direction integrations.
- 👤 **Saved Places Dashboard** — Dedicated, full-screen, responsive Saved Places dashboard accessible from the navbar, rendering all user-bookmarked locations with coordinate badges, direction planners, and deletion triggers.
- 👤 **Profile Card & Account Actions** — Profile page displaying user info, public/private memories diary, and a clean **Account Actions** panel with Log out and Delete Account buttons grouped together.
- ✍️ **Profile Editing & Customizations** — Inline profile editor to update display name, avatar photo, bio description (supports emojis, lines, up to 300 words max with word counter), and custom username handle (Instagram format validation, restricted to one change per month with dynamic banner cooldown count).
- 🎲 **DiceBear Client Fallbacks** — Automatic silhouette fallback helper mapping username strings to unique DiceBear SVG avatars if Google/GitHub profile photos fail to load.
- 🏠 **Lobby Join & Lobbies Directory** — Tabbed page layout offering two ways to join: entering a 6-character room code, or browsing public active lobbies. Allows users to submit join requests containing a custom note explaining why they want to tag along.
- 🤝 **Host Request Manager Sidebar** — Real-time panel in the lobby sidebar allowing hosts to view pending join requests, inspect custom notes, and accept or decline users.
- ⚡ **Real-Time Kicks & Room Deletions** — Hosts can hover over any sidebar member to instantly kick them out. Kicked users are automatically disconnected and redirected to `/join-room` with toast warnings. Host room deletions hard-purge messages and instantly redirect all online members to `/`.
- 💬 **Socket Chat & Presence** — Sidebar tracking active room members, host tags, online indicators, and group text chat with system join/leave notices.
- 🎮 **Game Lounge & Live Voting** — Lists of browser games with live voting panels (yes, no, maybe progress bars and host early end overrides).
- 🎬 **Watch Lounge (TMDB & Streaming providers)** — Filter filters (moods, genres, languages), movie list summaries, movie proposals, and custom victory cards calling API to display logo shortcuts of streaming providers (Netflix, Prime Video, Disney+).
- 📚 **Study Lounge (Pomodoro & Tasks)** — Synced circular SVG countdown timers for Work/Break phases, alongside personal local Todo checklists.
- 📍 **Outing Lounge (midpoint planning)** — Geolocation submissions, submission status rosters, midpoint centroid search aggregations, and results place voting.
- 💬 **Private Direct Messaging (DM)** — Search for usernames (preventing self-search), send chat requests, approve pending incoming requests, and chat in real-time. Displays a pulsing red notification dot in the Navbar, an Unread Messages Banner on the Home dashboard, real-time DM toaster alerts, and automatic read tracking/synchronization.
- 📸 **Interactive Community Feed** — Dedicated social feed page displaying public memories from all community members with Instagram-like styling. Features an active members story bar, togglable photo likes with pop micro-animations, and live comment threads.
- 🎨 **Responsive Dual Theme & Brand Logo** — Sun/Moon live toggle selector shifting components and dashboards between custom navy-dark and slate-light styling variables. Features a custom SVG neon brand logo with zoom and spin hover dynamics in the Navbar.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Frontend packaging and dev server |
| React Router v7 | Client routing management |
| Tailwind CSS v3 | Utility-first CSS styling |
| Socket.io Client | Real-time connection client |
| Axios | HTTP request interceptors |
| React Toastify | Toast alerts and error warnings |
| React Icons | Curated modern icon sets (Lucide/Fi) |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/               # Static icons and logos
│   ├── components/           # Reusable view components
│   │   ├── common/           # Custom standard buttons / forms
│   │   ├── layout/           # Navbar component
│   │   ├── games/            # GameList, GameVoting modules
│   │   ├── movies/           # MovieFilters, MovieCard, WatchLounge
│   │   ├── outing/           # OutingFilters, OutingResults, OutingLounge
│   │   └── places/           # PlaceCard list items
│   ├── context/
│   │   ├── AuthContext.jsx   # User authentication provider
│   │   ├── SocketContext.jsx # Socket.io-client provider
│   │   └── ThemeContext.jsx  # Sun/Moon light-dark context provider
│   ├── hooks/
│   │   └── useGeolocation.js # Navigator geolocation hook
│   ├── pages/
│   │   ├── Home.jsx          # Mode selector landing page & user dashboard
│   │   ├── Login.jsx         # Login form
             ├── Register.jsx      # Registration form
│   │   ├── Explore.jsx       # Solo place finder explorer
│   │   ├── CreateRoom.jsx    # Room creator & code copy
│   │   ├── JoinRoom.jsx      # Tabbed join code & public active lobbies directory
│   │   ├── Profile.jsx       # User details, About Me bio, actions & memories diary
│   │   ├── SavedPlaces.jsx   # Dedicated user saved places panel
│   │   ├── Feed.jsx          # Instagram-style community trip feed page
│   │   ├── Room.jsx          # Synced collaborative room panels, kicks, & request managers
│   │   └── DirectMessages.jsx # Unified DM sidebar search & chat workspace
│   ├── services/
│   │   ├── api.js            # Axios request configurations
│   │   ├── authService.js    # Register/Login/Profile updates
│   │   ├── placeService.js   # Save/Load place requests
│   │   ├── roomService.js    # Create/Join/Get/Request/Kick room endpoints
│   │   ├── memoryService.js  # Upload/Fetch memories and feed
│   │   └── chatService.js    # Search, request actions, and DM requests
│   ├── utils/
│   │   ├── avatarHelper.js   # Client-side broken image DiceBear fallback resolver
│   ├── App.jsx               # Protected/Guest Route routing wraps
│   ├── main.jsx              # React mounting root
│   └── index.css             # Component style layers, dark mode overrides & animations
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Backend API running locally or hosted (see [where-to-BE](https://github.com/aartisingh07/where-to-BE))

### Installation

```bash
# Clone the repository
git clone https://github.com/aartisingh07/where-to-FE.git
cd where-to-FE

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run Locally

```bash
npm run dev
```

The app will launch at `http://localhost:5173`.

---

## 📦 Build for Production

```bash
npm run build
```

The production assets will be built into the `dist/` directory.

---

## 🔗 Related

- 🔧 **Backend Repo**: [where-to-BE](https://github.com/aartisingh07/where-to-BE)

---

## 👩‍💻 Author

**Aarti Singh** — [@aartisingh07](https://github.com/aartisingh07)
