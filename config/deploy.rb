# config valid for current version and patch releases of Capistrano
lock "~> 3.18.0"

set :application, "qa_platform"
set :repo_url, "git@github.com:your-username/qa-platform.git"

# Default branch is :master
set :branch, "master"

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/var/www/qa_platform"

# Default value for :format is :airbrussh
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults:
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files, "config/database.yml", "config/master.key", ".env"

# Default value for :linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system", "vendor", "storage"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

# Puma configuration
set :puma_threads,    [4, 16]
set :puma_workers,    0
set :puma_bind,       "unix://#{shared_path}/tmp/sockets/#{fetch(:application)}-puma.sock"
set :puma_state,      "#{shared_path}/tmp/pids/puma.state"
set :puma_pid,        "#{shared_path}/tmp/pids/puma.pid"
set :puma_access_log, "#{release_path}/log/puma.access.log"
set :puma_error_log,  "#{release_path}/log/puma.error.log"
set :puma_preload_app, true
set :puma_worker_timeout, nil
set :puma_init_active_record, true  # Change to false when not using ActiveRecord

# Node.js and Yarn configuration
set :nvm_type, :user # or :system, depends on your nvm installation
set :nvm_node, 'v20.19.0'
set :nvm_map_bins, %w{node npm yarn}

# Yarn configuration
set :yarn_flags, '--production --silent --no-progress'

namespace :puma do
  desc 'Create Directories for Puma Pids and Sockets'
  task :make_dirs do
    on roles(:app) do
      execute "mkdir -p #{shared_path}/tmp/sockets #{shared_path}/tmp/pids"
    end
  end

  before :start, :make_dirs
end

namespace :deploy do
  desc "Make sure local git is in sync with remote."
  task :check_revision do
    on roles(:app) do
      unless `git rev-parse HEAD` == `git rev-parse origin/#{fetch(:branch)}`
        puts "WARNING: HEAD is not the same as origin/#{fetch(:branch)}"
        puts "Run `git push` to sync changes."
        exit
      end
    end
  end

  desc 'Initial Deploy'
  task :initial do
    on roles(:app) do
      before 'deploy:restart', 'puma:start'
      invoke 'deploy'
    end
  end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 1 do
      invoke 'puma:restart'
    end
  end

  desc 'Upload to shared/config'
  task :upload_yml do
    on roles(:app) do
      execute "mkdir -p #{shared_path}/config"
      upload! StringIO.new(File.read("config/database.yml")), "#{shared_path}/config/database.yml" if File.exist?("config/database.yml")
      upload! StringIO.new(File.read("config/master.key")), "#{shared_path}/config/master.key" if File.exist?("config/master.key")
    end
  end

  desc 'Seed the database'
  task :seed do
    on roles(:app) do
      within "#{current_path}" do
        with rails_env: "#{fetch(:stage)}" do
          execute :rake, "db:seed"
        end
      end
    end
  end

  desc 'Build frontend assets'
  task :build_assets do
    on roles(:app) do
      within release_path do
        execute :yarn, "build"
        execute :yarn, "build:css"
      end
    end
  end

  before :check_revision, :check_revision
  after  'deploy:symlink:shared', 'deploy:build_assets'
  after  :finishing,    'deploy:cleanup'
  after  :finishing,    'puma:restart'
end