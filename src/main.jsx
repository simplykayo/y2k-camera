import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const FILTERS = [
  { name:'Original', group:'BASICS', css:'none', tint:null },
  { name:'2004 Digicam', group:'Y2K', css:'contrast(1.16) saturate(1.24) brightness(1.04)', tint:'#ffd9ad', blend:'soft-light', alpha:.08 },
  { name:'Cyber Princess', group:'Y2K', css:'contrast(1.12) saturate(1.5) hue-rotate(-8deg)', tint:'#ff8bc8', blend:'soft-light', alpha:.18 },
  { name:'Chrome Heart', group:'Y2K', css:'contrast(1.35) saturate(.72) brightness(1.08)', tint:'#b9d5e9', blend:'screen', alpha:.12 },
  { name:'Bubblegum', group:'Y2K', css:'saturate(1.5) hue-rotate(-14deg) brightness(1.06)', tint:'#ff70bd', blend:'soft-light', alpha:.2 },
  { name:'Cyber Blue', group:'Y2K', css:'contrast(1.18) saturate(1.25) hue-rotate(18deg)', tint:'#67cfff', blend:'soft-light', alpha:.18 },
  { name:'Disposable', group:'FILM', css:'contrast(1.12) saturate(.82) sepia(.18) brightness(1.04)', tint:'#f3c38c', blend:'multiply', alpha:.12 },
  { name:'Warm Print', group:'FILM', css:'sepia(.28) saturate(1.18) contrast(1.06)', tint:'#ffb66f', blend:'soft-light', alpha:.13 },
  { name:'Polaroid', group:'FILM', css:'contrast(.92) saturate(.82) brightness(1.12)', tint:'#fff0d4', blend:'screen', alpha:.14 },
  { name:'Film Grain', group:'FILM', css:'contrast(1.16) saturate(.78) brightness(1.02)', tint:'#8c755f', blend:'soft-light', alpha:.08 },
  { name:'Kodak-ish', group:'FILM', css:'contrast(1.13) saturate(1.32) sepia(.12)', tint:'#ffbd65', blend:'soft-light', alpha:.12 },
  { name:'Cherry', group:'COLOR', css:'saturate(1.32) hue-rotate(-20deg) contrast(1.08)', tint:'#ef5279', blend:'soft-light', alpha:.16 },
  { name:'Lavender', group:'COLOR', css:'saturate(.92) hue-rotate(24deg) brightness(1.08)', tint:'#b79aff', blend:'soft-light', alpha:.2 },
  { name:'Ocean', group:'COLOR', css:'saturate(1.15) hue-rotate(145deg) contrast(1.06)', tint:'#53c5d9', blend:'soft-light', alpha:.13 },
  { name:'Peach Soda', group:'COLOR', css:'saturate(1.08) sepia(.16) brightness(1.08)', tint:'#ffae91', blend:'soft-light', alpha:.2 },
  { name:'Midnight', group:'COLOR', css:'brightness(.78) contrast(1.2) saturate(1.15)', tint:'#222b78', blend:'multiply', alpha:.2 },
  { name:'Soft Focus', group:'DREAM', css:'blur(.35px) brightness(1.12) saturate(.86)', tint:'#fff0e8', blend:'screen', alpha:.18 },
  { name:'Angel Glow', group:'DREAM', css:'brightness(1.15) contrast(.88) saturate(1.12)', tint:'#ffd9ef', blend:'screen', alpha:.22 },
  { name:'Stardust', group:'DREAM', css:'contrast(1.04) saturate(1.2) brightness(1.08)', tint:'#c9c3ff', blend:'screen', alpha:.15 },
  { name:'Bloom', group:'DREAM', css:'brightness(1.12) saturate(1.2) contrast(.92)', tint:'#ffa9c8', blend:'soft-light', alpha:.18 },
  { name:'Haze', group:'DREAM', css:'contrast(.84) brightness(1.13) saturate(.72)', tint:'#d7d7e8', blend:'screen', alpha:.2 },
  { name:'VHS', group:'RETRO', css:'contrast(1.2) saturate(1.3) hue-rotate(-8deg)', tint:'#ef4747', blend:'soft-light', alpha:.1 },
  { name:'CRT', group:'RETRO', css:'contrast(1.28) saturate(1.1) brightness(.92)', tint:'#61b5a0', blend:'soft-light', alpha:.13 },
  { name:'Camcorder', group:'RETRO', css:'contrast(1.2) saturate(.86) brightness(1.04)', tint:'#c6d19b', blend:'soft-light', alpha:.16 },
  { name:'Pixel Pop', group:'RETRO', css:'contrast(1.32) saturate(1.5)', tint:'#ffdf6e', blend:'soft-light', alpha:.1 },
  { name:'Glitch', group:'RETRO', css:'contrast(1.25) saturate(1.5) hue-rotate(12deg)', tint:'#00d8ff', blend:'screen', alpha:.12 },
  { name:'Fish-eye', group:'ODD', css:'contrast(1.16) saturate(1.15) brightness(1.03)', tint:'#d7f4ff', blend:'soft-light', alpha:.1 },
  { name:'Thermal', group:'ODD', css:'saturate(2.4) hue-rotate(150deg) contrast(1.2)', tint:'#ff4d85', blend:'soft-light', alpha:.14 },
  { name:'Negative', group:'ODD', css:'invert(1) hue-rotate(180deg) contrast(1.08)', tint:null },
  { name:'Duotone', group:'ODD', css:'grayscale(1) contrast(1.2)', tint:'#7b59d6', blend:'color', alpha:.38 },
  { name:'RGB Split', group:'ODD', css:'saturate(1.45) contrast(1.12)', tint:'#ff58b9', blend:'screen', alpha:.13 },
  { name:'Flashback', group:'MOOD', css:'contrast(1.18) saturate(1.2) brightness(1.12)', tint:'#ffe5b2', blend:'screen', alpha:.18 },
  { name:'Dollhouse', group:'MOOD', css:'brightness(1.1) contrast(.96) saturate(1.32)', tint:'#ffc1df', blend:'soft-light', alpha:.2 },
  { name:'Glossy', group:'MOOD', css:'contrast(1.18) saturate(1.22) brightness(1.08)', tint:'#d5eaff', blend:'screen', alpha:.12 },
  { name:'Rosy', group:'MOOD', css:'hue-rotate(-12deg) saturate(1.2) brightness(1.04)', tint:'#ff9eb7', blend:'soft-light', alpha:.22 },
  { name:'Twilight', group:'MOOD', css:'contrast(1.12) saturate(1.24) hue-rotate(18deg) brightness(.92)', tint:'#5c5bb2', blend:'soft-light', alpha:.22 },
  { name:'Classic Mono', group:'MONO', css:'grayscale(1) contrast(1.08)', tint:null },
  { name:'Silver Screen', group:'MONO', css:'grayscale(1) contrast(1.28) brightness(1.08)', tint:'#c9d5df', blend:'soft-light', alpha:.12 },
  { name:'Noir', group:'MONO', css:'grayscale(1) contrast(1.5) brightness(.82)', tint:null },
  { name:'Soft Mono', group:'MONO', css:'grayscale(1) contrast(.86) brightness(1.12)', tint:'#f5e9df', blend:'screen', alpha:.12 }
];

const GROUPS = ['ALL', 'Y2K', 'FILM', 'COLOR', 'DREAM', 'RETRO', 'ODD', 'MOOD', 'MONO'];
const cx = (...items) => items.filter(Boolean).join(' ');

function filterAtIntensity(filter, strength) {
  if (!filter || filter === 'none') return 'none';
  const amount = Math.max(0, Math.min(100, strength)) / 100;
  const neutral = { brightness:1, contrast:1, saturate:1, 'hue-rotate':0, sepia:0, grayscale:0, invert:0, blur:0 };
  return filter.replace(/([a-z-]+)\(([^)]+)\)/g, (match, name, raw) => {
    const value = parseFloat(raw);
    if (!Number.isFinite(value)) return match;
    const base = neutral[name] ?? 0;
    const next = base + (value - base) * amount;
    const unit = raw.trim().replace(/^[-+0-9.]+/, '');
    return name + '(' + Number(next.toFixed(3)) + unit + ')';
  });
};

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facing, setFacing] = useState('user');
  const [selected, setSelected] = useState('2004 Digicam');
  const [group, setGroup] = useState('ALL');
  const [intensity, setIntensity] = useState(100);
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState(0);
  const [mode, setMode] = useState('single');
  const [shots, setShots] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [flash, setFlash] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sound, setSound] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const activeFilter = useMemo(() => FILTERS.find(f => f.name === selected) || FILTERS[0], [selected]);
  const visibleFilters = useMemo(() => group === 'ALL' ? FILTERS : FILTERS.filter(f => f.group === group), [group]);
  const liveStyle = { filter: filterAtIntensity(activeFilter.css, intensity), opacity: 1 };

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async (direction = facing) => {
    setCameraError('');
    stopCamera();
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access needs HTTPS or localhost, and a browser that supports getUserMedia.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: direction }, width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (error) {
      setCameraError(error.name === 'NotAllowedError'
        ? 'Camera permission was blocked. Allow camera access in your browser settings, then try again.'
        : 'Could not start the camera. Check that it is connected and not being used by another app.');
    }
  }, [facing, stopCamera]);

  useEffect(() => {
    startCamera('user');
    return () => streamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  const playShutter = () => {
    if (!sound) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square'; osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + .08);
      gain.gain.setValueAtTime(.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .12);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .13);
      osc.onended = () => ctx.close();
    } catch {}
  };

  const renderFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return null;
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.save();
    if (facing === 'user') { ctx.translate(width, 0); ctx.scale(-1, 1); }
    ctx.filter = filterAtIntensity(activeFilter.css, intensity);
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();
    if (activeFilter.tint && activeFilter.alpha) {
      ctx.save();
      ctx.globalCompositeOperation = activeFilter.blend || 'soft-light';
      ctx.globalAlpha = activeFilter.alpha * (intensity / 100);
      ctx.fillStyle = activeFilter.tint;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
    return canvas.toDataURL('image/jpeg', .94);
  };

  const takeOne = async () => {
    const data = renderFrame();
    if (!data) return null;
    const item = { id: crypto.randomUUID(), data, filter: selected, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
    setShots(old => [...old, item]);
    setGallery(old => [item, ...old]);
    return item;
  };

  const takePhoto = async () => {
    if (!cameraReady || busy) return;
    setBusy(true);
    const total = mode === 'strip' ? 4 : 1;
    for (let i = 0; i < total; i++) {
      for (let n = countdown; n > 0; n--) {
        setTimer(n);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setTimer(0);
      setFlash(true); playShutter();
      await new Promise(resolve => setTimeout(resolve, 130));
      await takeOne();
      await new Promise(resolve => setTimeout(resolve, 520));
      setFlash(false);
      if (i < total - 1) await new Promise(resolve => setTimeout(resolve, 450));
    }
    setBusy(false);
  };

  const makeStrip = async () => {
    if (shots.length === 0) return;
    const images = await Promise.all(shots.slice(-4).map(item => new Promise(resolve => {
      const img = new Image(); img.onload = () => resolve(img); img.src = item.data;
    })));
    const width = 900, pad = 42, gap = 24, photoH = 520;
    const height = pad * 2 + images.length * photoH + (images.length - 1) * gap + 120;
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fffdfb'; ctx.fillRect(0,0,width,height);
    images.forEach((img,i) => {
      const ratio = Math.min((width - pad*2) / img.width, photoH / img.height);
      const w = img.width * ratio, h = img.height * ratio;
      const x = (width-w)/2, y = pad + i*(photoH+gap) + (photoH-h)/2;
      ctx.fillStyle = '#eee9e6'; ctx.fillRect(pad-8, pad + i*(photoH+gap)-8, width-pad*2+16, photoH+16);
      ctx.drawImage(img,x,y,w,h);
    });
    ctx.fillStyle = '#77717c'; ctx.font = '22px monospace'; ctx.textAlign = 'center';
    ctx.fillText('Y2K CAMERA  ·  ' + new Date().toLocaleDateString(), width/2, height-48);
    download(canvas.toDataURL('image/png'), 'y2k-camera-strip.png');
  };

  const download = (data, filename) => {
    const a = document.createElement('a'); a.href = data; a.download = filename; a.click();
  };

  const switchCamera = async () => {
    const next = facing === 'user' ? 'environment' : 'user';
    setFacing(next);
    await startCamera(next);
  };

  const clearShots = () => setShots([]);
  const deleteGalleryItem = id => setGallery(old => old.filter(item => item.id !== id));

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Y2K Camera home">
          <span className="brand-mark">✳</span><span>Y2K<span className="brand-light">CAMERA</span></span>
        </a>
        <div className="top-meta"><span className="live-dot"></span> DIGITAL PHOTO STUDIO <span className="meta-divider">/</span> EST. 2004</div>
        <button className="top-pill" onClick={() => setShowGallery(!showGallery)}>MY ROLL <span className="roll-count">{gallery.length}</span></button>
      </header>

      <main>
        <section className="intro">
          <div className="eyebrow"><span>✦</span> YOUR LITTLE CORNER OF THE INTERNET</div>
          <h1>Make a little <em>moment.</em></h1>
          <p>A digital camera for the pictures you’ll keep forever.</p>
        </section>

        <div className="studio-grid">
          <section className="camera-column">
            <div className="section-head"><span><i className="tiny-square"></i> LIVE VIEWFINDER</span><span className="mono-label">CAM_01 <b>●</b></span></div>
            <div className="camera-shell">
              <div className="camera-top">
                <span className="camera-brand">KAYO<span>®</span></span>
                <div className="lens-decoration"><span></span></div>
                <span className="camera-model">DIGITAL STILL CAMERA<br/>5.0 MEGAPIXELS</span>
              </div>
              <div className="viewfinder-wrap">
                <div className="viewfinder">
                  <video ref={videoRef} className={cx('camera-video', facing === 'user' && 'mirrored')} style={liveStyle} playsInline muted />
                  {!cameraReady && <div className="camera-placeholder"><span className="placeholder-icon">▧</span><strong>YOUR CAMERA GOES HERE</strong><small>ALLOW CAMERA ACCESS TO BEGIN</small></div>}
                  <div className="viewfinder-overlay">
                    <span className="rec-label"><i></i> REC</span>
                    <span className="battery">▰ ▰ ▰</span>
                    <span className="viewfinder-time">AUTO · 04:03 PM</span>
                  </div>
                  {timer > 0 && <div className="countdown-number">{timer}</div>}
                  {flash && <div className="flash-overlay"></div>}
                  <div className="focus-corners"><i></i><i></i><i></i><i></i></div>
                </div>
              </div>
              <div className="camera-bottom">
                <div className="camera-status"><span className={cx('status-dot', cameraReady && 'ready')}></span>{cameraReady ? 'CAMERA READY' : 'WAITING FOR CAMERA'}</div>
                <div className="camera-controls">
                  <button className="round-control" title="Switch camera" onClick={switchCamera}>↔</button>
                  <button className="shutter" onClick={takePhoto} disabled={!cameraReady || busy} aria-label="Take photo"><span></span></button>
                  <button className={cx('round-control', sound && 'active')} title="Toggle shutter sound" onClick={() => setSound(!sound)}>♫</button>
                </div>
                <div className="camera-resolution">AUTO<br/>HD</div>
              </div>
            </div>
            {cameraError && <div className="camera-error"><span>!</span>{cameraError}<button onClick={() => startCamera(facing)}>TRY AGAIN ↗</button></div>}
            <div className="shoot-controls">
              <div className="control-block">
                <label>SELF TIMER</label>
                <div className="segmented">{[0,3,5,10].map(n => <button key={n} className={countdown===n?'selected':''} onClick={() => setCountdown(n)}>{n===0?'OFF':n+'s'}</button>)}</div>
              </div>
              <div className="control-block">
                <label>PHOTO MODE</label>
                <div className="segmented"><button className={mode==='single'?'selected':''} onClick={() => setMode('single')}>SINGLE</button><button className={mode==='strip'?'selected':''} onClick={() => setMode('strip')}>4-SHOT STRIP</button></div>
              </div>
            </div>
          </section>

          <aside className="filters-column">
            <div className="section-head"><span><i className="tiny-square pink"></i> THE FILTER DRAWER</span><span className="mono-label">{FILTERS.length} PRESETS</span></div>
            <div className="filter-panel">
              <div className="filter-feature">
                <div className="filter-preview"><div className="preview-swatch" style={{filter:activeFilter.css}}><span>✳</span></div><div className="preview-label">NOW SELECTED</div></div>
                <div className="filter-current"><span className="mini-kicker">CURRENT FILTER</span><h2>{activeFilter.name}</h2><p>{activeFilter.group} COLLECTION</p></div>
              </div>
              <div className="intensity-control"><div><label>FILTER STRENGTH</label><b>{intensity}%</b></div><input type="range" min="0" max="100" value={intensity} onChange={e => setIntensity(Number(e.target.value))}/></div>
              <div className="filter-tabs">{GROUPS.map(g => <button key={g} onClick={() => setGroup(g)} className={group===g?'active':''}>{g}</button>)}</div>
              <div className="filter-grid">
                {visibleFilters.map((filter,index) => <button key={filter.name} className={cx('filter-tile',selected===filter.name && 'chosen')} onClick={() => setSelected(filter.name)}>
                  <span className="filter-thumb" style={{filter:filter.css}}><i>{['✳','✦','♡','⁕','☼'][index%5]}</i></span>
                  <span className="filter-name">{filter.name}</span>
                  <span className="filter-group">{filter.group}</span>
                </button>)}
              </div>
            </div>
          </aside>
        </div>

        <section className="results-section">
          <div className="section-head"><span><i className="tiny-square"></i> YOUR CONTACT SHEET</span><span className="mono-label">{shots.length} / 4 FRAMES</span></div>
          <div className="contact-sheet">
            {shots.length === 0 ? <div className="empty-sheet"><span>▧</span><strong>NOTHING DEVELOPED YET</strong><small>YOUR NEXT FAVOURITE PHOTO MIGHT BE ONE CLICK AWAY.</small></div> : <div className="shot-list">{shots.slice(-4).map((shot,i)=><div className="shot-card" key={shot.id}><img src={shot.data} alt={'Photo '+(i+1)}/><div><span>FRAME 0{i+1}</span><b>{shot.filter}</b><button onClick={() => download(shot.data,'y2k-photo-'+(i+1)+'.jpg')}>SAVE ↗</button></div></div>)}</div>}
            <div className="sheet-actions"><button className="text-button" onClick={clearShots} disabled={!shots.length}>CLEAR FRAMES</button><button className="primary-button" onClick={makeStrip} disabled={!shots.length}>DOWNLOAD STRIP <span>↗</span></button></div>
          </div>
        </section>

        {showGallery && <section className="gallery-section">
          <div className="section-head"><span><i className="tiny-square pink"></i> MY CAMERA ROLL</span><button className="text-button" onClick={() => setShowGallery(false)}>CLOSE ×</button></div>
          {gallery.length===0 ? <p className="gallery-empty">Your roll is empty. Go make a moment.</p> : <div className="gallery-grid">{gallery.map(item=><div className="gallery-item" key={item.id}><img src={item.data} alt="Saved camera roll photo"/><div><span>{item.filter}</span><button onClick={()=>download(item.data,'y2k-'+item.id+'.jpg')}>↓</button><button onClick={()=>deleteGalleryItem(item.id)}>×</button></div></div>)}</div>}
        </section>}
      </main>

      <footer><span>Y2K CAMERA © 2004—2026</span><span>MADE FOR THE MEMORIES, NOT THE ALGORITHM <b>✳</b></span><span>NO UPLOADS. JUST YOU.</span></footer>
      <canvas ref={canvasRef} className="hidden-canvas" />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
