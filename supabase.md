# Supabase Setup Guide — Buddhilive Academy

This document outlines the setup steps required in the Supabase Dashboard to support user authentication (Google Sign-In & Email Magic Link) and dual-layer local-first progress synchronization.

---

## 1. Create Supabase Project

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard) and click **New project**.
2. Choose an organization, provide a name (e.g., `bl-academy`), and choose a secure database password.
3. Select the closest geographical region to your users.

---

## 2. Apply Database Schema & RLS Policies

1. In your project dashboard, navigate to the **SQL Editor** tab from the left sidebar.
2. Open or paste the contents of `supabase/schema.sql`.
3. Click **Run** to execute.
4. Verify the following:
   - Table `public.user_progress` is created with columns: `user_id`, `lesson_slug`, `completed`, `saved_code`, `xp_earned`, `created_at`, `updated_at`.
   - Primary key is composite: `(user_id, lesson_slug)`.
   - Constraints: `xp_earned >= 0` and `char_length(saved_code) <= 65536` (64 KB cap).
   - Row Level Security (RLS) is **Enabled** (green shield badge in Table Editor).
   - 4 policies exist for `authenticated` users ensuring `auth.uid() = user_id`.
   - `anon` role has no access privileges.

---

## 3. Configure Authentication Providers

### A. Google OAuth Provider

1. Go to **Authentication** > **Providers** > **Google**.
2. Toggle Google to **Enabled**.
3. Create OAuth 2.0 Credentials in [Google Cloud Console](https://console.cloud.google.com/):
   - Application type: **Web application**.
   - Authorized redirect URIs: Copy the **Callback URL** shown in the Supabase Google Provider panel (format: `https://<project-ref>.supabase.co/auth/v1/callback`).
4. Copy the **Client ID** and **Client Secret** from Google Cloud Console into the Supabase Google Provider settings.
5. Click **Save**.

### B. Email (Magic Link) Provider

1. Go to **Authentication** > **Providers** > **Email**.
2. Ensure Email provider is **Enabled**.
3. Ensure **Confirm email** or **Enable Email OTP** is active according to your verification preference (magic links send a one-time sign-in link or OTP code).
4. Customize email templates under **Authentication** > **Email Templates** if desired.

---

## 4. Configure Redirect URLs

1. In Supabase, navigate to **Authentication** > **URL Configuration**.
2. Set **Site URL**:
   - Development: `http://localhost:4321`
   - Production: `https://your-production-domain.com`
3. Add **Redirect URLs** to the whitelist:
   - `http://localhost:4321/**`
   - `http://127.0.0.1:4321/**`
   - `https://your-production-domain.com/**`
4. Click **Save**.

---

## 5. Environment Variables Configuration

In the repository root, create or edit `.env`:

```bash
# Supabase Configuration (Client Safe)
PUBLIC_SUPABASE_URL="https://<your-project-id>.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="<your-public-anon-key>"
```

> **SECURITY WARNING**:
> - Only `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are safe for client-side bundle exposure.
> - **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code, `.env` files committed to git, or browser bundles. All user authorization is strictly enforced through Postgres Row Level Security (RLS).

---

## 6. Verification Checklist

- [ ] Execute `select * from public.user_progress;` in SQL editor (should succeed for admin, return 0 rows initially).
- [ ] Sign in with Google from the frontend application and confirm user appears in **Authentication** > **Users**.
- [ ] Request a Magic Link email, click the link, and confirm authentication completes with active session.
- [ ] Save lesson progress and verify a row is written into `public.user_progress` matching the authenticated user's UUID.
- [ ] Verify from an anonymous/unauthenticated client that `public.user_progress` rejects queries with a 401/403 or empty set.

