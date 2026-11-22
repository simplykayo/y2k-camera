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

The filter presets are implemented with native CSS/canvas color operations, without a paid API or image-processing service. Some effects are color treatments rather than geometric lens distortions. In Together Mode, each person's selected filter and intensity are shared over the peer data channel and applied to that person's camera feed on the other viewer's screen.


## Together Mode

Together Mode adds code-based video rooms using PeerJS/WebRTC. One person creates a room and shares its six-letter code; the other enters the code to request a connection. Both people can see each other's live camera and microphone stream, and the Camera Together tab sends a synchronized shutter signal so both browsers capture locally.

- Video/audio is sent peer-to-peer using WebRTC; photos remain in each browser's session-only camera roll.
- The six-letter room code is a short-lived-in-practice room identifier, not a password. Share it privately and create a fresh room for each session; the host must approve incoming video calls.
- PeerJS's public signalling service is used to establish connections. Some restrictive networks may require a TURN relay for reliable connectivity.
- Together Mode requires HTTPS and camera/microphone permission on both devices.


## Google Meet-style appearance and camera tools

Choose **Google Meet** in the Style selector for a conventional meeting interface with a neutral palette, simple controls, a dark camera stage, and a familiar call toolbar.

Additional tools include camera quality presets (480p/720p/1080p), preview aspect ratios, fullscreen preview, picture-in-picture where supported, a speaker test, keyboard shortcuts (M = mic, V = camera, F = fullscreen, Space = capture), undo last photo, download-all and delete-all gallery actions, and a one-click invite message.

## Together Mode security notes

- Incoming host-side data connections are held until the host approves the matching incoming video call. Rejected callers' pending data connections are closed.
- Room codes are generated with browser cryptographic randomness and unbiased character selection. They are temporary room identifiers, **not passwords or account authentication**. Only share them with the intended person.
- WebRTC media/data connections are peer-to-peer when the network permits; the PeerJS signalling service is still used to establish them. A TURN relay may be required on restrictive networks.
- This is a browser-only project and has not undergone a professional penetration test or independent security audit. Do not use it for sensitive or confidential conversations.
