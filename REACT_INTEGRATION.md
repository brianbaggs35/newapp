# React on Rails Integration

This Rails application has been configured to integrate with React components.

## Setup Overview

### Dependencies
- **React 19.1.0** - Core React library
- **React DOM 19.1.0** - DOM rendering for React
- **React Router 7.7.0** - Client-side routing (available but not currently used)
- **Flowbite React 0.11.9** - React components based on Tailwind CSS
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **esbuild 0.25.7** - Fast JavaScript bundler

### File Structure

```
app/
├── javascript/
│   ├── application.js          # Main JavaScript entry point
│   ├── components/
│   │   ├── index.jsx          # React mounting and initialization
│   │   ├── App.jsx            # Main React app component
│   │   └── Home.jsx           # Home page React component
│   └── routes/
│       └── index.jsx          # React routing (simplified)
├── views/
│   └── homepage/
│       └── index.html.erb     # Rails view with React mount point
└── assets/
    ├── builds/                # Built JavaScript and CSS
    └── stylesheets/
        └── application.tailwind.css  # Tailwind CSS with custom styles
```

### How It Works

1. **Rails View**: The `app/views/homepage/index.html.erb` provides a div with id "react-root"
2. **React Mounting**: The `app/javascript/components/index.jsx` finds this div and mounts the React app
3. **Build Process**: esbuild compiles all JavaScript/JSX and Tailwind CSS processes styles
4. **Integration**: React components render inside the Rails application seamlessly

### Building Assets

```bash
# Build JavaScript
yarn build

# Build CSS
yarn build:css

# Build both
yarn build && yarn build:css
```

### Development

1. Start the Rails server: `bundle exec rails server`
2. Visit `http://localhost:3000` to see the React app
3. The "Link Test" button demonstrates Rails routing integration

### Components

- **Home Component**: Main page with Tailwind styling and Flowbite React button
- **App Component**: Simple wrapper that renders the current route component
- **Simplified Routing**: Currently renders the Home component directly

### Styling

- Uses Tailwind CSS for utility classes
- Includes Flowbite React components for enhanced UI elements
- Custom color variables defined in `application.tailwind.css`

## Next Steps

- Add more React components as needed
- Implement proper React Router setup if client-side routing is required
- Add more Rails routes and corresponding React components
- Configure additional Tailwind/Flowbite components