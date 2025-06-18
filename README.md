# Testing Repo

This repository contains a simple notepad web app. Open `index.html` in
your web browser and begin typing to save notes. Your text is automatically
stored in the browser so you can return to the page later and continue where you
left off. The layout now adapts better to small screens so you can comfortably
use it on phones and tablets. A small bullet button lets you toggle a
• bullet at the start of each selected line. A refresh button (⟳) in the
toolbar pulls the latest notes from the server when you want to sync manually.

## Hosting with GitHub Pages

If you want to use the notepad directly from GitHub, enable GitHub Pages for this
repository. Make sure your main HTML file is named `index.html` and lives in the
root of the branch you deploy. Then follow these steps:

1. Commit and push your code to GitHub.
2. On GitHub, open **Settings** → **Pages**.
3. Under **Source**, choose **Deploy from a branch** and select your branch
   (usually `main`) with the root folder.
4. Click **Save** (or **Save changes**). GitHub will display the new Pages URL
   near the top of the screen.

After a few moments, visit that URL to see the notepad hosted online.

## Syncing Across Devices

The notepad stores data in your browser by default. To share notes between
different browsers or devices, run the included Node.js server. The server
requires **Node.js 18 or newer**:

```bash
npm install
npm start
```

## Authentication

Set the `NOTES_PIN` environment variable when starting the server to
require a matching `pin` value on `/notes` requests. If `NOTES_PIN` is not
defined, the server falls back to `0043`. The notepad UI will prompt for
this pin (defaulting to `0043`) and include it with requests.
