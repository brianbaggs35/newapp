FactoryBot.define do
  factory :smtp_setting do
    host { 'smtp.gmail.com' }
    port { 587 }
    username { 'user@gmail.com' }
    password { 'secret123' }
    authentication { 'plain' }
    enable_starttls_auto { true }
    from_email { 'noreply@example.com' }
    from_name { 'QA Platform' }
  end
end