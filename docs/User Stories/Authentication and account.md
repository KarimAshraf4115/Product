# US-1.1: Register as a content creator

**Epic:** Authentication and account
**Requirement:** FR-1.1
**Priority:** Must

## Story

**As a** content creator,
**I want to** register with my email and password,
**so that** I have a personal account where my connected platforms, drafts, and scheduled posts are stored.

## Acceptance Criteria

1. I can open a registration form with **email**, **password**, and **confirm password** fields.
2. The email must be valid and not already registered. If it is taken, I see a clear message such as "This email is already registered, log in instead."
3. The password must meet a minimum rule (for example, at least 8 characters). The rule is shown before I submit, and I see a readable error if I break it (NFR-6.2).
4. On success, my account and a private workspace are created together (supports FR-1.6 and NFR-2.4).
5. After registering I am logged in and taken to the next step (set time zone or connect a first account).
6. The password is stored **hashed**, never in plain text (NFR-2.2).
7. The form works on mobile widths and accepts Arabic text (NFR-6.3, NFR-6.4).

## Notes

- Account and default workspace creation should be one atomic operation, so no user exists without a workspace.
- Time zone (FR-1.5) is a Must, so ask for it right after registration or default it from the browser. It gets its own story, US-1.5.
  
  
# US-1.2: Log in as a content creator

**Epic:** Authentication and account
**Requirement:** FR-1.2
**Priority:** Must

## Story

**As a** registered content creator,
**I want to** log in with my email and password,
**so that** I can access my workspace, drafts, and scheduled posts.

## Acceptance Criteria

1. I can open a login form with **email** and **password** fields and a "Forgot password?" link (FR-1.4).
2. With correct credentials, I am logged in and taken to my workspace (calendar or dashboard).
3. With wrong credentials, I see a generic message such as "Email or password is incorrect." It never reveals which one was wrong.
4. Repeated failed attempts are limited (for example, temporary lockout or delay after 5 tries) to prevent brute-force guessing.
5. My session stays active across page refreshes and expires after a defined period of inactivity.
6. After login, every request only returns data from my own workspace (NFR-2.4).
7. Session credentials are never exposed in URLs or logs (NFR-2.1 spirit).
8. The form works on mobile widths (NFR-6.3), and errors are human-readable (NFR-6.2).

## Notes

- Use the same generic error for "unknown email" and "wrong password" to avoid account enumeration.
- Times shown after login use my saved time zone (NFR-6.5, FR-1.5).


# US-1.3: Log out of my account

**Epic:** Authentication and account
**Requirement:** FR-1.3
**Priority:** Must

## Story

**As a** logged-in content creator,
**I want to** log out of my account,
**so that** no one else using my device can access my workspace, drafts, or connected platforms.

## Acceptance Criteria

1. A clear "Log out" action is available from any page (for example, in the profile menu), including on mobile widths (NFR-6.3).
2. On logout, my session is invalidated on the server, not just cleared in the browser.
3. After logout, I am redirected to the login page.
4. After logout, pressing the browser's Back button or opening a protected URL sends me to login instead of showing my data (NFR-2.4).
5. Logging out does **not** affect my scheduled posts. They still publish at their scheduled time, since publishing runs on the server (FR-4.4, NFR-1.1).
6. Logging out does **not** disconnect my platform accounts (that is FR-2.5, a separate action).

## Notes

- Criterion 5 is the important one. Users often assume logging out cancels scheduled posts, so consider a short hint in the UI, such as "Scheduled posts will still publish."
- Server-side session invalidation also makes a future "log out of all devices" story easy to add.

# US-1.4: Reset my password

**Epic:** Authentication and account
**Requirement:** FR-1.4
**Priority:** Must

## Story

**As a** content creator who forgot my password,
**I want to** reset it through a link sent to my email,
**so that** I can regain access to my account without contacting support.

## Acceptance Criteria

1. The login page has a "Forgot password?" link that opens a form asking for my **email**.
2. After I submit, I always see the same message, such as "If this email is registered, a reset link has been sent." It never reveals whether the email exists.
3. If the email is registered, a reset email is sent containing a **single-use, time-limited link** (for example, valid for 30 to 60 minutes).
4. Opening a valid link shows a form with **new password** and **confirm password** fields, following the same password rule as registration (US-1.1).
5. Opening an expired, used, or invalid link shows a readable message and an option to request a new link (NFR-6.2).
6. On success, the password is stored **hashed** (NFR-2.2), the reset link is invalidated, and all existing sessions for my account are ended.
7. After resetting, I am taken to the login page with a confirmation message.
8. Reset requests are rate-limited per email and per IP to prevent abuse.
9. The flow works on mobile widths (NFR-6.3), and the email link works over HTTPS only (NFR-2.3).

## Notes

- The reset token should be stored **hashed** in the database, like a password, so a database leak does not expose usable links.
- Ending all sessions on reset protects the account if someone else was logged in.
- The prototype spec used mock auth. In this full spec, real email delivery is needed, so an email service becomes a dependency.

# US-1.5: Set my time zone

**Epic:** Authentication and account
**Requirement:** FR-1.5 (supports NFR-6.5)
**Priority:** Must

## Story

**As a** content creator,
**I want to** set my time zone,
**so that** the times I choose for scheduling match my local time and my posts publish exactly when I expect.

## Acceptance Criteria

1. After registration, I am asked to confirm my time zone. It is pre-selected from my browser, and I can change it.
2. I can choose from a searchable list of time zones (for example, "Africa/Cairo (UTC+2)").
3. I can change my time zone later from account settings.
4. All times in the app (composer, calendar, notifications, history) are shown in my time zone.
5. Times are stored in **UTC** and converted only for display (NFR-6.5).
6. Daylight saving changes are handled correctly. A post scheduled for 9:00 local time still publishes at 9:00 local time after a shift.
7. When I schedule a post, the selected time zone is visible next to the time picker, so there is no ambiguity.
8. If I change my time zone, existing scheduled posts keep the same **moment in time** (UTC). Their displayed local time updates, and I see a short notice explaining this.
9. The setting works on mobile widths (NFR-6.3).

## Notes

- Use IANA zone names (such as `Africa/Cairo`), not fixed offsets, so daylight saving is handled automatically.
- Criterion 8 is a design decision: keeping the UTC moment avoids silently shifting posts. Confirm you agree.

---

# US-1.6: Manage multiple accounts in one workspace

**Epic:** Authentication and account
**Requirement:** FR-1.6
**Priority:** Should

## Story

**As a** content creator who manages several social accounts,
**I want to** keep all of them inside one workspace,
**so that** I can plan, schedule, and review everything from a single place instead of switching logins.

## Acceptance Criteria

1. My workspace can hold multiple connected accounts, across platforms and several per platform (see FR-2.2).
2. I can see all my connected accounts in one list, grouped or labeled by platform.
3. When creating a post, I choose which accounts to target (FR-3.2).
4. The calendar, history, and dashboard can show all accounts together, with a filter to narrow by account or platform (FR-4.2, FR-5.4).
5. Each account is clearly identified everywhere by its platform icon and account name, so I never post to the wrong one.
6. Data in my workspace is visible only to me (NFR-2.4).
7. The workspace works on mobile widths (NFR-6.3).

## Notes

- One user has one workspace in this phase. Teams, roles, and invitations are not in the spec, so they are out of scope.
- This is a Should, so it depends on FR-2.2 (multiple accounts per platform). If FR-2.2 is postponed, this story shrinks to "one workspace, one account per platform."
- Keeping the workspace as its own entity, separate from the user, makes teams easy to add later without a data migration.