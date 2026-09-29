# US-3.1: Create a draft with a base caption

**Epic:** Post creation and drafts
**Requirement:** FR-3.1
**Priority:** Must

## Story

**As a** content creator,
**I want to** create a draft post with a base caption and media,
**so that** I can prepare content once and adapt it to each platform later.

## Acceptance Criteria

1. A "New post" action is available from the main navigation and the calendar, including on mobile widths (NFR-6.3).
2. The composer has a **base caption** field and a way to attach images or videos.
3. The caption supports **Arabic (RTL) and emoji** correctly, and text direction adapts to the content (NFR-6.4).
4. Drafts are **auto-saved** as I type, and I can also save manually. Closing the composer does not lose my work.
5. A draft can be saved with **no target, no date, and even an empty caption** if media is attached, since validation only applies when scheduling (US-4.1).
6. Drafts appear in a drafts list and on the calendar as **Draft** status (FR-4.2).
7. Large video uploads use **chunked/resumable upload** and show progress. A failed upload can be resumed (NFR-4.3).
8. Errors are human-readable, for example "Video upload failed, tap to retry" (NFR-6.2).
9. Drafts are visible only to my workspace (NFR-2.4).

## Notes

- **Data model:** a `Post` holds the base content. Per-platform content lives in child records (see US-3.3), so the base stays the single source of truth.
- Auto-save should be debounced (for example, every few seconds after typing stops) to keep API calls low (NFR-4.1).
- Status starts as `draft`. Scheduling moves it forward (epic 6).

---

# US-3.2: Choose target accounts and platforms

**Epic:** Post creation and drafts
**Requirement:** FR-3.2
**Priority:** Must

## Story

**As a** content creator,
**I want to** choose which accounts and platforms a post goes to,
**so that** the right content reaches the right audiences.

## Acceptance Criteria

1. In the composer I can select one or more **connected accounts** across platforms, shown with platform icon, name, and avatar (US-2.4).
2. When I have several accounts on one platform, I can select any subset of them (US-2.2).
3. **Expired** accounts are shown as disabled or flagged, with a "Reconnect" shortcut, and cannot be selected for scheduling (US-2.4).
4. Platforms with no connected account show a "Connect" shortcut instead.
5. My selection can be changed at any time before publishing, and is saved with the draft.
6. Selecting a target updates the composer to show that target's platform-specific options and limits (US-3.3, US-3.4, US-4.1).
7. At least one target is required to **schedule**, but not to save a draft (US-3.1).
8. The selector works on mobile widths (NFR-6.3).

## Notes

- **Data model:** each selected account becomes a `PostTarget` (post × account). It carries its own status, override content, publish time, and platform post ID. This one record supports per-platform status (FR-4.5) and idempotent publishing (NFR-1.2).
- The account list should come from the stored account status, not a live platform call, to stay fast.

---

# US-3.3: Override content per platform

**Epic:** Post creation and drafts
**Requirement:** FR-3.3
**Priority:** Must

## Story

**As a** content creator,
**I want to** customize the caption, hashtags, and media for each platform,
**so that** each post fits its platform's style and audience instead of being identical everywhere.

## Acceptance Criteria

1. For each selected target, I can open its tab or section and edit **caption**, **hashtags**, and **media** separately.
2. By default a target **inherits** the base caption and media, and shows that it is inheriting.
3. Once I override a field, that target keeps its own version. Later changes to the base do not overwrite it.
4. I can **reset** an overridden field back to the base version.
5. Overridden fields are visibly marked, so I can see at a glance what differs from the base.
6. Each target can use a **different media set** (for example, a video on TikTok, an image on Facebook).
7. Arabic (RTL) and emoji work in every override field (NFR-6.4).
8. Overrides are saved with the draft and remain when I edit or reschedule (US-3.5).
9. The editor works on mobile widths (NFR-6.3).

## Notes

- **Pattern:** the effective content of a target is `override ?? base`, resolved per field. Store only what was overridden, so inheriting stays automatic.
- Hashtag handling (separate field or inside the caption) is a UX decision. A separate field makes per-platform hashtag limits easier to validate (US-4.1).
- AI caption adaptation (FR-8.3) can later plug in here by filling override fields.

---

# US-3.4: Fill in YouTube-specific fields

**Epic:** Post creation and drafts
**Requirement:** FR-3.4
**Priority:** Must

## Story

**As a** content creator publishing to YouTube,
**I want to** set a title, description, tags, and visibility,
**so that** my video is published with the metadata YouTube requires and the privacy setting I want.

## Acceptance Criteria

1. When a YouTube account is selected, the composer shows YouTube fields: **title**, **description**, **tags**, and **visibility** (public, unlisted, private).
2. **Title** is required to schedule. Description, tags, and visibility have sensible defaults (for example, visibility defaults to private or unlisted, to avoid accidental public posts).
3. Description can inherit from the base caption, like other fields (US-3.3), but I can override it.
4. Tags can be entered one by one and removed individually.
5. YouTube needs a **video**. If no video is attached, I see a readable message when scheduling (NFR-6.2).
6. These fields appear **only** when YouTube is selected, and disappear when it is deselected.
7. Values are saved with the draft and validated against YouTube limits (US-4.1).
8. Arabic (RTL) and emoji work in title, description, and tags (NFR-6.4).
9. The fields work on mobile widths (NFR-6.3).

## Notes

- **Design:** platform-specific fields differ per platform, so model them as a platform-specific options object on the `PostTarget`, defined by each platform adapter (NFR-7.1). Adding another platform's fields then needs no core changes.
- Field definitions (required, limits, allowed values) should come from configuration, not hard-coded (NFR-7.3).
- Choosing a safe default for visibility is a product decision. Confirm which one you want.

---

# US-3.5: Edit, duplicate, and delete posts

**Epic:** Post creation and drafts
**Requirement:** FR-3.7
**Priority:** Should

## Story

**As a** content creator,
**I want to** edit, duplicate, and delete my posts,
**so that** I can fix mistakes, reuse successful content, and remove posts I no longer need.

## Acceptance Criteria

1. I can **edit** any draft or scheduled post, with all content, targets, and overrides preserved.
2. Editing a **scheduled** post keeps it scheduled. Changing its time is covered by US-6.3 (reschedule).
3. I can **duplicate** a post. The copy becomes a new **draft** with the same base content, targets, and overrides, and **no schedule** and no publish history.
4. I can **delete** a draft, and a scheduled post, after a confirmation that names what will be removed.
5. Deleting a scheduled post cancels its pending publish jobs, so nothing is published afterward (FR-4.3).
6. A post or target that is **currently publishing** cannot be edited or deleted, and I see a readable message (NFR-6.2).
7. **Published** posts cannot be edited in the app (the platform copy is not changed). I can still duplicate them, and the history record is kept (FR-4.7).
8. If some targets already published and others failed, editing affects only the unpublished targets.
9. Actions are limited to my workspace (NFR-2.4) and work on mobile widths (NFR-6.3).

## Notes

- Edit and delete must be checked against the **current status at save time**, not when the screen opened. A post can move to `publishing` while the user is editing, so the server rejects stale changes.
- Consider soft delete for drafts, so accidental deletes can be undone, and hard delete only under data-deletion rules (NFR-3.1).
- Duplicating a published post is the easy way to "repost with changes."