# 🔧 Render: "Root directory backend does not exist" – Fix

## ❌ The Error

```
==> Root directory "backend" does not exist.
==> cd: /opt/render/project/src/backend: No such file or directory
```

Render is deploying commit **9ac1668** from GitHub. That commit **does not have the `backend` folder**.

---

## 🎯 Why This Happens

- **On GitHub (what Render uses):** Commit `9ac1668` = older, **no `backend/` folder**.
- **On your PC:** You have commit `7e00de5` = newer, **includes `backend/`**.
- That newer commit was **never pushed** to GitHub.

So Render only sees the old repo without `backend/`, and "Root directory backend" fails.

---

## ✅ Fix: Push Your Latest Commit to GitHub

Run this in your project folder (where your repo is):

```bash
git push origin master
```

This will:

1. Upload commit `7e00de5` (with the backend) to GitHub.
2. Update `master` on GitHub so it includes the `backend/` folder.
3. Let Render see the `backend` folder when it clones the repo.

---

## 📋 Step-by-Step

### 1. Open terminal in your project

```bash
cd "c:\React native\myapp"
```

### 2. Push to GitHub

```bash
git push origin master
```

If it asks for login, use your GitHub username and a **Personal Access Token** (not your normal password).

### 3. In Render

- Go to your service → **Manual Deploy** → **Deploy latest commit**.
- Or wait for auto-deploy if it’s enabled.

After the deploy, Render will use the latest commit that has `backend/`, and the "Root directory backend does not exist" error should go away.

---

## 🔐 If Push Asks for Password

GitHub no longer accepts account password for `git push`. Use a **Personal Access Token**:

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**.
2. **Generate new token**, enable `repo`.
3. Copy the token.
4. When `git push` asks for password, paste the **token** (not your GitHub password).

---

## ✅ After Pushing – What to Expect

**GitHub:**  
https://github.com/22A91A1289/Village-Work  
You should see a `backend` folder in the root of the repo.

**Render:**  
Next deploy should show something like:

```
==> Cloning from https://github.com/22A91A1289/Village-Work
==> Checking out commit 7e00de5...   (new commit)
==> Root directory "backend" exists
==> Running build command 'npm install'...
==> Running 'node server.js'
🚀 Server running...
```

---

## 📌 Summary

| Problem | Cause | Fix |
|--------|--------|-----|
| "Root directory backend does not exist" | `backend/` only in local commit, not on GitHub | `git push origin master` |
| Render uses old commit | GitHub `master` was not updated | Push, then redeploy on Render |

Run:

```bash
git push origin master
```

then redeploy on Render. The error should be resolved.
