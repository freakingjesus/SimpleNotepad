# Testing Repo

This repository contains a simple notepad web app. Open `index.html` in
your web browser and begin typing to save notes. Your text is automatically
stored in the browser so you can return to the page later and continue where you
left off. The layout now adapts better to small screens so you can comfortably
use it on phones and tablets. A small bullet button lets you toggle a
• bullet at the start of each selected line. A refresh button in the toolbar
pulls the latest notes from the server when you want to sync manually.

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

To enable the optional Gemini integration, provide your Google API key when
starting the server:

```bash
GEMINI_API_KEY=your_key npm start
```

This runs the `start` script defined in `package.json`.

When switching devices, click the refresh button in the toolbar to pull the
latest saved notes from the server.

## Enabling the Gemini API

Before using Gemini features, you must enable the API in your Google Cloud project:

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project or create a new one.
3. Go to **APIs & Services** → **Library** and search for "Generative Language API" (also known as the Google Gemini API).
4. Click **Enable**.

Create an API key in the same project and supply it to the server. The key must belong to the project where the API is enabled. See Google's [Generative AI quickstart](https://ai.google.dev/docs/start) for details.

## Setting `GEMINI_API_KEY` in Production

On a hosting provider like [Render](https://render.com/), set the
`GEMINI_API_KEY` environment variable through the dashboard:

1. Open your service in the Render dashboard.
2. Go to **Environment** → **Add Environment Variable** and enter your key.

After changing the value, redeploy or restart the service so the new key takes
effect.

## Running Tests

The repository includes automated tests for the server logic. After installing
dependencies with `npm install`, run:

```bash
npm test
```

This executes the Mocha test suite that verifies `loadNotes()` and
`saveNotes()` work correctly.

