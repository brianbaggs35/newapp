# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_07_134555) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "failure_analyses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.uuid "test_result_id", null: false
    t.bigint "organization_id", null: false
    t.bigint "assigned_to_id"
    t.bigint "created_by_id", null: false
    t.bigint "updated_by_id"
    t.string "status", default: "to_do", null: false
    t.string "priority", default: "medium", null: false
    t.text "notes"
    t.text "resolution_notes"
    t.datetime "resolved_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assigned_to_id"], name: "index_failure_analyses_on_assigned_to_id"
    t.index ["created_by_id"], name: "index_failure_analyses_on_created_by_id"
    t.index ["organization_id", "status"], name: "index_failure_analyses_on_organization_id_and_status"
    t.index ["organization_id"], name: "index_failure_analyses_on_organization_id"
    t.index ["test_result_id"], name: "index_failure_analyses_on_test_result_id"
    t.index ["updated_by_id"], name: "index_failure_analyses_on_updated_by_id"
    t.index ["uuid"], name: "index_failure_analyses_on_uuid", unique: true
  end

  create_table "invitation_codes", force: :cascade do |t|
    t.string "code", null: false
    t.string "code_type", null: false
    t.integer "max_uses", default: 1, null: false
    t.integer "uses_count", default: 0, null: false
    t.datetime "expires_at"
    t.bigint "organization_id"
    t.bigint "created_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_invitation_codes_on_code", unique: true
    t.index ["code_type", "expires_at"], name: "index_invitation_codes_on_code_type_and_expires_at"
    t.index ["created_by_id"], name: "index_invitation_codes_on_created_by_id"
    t.index ["organization_id"], name: "index_invitation_codes_on_organization_id"
    t.index ["uses_count", "max_uses"], name: "index_invitation_codes_on_uses_count_and_max_uses"
  end

  create_table "manual_test_cases", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.text "preconditions"
    t.text "steps", null: false
    t.text "expected_result", null: false
    t.text "actual_result"
    t.string "priority", default: "medium"
    t.string "status", default: "draft"
    t.string "category"
    t.text "tags"
    t.integer "estimated_time"
    t.bigint "organization_id", null: false
    t.bigint "created_by_id", null: false
    t.bigint "updated_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "module_name", limit: 100
    t.string "environment", limit: 100
    t.string "account", limit: 100
    t.bigint "test_suite_id"
    t.index ["category"], name: "index_manual_test_cases_on_category"
    t.index ["created_at"], name: "index_manual_test_cases_on_created_at"
    t.index ["created_by_id"], name: "index_manual_test_cases_on_created_by_id"
    t.index ["organization_id"], name: "index_manual_test_cases_on_organization_id"
    t.index ["priority"], name: "index_manual_test_cases_on_priority"
    t.index ["status"], name: "index_manual_test_cases_on_status"
    t.index ["test_suite_id"], name: "index_manual_test_cases_on_test_suite_id"
    t.index ["updated_by_id"], name: "index_manual_test_cases_on_updated_by_id"
    t.index ["uuid"], name: "index_manual_test_cases_on_uuid", unique: true
  end

  create_table "manual_test_run_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.uuid "manual_test_run_id", null: false
    t.bigint "manual_test_case_id", null: false
    t.bigint "organization_id", null: false
    t.bigint "executed_by_id"
    t.string "status", default: "to_do", null: false
    t.text "actual_results"
    t.text "failure_information"
    t.text "notes"
    t.decimal "execution_time", precision: 8, scale: 2
    t.datetime "executed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["executed_by_id"], name: "index_manual_test_run_items_on_executed_by_id"
    t.index ["manual_test_case_id"], name: "index_manual_test_run_items_on_manual_test_case_id"
    t.index ["manual_test_run_id", "status"], name: "index_manual_test_run_items_on_manual_test_run_id_and_status"
    t.index ["manual_test_run_id"], name: "index_manual_test_run_items_on_manual_test_run_id"
    t.index ["organization_id"], name: "index_manual_test_run_items_on_organization_id"
    t.index ["uuid"], name: "index_manual_test_run_items_on_uuid", unique: true
  end

  create_table "manual_test_runs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "name", null: false
    t.text "description"
    t.bigint "organization_id", null: false
    t.bigint "created_by_id", null: false
    t.string "status", default: "planning", null: false
    t.datetime "started_at"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_manual_test_runs_on_created_by_id"
    t.index ["organization_id", "status"], name: "index_manual_test_runs_on_organization_id_and_status"
    t.index ["organization_id"], name: "index_manual_test_runs_on_organization_id"
    t.index ["uuid"], name: "index_manual_test_runs_on_uuid", unique: true
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "industry"
    t.string "size"
    t.bigint "created_by_id"
    t.index ["active"], name: "index_organizations_on_active"
    t.index ["created_by_id"], name: "index_organizations_on_created_by_id"
    t.index ["name"], name: "index_organizations_on_name", unique: true
    t.index ["uuid"], name: "index_organizations_on_uuid", unique: true
  end

  create_table "smtp_settings", force: :cascade do |t|
    t.string "host", null: false
    t.integer "port", default: 587, null: false
    t.string "username"
    t.string "password"
    t.string "authentication", default: "plain"
    t.boolean "enable_starttls_auto", default: true
    t.string "from_email", null: false
    t.string "from_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "test_cases", force: :cascade do |t|
    t.string "name"
    t.string "project"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "test_suite_id"
    t.string "status", default: "pending"
    t.float "duration"
    t.text "failure_message"
    t.string "error_type"
    t.datetime "executed_at"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["test_suite_id"], name: "index_test_cases_on_test_suite_id"
    t.index ["uuid"], name: "index_test_cases_on_uuid", unique: true
  end

  create_table "test_execution_cycles", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.bigint "organization_id", null: false
    t.bigint "created_by_id", null: false
    t.string "status", default: "planned"
    t.datetime "planned_start_date"
    t.datetime "planned_end_date"
    t.datetime "actual_start_date"
    t.datetime "actual_end_date"
    t.text "environment_details"
    t.text "entry_criteria"
    t.text "exit_criteria"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["actual_start_date"], name: "index_test_execution_cycles_on_actual_start_date"
    t.index ["created_by_id"], name: "index_test_execution_cycles_on_created_by_id"
    t.index ["organization_id"], name: "index_test_execution_cycles_on_organization_id"
    t.index ["planned_start_date"], name: "index_test_execution_cycles_on_planned_start_date"
    t.index ["status"], name: "index_test_execution_cycles_on_status"
    t.index ["uuid"], name: "index_test_execution_cycles_on_uuid", unique: true
  end

  create_table "test_executions", force: :cascade do |t|
    t.bigint "manual_test_case_id", null: false
    t.bigint "executed_by_id", null: false
    t.bigint "organization_id", null: false
    t.string "status", default: "pending"
    t.text "actual_result"
    t.text "notes"
    t.string "defect_id"
    t.integer "execution_time"
    t.text "screenshots_urls"
    t.datetime "started_at"
    t.datetime "completed_at"
    t.datetime "executed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "test_execution_cycle_id"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["executed_at"], name: "index_test_executions_on_executed_at"
    t.index ["executed_by_id"], name: "index_test_executions_on_executed_by_id"
    t.index ["manual_test_case_id", "executed_at"], name: "index_test_executions_on_manual_test_case_id_and_executed_at"
    t.index ["manual_test_case_id"], name: "index_test_executions_on_manual_test_case_id"
    t.index ["organization_id"], name: "index_test_executions_on_organization_id"
    t.index ["status"], name: "index_test_executions_on_status"
    t.index ["test_execution_cycle_id", "status"], name: "index_test_executions_on_test_execution_cycle_id_and_status"
    t.index ["test_execution_cycle_id"], name: "index_test_executions_on_test_execution_cycle_id"
    t.index ["uuid"], name: "index_test_executions_on_uuid", unique: true
  end

  create_table "test_results", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.uuid "test_run_id", null: false
    t.bigint "organization_id", null: false
    t.string "class_name", null: false
    t.string "test_name", null: false
    t.string "status", null: false
    t.decimal "duration", precision: 10, scale: 3
    t.text "failure_message"
    t.text "error_message"
    t.string "error_type"
    t.text "system_out"
    t.text "system_err"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id", "status"], name: "index_test_results_on_organization_id_and_status"
    t.index ["organization_id"], name: "index_test_results_on_organization_id"
    t.index ["test_run_id", "status"], name: "index_test_results_on_test_run_id_and_status"
    t.index ["test_run_id"], name: "index_test_results_on_test_run_id"
    t.index ["uuid"], name: "index_test_results_on_uuid", unique: true
  end

  create_table "test_runs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "name", null: false
    t.text "description"
    t.bigint "organization_id", null: false
    t.bigint "created_by_id", null: false
    t.string "status", default: "pending", null: false
    t.integer "total_tests", default: 0
    t.integer "passed_tests", default: 0
    t.integer "failed_tests", default: 0
    t.integer "skipped_tests", default: 0
    t.decimal "duration", precision: 10, scale: 3
    t.datetime "started_at"
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_test_runs_on_created_at"
    t.index ["created_by_id"], name: "index_test_runs_on_created_by_id"
    t.index ["organization_id", "status"], name: "index_test_runs_on_organization_id_and_status"
    t.index ["organization_id"], name: "index_test_runs_on_organization_id"
    t.index ["uuid"], name: "index_test_runs_on_uuid", unique: true
  end

  create_table "test_suites", force: :cascade do |t|
    t.string "name"
    t.string "project"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "total_tests", default: 0
    t.integer "passed_tests", default: 0
    t.integer "failed_tests", default: 0
    t.integer "skipped_tests", default: 0
    t.float "total_duration", default: 0.0
    t.datetime "executed_at"
    t.bigint "organization_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "created_by_id"
    t.index ["created_by_id"], name: "index_test_suites_on_created_by_id"
    t.index ["organization_id", "name"], name: "index_test_suites_on_organization_id_and_name"
    t.index ["organization_id"], name: "index_test_suites_on_organization_id"
    t.index ["uuid"], name: "index_test_suites_on_uuid", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role", default: "test_runner"
    t.bigint "organization_id"
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "invitation_code_id"
    t.boolean "onboarding_completed", default: false, null: false
    t.string "first_name"
    t.string "last_name"
    t.string "phone"
    t.string "job_title"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_code_id"], name: "index_users_on_invitation_code_id"
    t.index ["onboarding_completed"], name: "index_users_on_onboarding_completed"
    t.index ["organization_id", "role"], name: "index_users_on_organization_id_and_role"
    t.index ["organization_id"], name: "index_users_on_organization_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role"], name: "index_users_on_role"
    t.index ["uuid"], name: "index_users_on_uuid", unique: true
  end

  add_foreign_key "failure_analyses", "organizations"
  add_foreign_key "failure_analyses", "test_results"
  add_foreign_key "failure_analyses", "users", column: "assigned_to_id"
  add_foreign_key "failure_analyses", "users", column: "created_by_id"
  add_foreign_key "failure_analyses", "users", column: "updated_by_id"
  add_foreign_key "invitation_codes", "organizations"
  add_foreign_key "invitation_codes", "users", column: "created_by_id"
  add_foreign_key "manual_test_cases", "organizations"
  add_foreign_key "manual_test_cases", "test_suites"
  add_foreign_key "manual_test_cases", "users", column: "created_by_id"
  add_foreign_key "manual_test_cases", "users", column: "updated_by_id"
  add_foreign_key "manual_test_run_items", "manual_test_cases"
  add_foreign_key "manual_test_run_items", "manual_test_runs"
  add_foreign_key "manual_test_run_items", "organizations"
  add_foreign_key "manual_test_run_items", "users", column: "executed_by_id"
  add_foreign_key "manual_test_runs", "organizations"
  add_foreign_key "manual_test_runs", "users", column: "created_by_id"
  add_foreign_key "organizations", "users", column: "created_by_id"
  add_foreign_key "test_cases", "test_suites"
  add_foreign_key "test_execution_cycles", "organizations"
  add_foreign_key "test_execution_cycles", "users", column: "created_by_id"
  add_foreign_key "test_executions", "manual_test_cases"
  add_foreign_key "test_executions", "organizations"
  add_foreign_key "test_executions", "test_execution_cycles"
  add_foreign_key "test_executions", "users", column: "executed_by_id"
  add_foreign_key "test_results", "organizations"
  add_foreign_key "test_results", "test_runs"
  add_foreign_key "test_runs", "organizations"
  add_foreign_key "test_runs", "users", column: "created_by_id"
  add_foreign_key "test_suites", "organizations"
  add_foreign_key "test_suites", "users", column: "created_by_id"
  add_foreign_key "users", "invitation_codes"
  add_foreign_key "users", "organizations"
end
