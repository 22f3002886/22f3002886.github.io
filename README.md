# Abhishek Kumar — terminal portfolio

Static site. No build step. Edit `content.js`, then redeploy.

The copy in `content.js` is starter material. Replace the bio, projects, skills, education, and links before you treat this as the public site.

## Commands

`help` `about` `projects` `skills` `contact` `education` `sudo` `clear`

Arrow up / down walks command history. Click a chip to run that command.

## Deploy on abhishekrthakur.me

The domain already answers from GitHub Pages. Replacing that Pages site is the shortest path. `CNAME` is already in this folder.

1. Find the GitHub repo that publishes the domain (Settings → Pages, or the repo that contains the current one-line site).
2. Replace its files with this folder. Keep `CNAME`.
3. Commit and push to the branch Pages uses (`main` or `gh-pages`).
4. In the repo: Settings → Pages → branch set to that branch, folder `/ (root)`.
5. Wait a minute, then open https://abhishekrthakur.me/

If Pages was serving from `/docs` or a different branch, either move these files there or switch the source to root.

## Deploy on Vercel instead

Import the folder (or the GitHub repo) as a static project. Framework preset: Other. Output is the repo root.

Then add the domain in the project’s Domains tab. You must change DNS off GitHub Pages or both hosts will fight.

Typical records (confirm the exact values on the Vercel domain card):

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 76.76.21.21 |
| CNAME | www | the CNAME target Vercel shows |

SSL is issued after DNS validates.
