# Architectural Choices: Local-First State & Supabase Integration

**Branch**: `004-local-first-state` | **Date**: 2026-11-02

## Choices Ledger

### Choice 1: Supabase Dashboard Setup Guide Location
- **Classification**: `sound`
- **Context**: Spec had placeholder for documentation location (README vs schema.sql comments).
- **Decision**: User explicitly directed dashboard setup documentation to root `supabase.md`.
- **Impact**: Standalone, clean reference for Supabase project configuration without cluttering code comments.

### Choice 2: Preservation of Local Keys Post-Migration
- **Classification**: `sound`
- **Context**: Spec asked whether to delete or keep `lesson_progress_<slug>` keys after migration to Supabase.
- **Decision**: Retain local keys in `localStorage` and set a per-user `lesson_migrated_<user_id>` flag.
- **Rationale**: Local storage remains the instant synchronous source of truth for the client UI, maintaining zero-latency rendering and offline availability without needing network calls.

### Choice 3: Deterministic Conflict Resolution for Progress Merging
- **Classification**: `sound`
- **Context**: Resolving conflicting states between anonymous local exercises and existing cloud data on login.
- **Decision**:
  - `completed`: `local.completed || remote.completed`
  - `xp_earned`: `Math.max(local.xp_earned, remote.xp_earned)`
  - `saved_code`: code from whichever entity has the more recent `updated_at` timestamp.
- **Rationale**: User never loses completed status or hard-earned XP, and recent code modifications take precedence.

### Choice 4: SSR-Safe In-Memory Fallback
- **Classification**: `sound`
- **Context**: Astro build-time static site generation runs in an environment where `window.localStorage` is undefined.
- **Decision**: Implemented `getSafeStorage()` returning an in-memory `MemoryStorage` map when `typeof window === 'undefined'` or when quota errors occur.
- **Rationale**: Guarantees zero SSR crashes during static rendering while retaining persistent behavior in browsers.

