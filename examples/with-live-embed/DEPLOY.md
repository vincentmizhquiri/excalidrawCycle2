# Deploying the Live-Sync Embed

Two separate things need to go live: the relay server (the piece that lets
two browsers talk to each other) and this app itself (the actual embeddable
page). Do them in this order.

## Part 1: Deploy the relay server

This is Excalidraw's own open-source server — https://github.com/excalidraw/excalidraw-room.
You don't need to change any code in it.

1. Go to https://github.com/excalidraw/excalidraw-room and click "Fork" (top
   right) to get your own copy on your GitHub account.
2. Go to https://render.com and sign up / log in (free tier works fine for
   this).
3. Click "New +" → "Web Service".
4. Connect your GitHub account if prompted, then pick your forked
   `excalidraw-room` repo.
5. Fill in these settings:
   - **Runtime**: Node
   - **Build Command**: `yarn && yarn build`
   - **Start Command**: `yarn start`
6. Click "Create Web Service". Render will build and deploy it — takes a
   few minutes. When it's done, you'll see a URL like
   `https://excalidraw-room-xxxx.onrender.com`. That's your relay server
   address — copy it.
7. Quick sanity check: open that URL in a browser. You should see the text
   "Excalidraw collaboration server is up :)". If you see that, it's
   working.

**Note:** Render's free tier "spins down" the server after 15 minutes of no
traffic, and takes 30-60 seconds to wake back up on the next request. For a
demo tomorrow, either keep the tab open and test a few minutes before you
present, or upgrade to a paid instance if it needs to be instantly ready.

## Part 2: Configure and run this app

1. In this folder (`examples/with-live-embed`), open the `.env` file (create
   it if it doesn't exist — copy `.env.example` and rename it to `.env`).
2. Set it to the URL from Part 1:
   ```
   VITE_APP_WS_SERVER_URL=https://excalidraw-room-xxxx.onrender.com
   ```
3. From the **repo root** (not this folder), run:
   ```
   yarn build:packages
   ```
   This only needs to be done once (or again if you pull new changes to the
   core Excalidraw packages).
4. From this folder, run:
   ```
   yarn start
   ```
   This opens the app in your browser at `http://localhost:3002`.

## Testing that live-sync actually works

1. With the app open, copy the full URL from your browser's address bar —
   it'll have `#room=` followed by a random ID.
2. Open that exact same URL in a second browser tab (or a different
   browser entirely, like Firefox if you're in Chrome).
3. Draw something in one tab. It should appear in the other tab within
   about a second.
4. The pill in the top-left should say "Live — 2 people viewing" once both
   tabs are connected.

If it doesn't sync: check the browser console (right-click → Inspect →
Console) in both tabs for errors, and send me exactly what you see there —
that's the fastest way for me to diagnose it without being able to see it
live myself.

## Deploying this app itself (so it's a real embeddable URL, not just
## localhost)

Once it's working locally, this app can be deployed the same way as any
other Vite app — Vercel or Netlify both work by pointing at this folder in
your GitHub repo, with the build command `yarn build` and the same
`VITE_APP_WS_SERVER_URL` environment variable set in their dashboard. Let me
know once local testing works and I'll walk through that step next.
