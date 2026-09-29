# US-2.1: Connect a social media account via OAuth

**Epic:** Connecting platforms
**Requirement:** FR-2.1 (supports FR-2.3, NFR-2.1, NFR-2.3, NFR-2.5)
**Priority:** Must

## Story

**As a** content creator,
**I want to** connect my Facebook, Instagram, TikTok, or YouTube account through the platform's official login and consent screen,
**so that** the app can publish on my behalf without me ever sharing my social media password.

## Acceptance Criteria

1. I can see the supported platforms (Facebook, Instagram, TikTok, YouTube), each with a "Connect" button.
2. Clicking "Connect" redirects me to the **platform's own** consent screen, where I approve the permissions requested.
3. The app never asks for or sees my social media password.
4. On approval, I return to the app and the account appears as **connected**, showing its name and avatar (see US-2.4).
5. If I deny consent or cancel, I return to the app with a readable message such as "Connection cancelled, no changes were made" (NFR-6.2).
6. If the connection fails (network error, platform error), I see a human-readable reason and can retry, not a raw API error (NFR-6.2).
7. The OAuth flow includes a **state** parameter, verified on return, to prevent CSRF attacks (NFR-2.5).
8. Callbacks work over HTTPS only (NFR-2.3).
9. Access and refresh tokens are **encrypted at rest** and never logged or sent to the frontend (NFR-2.1, FR-2.3).
10. The connected account is saved to **my workspace only** (NFR-2.4).
11. The flow works on mobile browser widths (NFR-6.3), and a new user can complete it without documentation (NFR-6.1).

## Notes

- **Design pattern:** each platform gets its own OAuth adapter behind one common interface (connect, exchange code, refresh token). Adding a platform then means adding an adapter, with no change to core code (NFR-7.1, Open/Closed).
- Instagram is special: it connects through a Facebook Page, which needs an extra authorization step. That is covered separately in US-2.6 (FR-2.6).
- Requested permissions (scopes) should be the minimum needed for publishing and reading metrics (NFR-3.2).
- Token refresh and expiry status are separate stories (US-2.3 and US-2.4), so this story ends at "connected."


# US-2.2: Connect multiple accounts per platform

**Epic:** Connecting platforms
**Requirement:** FR-2.2
**Priority:** Should

## Story

**As a** content creator who runs more than one account on the same platform,
**I want to** connect several accounts from the same platform (for example, two Instagram accounts or three YouTube channels),
**so that** I can manage all of them from one workspace without logging in and out.

## Acceptance Criteria

1. After connecting one account for a platform, I can still click "Connect" for that platform to add another.
2. Connecting an account that is **already connected** in my workspace does not create a duplicate. I see a message such as "This account is already connected" (NFR-6.2).
3. Each connected account is shown as a separate entry with its own name, avatar, platform icon, and status.
4. When several accounts share a platform, I can tell them apart everywhere in the app by their name and avatar, so I never post to the wrong one.
5. I can disconnect one account without affecting my other accounts on the same platform (US-2.5).
6. Each account has its own tokens, stored encrypted and refreshed independently (FR-2.3, NFR-2.1).
7. If one account's token expires, only that account is marked as expired. The others keep working (US-2.4).
8. When creating a post, I can select any combination of accounts (FR-3.2).
9. The list works on mobile widths (NFR-6.3).

## Notes

- **Data model:** a workspace has many connected accounts. Each account is identified by platform plus the platform's own account ID. A unique constraint on (workspace, platform, platform account ID) enforces criterion 2.
- Scale target is about 500 connected accounts across roughly 100 users (NFR-5.1), so about 5 per user. No special limit is needed, but a per-workspace cap can be added later if needed.
- Facebook Pages and Instagram business accounts are also "accounts" in this model. Each Page or profile should be a separate entry, since posting targets a specific Page or profile.

# US-2.3: Keep my connection alive with secure, auto-refreshed tokens

**Epic:** Connecting platforms
**Requirement:** FR-2.3 (supports NFR-2.1, NFR-1.1, NFR-7.2)
**Priority:** Must

## Story

**As a** content creator,
**I want** my account connections to stay active automatically and be stored securely,
**so that** my scheduled posts publish without me having to reconnect again and again, and my access is never exposed.

## Acceptance Criteria

1. Access and refresh tokens are **encrypted at rest** and never logged or sent to the frontend (NFR-2.1).
2. The system refreshes a token **before it expires**, without any action from me.
3. Refresh also runs just before a publish attempt if the token is close to expiry, so a scheduled post is not missed because of a stale token.
4. If refresh succeeds, the new token replaces the old one and the account stays **active**.
5. If refresh fails permanently (revoked access, expired refresh token, password changed on the platform), the account is marked **expired** and I am notified (US-2.4, FR-7.1).
6. If refresh fails temporarily (network or platform outage), it is retried with backoff before the account is marked expired.
7. Two workers must not refresh the same token at the same time (avoid race conditions that invalidate a token).
8. Each refresh attempt is logged with its outcome, **without** the token value (NFR-8.1, NFR-2.1).
9. The token logic has automated tests, including expiry, successful refresh, and failed refresh (NFR-7.2).

## Notes

- **Design pattern:** each platform's refresh rules differ (for example, Meta long-lived tokens versus Google refresh tokens), so put refresh behind the same platform adapter interface used for OAuth (NFR-7.1, Strategy/Open-Closed).
- Encryption key management matters: keep keys outside the database (environment or secrets manager) so a database leak alone does not expose tokens.
- Criterion 7 needs a lock per account (for example, a database row lock), since scheduled jobs and manual actions can trigger refresh together.

---

# US-2.4: See my connected accounts and their status

**Epic:** Connecting platforms
**Requirement:** FR-2.4
**Priority:** Must

## Story

**As a** content creator,
**I want to** see a list of my connected accounts with their status (active or expired),
**so that** I know which accounts are ready to publish and which need my attention before a post fails.

## Acceptance Criteria

1. A "Connected accounts" page lists every connected account with its **platform icon**, **name**, **avatar**, and **status**.
2. The status is clearly shown as **Active** or **Expired**, using both color and text or icon, not color alone.
3. Expired accounts show a readable message and a **Reconnect** button, for example "Instagram connection expired, reconnect" (NFR-6.2).
4. Reconnecting an expired account restores it to Active and keeps its existing scheduled posts and history (no duplicate entry).
5. Accounts are grouped or labeled by platform, so several accounts on one platform are easy to tell apart (US-2.2).
6. Platforms with no connected account show a "Connect" button (US-2.1).
7. Account status is also visible where I choose accounts for a post, and expired accounts are flagged there before I schedule (FR-3.2, FR-4.9).
8. The page shows only my workspace's accounts (NFR-2.4) and works on mobile widths (NFR-6.3).

## Notes

- Status should be stored on the account record and updated by the token refresh logic (US-2.3), so this page just reads it and stays fast (NFR-4.1).
- Criterion 4 matters: matching on (workspace, platform, platform account ID) lets a reconnect update the existing record instead of creating a new one.

---

# US-2.5: Disconnect an account

**Epic:** Connecting platforms
**Requirement:** FR-2.5 (supports FR-9.2)
**Priority:** Must

## Story

**As a** content creator,
**I want to** disconnect a connected account at any time,
**so that** the app loses access to it and I stay in control of my data.

## Acceptance Criteria

1. Each connected account has a **Disconnect** action.
2. Before disconnecting, I see a confirmation that explains the effect, including the number of scheduled posts for that account that will be affected.
3. On confirmation, the account's stored tokens are **deleted** from the system.
4. Where the platform supports it, the token is also **revoked** on the platform's side. If revocation fails, I still see the account as disconnected in the app, and the failure is logged.
5. Scheduled posts targeting the disconnected account are **not published**. They are marked as cancelled or failed for that platform, with a readable reason (NFR-6.2), and I am notified.
6. Posts targeting other accounts in the same post still publish normally (per-platform independence, FR-4.5).
7. Past published posts and history for that account stay visible, but the account is labeled "Disconnected."
8. Disconnecting one account does not affect my other accounts on the same platform (US-2.2).
9. The action is limited to my own workspace (NFR-2.4) and works on mobile widths (NFR-6.3).

## Notes

- Deleting tokens is the part that matters for security and privacy (NFR-2.1, NFR-3.1). Keeping the account record itself (without tokens) preserves history.
- Criterion 5 needs a clear rule: a post scheduled for a mix of accounts should not be silently dropped. Notify the user with the specific accounts affected.
- This is the single-account version of FR-9.2 ("revoke platform access"). Full data deletion is handled in the compliance epic.

---

# US-2.6: Get guided through Instagram Page authorization

**Epic:** Connecting platforms
**Requirement:** FR-2.6
**Priority:** Should

## Story

**As a** content creator who wants to connect Instagram,
**I want** step-by-step guidance through the Facebook Page authorization the connection requires,
**so that** I can finish connecting without getting stuck or confused by requirements I did not know about.

## Acceptance Criteria

1. Clicking "Connect" on Instagram first shows a short **checklist** of what is needed. For example: an Instagram professional (business or creator) account, linked to a Facebook Page.
2. The guide explains the **Page authorization step** in plain language and shows which Page(s) I need to select on the Facebook consent screen.
3. If my Instagram account is personal, or is not linked to a Page, the app detects this and shows a readable message with the steps to fix it, instead of a raw API error (NFR-6.2).
4. If I skip selecting a Page during consent, I see a specific message such as "No Facebook Page was authorized, so Instagram can't publish. Try again and select your Page."
5. The guide can be reopened at any time, including from an Instagram account that shows an error.
6. On success, the Instagram account appears as connected, and its linked Page is shown in the account details (US-2.4).
7. Guidance is available in a short in-app format (text and simple steps), with no separate documentation needed (NFR-6.1).
8. The flow works on mobile widths (NFR-6.3).

## Notes

- Instagram publishing goes through the Facebook Page connection, so this is the most likely place for a first-time user to fail. Plan to test it with real users.
- The guide is UI content only. The actual OAuth handling stays in the Instagram adapter (US-2.1, NFR-7.1).
- Requirements like "professional account" and "linked Page" depend on Meta's current rules. Verify them against Meta's documentation when you build, since they change.