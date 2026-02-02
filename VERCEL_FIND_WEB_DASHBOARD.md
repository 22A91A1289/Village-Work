# Find web-dashboard in Vercel Root Directory

Your repo has **web-dashboard** (it’s in the repo and on GitHub). In Vercel’s Root Directory picker you only see the first few folders, so you need to scroll.

---

## 1. Scroll down in the list

In the Root Directory selector you see something like:

- Village-Work (root)
- Screens
- assets  
- backend  

Folders are usually in **alphabetical order**. So after **backend** you should get:

- **components**
- **config**
- **contexts**
- **data**
- **navigation**
- **utils**
- **web-dashboard**  ← scroll until you see this

**Do this:** Scroll down inside that folder list until you see **web-dashboard**, then select it.

---

## 2. If you still don’t see web-dashboard

- **Refresh:** Reload the Vercel page and open Root Directory again.  
- **Redeploy:** Deployments → ⋯ on latest deploy → Redeploy (so Vercel re-reads the repo).  
- **Manual path:** If there is an “Override” or “Enter path” / text field under the tree, type:  
  `web-dashboard`  
  and save.

---

## 3. Confirm on GitHub

Open:  
**https://github.com/22A91A1289/Village-Work**

Check that in the root of the repo you see a folder named **web-dashboard**.  
If it’s there, Vercel has it too; you just need to scroll (or type the path) in the Root Directory picker.

---

## Summary

- **web-dashboard** is in your repo and on GitHub.  
- In Vercel, **scroll down** in the Root Directory list until you see **web-dashboard**, then select it.  
- If the list doesn’t show it, refresh, redeploy, or type **web-dashboard** in the path field if available.
