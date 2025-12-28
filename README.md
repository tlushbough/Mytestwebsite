# Helloworld (static site)

This is a minimal static site meant to be hosted with GitHub Pages.

## Files

- `index.html` — homepage
- `styles.css` — minimal styling

## Publish to GitHub Pages (quick steps)

1. Create a repository on GitHub (name it e.g. `Helloworld`).
2. In your local folder run:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
# replace USERNAME and REPO with your values
git remote add origin git@github.com:USERNAME/REPO.git
git push -u origin main
```

3. Enable GitHub Pages:

- Go to the repository on GitHub → Settings → Pages.
- Under "Source" select branch `main` and folder `/ (root)`, then Save.

4. After a minute or two your site will be available at:

```
https://USERNAME.github.io/REPO
```

Optional: You can create the repo and push in one step with the GitHub CLI:

```bash
gh repo create USERNAME/REPO --public --source=. --remote=origin --push
```

If you want automatic publishing from a `gh-pages` branch or CI-based deployment, I can add a GitHub Actions workflow. 
# Mytestwebsite
