-- Seeder for admin user (for local/dev only)
-- Admin user_id: 11111111-1111-1111-1111-111111111111

-- Insert into auth.users (Supabase default auth table)
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values (
  '11111111-1111-1111-1111-111111111111',
  'admin@softlearner.com',
  crypt('AdminPassword123!', gen_salt('bf')),
  now()
);
