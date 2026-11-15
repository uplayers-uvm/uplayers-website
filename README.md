# The University Players website

Website for UVM's student-run theatre club.

- **Editing content (no coding):** log in at https://app.pagescms.org and open this repository. See [EDITING-GUIDE.md](EDITING-GUIDE.md) for step-by-step instructions.
- **How it goes live:** every saved change triggers the GitHub Action in `.github/workflows/deploy.yml`, which builds the site and publishes it to Cloudflare Pages (project `uplayers`). It needs the `CLOUDFLARE_API_TOKEN` repository secret.
- **Built with:** [Astro](https://astro.build). Run `npm install` then `npm run dev` to work on it locally.
- **Handoff:** to pass the site to the next webmaster, add them as an Owner of the GitHub organization and as a member of the Cloudflare account, then remove yourself.
