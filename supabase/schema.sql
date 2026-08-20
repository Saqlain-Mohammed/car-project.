-- ═══════════════════════════════════════════════════════════════════════════
--  TORQUEGRID — COMPLETE BACKEND SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════
--
--  Single authoritative file. Replaces the previous four-script setup
--  (schema / addendum / realtime / community+seed), which had to be run in a
--  specific order and could not be re-run.
--
--  HOW TO RUN
--    Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
--
--  This script is IDEMPOTENT: running it twice is safe and is the intended
--  way to apply changes. Every object uses IF NOT EXISTS, CREATE OR REPLACE,
--  or an explicit DROP-then-CREATE. Postgres has no CREATE POLICY IF NOT
--  EXISTS, which is what made the old scripts fail on a second run
--  (error 42710), so every policy here is dropped first.
--
--  ORDER OF SECTIONS
--    1  Extensions
--    2  Identity: profiles, follows, badges
--    3  Vehicles / garage
--    4  Posts, comments, likes, saves
--    5  Communities
--    6  Events
--    7  Marketplace
--    8  Services
--    9  Knowledge: catalog, parts, guides, news
--   10  Motorsport
--   11  Notifications
--   12  Counter triggers
--   13  Row Level Security
--   14  Grants
--   15  Storage buckets
--   16  Realtime publication
--   17  Reference seed data
-- ═══════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════════
--  1. EXTENSIONS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- fuzzy text search


-- ═══════════════════════════════════════════════════════════════════════════
--  2. IDENTITY
-- ═══════════════════════════════════════════════════════════════════════════

-- One row per auth user. `id` mirrors auth.users.id so every foreign key in
-- the app can point at profiles instead of reaching into the auth schema.
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL,
  display_name    TEXT,
  bio             TEXT,
  avatar_url      TEXT,
  cover_url       TEXT,
  location        TEXT,
  website         TEXT,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  is_company      BOOLEAN NOT NULL DEFAULT FALSE,
  -- Denormalised counters, maintained by triggers in section 12.
  follower_count  INTEGER NOT NULL DEFAULT 0,
  following_count INTEGER NOT NULL DEFAULT 0,
  post_count      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_username_trgm_idx
  ON public.profiles USING GIN (username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS profiles_follower_count_idx
  ON public.profiles (follower_count DESC);

-- Directed follow edge. The CHECK stops a user following themselves; the
-- primary key stops duplicates, so a double-tap is a no-op rather than an error.
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT follows_no_self CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS follows_following_idx ON public.follows (following_id);

CREATE TABLE IF NOT EXISTS public.badge_definitions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,
  tone        TEXT
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id   UUID NOT NULL REFERENCES public.badge_definitions(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);


-- ═══════════════════════════════════════════════════════════════════════════
--  3. VEHICLES / GARAGE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.vehicles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  make         TEXT NOT NULL,
  model        TEXT NOT NULL,
  year         INTEGER,
  type         TEXT NOT NULL DEFAULT 'car' CHECK (type IN ('car','bike')),
  nickname     TEXT,
  colour       TEXT,
  description  TEXT,
  image_urls   TEXT[] NOT NULL DEFAULT '{}',
  is_primary   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vehicles_owner_idx ON public.vehicles (owner_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.vehicle_modifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id  UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  category    TEXT,
  brand       TEXT,
  cost        NUMERIC(12,2),
  notes       TEXT,
  installed_at DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vehicle_mods_vehicle_idx ON public.vehicle_modifications (vehicle_id);

CREATE TABLE IF NOT EXISTS public.vehicle_timeline (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id  UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT,
  entry_type  TEXT DEFAULT 'note',
  odometer    INTEGER,
  image_urls  TEXT[] NOT NULL DEFAULT '{}',
  happened_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vehicle_timeline_vehicle_idx
  ON public.vehicle_timeline (vehicle_id, happened_at DESC);


-- ═══════════════════════════════════════════════════════════════════════════
--  4. POSTS
-- ═══════════════════════════════════════════════════════════════════════════

-- `content_type` is the surface (feed post, reel, wallpaper...); `post_type`
-- separates ordinary member posts from company/brand posts. The frontend
-- filters on both, so both are indexed.
CREATE TABLE IF NOT EXISTS public.posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         TEXT,
  body          TEXT,
  media_urls    TEXT[] NOT NULL DEFAULT '{}',
  content_type  TEXT NOT NULL DEFAULT 'post'
                CHECK (content_type IN ('post','reel','wallpaper','skill','spotting')),
  post_type     TEXT NOT NULL DEFAULT 'member'
                CHECK (post_type IN ('member','company')),
  tags          TEXT[] NOT NULL DEFAULT '{}',
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  like_count    INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  view_count    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_feed_idx
  ON public.posts (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_content_type_idx
  ON public.posts (content_type, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_post_type_idx
  ON public.posts (post_type, created_at DESC);
CREATE INDEX IF NOT EXISTS posts_author_idx
  ON public.posts (author_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS post_likes_user_idx ON public.post_likes (user_id);

CREATE TABLE IF NOT EXISTS public.saved_posts (
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS saved_posts_user_idx
  ON public.saved_posts (user_id, created_at DESC);

-- `parent_id` self-reference gives one level of threaded replies.
CREATE TABLE IF NOT EXISTS public.comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id  UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comments_post_idx ON public.comments (post_id, created_at);


-- ═══════════════════════════════════════════════════════════════════════════
--  5. COMMUNITIES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.communities (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  description  TEXT,
  type         TEXT NOT NULL DEFAULT 'crew'
               CHECK (type IN ('crew','brand','region','interest')),
  cover_url    TEXT,
  avatar_url   TEXT,
  is_private   BOOLEAN NOT NULL DEFAULT FALSE,
  owner_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  member_count INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS communities_type_idx ON public.communities (type);
CREATE INDEX IF NOT EXISTS communities_members_idx ON public.communities (member_count DESC);

CREATE TABLE IF NOT EXISTS public.community_members (
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member','mod','owner')),
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (community_id, user_id)
);

CREATE INDEX IF NOT EXISTS community_members_user_idx ON public.community_members (user_id);

CREATE TABLE IF NOT EXISTS public.community_messages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  sender_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body         TEXT NOT NULL,
  media_url    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_messages_room_idx
  ON public.community_messages (community_id, created_at DESC);


-- ═══════════════════════════════════════════════════════════════════════════
--  6. EVENTS / MEETUPS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.events (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  event_type     TEXT NOT NULL DEFAULT 'meetup'
                 CHECK (event_type IN ('meetup','trackday','show','drive','workshop')),
  cover_url      TEXT,
  location       TEXT,
  city           TEXT,
  starts_at      TIMESTAMPTZ NOT NULL,
  ends_at        TIMESTAMPTZ,
  capacity       INTEGER,
  attendee_count INTEGER NOT NULL DEFAULT 0,
  is_published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_upcoming_idx
  ON public.events (is_published, starts_at);
CREATE INDEX IF NOT EXISTS events_type_idx ON public.events (event_type, starts_at);

CREATE TABLE IF NOT EXISTS public.event_attendees (
  event_id   UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'going'
             CHECK (status IN ('going','interested','waitlist')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS event_attendees_user_idx ON public.event_attendees (user_id);


-- ═══════════════════════════════════════════════════════════════════════════
--  7. MARKETPLACE
-- ═══════════════════════════════════════════════════════════════════════════

-- Vehicles and parts are separate tables because their attributes barely
-- overlap. Enquiries point at either one via (listing_id, listing_type),
-- which is why listing_id carries no foreign key.
CREATE TABLE IF NOT EXISTS public.marketplace_vehicles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  make        TEXT,
  model       TEXT,
  year        INTEGER,
  type        TEXT DEFAULT 'car' CHECK (type IN ('car','bike')),
  condition   TEXT DEFAULT 'used' CHECK (condition IN ('new','used','salvage')),
  price       NUMERIC(12,2) NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'INR',
  odometer    INTEGER,
  city        TEXT,
  image_urls  TEXT[] NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active','sold','draft','removed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mkt_vehicles_browse_idx
  ON public.marketplace_vehicles (status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.marketplace_parts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  category    TEXT,
  brand       TEXT,
  condition   TEXT DEFAULT 'used' CHECK (condition IN ('new','used','refurbished')),
  price       NUMERIC(12,2) NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'INR',
  fits        TEXT,
  city        TEXT,
  image_urls  TEXT[] NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active','sold','draft','removed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mkt_parts_browse_idx
  ON public.marketplace_parts (status, created_at DESC);
CREATE INDEX IF NOT EXISTS mkt_parts_category_idx ON public.marketplace_parts (category);

CREATE TABLE IF NOT EXISTS public.marketplace_enquiries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id   UUID NOT NULL,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('vehicle','part')),
  buyer_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message      TEXT,
  offer_price  NUMERIC(12,2),
  status       TEXT NOT NULL DEFAULT 'open'
               CHECK (status IN ('open','replied','closed')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mkt_enquiries_listing_idx
  ON public.marketplace_enquiries (listing_id, listing_type);


-- ═══════════════════════════════════════════════════════════════════════════
--  8. SERVICES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.services (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  service_type TEXT NOT NULL,
  speciality   TEXT,
  description  TEXT,
  city         TEXT,
  phone        TEXT,
  price_label  TEXT,
  rating       NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  is_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS services_browse_idx
  ON public.services (is_active, rating DESC);
CREATE INDEX IF NOT EXISTS services_type_idx ON public.services (service_type);

CREATE TABLE IF NOT EXISTS public.service_reviews (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id  UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (service_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS service_reviews_service_idx ON public.service_reviews (service_id);

-- The "Get quote" form. user_id is nullable so a signed-out visitor can still
-- request a callback; service_id is nullable because the static provider cards
-- are not all backed by a services row yet.
CREATE TABLE IF NOT EXISTS public.service_enquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id    UUID REFERENCES public.services(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  phone         TEXT NOT NULL,
  message       TEXT,
  service_type  TEXT,
  provider_name TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','contacted','resolved')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS service_enquiries_new_idx
  ON public.service_enquiries (status, created_at DESC);


-- ═══════════════════════════════════════════════════════════════════════════
--  9. KNOWLEDGE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.vehicle_catalog (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make          TEXT NOT NULL,
  model         TEXT NOT NULL,
  year          INTEGER,
  type          TEXT DEFAULT 'car' CHECK (type IN ('car','bike')),
  body_style    TEXT,
  engine        TEXT,
  power_bhp     INTEGER,
  torque_nm     INTEGER,
  transmission  TEXT,
  fuel          TEXT,
  price_label   TEXT,
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (make, model, year)
);

CREATE INDEX IF NOT EXISTS vehicle_catalog_make_idx ON public.vehicle_catalog (make, model);

CREATE TABLE IF NOT EXISTS public.car_parts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT,
  function    TEXT,
  symptoms    TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name, category)
);

CREATE INDEX IF NOT EXISTS car_parts_category_idx ON public.car_parts (category, name);

CREATE TABLE IF NOT EXISTS public.maintenance_guides (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE,
  summary      TEXT,
  body         TEXT,
  category     TEXT,
  difficulty   TEXT CHECK (difficulty IN ('beginner','intermediate','advanced')),
  duration_min INTEGER,
  cover_url    TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  view_count   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS guides_browse_idx
  ON public.maintenance_guides (is_published, created_at DESC);

CREATE TABLE IF NOT EXISTS public.news_articles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  body         TEXT,
  cover_url    TEXT,
  category     TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  view_count   INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS news_browse_idx
  ON public.news_articles (is_published, published_at DESC);


-- ═══════════════════════════════════════════════════════════════════════════
-- 10. MOTORSPORT
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.motorsport_series (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug     TEXT UNIQUE NOT NULL,
  name     TEXT NOT NULL,
  category TEXT,
  logo_url TEXT
);

CREATE TABLE IF NOT EXISTS public.motorsport_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  series_id  UUID REFERENCES public.motorsport_series(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  circuit    TEXT,
  country    TEXT,
  -- The Community page reads the row flagged 'live' to drive its live widget.
  status     TEXT NOT NULL DEFAULT 'scheduled'
             CHECK (status IN ('scheduled','live','finished','cancelled')),
  starts_at  TIMESTAMPTZ NOT NULL,
  ends_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS motorsport_live_idx
  ON public.motorsport_events (status, starts_at DESC);

CREATE TABLE IF NOT EXISTS public.motorsport_comments (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id   UUID NOT NULL REFERENCES public.motorsport_events(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS motorsport_comments_event_idx
  ON public.motorsport_comments (event_id, created_at DESC);


-- ═══════════════════════════════════════════════════════════════════════════
-- 11. NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- `actor_id` is the person who caused the notification. The frontend joins it
-- as `actor:actor_id ( username, avatar_url )`.
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL
             CHECK (type IN ('follow','like','comment','event','marketplace','system')),
  body       TEXT NOT NULL,
  entity_id  UUID,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_inbox_idx
  ON public.notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_unread_idx
  ON public.notifications (user_id, is_read);


-- ═══════════════════════════════════════════════════════════════════════════
-- 12. TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════════
--  Counters live on the parent row so feeds do not need a COUNT() per card.
--  Every function is SECURITY DEFINER because it writes rows the acting user
--  has no direct UPDATE grant on, and pins search_path to resist hijacking.
-- ═══════════════════════════════════════════════════════════════════════════

-- Creates the profile row when someone signs up. Without this, signup succeeds
-- in auth.users but every profile join returns nothing.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  base_name TEXT;
  final_name TEXT;
  suffix INTEGER := 0;
BEGIN
  base_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'username', ''),
    SPLIT_PART(NEW.email, '@', 1)
  );
  final_name := base_name;

  -- username is UNIQUE; fall back to name1, name2... rather than failing
  -- the signup transaction outright.
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_name) LOOP
    suffix := suffix + 1;
    final_name := base_name || suffix::TEXT;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name)
  VALUES (NEW.id, final_name, NEW.raw_user_meta_data->>'display_name')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Generic counter helper: bump a column on a parent table by +1 / -1.
CREATE OR REPLACE FUNCTION public.bump_counter(
  tbl TEXT, col TEXT, key_col TEXT, key_val UUID, delta INTEGER
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  EXECUTE FORMAT(
    'UPDATE public.%I SET %I = GREATEST(0, %I + $1) WHERE %I = $2',
    tbl, col, col, key_col
  ) USING delta, key_val;
END;
$$;


CREATE OR REPLACE FUNCTION public.on_follow_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.bump_counter('profiles','follower_count','id', NEW.following_id, 1);
    PERFORM public.bump_counter('profiles','following_count','id', NEW.follower_id, 1);
    INSERT INTO public.notifications (user_id, actor_id, type, body, entity_id)
    VALUES (NEW.following_id, NEW.follower_id, 'follow', 'started following you', NEW.follower_id);
  ELSE
    PERFORM public.bump_counter('profiles','follower_count','id', OLD.following_id, -1);
    PERFORM public.bump_counter('profiles','following_count','id', OLD.follower_id, -1);
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_follow_change ON public.follows;
CREATE TRIGGER trg_follow_change
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.on_follow_change();


CREATE OR REPLACE FUNCTION public.on_post_like_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.bump_counter('posts','like_count','id', NEW.post_id, 1);
    SELECT author_id INTO owner FROM public.posts WHERE id = NEW.post_id;
    -- No point telling someone they liked their own post.
    IF owner IS NOT NULL AND owner <> NEW.user_id THEN
      INSERT INTO public.notifications (user_id, actor_id, type, body, entity_id)
      VALUES (owner, NEW.user_id, 'like', 'liked your post', NEW.post_id);
    END IF;
  ELSE
    PERFORM public.bump_counter('posts','like_count','id', OLD.post_id, -1);
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_post_like_change ON public.post_likes;
CREATE TRIGGER trg_post_like_change
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.on_post_like_change();


CREATE OR REPLACE FUNCTION public.on_comment_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.bump_counter('posts','comment_count','id', NEW.post_id, 1);
    SELECT author_id INTO owner FROM public.posts WHERE id = NEW.post_id;
    IF owner IS NOT NULL AND owner <> NEW.author_id THEN
      INSERT INTO public.notifications (user_id, actor_id, type, body, entity_id)
      VALUES (owner, NEW.author_id, 'comment', 'commented on your post', NEW.post_id);
    END IF;
  ELSE
    PERFORM public.bump_counter('posts','comment_count','id', OLD.post_id, -1);
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_comment_change ON public.comments;
CREATE TRIGGER trg_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.on_comment_change();


CREATE OR REPLACE FUNCTION public.on_post_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.bump_counter('profiles','post_count','id', NEW.author_id, 1);
  ELSE
    PERFORM public.bump_counter('profiles','post_count','id', OLD.author_id, -1);
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_post_change ON public.posts;
CREATE TRIGGER trg_post_change
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.on_post_change();


CREATE OR REPLACE FUNCTION public.on_community_member_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.bump_counter('communities','member_count','id', NEW.community_id, 1);
  ELSE
    PERFORM public.bump_counter('communities','member_count','id', OLD.community_id, -1);
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_community_member_change ON public.community_members;
CREATE TRIGGER trg_community_member_change
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.on_community_member_change();


CREATE OR REPLACE FUNCTION public.on_event_attendee_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.bump_counter('events','attendee_count','id', NEW.event_id, 1);
  ELSE
    PERFORM public.bump_counter('events','attendee_count','id', OLD.event_id, -1);
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_event_attendee_change ON public.event_attendees;
CREATE TRIGGER trg_event_attendee_change
  AFTER INSERT OR DELETE ON public.event_attendees
  FOR EACH ROW EXECUTE FUNCTION public.on_event_attendee_change();


-- Recomputes a service's rating from its reviews. Called by a trigger so the
-- client never has to write the aggregate itself.
CREATE OR REPLACE FUNCTION public.refresh_service_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target UUID;
BEGIN
  target := COALESCE(NEW.service_id, OLD.service_id);
  UPDATE public.services s
  SET rating = COALESCE(ROUND(agg.avg_rating::NUMERIC, 2), 0),
      review_count = COALESCE(agg.n, 0)
  FROM (
    SELECT AVG(rating) AS avg_rating, COUNT(*) AS n
    FROM public.service_reviews WHERE service_id = target
  ) agg
  WHERE s.id = target;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_service_review_change ON public.service_reviews;
CREATE TRIGGER trg_service_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.service_reviews
  FOR EACH ROW EXECUTE FUNCTION public.refresh_service_rating();


-- Called by the client as supabase.rpc('increment_post_views', { post_id }).
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS VOID
LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$
  UPDATE public.posts SET view_count = view_count + 1 WHERE id = post_id;
$$;

GRANT EXECUTE ON FUNCTION public.increment_post_views(UUID) TO anon, authenticated;


-- Same pattern for the knowledge surfaces. These exist so the client never
-- needs a general UPDATE grant on published content just to count a read.
CREATE OR REPLACE FUNCTION public.increment_guide_views(guide_id UUID)
RETURNS VOID
LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$
  UPDATE public.maintenance_guides
  SET view_count = view_count + 1
  WHERE id = guide_id AND is_published;
$$;

CREATE OR REPLACE FUNCTION public.increment_article_views(article_id UUID)
RETURNS VOID
LANGUAGE SQL SECURITY DEFINER SET search_path = public
AS $$
  UPDATE public.news_articles
  SET view_count = view_count + 1
  WHERE id = article_id AND is_published;
$$;

GRANT EXECUTE ON FUNCTION public.increment_guide_views(UUID)   TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_article_views(UUID) TO anon, authenticated;


-- Keeps updated_at honest on the tables that expose it.
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END; $$;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','vehicles','posts'] LOOP
    EXECUTE FORMAT('DROP TRIGGER IF EXISTS trg_touch_%1$s ON public.%1$I', t);
    EXECUTE FORMAT(
      'CREATE TRIGGER trg_touch_%1$s BEFORE UPDATE ON public.%1$I
       FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', t);
  END LOOP;
END $$;


-- ═══════════════════════════════════════════════════════════════════════════
-- 13. ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════
--  Shape of the rules:
--    * Public catalogue content is readable by anyone, writable by nobody
--      (seeded via the dashboard / service role).
--    * User content is readable by anyone but writable only by its owner.
--    * Private content (notifications, saves, enquiries) is owner-only.
--  Policies are dropped before creation so this section is re-runnable —
--  Postgres has no CREATE POLICY IF NOT EXISTS.
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','follows','badge_definitions','user_badges',
    'vehicles','vehicle_modifications','vehicle_timeline',
    'posts','post_likes','saved_posts','comments',
    'communities','community_members','community_messages',
    'events','event_attendees',
    'marketplace_vehicles','marketplace_parts','marketplace_enquiries',
    'services','service_reviews','service_enquiries',
    'vehicle_catalog','car_parts','maintenance_guides','news_articles',
    'motorsport_series','motorsport_events','motorsport_comments',
    'notifications'
  ] LOOP
    EXECUTE FORMAT('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;


-- ── Read-only reference data ──────────────────────────────────────────────
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'badge_definitions','vehicle_catalog','car_parts',
    'motorsport_series','motorsport_events'
  ] LOOP
    EXECUTE FORMAT('DROP POLICY IF EXISTS "read_%1$s" ON public.%1$I', t);
    EXECUTE FORMAT(
      'CREATE POLICY "read_%1$s" ON public.%1$I FOR SELECT USING (TRUE)', t);
  END LOOP;
END $$;


-- ── PROFILES ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_read"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

CREATE POLICY "profiles_read"   ON public.profiles FOR SELECT USING (TRUE);
-- The signup trigger runs as definer, but keep this so a client can self-heal
-- a missing profile row.
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- ── FOLLOWS ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "follows_read"   ON public.follows;
DROP POLICY IF EXISTS "follows_insert" ON public.follows;
DROP POLICY IF EXISTS "follows_delete" ON public.follows;

CREATE POLICY "follows_read"   ON public.follows FOR SELECT USING (TRUE);
CREATE POLICY "follows_insert" ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete" ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);


-- ── USER BADGES ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "user_badges_read" ON public.user_badges;
CREATE POLICY "user_badges_read" ON public.user_badges FOR SELECT USING (TRUE);


-- ── VEHICLES (owner-writable, publicly readable) ──────────────────────────
DROP POLICY IF EXISTS "vehicles_read"  ON public.vehicles;
DROP POLICY IF EXISTS "vehicles_write" ON public.vehicles;

CREATE POLICY "vehicles_read"  ON public.vehicles FOR SELECT USING (TRUE);
CREATE POLICY "vehicles_write" ON public.vehicles FOR ALL
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Child rows inherit the parent vehicle's owner.
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['vehicle_modifications','vehicle_timeline'] LOOP
    EXECUTE FORMAT('DROP POLICY IF EXISTS "%1$s_read"  ON public.%1$I', t);
    EXECUTE FORMAT('DROP POLICY IF EXISTS "%1$s_write" ON public.%1$I', t);
    EXECUTE FORMAT(
      'CREATE POLICY "%1$s_read" ON public.%1$I FOR SELECT USING (TRUE)', t);
    EXECUTE FORMAT($f$
      CREATE POLICY "%1$s_write" ON public.%1$I FOR ALL
        USING (EXISTS (SELECT 1 FROM public.vehicles v
                       WHERE v.id = %1$I.vehicle_id AND v.owner_id = auth.uid()))
        WITH CHECK (EXISTS (SELECT 1 FROM public.vehicles v
                       WHERE v.id = %1$I.vehicle_id AND v.owner_id = auth.uid()))
    $f$, t);
  END LOOP;
END $$;


-- ── POSTS ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "posts_read"   ON public.posts;
DROP POLICY IF EXISTS "posts_insert" ON public.posts;
DROP POLICY IF EXISTS "posts_update" ON public.posts;
DROP POLICY IF EXISTS "posts_delete" ON public.posts;

-- Drafts stay visible to their author only.
CREATE POLICY "posts_read" ON public.posts FOR SELECT
  USING (is_published OR auth.uid() = author_id);
CREATE POLICY "posts_insert" ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update" ON public.posts FOR UPDATE
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_delete" ON public.posts FOR DELETE
  USING (auth.uid() = author_id);


-- ── LIKES / SAVES / COMMENTS ──────────────────────────────────────────────
DROP POLICY IF EXISTS "post_likes_read"   ON public.post_likes;
DROP POLICY IF EXISTS "post_likes_insert" ON public.post_likes;
DROP POLICY IF EXISTS "post_likes_delete" ON public.post_likes;

CREATE POLICY "post_likes_read"   ON public.post_likes FOR SELECT USING (TRUE);
CREATE POLICY "post_likes_insert" ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_likes_delete" ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Saves are private: only the owner may even see them.
DROP POLICY IF EXISTS "saved_posts_read"   ON public.saved_posts;
DROP POLICY IF EXISTS "saved_posts_insert" ON public.saved_posts;
DROP POLICY IF EXISTS "saved_posts_delete" ON public.saved_posts;

CREATE POLICY "saved_posts_read" ON public.saved_posts FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "saved_posts_insert" ON public.saved_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_posts_delete" ON public.saved_posts FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "comments_read"   ON public.comments;
DROP POLICY IF EXISTS "comments_insert" ON public.comments;
DROP POLICY IF EXISTS "comments_update" ON public.comments;
DROP POLICY IF EXISTS "comments_delete" ON public.comments;

CREATE POLICY "comments_read"   ON public.comments FOR SELECT USING (TRUE);
CREATE POLICY "comments_insert" ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_update" ON public.comments FOR UPDATE
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_delete" ON public.comments FOR DELETE
  USING (auth.uid() = author_id);


-- ── COMMUNITIES ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "communities_read"   ON public.communities;
DROP POLICY IF EXISTS "communities_insert" ON public.communities;
DROP POLICY IF EXISTS "communities_update" ON public.communities;

-- Private crews are visible only to their members.
CREATE POLICY "communities_read" ON public.communities FOR SELECT
  USING (
    NOT is_private
    OR EXISTS (SELECT 1 FROM public.community_members m
               WHERE m.community_id = communities.id AND m.user_id = auth.uid())
  );
CREATE POLICY "communities_insert" ON public.communities FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "communities_update" ON public.communities FOR UPDATE
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "community_members_read"  ON public.community_members;
DROP POLICY IF EXISTS "community_members_join"  ON public.community_members;
DROP POLICY IF EXISTS "community_members_leave" ON public.community_members;

CREATE POLICY "community_members_read"  ON public.community_members
  FOR SELECT USING (TRUE);
CREATE POLICY "community_members_join"  ON public.community_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "community_members_leave" ON public.community_members
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "community_messages_read" ON public.community_messages;
DROP POLICY IF EXISTS "community_messages_send" ON public.community_messages;

-- You must be a member to read or post in a room.
CREATE POLICY "community_messages_read" ON public.community_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.community_members m
                 WHERE m.community_id = community_messages.community_id
                   AND m.user_id = auth.uid()));
CREATE POLICY "community_messages_send" ON public.community_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (SELECT 1 FROM public.community_members m
                WHERE m.community_id = community_messages.community_id
                  AND m.user_id = auth.uid())
  );


-- ── EVENTS ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "events_read"   ON public.events;
DROP POLICY IF EXISTS "events_insert" ON public.events;
DROP POLICY IF EXISTS "events_update" ON public.events;
DROP POLICY IF EXISTS "events_delete" ON public.events;

CREATE POLICY "events_read" ON public.events FOR SELECT
  USING (is_published OR auth.uid() = organizer_id);
CREATE POLICY "events_insert" ON public.events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "events_update" ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id) WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "events_delete" ON public.events FOR DELETE
  USING (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "event_attendees_read"  ON public.event_attendees;
DROP POLICY IF EXISTS "event_attendees_join"  ON public.event_attendees;
DROP POLICY IF EXISTS "event_attendees_leave" ON public.event_attendees;

CREATE POLICY "event_attendees_read"  ON public.event_attendees
  FOR SELECT USING (TRUE);
CREATE POLICY "event_attendees_join"  ON public.event_attendees
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "event_attendees_leave" ON public.event_attendees
  FOR DELETE USING (auth.uid() = user_id);


-- ── MARKETPLACE ───────────────────────────────────────────────────────────
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['marketplace_vehicles','marketplace_parts'] LOOP
    EXECUTE FORMAT('DROP POLICY IF EXISTS "%1$s_read"  ON public.%1$I', t);
    EXECUTE FORMAT('DROP POLICY IF EXISTS "%1$s_write" ON public.%1$I', t);
    -- Only live listings are public; a seller always sees their own.
    EXECUTE FORMAT($f$
      CREATE POLICY "%1$s_read" ON public.%1$I FOR SELECT
        USING (status = 'active' OR auth.uid() = seller_id)
    $f$, t);
    EXECUTE FORMAT($f$
      CREATE POLICY "%1$s_write" ON public.%1$I FOR ALL
        USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id)
    $f$, t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "mkt_enquiries_read"   ON public.marketplace_enquiries;
DROP POLICY IF EXISTS "mkt_enquiries_insert" ON public.marketplace_enquiries;

-- A buyer sees the enquiries they sent. (Seller-side visibility needs the
-- listing owner joined in; add it here when the seller inbox ships.)
CREATE POLICY "mkt_enquiries_read" ON public.marketplace_enquiries FOR SELECT
  USING (auth.uid() = buyer_id);
CREATE POLICY "mkt_enquiries_insert" ON public.marketplace_enquiries FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);


-- ── SERVICES ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "services_read"  ON public.services;
DROP POLICY IF EXISTS "services_write" ON public.services;

CREATE POLICY "services_read" ON public.services FOR SELECT
  USING (is_active OR auth.uid() = provider_id);
CREATE POLICY "services_write" ON public.services FOR ALL
  USING (auth.uid() = provider_id) WITH CHECK (auth.uid() = provider_id);

DROP POLICY IF EXISTS "service_reviews_read"  ON public.service_reviews;
DROP POLICY IF EXISTS "service_reviews_write" ON public.service_reviews;

CREATE POLICY "service_reviews_read"  ON public.service_reviews
  FOR SELECT USING (TRUE);
CREATE POLICY "service_reviews_write" ON public.service_reviews FOR ALL
  USING (auth.uid() = reviewer_id) WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "service_enquiries_insert" ON public.service_enquiries;
DROP POLICY IF EXISTS "service_enquiries_read"   ON public.service_enquiries;

-- "Get quote" must work for signed-out visitors, so the insert is open. The
-- WITH CHECK still stops anyone attributing an enquiry to another user.
CREATE POLICY "service_enquiries_insert" ON public.service_enquiries FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "service_enquiries_read" ON public.service_enquiries FOR SELECT
  USING (auth.uid() = user_id);


-- ── KNOWLEDGE (published content is public; authors manage their own) ─────
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['maintenance_guides','news_articles'] LOOP
    EXECUTE FORMAT('DROP POLICY IF EXISTS "%1$s_read"  ON public.%1$I', t);
    EXECUTE FORMAT('DROP POLICY IF EXISTS "%1$s_write" ON public.%1$I', t);
    EXECUTE FORMAT($f$
      CREATE POLICY "%1$s_read" ON public.%1$I FOR SELECT
        USING (is_published OR auth.uid() = author_id)
    $f$, t);
    EXECUTE FORMAT($f$
      CREATE POLICY "%1$s_write" ON public.%1$I FOR ALL
        USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id)
    $f$, t);
  END LOOP;
END $$;

-- View counts are bumped through the RPCs in section 12 rather than a direct
-- UPDATE. RLS grants access per ROW, never per COLUMN, so a policy permissive
-- enough to allow "bump views on any published row" would equally allow
-- rewriting that row's title and body. The SECURITY DEFINER functions touch
-- exactly one column, so no broad UPDATE policy is needed here.


-- ── MOTORSPORT COMMENTS ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "motorsport_comments_read"  ON public.motorsport_comments;
DROP POLICY IF EXISTS "motorsport_comments_write" ON public.motorsport_comments;

CREATE POLICY "motorsport_comments_read"  ON public.motorsport_comments
  FOR SELECT USING (TRUE);
CREATE POLICY "motorsport_comments_write" ON public.motorsport_comments FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ── NOTIFICATIONS (strictly private) ──────────────────────────────────────
DROP POLICY IF EXISTS "notifications_read"   ON public.notifications;
DROP POLICY IF EXISTS "notifications_update" ON public.notifications;

CREATE POLICY "notifications_read" ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);
-- Marking read is the only write a client may make; rows are created by the
-- SECURITY DEFINER triggers in section 12.
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════════════════════════
-- 14. GRANTS
-- ═══════════════════════════════════════════════════════════════════════════
--  RLS restricts which rows a role can reach; it does not grant access to the
--  table in the first place. Both are required. Row-level rules in section 13
--  remain the real boundary — these grants are deliberately broad and are
--  narrowed by the policies above.
-- ═══════════════════════════════════════════════════════════════════════════

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Signed-out visitors may submit a service enquiry ("Get quote") and nothing else.
GRANT INSERT ON public.service_enquiries TO anon;

-- Keep future tables consistent with the above.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════════
-- 15. STORAGE
-- ═══════════════════════════════════════════════════════════════════════════
--  Bucket names must match the client:
--    avatars, covers, posts, reels, wallpapers, marketplace, community-media
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars',         'avatars',         TRUE),
  ('covers',          'covers',          TRUE),
  ('posts',           'posts',           TRUE),
  ('reels',           'reels',           TRUE),
  ('wallpapers',      'wallpapers',      TRUE),
  ('marketplace',     'marketplace',     TRUE),
  ('community-media', 'community-media', TRUE)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Anyone may read; only signed-in users may upload, and each may only modify
-- objects inside a folder named after their own uid.
DO $$
DECLARE b TEXT;
BEGIN
  FOREACH b IN ARRAY ARRAY[
    'avatars','covers','posts','reels','wallpapers','marketplace','community-media'
  ] LOOP
    EXECUTE FORMAT('DROP POLICY IF EXISTS "%1$s_public_read" ON storage.objects', b);
    EXECUTE FORMAT('DROP POLICY IF EXISTS "%1$s_upload"      ON storage.objects', b);
    EXECUTE FORMAT('DROP POLICY IF EXISTS "%1$s_modify"      ON storage.objects', b);

    EXECUTE FORMAT($f$
      CREATE POLICY "%1$s_public_read" ON storage.objects FOR SELECT
        USING (bucket_id = %1$L)
    $f$, b);

    EXECUTE FORMAT($f$
      CREATE POLICY "%1$s_upload" ON storage.objects FOR INSERT TO authenticated
        WITH CHECK (bucket_id = %1$L)
    $f$, b);

    EXECUTE FORMAT($f$
      CREATE POLICY "%1$s_modify" ON storage.objects FOR ALL TO authenticated
        USING (bucket_id = %1$L AND owner = auth.uid())
        WITH CHECK (bucket_id = %1$L AND owner = auth.uid())
    $f$, b);
  END LOOP;
END $$;


-- ═══════════════════════════════════════════════════════════════════════════
-- 16. REALTIME
-- ═══════════════════════════════════════════════════════════════════════════
--  ALTER PUBLICATION ... ADD TABLE errors if the table is already a member,
--  so each one is checked first.
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'posts','comments','post_likes',
    'community_messages','notifications','motorsport_comments'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = t
    ) THEN
      EXECUTE FORMAT('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;


-- ═══════════════════════════════════════════════════════════════════════════
-- 17. REFERENCE SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════
--  Only catalogue rows that the UI needs in order to render something. No
--  fake users, posts or listings — those arrive when real people sign up.
--  Every insert is keyed on a natural unique column so re-running is a no-op.
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.badge_definitions (slug, name, description, icon, tone) VALUES
  ('founder',   'Founder',        'Joined in the first season',        'award',  'live'),
  ('verified',  'Verified',       'Identity confirmed',                'check',  'accent'),
  ('wrencher',  'Wrencher',       'Published 5 maintenance guides',    'wrench', 'success'),
  ('collector', 'Collector',      'Three or more vehicles in garage',  'car',    'accent')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.car_parts (name, category, description) VALUES
  ('Brake Pads',      'Braking',     'Friction material pressed against the disc to slow the wheel.'),
  ('Brake Disc',      'Braking',     'Rotor the pads clamp; warps if overheated.'),
  ('Air Filter',      'Intake',      'Traps dust before it reaches the combustion chamber.'),
  ('Spark Plug',      'Ignition',    'Ignites the air-fuel mixture in petrol engines.'),
  ('Timing Belt',     'Engine',      'Synchronises crankshaft and camshaft rotation.'),
  ('Clutch Plate',    'Transmission','Couples engine output to the gearbox.'),
  ('Shock Absorber',  'Suspension',  'Damps spring oscillation to keep tyres planted.'),
  ('Radiator',        'Cooling',     'Sheds engine heat into the airflow.'),
  ('Alternator',      'Electrical',  'Charges the battery while the engine runs.'),
  ('Turbocharger',    'Forced Induction','Exhaust-driven compressor that raises intake pressure.'),
  ('Catalytic Converter','Exhaust',  'Converts harmful exhaust gases into less harmful ones.'),
  ('Fuel Injector',   'Fuel',        'Atomises fuel into the intake or cylinder.')
ON CONFLICT (name, category) DO NOTHING;

INSERT INTO public.motorsport_series (slug, name, category) VALUES
  ('f1',      'Formula 1',        'Open-wheel'),
  ('motogp',  'MotoGP',           'Motorcycle'),
  ('wrc',     'World Rally',      'Rally'),
  ('wec',     'Endurance (WEC)',  'Sportscar'),
  ('indycar', 'IndyCar',          'Open-wheel')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.vehicle_catalog (make, model, year, type, engine, power_bhp, fuel) VALUES
  ('Toyota',        'Supra',        2019, 'car',  '3.0L I6 Turbo',  335, 'Petrol'),
  ('Toyota',        'Fortuner',     2023, 'car',  '2.8L I4 Diesel', 201, 'Diesel'),
  ('Honda',         'Civic Type R', 2022, 'car',  '2.0L I4 Turbo',  315, 'Petrol'),
  ('BMW',           'M340i',        2023, 'car',  '3.0L I6 Turbo',  382, 'Petrol'),
  ('Mahindra',      'Thar',         2023, 'car',  '2.2L I4 Diesel', 130, 'Diesel'),
  ('Tata',          'Nexon EV',     2024, 'car',  'Permanent Magnet', 141, 'Electric'),
  ('Hyundai',       'i20 N Line',   2023, 'car',  '1.0L I3 Turbo',  118, 'Petrol'),
  ('Royal Enfield', 'Continental GT 650', 2023, 'bike', '648cc Parallel Twin', 47, 'Petrol'),
  ('Royal Enfield', 'Himalayan',    2024, 'bike', '452cc Single',    39, 'Petrol'),
  ('KTM',           'Duke 390',     2024, 'bike', '399cc Single',    44, 'Petrol'),
  ('Yamaha',        'MT-15',        2023, 'bike', '155cc Single',    18, 'Petrol'),
  ('Kawasaki',      'Ninja ZX-10R', 2023, 'bike', '998cc Inline-4', 200, 'Petrol')
ON CONFLICT (make, model, year) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════════════════
--  DONE — verification
-- ═══════════════════════════════════════════════════════════════════════════

SELECT
  (SELECT COUNT(*) FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE') AS tables,
  (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public')  AS policies,
  (SELECT COUNT(*) FROM storage.buckets)                          AS buckets,
  (SELECT COUNT(*) FROM public.vehicle_catalog)                   AS catalog_rows,
  (SELECT COUNT(*) FROM public.car_parts)                         AS part_rows;
