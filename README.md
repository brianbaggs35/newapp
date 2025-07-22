# Test App - React on Rails Integration

A Ruby on Rails 8.0 application with full React 19.1.0 integration for modern frontend development.

## Features

- **Rails 8.0.2** with **React 19.1.0** integration
- **esbuild** for fast JavaScript bundling
- **Tailwind CSS 4.1.11** for utility-first styling
- **Flowbite React** components library
- **Jest** testing framework with React Testing Library
- Automated testing dashboard with import/export capabilities

## Prerequisites

- Ruby 3.2.3 (see `.ruby-version`)
- Node.js 20.19+ (see `.node-version`) 
- Yarn package manager
- PostgreSQL (for database)

## Setup

1. **Install dependencies:**
   ```bash
   bundle install
   yarn install
   ```

2. **Build assets:**
   ```bash
   yarn build && yarn build:css
   ```

3. **Database setup:**
   ```bash
   bin/rails db:create db:migrate
   ```

4. **Start the development server:**
   ```bash
   bin/dev
   # or separately:
   bin/rails server
   ```

5. **Visit the application:**
   Open http://localhost:3000

## React Integration

### How React Components Work with Rails

This application demonstrates seamless React integration within Rails views:

1. **React Mount Point**: Rails views include a `<div id="react-root"></div>` element
2. **Component Mounting**: React components automatically mount using `createRoot()` 
3. **Turbo Integration**: Components remount properly on Turbo navigation
4. **Asset Pipeline**: esbuild bundles React components, Rails serves them

### Adding React Components to Rails Views

1. **Create a React component** in `app/javascript/components/`:
   ```jsx
   // app/javascript/components/MyComponent.jsx
   import React from 'react';
   
   export default function MyComponent({ title }) {
     return <h1>{title}</h1>;
   }
   ```

2. **Add the mount point** in your Rails view:
   ```erb
   <!-- app/views/my_page/index.html.erb -->
   <div id="react-root" data-props='<%= { title: "Hello from Rails!" }.to_json %>'></div>
   ```

3. **Update the mounting logic** in `app/javascript/components/index.jsx`:
   ```jsx
   import MyComponent from './MyComponent';
   
   function mountReactApp() {
     const container = document.getElementById("react-root");
     if (container) {
       const props = JSON.parse(container.dataset.props || '{}');
       const root = createRoot(container);
       root.render(<MyComponent {...props} />);
     }
   }
   ```

4. **Build and reload:**
   ```bash
   yarn build && yarn build:css
   ```

### Available React Libraries

- **React 19.1.0** - Core React library
- **React Router 7.7.0** - Client-side routing
- **Flowbite React** - Tailwind-based components
- **React Icons** - Icon library  
- **Chart.js + React-ChartJS-2** - Data visualization

## Testing

### Run React Tests
```bash
yarn test                # Run all tests
yarn test:watch         # Watch mode
yarn test:coverage      # With coverage report
```

### Run Rails Tests  
```bash
bundle exec rspec       # RSpec tests
bin/rails test          # Minitest (if used)
```

### Integration Test
```bash
node test-react-integration.js
```

## Development Workflow

1. **Start development server:**
   ```bash
   bin/dev  # Starts Rails + asset watching
   ```

2. **Edit React components** in `app/javascript/components/`

3. **Assets rebuild automatically** (with `bin/dev`)

4. **Test changes:**
   ```bash
   yarn test              # React tests
   bundle exec rspec      # Rails tests  
   ```

## File Structure

```
app/
├── javascript/
│   ├── application.js          # Main entry point
│   ├── components/             # React components
│   │   ├── index.jsx          # React mounting logic
│   │   ├── App.jsx            # Main app component
│   │   ├── Home.jsx           # Home page component
│   │   └── tests/             # Test dashboard components
│   ├── controllers/           # Stimulus controllers
│   └── routes/               # React routing
├── assets/
│   ├── builds/               # Built JavaScript and CSS
│   └── stylesheets/         # Source stylesheets
└── views/
    └── homepage/
        └── index.html.erb    # Rails view with React mount
```

## Production Deployment

1. **Build production assets:**
   ```bash
   RAILS_ENV=production yarn build
   RAILS_ENV=production yarn build:css
   RAILS_ENV=production bundle exec rails assets:precompile
   ```

2. **Deploy with your preferred method** (Kamal, Docker, Heroku, etc.)

## Documentation

- [Detailed React Integration Guide](REACT_INTEGRATION.md)
- [Rails 8.0 Guides](https://guides.rubyonrails.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
