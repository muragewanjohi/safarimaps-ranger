# SafariMap GameWarden 🦁

A comprehensive mobile application designed to assist game wardens and conservation rangers in managing and monitoring wildlife activity, tourist safety, and incident response in national reserves.

## 🌟 Features

### Dashboard
- **Ranger Profile**: Personal information, team assignment, and current park
- **Park Information**: Detailed park data including location, area, and establishment date
- **Statistics Overview**: Real-time metrics for incidents, wildlife tracking, and ranger activity
- **Emergency Alerts**: Critical visitor emergencies with SOS indicators
- **Quick Actions**: Fast access to common ranger tasks

### Map View
- **Interactive Map**: Visual representation of Masai Mara National Reserve
- **Location Markers**: Wildlife sightings, attractions, hotels, and points of interest
- **Filter System**: Categorize locations by type (Wildlife, Attractions, Hotels, etc.)
- **Add Locations**: Report new wildlife sightings and points of interest
- **Detailed Information**: Comprehensive location data with coordinates and metadata

### Incident Reports
- **Incident Management**: Track security, wildlife, and infrastructure incidents
- **Severity Classification**: Critical, High, Medium, and Resolved status tracking
- **Filter Options**: Sort by incident type, status, and severity
- **Detailed Reports**: Comprehensive incident information with contact details
- **Action Buttons**: Update status, add notes, escalate, and route information

### Profile Management
- **User Profile**: Ranger information with avatar, role, and team assignment
- **Impact Statistics**: Conservation contributions and achievements
- **Achievements**: Recognition badges for outstanding conservation work
- **App Settings**: Customizable preferences for notifications, location sharing, and offline mode
- **Quick Actions**: Profile editing, preferences, and account management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ranger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Expo Go**: Scan the QR code with your mobile device

## 📱 Platform Support

- **iOS**: Native iOS app with SF Symbols
- **Android**: Native Android app with Material Icons
- **Web**: Progressive Web App support

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Icons**: SF Symbols (iOS) / Material Icons (Android/Web)
- **Styling**: React Native StyleSheet
- **State Management**: React Hooks (useState)

### Project Structure
```
ranger/
├── app/                    # Main application screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Dashboard/Home screen
│   │   ├── explore.tsx    # Map view screen
│   │   ├── reports.tsx    # Incident reports screen

│   │   └── profile.tsx    # Profile management screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # UI-specific components
│   │   └── IconSymbol.tsx # Cross-platform icon component
│   └── ...               # Other components
├── constants/            # App constants and themes
├── hooks/               # Custom React hooks
└── assets/              # Images, fonts, and other assets
```

## 🎯 Key Components

### IconSymbol Component
Cross-platform icon system that maps SF Symbols (iOS) to Material Icons (Android/Web) for consistent visual experience.

### ThemedText Component
Text component with automatic theme support for light/dark modes.

### Navigation Structure
- **Dashboard**: Main overview and quick actions
- **Map**: Interactive map with location management
- **Reports**: Incident tracking and management
- **Profile**: User account and settings

## 🔧 Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run on web browser
```

### Code Style
- TypeScript for type safety
- Functional components with React Hooks
- Consistent naming conventions
- Comprehensive error handling
- Responsive design principles

## 📋 Requirements

This application is designed to meet the requirements outlined in `Requirements.md`:

- **Real-time Incident Tracking**: Monitor and report security, wildlife, and infrastructure incidents
- **Tourist Safety**: Emergency response system for visitor incidents
- **Wildlife Monitoring**: Track and log wildlife sightings and movements
- **Offline Capability**: Work without internet connection with data sync
- **Role-based Access**: Different interfaces for rangers and administrators
- **Performance**: Optimized for 2GB RAM Android devices

## 🚧 Future Enhancements

- **Real-time Chat**: Incident coordination between rangers
- **Heatmaps**: Visual representation of incident frequency
- **GPS Integration**: Wildlife tracking with collar GPS data
- **Push Notifications**: Real-time alerts for critical incidents
- **Analytics Dashboard**: Conservation impact metrics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the [Expo documentation](https://docs.expo.dev/) for technical questions

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/) and React Native
- Icons provided by SF Symbols and Material Icons
- Designed for conservation rangers and wildlife management professionals
