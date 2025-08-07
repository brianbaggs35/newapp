# QA Platform - Comprehensive Testing Management System

A Ruby on Rails 8.0 application with full React 19.1.0 integration for comprehensive automated and manual testing management.

## Features

- **Rails 8.0.2** with **React 19.1.0** integration
- **Invitation-based Authentication** with role management (System Admin, Owner, Admin, Member)
- **Comprehensive Dashboard** with real-time analytics and Chart.js visualizations
- **System Admin Panel** with user/organization management and SMTP configuration
- **Onboarding System** with wizard-style setup for new organizations
- **Automated Testing** upload, analysis, and reporting
- **Manual Testing** case management and execution tracking
- **Capistrano Deployment** ready for AWS and other cloud platforms
- **Turbo Streams** for dynamic page updates
- **Modern UI/UX** with Tailwind CSS 4.1.11 and Flowbite React components
- **Comprehensive Testing** with RSpec and Jest

## Prerequisites

- Ruby 3.4.5 (see `.ruby-version`)
- Node.js 20.19+ (see `.node-version`) 
- Yarn package manager
- PostgreSQL (for database)

## Setup

1. **Install dependencies:**
   ```bash
   bundle install
   yarn install
   ```

2. **Database setup:**
   ```bash
   bin/rails db:create db:migrate db:seed
   ```

3. **Build assets:**
   ```bash
   # Production build (optimized)
   yarn build && yarn build:css
   
   # Development build (with source maps)
   yarn build:dev && yarn build:css
   ```

4. **Start the development server:**
   ```bash
   bin/dev
   # or separately:
   bin/rails server
   ```

5. **Visit the application:**
   Open http://localhost:3000

## Authentication & User Management

### Invitation System

The QA Platform uses an invitation-only registration system:

- **System Admins** can generate invitation codes for new organization owners or users
- **Organization Owners** can invite users to their organization
- **Two types of invitations:**
  - **Owner codes**: For subscription purchasers to create new organizations
  - **User codes**: For inviting members to existing organizations

### User Roles

- **System Admin**: Full platform access, manages all organizations and users
- **Owner**: Organization owner with full organization management rights
- **Admin**: Organization administrator with user management rights  
- **Member**: Regular organization member with testing access

### Creating the First System Admin

```bash
rails console
User.create!(
  email: 'admin@example.com',
  password: 'secure_password',
  password_confirmation: 'secure_password',
  role: 'system_admin',
  confirmed_at: Time.current,
  onboarding_completed: true
)
```

## Capistrano Deployment

### Initial Setup

1. **Configure deployment settings:**
   
   Edit `config/deploy.rb`:
   ```ruby
   set :repo_url, "git@github.com:your-username/your-repo.git"
   set :deploy_to, "/var/www/qa_platform"
   ```

2. **Configure production server:**
   
   Edit `config/deploy/production.rb`:
   ```ruby
   server "your-production-server.com", user: "deploy", roles: %w{app db web}
   ```

3. **Setup SSH keys:**
   ```bash
   # Copy your SSH public key to the server
   ssh-copy-id deploy@your-production-server.com
   ```

### Deployment Commands

```bash
# Initial deployment
cap production deploy:initial

# Regular deployment
cap production deploy

# Upload configuration files
cap production deploy:upload_yml

# Restart application
cap production puma:restart

# Run database migrations
cap production db:migrate

# Seed database (first deployment only)  
cap production deploy:seed
```

### Server Requirements

- Ruby 3.4.5
- Node.js 20.19+ with Yarn
- PostgreSQL
- Nginx (recommended)
- SSL certificate (Let's Encrypt recommended)

### Environment Variables

Create `.env` file on the server with:
```bash
RAILS_MASTER_KEY=your_master_key
DATABASE_URL=postgresql://user:password@localhost/qa_platform_production
RAILS_ENV=production
NODE_ENV=production
```

## System Admin Panel

Access at `/admin/dashboard` (System Admin role required):

### Features
- **Dashboard**: User and organization statistics
- **User Management**: View, manage, and confirm users
- **Organization Management**: Oversee all organizations
- **Invitation Codes**: Generate and manage invitation codes
- **SMTP Settings**: Configure email delivery settings

### Generating Invitation Codes

1. Navigate to Admin Dashboard → Invitation Codes
2. Click "Generate New Code"
3. Select code type (Owner or User)
4. Set expiration and usage limits
5. Send the code via email to new users

## Testing

### Run React Tests
```bash
yarn test                # Run all tests
yarn test:watch         # Watch mode
yarn test:coverage      # With coverage report (85% target)
```

### Run Rails Tests  
```bash
bundle exec rspec                    # RSpec tests
bundle exec rspec --format RspecJunitFormatter --out tmp/rspec_results.xml
```

### Code Quality
```bash
bundle exec rubocop              # Ruby linting
yarn lint                        # JavaScript linting
bundle exec brakeman             # Security scanning
```

## Development Workflow

### Frontend Development

1. **React Components**: Located in `app/javascript/components/`
2. **Styling**: Tailwind CSS with Flowbite React components
3. **Charts**: Chart.js integration for analytics
4. **Real-time Updates**: Turbo Streams for dynamic content

### Backend Development

1. **Controllers**: RESTful APIs with JSON and Turbo Stream responses
2. **Models**: Comprehensive validations and associations
3. **Services**: Business logic separation
4. **Background Jobs**: Sidekiq for email and processing

### Testing Strategy

1. **RSpec**: Model, controller, and integration tests
2. **FactoryBot**: Test data generation
3. **Jest**: React component testing
4. **Capybara**: End-to-end browser testing

## API Documentation

### Dashboard Stats API

```bash
GET /dashboard/stats
```

Returns comprehensive statistics for automated and manual testing.

### Authentication API

Uses Devise with JSON support for API authentication.

## Troubleshooting

### Common Issues

1. **Asset Build Failures**: Ensure Node.js and Yarn are properly installed
2. **Database Connection**: Verify PostgreSQL is running and configured
3. **Permission Errors**: Check file permissions and user access
4. **Missing Dependencies**: Run `bundle install` and `yarn install`

### Logs

- Rails: `log/production.log`
- Puma: `log/puma.error.log`  
- Deployment: Check Capistrano output

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Ensure 85%+ test coverage
5. Submit a pull request

## License

This QA Platform is proprietary software. All rights reserved.
