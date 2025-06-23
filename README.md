# Testing Repo

This repository contains a simple notepad web app. Open `index.html` in your web browser and begin typing to save notes. Your text is automatically stored in the browser so you can return to the page later and continue where you left off. The layout now adapts better to small screens so you can comfortably use it on phones and tablets. A small bullet button lets you toggle a • bullet at the start of each selected line.

## Hosting with GitHub Pages

If you want to use the notepad directly from GitHub, enable GitHub Pages for this repository. Make sure your main HTML file is named `index.html` and lives in the root of the branch you deploy. Then follow these steps:

1. Commit and push your code to GitHub.
2. On GitHub, open **Settings** → **Pages**.
3. Under **Source**, choose **Deploy from a branch** and select your branch (usually `main`) with the root folder.
4. Click **Save** (or **Save changes**). GitHub will display the new Pages URL near the top of the screen.

After a few moments, visit that URL to see the notepad hosted online.

## Syncing Across Devices

The notepad stores data in your browser by default. To share notes between different browsers or devices, run the included Node.js server. The server requires **Node.js 18 or newer**:

```bash
npm install
npm start
```

This command launches the sync server on port 3000. While it runs, open `index.html` in your browser to use the notepad. Your notes automatically save and sync a few seconds after you stop typing.

To run the automated tests:

```bash
npm test
```

## Persistent Storage for `notes.txt`

The Node.js backend saves notes in a file called `notes.txt` at the project root. When this file is lost, so are your notes. Local development keeps the file on disk, but most hosting providers reset the filesystem on each deploy or restart.

If you want to keep notes when deploying to a platform like Render or Heroku, make sure the file is stored on persistent storage. On Render you can attach a disk in your service settings and mount it into the app directory so `notes.txt` survives restarts. Heroku doesn't preserve local files, so use an add-on such as Postgres or an S3 bucket and modify the server to write there instead. Any storage backend that persists between deployments will work.

## Optional Supabase Backup

To store a copy of your notes in Supabase:

1. Create a Supabase project and a table named `notes` with columns
   `id` (integer, primary key) and `content` (text).
2. From the project settings, copy the **Project URL** and your
   **service role** API key.
3. Set environment variables `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
   before starting the server.

When these variables are defined the server provides two extra routes:

- `POST /backup` – Upload the contents of `notes.txt` to the table.
- `GET /restore` – Retrieve the stored text and overwrite `notes.txt`.

The page adds **Save to Cloud** (💾) and **Restore from Cloud** (⬇️)
buttons that call these routes.
