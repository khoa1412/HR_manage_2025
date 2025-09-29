# 🎨 UI/UX Guidelines

## 🎯 Design System

### 🌈 Color Palette
```css
/* Primary Colors */
--primary-blue: #3B82F6    /* Main actions, links */
--primary-blue-light: #93C5FD
--primary-blue-dark: #1D4ED8

/* Semantic Colors */
--success-green: #10B981   /* Success states, positive metrics */
--warning-yellow: #F59E0B  /* Warning states, attention items */
--danger-red: #EF4444      /* Error states, critical actions */
--info-purple: #8B5CF6     /* Info states, secondary actions */

/* Neutral Colors */
--gray-50: #F9FAFB         /* Background light */
--gray-100: #F3F4F6        /* Background medium */
--gray-200: #E5E7EB        /* Borders */
--gray-500: #6B7280        /* Text secondary */
--gray-900: #111827        /* Text primary */
```

### 📏 Typography Scale
```css
/* Headings */
.text-2xl { font-size: 1.5rem; font-weight: 700; }    /* Page titles */
.text-xl  { font-size: 1.25rem; font-weight: 600; }   /* Section headers */
.text-lg  { font-size: 1.125rem; font-weight: 500; }  /* Card headers */

/* Body Text */
.text-base { font-size: 1rem; font-weight: 400; }     /* Normal text */
.text-sm   { font-size: 0.875rem; font-weight: 400; } /* Secondary text */
.text-xs   { font-size: 0.75rem; font-weight: 400; }  /* Captions */
```

### 📦 Component Classes
```css
/* Cards */
.card {
  @apply bg-white rounded-lg shadow border border-gray-200 p-4;
}

/* Buttons */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
         transition-colors font-medium;
}

.btn-outline {
  @apply border border-gray-300 text-gray-700 px-4 py-2 rounded-lg 
         hover:bg-gray-50 transition-colors;
}

/* Form Elements */
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
```

## 🧩 Component Patterns

### 📊 **Dashboard Cards**
```jsx
<div className="card p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">Metric Name</p>
      <p className="text-2xl font-bold text-gray-900">Value</p>
    </div>
    <div className="p-3 bg-blue-100 rounded-full">
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
  </div>
  <div className="mt-2 flex items-center">
    <TrendIcon className="h-4 w-4 text-green-500" />
    <span className="text-sm text-gray-600 ml-1">vs tháng trước</span>
  </div>
</div>
```

### 📋 **Data Tables**
```jsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
          Column Header
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3 text-sm text-gray-900">Cell Content</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 🎛️ **Tab Navigation**
```jsx
<div className="border-b border-gray-200">
  <nav className="-mb-px flex space-x-8">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={`group inline-flex items-center py-2 px-1 border-b-2 
                   font-medium text-sm ${
          activeTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        <tab.icon className="h-4 w-4 mr-2" />
        {tab.name}
      </button>
    ))}
  </nav>
</div>
```

### 🏷️ **Status Badges**
```jsx
<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
  status === 'active' ? 'bg-green-100 text-green-800' :
  status === 'inactive' ? 'bg-red-100 text-red-800' :
  'bg-gray-100 text-gray-800'
}`}>
  {statusText}
</span>
```

## 📱 Responsive Guidelines

### 🖥️ **Breakpoint Strategy**
```css
/* Mobile First Approach */
.container {
  /* Mobile (default) */
  @apply px-4;
  
  /* Tablet (768px+) */
  @screen md: @apply px-6;
  
  /* Desktop (1024px+) */
  @screen lg: @apply px-8 max-w-7xl mx-auto;
}

/* Grid Responsiveness */
.responsive-grid {
  @apply grid grid-cols-1;      /* Mobile: 1 column */
  @screen md: @apply grid-cols-2; /* Tablet: 2 columns */
  @screen lg: @apply grid-cols-4; /* Desktop: 4 columns */
}
```

### 📲 **Mobile Patterns**
- **Navigation**: Hamburger menu on mobile
- **Tables**: Horizontal scroll hoặc card layout
- **Forms**: Single column layout
- **Actions**: Larger touch targets (min 44px)

## 🎭 Animation & Transitions

### ⚡ **Micro-interactions**
```css
/* Hover States */
.hover-effect {
  @apply transition-all duration-200 ease-in-out;
}

.hover-effect:hover {
  @apply transform scale-105 shadow-lg;
}

/* Loading States */
.loading-spinner {
  @apply animate-spin rounded-full border-2 border-gray-300 border-t-blue-600;
}

/* Fade Transitions */
.fade-enter {
  @apply opacity-0 transform translate-y-4;
}

.fade-enter-active {
  @apply opacity-100 transform translate-y-0 transition-all duration-300;
}
```

## 🔍 Accessibility

### ♿ **WCAG Compliance**
- **Color Contrast**: Minimum 4.5:1 ratio cho normal text
- **Focus Indicators**: Visible focus states cho all interactive elements
- **Alt Text**: Descriptive alt text cho images
- **Keyboard Navigation**: Full keyboard accessibility

### 🎯 **Focus Management**
```css
/* Focus Styles */
.focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* Skip Links */
.skip-link {
  @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
         bg-blue-600 text-white px-4 py-2 rounded-lg z-50;
}
```

## 🚀 Performance Guidelines

### ⚡ **Optimization Tips**
1. **Lazy Loading**: Load components when needed
2. **Image Optimization**: Use appropriate formats và sizes
3. **Bundle Splitting**: Code splitting cho faster initial load
4. **Caching**: Cache static assets và API responses

### 📊 **Metrics to Monitor**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

---

**🔙 Back**: [📚 Documentation Home](./README.md)
