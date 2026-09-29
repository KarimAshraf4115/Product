### Modular MONOLITH + Separate Worker Process (VERY IMPORTANT)

- Client Side -> responsive SPA. It needs RTL/Arabic support and time zone display baked in from the start. It only talks to your API, **never to platforms**.
- **API (modular monolith)**: each **module** owns its own logic and tables
	- **Auth** -> **Workspace**: users, sessions, time zone, workspace membership.
	- **Accounts**: OAuth connect/disconnect, status list
	- **Posts**: drafts, base caption, per-platform overrides, validation
	- **Scheduling**: schedule/reschedule/cancel, calendar queries
	- **Media**: uploads and library
	- **Analytics**: reads synced data for the dashboard
	- **Tasks**: board, campaigns, checklists
	- **Notifications**: in-app, email later
	- **Compliance**: data deletion, Meta deletion callback
- **Platform adapter layer**: Define small interfaces, one implementation per platform:

> [!NOTE] Note
> Facebook and Instagram share the Meta Graph API but have very different publishing flows, so I'd make them separate adapters sharing a Meta client.

#### Scheduler / Workers Part
- **The DB is the source of truth**, not the queue. A Poller runs every 30s (for example), finds due `PostTarget`s, and enqueues them. If the queue dies or restarts, the next poll recovers everything
- Persistent queue with retries and backoff
- **Idempotency**: each `PostTarget` is a state machine (`scheduled → publishing → published/failed`). A worker claims it with an atomic update (`WHERE status='scheduled'`), so two workers can't both grab it. Also, if a worker crashes mid-publish, you need a "stuck in publishing" recovery path that _checks the platform first_ before retrying, since platforms don't give you idempotency keys.

#### Token
- **Token manager**: encrypts tokens (envelope encryption, key in env or secrets manager, not the DB), runs a refresh job before expiry, and flips the account to `expired` and fires a notification when refresh fails.
  
  
#### Media Service
- object storage (S3-compatible), chunked/resumable uploads, validation of size/duration/format against platform limits. 
  
  >[!Note] Note
  >**Instagram publishing pulls media from a public URL**, so you'll need signed, publicly reachable URLs. This affects our storage design.
  
#### Analytics
- scheduled jobs per account that write **metric snapshots** to your DB. Dashboard reads only those. Normalize into a common schema, with a JSON column for platform-specific deep metrics.