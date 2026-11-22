# Y2K Camera

A little digital camera for the pictures you'll keep forever. A browser-based photo booth with a deliberately nostalgic early-2000s camera interface.

## Features

- Live webcam preview (camera permission required)
- 40 visual filter presets across nine collections
- Filter strength control
- Front/rear camera switching where supported
- Self timer: off, 3, 5 or 10 seconds
- Single photo and four-shot photo strip modes
- Camera flash and optional synthesized shutter sound
- Download individual photos or a composed photo strip
- Session-only camera roll; images are not uploaded

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Camera access works on localhost and secure HTTPS origins.

## Build

```bash
npm run build
npm run preview
```

## Deploy to Cloudflare Pages

1. Import this GitHub repository into Cloudflare Pages.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Build output directory: `dist`.
5. Deploy. Camera access requires HTTPS, which Cloudflare Pages provides.

## Privacy

Camera frames are processed in the browser. There is no upload endpoint, account system, analytics integration, or remote image storage. The camera roll exists only in the current page session and clears when the page is closed or refreshed.

## Notes

The filter presets are implemented with native CSS/canvas color operations, without a paid API or image-processing service. Some effects are color treatments rather than geometric lens distortions.


## Together Mode

Together Mode adds private, invite-link video rooms using PeerJS/WebRTC. One person creates a room and shares its unlisted invite link; the other joins from the link. Both people can see each other's live camera and microphone stream, and the Camera Together tab sends a synchronized shutter signal so both browsers capture locally using their own selected filter and timer.

- Video/audio is sent peer-to-peer using WebRTC; photos remain in each browser's session-only camera roll.
- The invite URL is a bearer link: anyone who receives it can attempt to join, so share it privately and create a fresh room for each session.
- PeerJS's public signalling service is used to establish connections. Some restrictive networks may require a TURN relay for reliable connectivity.
- Together Mode requires HTTPS and camera/microphone permission on both devices.
