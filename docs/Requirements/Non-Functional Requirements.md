## 1 - Reliability (TOP PRIORITY)

| NFR-ID  | Req.                                                                                                                   |
| ------- | ---------------------------------------------------------------------------------------------------------------------- |
| NFR-1.1 | Scheduled posts publish within 2 minutes of the scheduled time in 99% of cases, excluding platform outages.            |
| NFR-1.2 | A post is never published twice to the same account (idempotent publishing).                                           |
| NFR-1.3 | Failed publishes retry automatically (e.g. 3 times with backoff) before being marked failed, and the user is notified. |
| NFR-1.4 | Scheduled jobs survive server restarts (persistent queue, not in-memory).                                              |
| NFR-1.5 | Availability target of 99% per month (about 7 hours of downtime), because if the scheduler is down, posts are missed.  |
 - Availability : is the percentage of time system is up and working. A 99% target means it's allowed to be down for at most 1% of the month.(7 hours)

## 2 - Security 

| NFR-ID  | Req.                                                                       |
| ------- | -------------------------------------------------------------------------- |
| NFR-2.1 | Tokens are encrypted at rest and never logged or sent to the frontend.     |
| NFR-2.2 | Passwords are hashed with a modern algorithm                               |
| NFR-2.3 | HTTPS everywhere (OAuth callbacks require it).                             |
| NFR-2.4 | Every request checks that the user only accesses their own workspace data. |
| NFR-2.5 | OAuth flows use a **state** parameter to prevent CSRF attacks.             |
# 3 - Privacy

| NFR-ID  | Req.                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------ |
| NFR-3.1 | On account deletion, all user data including tokens is removed within a defined period (e.g. 30 days). |
| NFR-3.2 | Use platform data only as the platforms' developer policies allow.                                     |
## 4 - Performance

| NFR-ID  | Req.                                                                                                                            |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| NFR-4.1 | Main pages load in under 3 seconds, and 95% of normal API calls respond in under 500 ms.                                        |
| NFR-4.2 | The dashboard reads from **stored, periodically synced data**, not live platform calls. This keeps it fast and saves API quota. |
| NFR-4.3 | Large video uploads use chunked/resumable upload, with a maximum file size defined per platform.                                |

## 5 - Scalability

| NFR-ID  | Req.                                                                                                                                    |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-5.1 | Initial target of about 100 users, 500 connected accounts and 10,000 posts/month, with publishing workers that can be scaled out later. |

## 6 - Usability & Localization

| NFR-ID  | Req.                                                                                                  |
| ------- | ----------------------------------------------------------------------------------------------------- |
| NFR-6.1 | A new user can connect an account and schedule a first post in under 5 minutes without documentation. |
| NFR-6.2 | Errors are human-readable ("Instagram connection expired, reconnect"), not raw API errors.            |
| NFR-6.3 | Responsive web app that works on mobile browsers.                                                     |
| NFR-6.4 | Captions support Arabic (RTL text) and emoji correctly, which matters for Egyptian creators.          |
| NFR-6.5 | Times are stored in UTC and shown in the user's timezone.                                             |
## 7 - Maintainability

| NFR-ID  | Req.                                                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| NFR-7.1 | Adding a new platform requires writing a new adapter without modifying the core scheduler (Open/Closed Principle). |
| NFR-7.2 | The scheduler and token logic have automated tests.                                                                |
| NFR-7.3 | Platform limits live in configuration, not hard-coded.                                                             |

## 8 - Observability

| NFR-ID  | Req.                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------- |
| NFR-8.1 | Every publish attempt is logged with its status and the platform's error, so failures can be diagnosed. |
## 9 - Data and Compatibility 

| NFR-ID  | Req.                                                                  |
| ------- | --------------------------------------------------------------------- |
| NFR-9.1 | Daily database backups with a set retention (e.g. 7 days).            |
| NFR-9.2 | Supports the latest two versions of Chrome, Edge, Firefox and Safari. |




