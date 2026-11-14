-- Wazifa Library — Supabase schema. Run in Supabase SQL Editor.
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  daily_streak int not null default 0,
  last_active_date date,
  preferences_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wazifa_id text not null,
  is_bookmarked boolean not null default false,
  current_count int not null default 0,
  target_count int not null default 0,
  completed_today boolean not null default false,
  last_reset_date date,
  updated_at timestamptz not null default now(),
  unique(user_id, wazifa_id)
);

create table if not exists public.custom_wazaif (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text,
  arabic text,
  transliteration text,
  english_translation text,
  urdu_translation text,
  target_count int not null default 33,
  recommended_time text,
  instructions text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_routines enable row level security;
alter table public.custom_wazaif enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

drop policy if exists "routines_select_own" on public.user_routines;
drop policy if exists "routines_insert_own" on public.user_routines;
drop policy if exists "routines_update_own" on public.user_routines;
drop policy if exists "routines_delete_own" on public.user_routines;
create policy "routines_select_own" on public.user_routines for select using (auth.uid() = user_id);
create policy "routines_insert_own" on public.user_routines for insert with check (auth.uid() = user_id);
create policy "routines_update_own" on public.user_routines for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "routines_delete_own" on public.user_routines for delete using (auth.uid() = user_id);

drop policy if exists "custom_select_own" on public.custom_wazaif;
drop policy if exists "custom_insert_own" on public.custom_wazaif;
drop policy if exists "custom_update_own" on public.custom_wazaif;
drop policy if exists "custom_delete_own" on public.custom_wazaif;
create policy "custom_select_own" on public.custom_wazaif for select using (auth.uid() = user_id);
create policy "custom_insert_own" on public.custom_wazaif for insert with check (auth.uid() = user_id);
create policy "custom_update_own" on public.custom_wazaif for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "custom_delete_own" on public.custom_wazaif for delete using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_profiles_updated on public.profiles;
drop trigger if exists trg_routines_updated on public.user_routines;
drop trigger if exists trg_custom_updated on public.custom_wazaif;
create trigger trg_profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_routines_updated before update on public.user_routines for each row execute function public.set_updated_at();
create trigger trg_custom_updated before update on public.custom_wazaif for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
