# Vercel – Set Root Directory to web-dashboard

You don’t get a dropdown for root directory in Vercel. You have to **type** it.

---

## Step 1: Open project settings

1. Go to **https://vercel.com/dashboard**
2. Open your **Village-Work** project (or the one you imported).
3. Click the **Settings** tab.

---

## Step 2: Set Root Directory (type it)

1. In the left sidebar, click **General**.
2. Scroll to **Root Directory**.
3. Click **Edit** next to “Root Directory”.
4. In the text field, type exactly:

   ```text
   web-dashboard
   ```

   Important:
   - Use a **hyphen**: `web-dashboard` (not `webdashboard`).
   - No leading or trailing slash.
   - All lowercase.

5. Click **Save**.

---

## Step 3: Environment variable

1. Still in **Settings**, go to **Environment Variables**.
2. Add:
   - **Name:** `REACT_APP_API_BASE_URL`
   - **Value:** `https://village-work.onrender.com`
3. Save.

---

## Step 4: Redeploy

1. Go to the **Deployments** tab.
2. Open the **⋯** menu on the latest deployment.
3. Click **Redeploy** (or push a new commit to trigger a deploy).

---

## If you don’t see “Root Directory”

- **New project:** When you **Import** the repo, look for **Configure Project**.
- In **Root Directory**, click **Edit** and type: `web-dashboard`.
- Then add the env variable and deploy.

---

## Summary

| Field              | Value                          |
|--------------------|---------------------------------|
| **Root Directory** | `web-dashboard` (type this)    |
| **Framework**      | Create React App (auto-detected)|
| **Build Command**  | `npm run build` (default)       |
| **Output Directory** | `build` (default)            |
| **Env variable**   | `REACT_APP_API_BASE_URL` = `https://village-work.onrender.com` |

The folder in your repo is named **web-dashboard** (with hyphen). There is no dropdown; type `web-dashboard` in the Root Directory field.
