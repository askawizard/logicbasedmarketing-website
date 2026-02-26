# GitHub Auto-Deploy Setup
## One-time 20-minute setup. Then every change deploys automatically.

After this is set up: you or Claude makes a change to any file → push to GitHub → Bluehost updates in 2 minutes. No more manual uploads ever.

---

## STEP 1 — Create a GitHub repo (5 min)

1. Go to github.com → sign in (or create free account)
2. Click "New repository"
3. Name it: `logic-based-marketing-website`
4. Set to **Private**
5. Don't add README or .gitignore
6. Click "Create repository"

---

## STEP 2 — Add your FTP credentials as GitHub Secrets (3 min)

GitHub Secrets keep your password out of the code.

1. In your new repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these two secrets:

**Secret 1:**
- Name: `FTP_USERNAME`
- Value: your Bluehost FTP username (same as cPanel login — usually your email or main username)

**Secret 2:**
- Name: `FTP_PASSWORD`
- Value: your Bluehost FTP password (same as cPanel password)

To find your FTP credentials: Bluehost cPanel → Files → FTP Accounts

---

## STEP 3 — Push your website files to GitHub (5 min)

Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd "path/to/your/Claude/LogicBasedMarketing/website"
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/logic-based-marketing-website.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## STEP 4 — Watch it deploy (2 min)

1. Go to your GitHub repo
2. Click the "Actions" tab
3. You'll see a workflow running called "Deploy to Bluehost"
4. Green checkmark = deployed successfully
5. Go to logicbasedmarketing.com — your site is updated

---

## HOW IT WORKS GOING FORWARD

Every time you (or Claude) changes a file:

```bash
git add .
git commit -m "describe what changed"
git push
```

That's it. Bluehost updates in ~2 minutes automatically.

Claude can also tell you exactly what commands to run for each deploy.

---

## TROUBLESHOOTING

**Deploy fails — FTP connection refused:**
- Check Bluehost FTP hostname: usually `ftp.logicbasedmarketing.com` or `box1234.bluehost.com`
- Go to Bluehost cPanel → FTP Accounts → find your primary FTP hostname
- Update `server:` in `.github/workflows/deploy.yml` with the correct hostname

**"Permission denied" errors:**
- Double-check the `server-dir` path: `/public_html/logicbasedmarketing/`
- Make sure FTP user has write access to that directory

**Files not showing up:**
- Check the `local-dir` in deploy.yml — it should be `./` to deploy all files in the website folder
- Check the `exclude` list isn't blocking your files

---

## WHAT GETS DEPLOYED

Every `.html`, `.css`, `.js`, `.xml`, image, and other file in the `website/` folder.

What gets EXCLUDED (not deployed):
- `.git` folder and files
- `.github` folder
- `*.md` files (internal docs)
- `*.zip` files

The `one-pager.html`, `pricing.html`, and `proposal.html` pages deploy but are not linked in nav (as designed — sales tools only).

---

*Once this is set up, tell Claude: "GitHub auto-deploy is configured" and Claude will start including git commands with every website change.*
