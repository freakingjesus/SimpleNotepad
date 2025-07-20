# Testing Repo

This repository contains a simple notepad web app. Open `index.html` in your web browser and begin typing to save notes. Your text is automatically stored in the browser so you can return to the page later and continue where you left off. The layout now adapts better to small screens so you can comfortably use it on phones and tablets. Small bullet and checkbox buttons let you toggle a • bullet or ☐ checkbox at the start of each selected line.

## Hosting with GitHub Pages

If you want to use the notepad directly from GitHub, enable GitHub Pages for this repository. Make sure your main HTML file is named `index.html` and lives in the root of the branch you deploy. Then follow these steps:

1. Commit and push your code to GitHub.
2. On GitHub, open **Settings** → **Pages**.
3. Under **Source**, choose **Deploy from a branch** and select your branch (usually `main`) with the root folder.
4. Click **Save** (or **Save changes**). GitHub will display the new Pages URL near the top of the screen.

After a few moments, visit that URL to see the notepad hosted online.

## Syncing Across Devices

Press **💾 Save** to store the current note in Supabase and **⭮ Load** to reload
the saved copy. Notes are still stored locally as you type, but Supabase lets you
pull the same content on another device.

You can still run the Node.js server to access the Gemini endpoint. It requires **Node.js 18 or newer**:

```bash
npm install
npm start
```

The server requests Google Search grounding so Gemini can cite web results in its responses.

To run the automated tests:

```bash
npm test
```

## Supabase setup

1. In Supabase create a new table named `notes` with columns:
   - `id` UUID (primary key)
   - `content` text
2. Enable Row Level Security (RLS) on the table.
3. Add an "Allow anon insert" policy so anyone can save notes.
4. Update `SUPABASE_URL` and `SUPABASE_KEY` in `index.html` with
your project's anon key values.
