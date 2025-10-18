# StudyFlow Website - Code Sitemap

## 📁 Project Structure Overview

```
webcs website/
├── 📄 App.tsx                    # Main application entry point
├── 📄 DOCUMENTATION.md           # Project documentation
├── 📄 Attributions.md            # Image and resource attributions
├── 📁 components/                # React components directory
│   ├── 📁 ui/                    # Reusable UI components (shadcn/ui)
│   ├── 📁 figma/                 # Figma-related components
│   ├── 📄 HomePage.tsx           # Homepage component
│   ├── 📄 CreateStudySet.tsx     # Study set creation page
│   ├── 📄 StudySetViewer.tsx     # Flashcard study interface
│   ├── 📄 SearchDiscover.tsx     # Search and discovery page
│   ├── 📄 ProfilePage.tsx        # User profile page
│   └── 📄 Wireframe*.tsx         # Wireframe components (6 files)
├── 📁 styles/                    # Global styles
│   └── 📄 globals.css            # Global CSS with design tokens
└── 📁 guidelines/                # Development guidelines
    └── 📄 Guidelines.md          # AI development guidelines
```

## 🎯 Main Application Flow

### **App.tsx** - Application Root
- **Purpose**: Main application container and navigation controller
- **Features**:
  - State management for current page and sidebar
  - Navigation routing between 5 main pages
  - Responsive layout (desktop sidebar + mobile bottom nav)
  - Glassmorphism design with gradient backgrounds

**Navigation Structure:**
```
App.tsx
├── 🏠 Home (HomePage.tsx)
├── 📚 Study (StudySetViewer.tsx)
├── ➕ Create (CreateStudySet.tsx)
├── 🔍 Discover (SearchDiscover.tsx)
└── 👤 Profile (ProfilePage.tsx)
```

## 📱 Page Components

### **HomePage.tsx** - Landing Page
- **Purpose**: Dashboard and learning overview
- **Features**:
  - Hero section with call-to-action
  - Learning statistics (streak, study time, sets mastered)
  - Recent study sets with progress tracking
  - Suggested topics for discovery
  - AI generator integration

### **CreateStudySet.tsx** - Content Creation
- **Purpose**: Study set creation and editing interface
- **Features**:
  - Study set metadata (title, description, subject)
  - Dynamic card creation with term/definition pairs
  - Image upload capabilities
  - AI hint generation
  - Subject categorization
  - Draft saving functionality

### **StudySetViewer.tsx** - Learning Interface
- **Purpose**: Interactive flashcard study experience
- **Features**:
  - Multiple study modes (flashcards, quiz, memory game)
  - Card flipping animations
  - Progress tracking
  - Difficulty indicators
  - Navigation controls
  - Performance feedback (know it/learning/don't know)

### **SearchDiscover.tsx** - Content Discovery
- **Purpose**: Browse and search community study sets
- **Features**:
  - Advanced search functionality
  - Subject-based filtering
  - View modes (popular, recent, featured)
  - Study set cards with ratings and user counts
  - Author information and difficulty levels

### **ProfilePage.tsx** - User Management
- **Purpose**: User profile and progress tracking
- **Features**:
  - Profile information and statistics
  - Achievement system
  - Study progress visualization
  - Social features (followers/following)
  - Personal study sets management
  - Weekly learning goals

## 🧩 UI Component Library

### **components/ui/** - Reusable Components (shadcn/ui)
**Form Components:**
- `button.tsx` - Button variants and states
- `input.tsx` - Text input fields
- `textarea.tsx` - Multi-line text input
- `select.tsx` - Dropdown selections
- `checkbox.tsx` - Checkbox inputs
- `radio-group.tsx` - Radio button groups
- `form.tsx` - Form validation and handling

**Layout Components:**
- `card.tsx` - Content containers
- `separator.tsx` - Visual dividers
- `tabs.tsx` - Tabbed interfaces
- `accordion.tsx` - Collapsible content
- `sidebar.tsx` - Navigation sidebar
- `sheet.tsx` - Slide-out panels

**Feedback Components:**
- `alert.tsx` - Alert messages
- `progress.tsx` - Progress indicators
- `skeleton.tsx` - Loading placeholders
- `sonner.tsx` - Toast notifications
- `tooltip.tsx` - Hover tooltips

**Navigation Components:**
- `navigation-menu.tsx` - Main navigation
- `breadcrumb.tsx` - Breadcrumb trails
- `pagination.tsx` - Page navigation
- `menubar.tsx` - Menu bars

**Data Display:**
- `table.tsx` - Data tables
- `chart.tsx` - Data visualization
- `avatar.tsx` - User avatars
- `badge.tsx` - Status badges
- `calendar.tsx` - Date picker

**Interactive Components:**
- `dialog.tsx` - Modal dialogs
- `popover.tsx` - Popover menus
- `dropdown-menu.tsx` - Dropdown menus
- `context-menu.tsx` - Right-click menus
- `hover-card.tsx` - Hover cards
- `command.tsx` - Command palette

**Utility Components:**
- `utils.ts` - Utility functions
- `use-mobile.ts` - Mobile detection hook

### **components/figma/** - Design System Components
- `ImageWithFallback.tsx` - Image component with fallback handling

## 🎨 Styling System

### **styles/globals.css** - Design Tokens
- **CSS Variables**: Color system, typography, spacing
- **Dark Mode**: Complete dark theme support
- **Typography**: Font sizes, weights, and line heights
- **Border Radius**: Consistent rounded corners
- **Color Palette**: Primary, secondary, accent colors
- **Component Themes**: Sidebar, chart, and form styling

## 📋 Wireframe Components

### **Wireframe Series** - Design Prototypes
- `WireframeApp.tsx` - App layout wireframe
- `WireframeHomePage.tsx` - Homepage wireframe
- `WireframeCreateSet.tsx` - Creation interface wireframe
- `WireframeStudyViewer.tsx` - Study interface wireframe
- `WireframeSearch.tsx` - Search interface wireframe
- `WireframeProfile.tsx` - Profile interface wireframe

## 🔄 Data Flow Architecture

```
User Interaction → App.tsx → Page Component → UI Components
                     ↓
                State Management
                     ↓
                Component Updates
                     ↓
                UI Re-render
```

## 📊 Component Dependencies

### **Core Dependencies:**
- **React**: Component framework
- **Lucide React**: Icon library
- **Tailwind CSS**: Styling framework
- **shadcn/ui**: Component library

### **Component Relationships:**
```
App.tsx
├── Imports all page components
├── Manages global state
└── Handles routing logic

Page Components
├── Import UI components from /ui
├── Import ImageWithFallback from /figma
├── Use Tailwind classes for styling
└── Implement page-specific logic

UI Components
├── Self-contained and reusable
├── Follow shadcn/ui patterns
└── Use design tokens from globals.css
```

## 🎯 Key Features by Component

| Component | Key Features | Dependencies |
|-----------|--------------|--------------|
| **App.tsx** | Navigation, Responsive Layout, State Management | All page components |
| **HomePage** | Dashboard, Statistics, Recent Sets | ImageWithFallback |
| **CreateStudySet** | Card Creation, AI Integration, Form Handling | UI components |
| **StudySetViewer** | Study Modes, Progress Tracking, Animations | UI components |
| **SearchDiscover** | Search, Filtering, Community Content | ImageWithFallback |
| **ProfilePage** | User Stats, Achievements, Social Features | UI components |

This sitemap provides a comprehensive overview of your StudyFlow website's code structure, making it easy to navigate and understand the relationships between different components and files.

