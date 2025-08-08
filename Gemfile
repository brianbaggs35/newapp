source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.0.2"
# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "propshaft"
# Use postgresql as the database for Active Record
gem "pg"
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"
# Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem "jsbundling-rails"
# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails"
# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "stimulus-rails"
# Bundle and process CSS [https://github.com/rails/cssbundling-rails]
gem "cssbundling-rails"
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem "bcrypt", "~> 3.1.7"

# Devise for authentication
gem "devise"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Deploy this application anywhere as a Docker container [https://kamal-deploy.org]
gem "kamal", require: false

# Add HTTP asset caching/compression and X-Sendfile acceleration to Puma [https://github.com/basecamp/thruster/]
gem "thruster", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
gem "image_processing", "~> 1.2"

# Deployment with Capistrano
gem "capistrano", "~> 3.18"
gem "capistrano-rails", "~> 1.6"
gem "capistrano-bundler", "~> 2.1"
gem "capistrano3-puma", "~> 6.0"
gem "capistrano-nvm", require: false
gem "capistrano-yarn"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"

  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem "brakeman", require: false

  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem "rubocop-rails-omakase", require: false

  # RSpec for testing
  gem "rspec-rails", "~> 8.0"
  gem "factory_bot_rails", "~> 6.4"
  gem "rspec_junit_formatter", "~> 0.6"
end

group :test do
  gem "simplecov", require: false
  gem "simplecov-lcov", require: false
  gem "capybara", "~> 3.40"
  gem "selenium-webdriver"
  gem "webdrivers"
end

# XML parsing for JUnit files
gem "nokogiri"

# UUID support and multi-tenancy
gem "apartment"
gem "acts_as_tenant"

# File upload and processing (already specified above with version constraint)

# PDF generation for reports
gem "wicked_pdf"
gem "wkhtmltopdf-binary"

# Background job processing
gem "sidekiq", "~> 7.0"
gem "sidekiq-cron", "~> 2.0"

# Authorization and role management
gem "cancancan", "~> 3.6"

# API serialization
gem "jsonapi-serializer", "~> 2.2"

# Pagination
gem "kaminari", "~> 1.2"

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console"
end
