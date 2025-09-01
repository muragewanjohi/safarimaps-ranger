SafariMap GameWarden App - Enhanced Requirements Document
1. Overview
SafariMap is a mobile-first application designed to assist game wardens and conservation rangers in managing and monitoring wildlife activity, tourist safety, and incident response in national reserves. The MVP focuses on real-time incident tracking, reporting, and field communications, with future upgrades planned for analytics and collaboration.
________________________________________
2. Core Functional Requirements
2.1 Dashboard Overview
•	Display active incidents (categorized by severity)
•	Number of wildlife tracked, tourist locations, and ranger activity
•	Highlight ongoing emergencies (e.g., lost tourists)
•	Show ranger’s name, team, and assigned park
2.2 Incident Reporting & Management
•	Create new incident reports with:
o	Incident type (wildlife, infrastructure, visitor-related)
o	Severity (Critical, High, Medium, Resolved)
o	Number of people involved
o	Photos (and optionally video)
o	Contact info & location tagging
•	Update report status through workflow: Reported > In Progress > Resolved
•	Support offline creation with local queue for syncing when back online
2.3 Visitor Emergencies
•	Display urgent alerts in a red-highlighted box
•	Categories:
o	Vehicle stuck (e.g., safari van)
o	Missing persons (with urgency flags)
•	Include call-to-action buttons: Respond, View More, Contact Leader
2.4 Wildlife & Tourist Location Tracking
•	Add locations directly from map view
•	Assign location type (Wildlife, Tourist, Hotel, Incident, Ranger)
•	Include metadata (species group, ranger report, timestamp)
•	Mark endangered or protected groups visually (icon/badge)
2.5 Map View
•	Real-time map showing:
o	Active incidents
o	Ranger and tourist locations
o	Wildlife movements
•	Filter by layer: wildlife, tourist, infrastructure, incidents
•	Add new locations with metadata
•	Syncs with backend every 10 minutes (or when online)
2.6 Reports Tab
•	Show active and past incidents
•	Filter by severity, status, and ranger
•	Add new reports or update existing ones
2.7 Role-Based Interface
•	Ranger View:
o	Incident creation, map navigation, reporting
•	Admin View:
o	Full incident list, ranger activity, system settings
•	Visitor View (future):
o	Safety alerts, locations, and tourist notifications
________________________________________
3. UX/UI Enhancements
3.1 Quick Access Features
•	Floating action button (FAB) for quick incident/photo/add location
•	Dashboard buttons with live counters (e.g., 18 Reports Today)
•	Offline status banner: “You are offline - 2 items waiting to sync”
3.2 Tagging & Filtering
•	Tag incidents with: Open, Critical, Wildlife, Vehicle, 8 tourists
•	Filter reports by time, severity, or location
3.3 Notifications
•	Badge for real-time alerts (optional push notifications)
•	In-app bell icon to track new critical updates
3.4 Visual Improvements
•	Better color contrast between Critical, Resolved, and Active
•	Location cards show timestamp: “Last updated: 10 mins ago”
•	Profile tab shows role, shift status, and reporting stats
________________________________________
4. Non-Functional Requirements
4.1 Performance
•	Load initial data within 2 seconds on 4G connection
•	Map and dashboard operate smoothly on 2GB RAM Android devices
4.2 Offline Mode
•	Create incidents, reports, and add locations while offline
•	Auto-sync when back online
4.3 Compliance & Privacy
•	Must comply with Kenya Data Protection Act, 2019
•	Prompt users before accessing location, photos, camera
4.4 Security
•	Role-based access control
•	Encrypted API calls using HTTPS
•	Local data encryption for offline storage
________________________________________
5. Future Enhancements (Phase 2+)
•	Chat threads for incident coordination
•	Heatmaps of incident frequency
•	Wildlife tracking with collar GPS integration
•	Integration with park gate systems for tourist monitoring
•	Ranger attendance logs and shift handovers
________________________________________
6. Tech Stack Recommendations
•	Frontend: React Native (cross-platform)
•	Backend: Supabase 
•	Maps: Google Maps SDK
•	Push Notifications: Firebase Cloud Messaging
•	Storage: Encrypted local SQLite + Cloud Storage for media
________________________________________
7. Appendix
•	Expo documentation: https://docs.expo.dev/
•	Supabase documentation : https://supabase.com/docs
•	Deepseek API : https://deepseek.ai/docs

________________________________________
