
# Authentication

| FR-ID  | Req.                                           | Priority |
| ------ | ---------------------------------------------- | -------- |
| FR-1.1 | Register as Content Creator (Email - Password) | Must     |
| FR-1.2 | Login as Content Creator                       | Must     |
| FR-1.3 | Logout from account                            | Must     |
| FR-1.4 | Password Reset                                 | Must     |
| FR-1.5 | Set time zone (For Scheduling)                 | Must     |
| FR-1.6 | One Workspace (Multiple Accounts)              | Should   |
# Connecting Platforms

| FR-ID  | Req.                                                                 | Priority |
| ------ | -------------------------------------------------------------------- | -------- |
| FR-2.1 | Connect accounts (OAuth) -> Facebook, Instagram, TikTok, YouTube     | Must     |
| FR-2.2 | Multiple Accounts per platform                                       | Should   |
| FR-2.3 | Store tokens encrypted and refresh automatically (Like a session)    | Must     |
| FR-2.4 | List connected accounts with status (active/expired)                 | Must     |
| FR-2.5 | Disconnect an account                                                | Must     |
| FR-2.6 | Guide Instagram users through the Page Publishing Authorization step | Should   |

# Posting on Multiple Platforms

| FR-ID  | Req.                                                                     | Priority    |
| ------ | ------------------------------------------------------------------------ | ----------- |
| FR-3.1 | Create **Draft** with **Base Caption**                                   | Must        |
| FR-3.2 | Choose Target **Account** and **Platforms**                              | Must        |
| FR-3.3 | Override Per-Platform (captions - hashtags - media)                      | Must        |
| FR-3.4 | Platform specific fields (YouTube: title, description, tags, visibility) | Must        |
| FR-3.5 | Validation against **Platform Limits**                                   | Must        |
| FR-3.6 | Per-platform preview                                                     | Must for TT |
| FR-3.7 | Edit, duplicate, delete                                                  | Should      |
| FR-3.8 | Save drafts in **Media Liberary**                                        | Should      |
# Scheduling 

| FR-ID  | Req.                                                                       | Priority |
| ------ | -------------------------------------------------------------------------- | -------- |
| FR-4.1 | Schedule with date/time, with optional different time per platform         | Must     |
| FR-4.2 | Calendar view                                                              | Must     |
| FR-4.3 | Reschedule OR Cancel                                                       | Must     |
| FR-4.4 | Auto Publish at the Scheduled Time                                         | Must     |
| FR-4.5 | Per-platform status: scheduled / publishing / published / failed           | Must     |
| FR-4.6 | Retry on failure and notify the user                                       | Must     |
| FR-4.7 | Save the platform's post ID/URL after publishing (To view on the platform) | Should   |
| FR-4.8 | Publish now                                                                | Must     |
| FR-4.9 | Enforce platform limits and warn before scheduling over them               | Must     |
# Analytics Dashboard

| FR-ID  | Req.                                                   | Priority |
| ------ | ------------------------------------------------------ | -------- |
| FR-5.1 | Periodic fetch of account-level metrics                | Must     |
| FR-5.2 | Fetch per-post metrics for published posts             | Must     |
| FR-5.3 | One unified overview across all accounts and platforms | Must     |
| FR-5.4 | Filters by date range, platform and account            | Must     |
| FR-5.5 | Per-post performance table, sortable                   | Must     |
| FR-5.6 | "Last synced" indicator + manual refresh               | Should   |
| FR-5.7 | Platform-specific deep metrics                         | Could    |
# Task Manager

| FR-ID  | Req.                                                    | Priority |
| ------ | ------------------------------------------------------- | -------- |
| FR-6.1 | Four columns: Future Plans / To Do / In Progress / Done | Must     |
| FR-6.2 | CRUD tasks with title, description, due date, labels    | Must     |
| FR-6.3 | Drag tasks between columns                              | Must     |
| FR-6.4 | Link a task to a post draft                             | Should   |
| FR-6.5 | Group tasks into campaigns                              | Should   |
| FR-6.6 | Checklists/subtasks                                     | Should   |
# Notifications

| FR-ID  | Req.                                                    | Priority |
| ------ | ------------------------------------------------------- | -------- |
| FR-7.1 | In-app notification on publish failure or expired token | Must     |
| FR-7.2 | Notify on **Upcoming Publishing Time**                  | Could    |


--------------------------------------------------------------------------

# Late MVP stages

# AI insights

| FR-ID  | Req.                                                            | Priority |
| ------ | --------------------------------------------------------------- | -------- |
| FR-8.1 | Best-time-to-post from the user's own history, no LLM needed    | Could    |
| FR-8.2 | LLM summary of dashboard metrics with recommendations (Reports) | Could    |
| FR-8.3 | AI caption adaptation per platform                              | Could    |
# Compliance

| FR-ID  | Req.                                                  | Priority |
| ------ | ----------------------------------------------------- | -------- |
| FR-9.1 | Public privacy policy and terms of service pages      | Must     |
| FR-9.2 | User can delete their data and revoke platform access | Must     |
| FR-9.3 | Data-deletion endpoint/instructions for Meta          | Must     |

