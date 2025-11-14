# Modern Todo List App

A beautiful, production-ready Todo List application built with React Native, Expo, and modern UI/UX principles.

## Features

### Core Functionality
- ✅ Create, edit, and delete todos
- ✅ Mark todos as complete with satisfying animations
- ✅ Swipe gestures (left to delete, right to complete)
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Categories (Work, Personal, Shopping, Health, Learning)
- ✅ Due dates with intelligent formatting
- ✅ Search and filter todos

### Organization
- 📅 Today view - See tasks due today
- 📋 All todos - Complete overview
- ✓ Completed - Track finished tasks
- 📊 Statistics - View your productivity metrics

### Statistics Dashboard
- Total todos count
- Completion rate with progress ring
- Daily and weekly completion stats
- Streak counter (current and longest)
- Motivational messages

### Design & UX
- 🎨 Modern minimalist design inspired by Linear and Things 3
- 🌗 Beautiful light and dark mode
- ✨ Smooth animations with React Native Reanimated
- 📱 Haptic feedback for interactions
- 🎯 Intuitive gestures and micro-interactions

## Tech Stack

- **Framework**: Expo ~54.0 with React Native 0.81
- **Routing**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Storage**: AsyncStorage for local persistence
- **Animations**: React Native Reanimated 4
- **Gestures**: React Native Gesture Handler
- **UI**: Custom components with consistent design system
- **Icons**: Lucide React Native
- **Date Handling**: date-fns
- **Styling**: Custom design tokens and StyleSheet

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

## Project Structure

```
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # All Todos
│   │   ├── today.tsx        # Today's Tasks
│   │   ├── completed.tsx    # Completed Tasks
│   │   └── stats.tsx        # Statistics
│   ├── modals/              # Modal screens
│   │   ├── add-todo.tsx     # Add/Edit Todo
│   │   └── settings.tsx     # Settings
│   └── _layout.tsx          # Root layout
├── components/
│   ├── todo/                # Todo-specific components
│   ├── ui/                  # Reusable UI components
│   ├── stats/               # Statistics components
│   └── shared/              # Shared components
├── stores/                  # Zustand stores
│   ├── useTodoStore.ts      # Todo state management
│   └── useThemeStore.ts     # Theme state
├── utils/                   # Utility functions
│   ├── haptics.ts           # Haptic feedback helpers
│   └── date.ts              # Date formatting utilities
├── constants/               # App constants
│   └── theme.ts             # Design tokens
└── types/                   # TypeScript types
    └── index.ts             # Type definitions
```

## Design System

### Color Palette
- **Primary**: Indigo (#6366F1 / #818CF8)
- **Secondary**: Violet (#8B5CF6 / #A78BFA)
- **Success**: Emerald (#10B981 / #34D399)
- **Error**: Red (#EF4444 / #F87171)
- **Warning**: Amber (#F59E0B / #FBBF24)

### Typography Scale
- H1: 32px / 700
- H2: 24px / 600
- H3: 20px / 600
- Body: 16px / 400
- Body Small: 14px / 400
- Caption: 12px / 500

### Spacing Scale
4, 8, 12, 16, 24, 32, 48, 64

## Key Features Explained

### Swipe Gestures
- **Swipe Right**: Quick complete action (green background)
- **Swipe Left**: Delete action with confirmation (red background)

### Priority System
- **Urgent**: Red accent, highest priority
- **High**: Orange accent
- **Medium**: Yellow accent
- **Low**: Gray accent

### Date Intelligence
- Displays "Today", "Tomorrow", or day name for upcoming dates
- Shows overdue items in red
- Quick date selection in add/edit modal

### Statistics
- Real-time completion rate
- Daily streak tracking
- Weekly completion metrics
- Visual progress indicators

### Data Persistence
- Automatic save to AsyncStorage
- Survives app restarts
- Optimized with debounced updates

## Performance Optimizations

- Memoized components to prevent unnecessary re-renders
- Optimized list rendering with FlatList
- Debounced search (300ms)
- Smooth 60fps animations
- Lazy loading for stats/settings

## Accessibility

- Proper accessibility labels
- Screen reader support
- High contrast colors (WCAG AA compliant)
- Dynamic font scaling
- Haptic feedback (toggleable)

## Future Enhancements

- [ ] Cloud sync with authentication
- [ ] Push notifications for due dates
- [ ] Recurring tasks
- [ ] Tags system
- [ ] Task notes with rich text
- [ ] Subtasks/checklists
- [ ] Custom categories
- [ ] Data export/import (JSON)
- [ ] Dark mode auto-switch based on time
- [ ] Widget support
- [ ] Siri shortcuts (iOS)
- [ ] Apple Watch app
- [ ] iPad optimization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or production.

## Acknowledgments

- Design inspired by Linear, Things 3, and Notion
- Icons by Lucide
- Built with love using Expo and React Native
