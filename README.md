# Testing Repo

This repository contains a simple notepad web app. Open `index.html` in your
web browser and begin typing to save notes. Your text is automatically stored in
the browser so you can return to the page later and continue where you left
off. The layout now adapts better to small screens so you can comfortably use it
on phones and tablets.

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
different browsers or devices, run the included Node.js server:

```bash
npm install express cors
node server.js
```

Edit `SERVER_URL` in `index.html` to point to where the server is running.
When the page loads, it fetches the saved notes from the server and stores
new changes there as you type.

### Deploying the server for free

You don't need to keep a personal computer online. The `server.js` file can be
hosted on a free cloud service such as **Render** or **Railway**:

1. Create an account on [render.com](https://render.com) or another Node.js
   hosting provider and choose to create a new web service.
2. Connect your GitHub account and select this repository.
3. Use `npm install` as the build command and `node server.js` as the start
   command.
4. Deploy the service. Once it starts, copy the URL Render gives you.
5. Update `SERVER_URL` in `index.html` with that address so all devices send
   notes to your cloud server.

Free tiers may sleep when inactive, so it can take a moment for the server to
wake up when you first visit the page.

## Troubleshooting

If you see errors like `net::ERR_CONNECTION_REFUSED` or the page still tries to
connect to `http://localhost:3000`, verify that:

1. `SERVER_URL` in `index.html` points to the correct address of your running
   server (for example the URL Render gave you).
2. You have uploaded the updated `index.html` to GitHub Pages and refreshed the
   page in your browser with cache disabled.

When the server is unreachable, the notepad will continue to save notes locally
and display "Unable to reach server" near the bottom of the page.

