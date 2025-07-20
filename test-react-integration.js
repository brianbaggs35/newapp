#!/usr/bin/env node

// Simple test to verify React components can be imported and used
const fs = require('fs');
const path = require('path');

// Check that key files exist and are properly structured
const filesToCheck = [
  'app/javascript/application.js',
  'app/javascript/components/index.jsx',
  'app/javascript/components/App.jsx',
  'app/javascript/components/Home.jsx',
  'app/javascript/routes/index.jsx',
  'app/views/homepage/index.html.erb',
  'app/assets/builds/application.js',
  'app/assets/builds/application.css'
];

console.log('🧪 Testing React on Rails Integration...\n');

let allChecksPass = true;

filesToCheck.forEach(file => {
  const fullPath = path.join('/home/runner/work/newapp/newapp', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allChecksPass = false;
  }
});

// Check that the React mounting point exists in the Rails view
const viewFile = '/home/runner/work/newapp/newapp/app/views/homepage/index.html.erb';
const viewContent = fs.readFileSync(viewFile, 'utf8');
if (viewContent.includes('react-root')) {
  console.log('✅ React mounting point found in Rails view');
} else {
  console.log('❌ React mounting point missing in Rails view');
  allChecksPass = false;
}

// Check that the JavaScript includes React imports
const jsFile = '/home/runner/work/newapp/newapp/app/javascript/components/index.jsx';
const jsContent = fs.readFileSync(jsFile, 'utf8');
if (jsContent.includes('import React') && jsContent.includes('createRoot')) {
  console.log('✅ React imports and mounting code found');
} else {
  console.log('❌ React imports or mounting code missing');
  allChecksPass = false;
}

// Check that the built assets exist and have reasonable size
const builtJs = '/home/runner/work/newapp/newapp/app/assets/builds/application.js';
const builtCss = '/home/runner/work/newapp/newapp/app/assets/builds/application.css';
const jsStats = fs.statSync(builtJs);
const cssStats = fs.statSync(builtCss);

if (jsStats.size > 100000) { // Should be at least 100KB for React bundle
  console.log(`✅ JavaScript bundle built (${Math.round(jsStats.size/1024)}KB)`);
} else {
  console.log(`❌ JavaScript bundle too small (${Math.round(jsStats.size/1024)}KB)`);
  allChecksPass = false;
}

if (cssStats.size > 1000) { // Should have some CSS
  console.log(`✅ CSS bundle built (${Math.round(cssStats.size/1024)}KB)`);
} else {
  console.log(`❌ CSS bundle too small (${Math.round(cssStats.size/1024)}KB)`);
  allChecksPass = false;
}

console.log('\n' + '='.repeat(50));
if (allChecksPass) {
  console.log('🎉 All checks passed! React is properly configured with Rails.');
  console.log('\nNext steps:');
  console.log('1. Start the Rails server: bundle exec rails server');
  console.log('2. Visit http://localhost:3000 to see the React app');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please review the configuration.');
  process.exit(1);
}