import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './styles-overhaul.css';
import Peer from 'peerjs';

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
const ROOM_STORAGE_KEY = 'y2k-camera-room-v1';
const makeRoomCode = () => { const limit = Math.floor(0x100000000 / 900000) * 900000; const values = new Uint32Array(1); let value; do { crypto.getRandomValues(values); value = values[0]; } while (value >= limit); return String(100000 + (value % 900000)); };
const STYLES = [
  {name:'Claymorphism',id:'clay',description:'Soft sculpted surfaces and playful depth'},
  {name:'Minimalism',id:'minimalism',description:'Quiet typography and purposeful space'},
  {name:'Neo-brutalism',id:'brutal',description:'Bold blocks, hard edges and graphic contrast'},
  {name:'Cybercore',id:'cyber',description:'Neon interfaces and futuristic control panels'},
  {name:'Scrapbook',id:'scrapbook',description:'Layered paper, tape and memory-board details'},
  {name:'Y2K aesthetic',id:'y2k',description:'Glossy chrome, candy colour and digital nostalgia'},
  {name:'Glasswave',id:'glass',description:'Translucent layers and luminous gradients'},
  {name:'Pixelart',id:'pixel',description:'Pixel-grid graphics and 8-bit interface details'}
];
const THEMES = [
  {name:'Vanilla Cloud',id:'clay-vanilla',style:'clay'},{name:'Peach Sorbet',id:'clay-peach',style:'clay'},{name:'Matcha Mochi',id:'clay-matcha',style:'clay'},
  {name:'Paper White',id:'minimal-paper',style:'minimalism'},{name:'Ink & Stone',id:'minimal-ink',style:'minimalism'},{name:'Warm Sand',id:'minimal-sand',style:'minimalism'},
  {name:'Primary Pop',id:'brutal-primary',style:'brutal'},{name:'Cobalt Punch',id:'brutal-cobalt',style:'brutal'},{name:'Lime Punch',id:'brutal-lime',style:'brutal'},
  {name:'Neon Tokyo',id:'cyber-tokyo',style:'cyber'},{name:'Acid Circuit',id:'cyber-acid',style:'cyber'},{name:'Violet Protocol',id:'cyber-violet',style:'cyber'},
  {name:'Sunday Journal',id:'scrap-sunday',style:'scrapbook'},{name:'Love Letters',id:'scrap-love',style:'scrapbook'},{name:'Field Notes',id:'scrap-field',style:'scrapbook'},
  {name:'Silver 2004',id:'y2k-silver',style:'y2k'},{name:'Bubblegum Chrome',id:'y2k-bubble',style:'y2k'},{name:'Cyber Lime',id:'y2k-lime',style:'y2k'},
  {name:'Aurora Glass',id:'glass-aurora',style:'glass'},{name:'Ocean Glass',id:'glass-ocean',style:'glass'},{name:'Rose Quartz',id:'glass-rose',style:'glass'},
  {name:'Arcade Classic',id:'pixel-classic',style:'pixel'},{name:'Berry Bit',id:'pixel-berry',style:'pixel'},{name:'Mint Console',id:'pixel-mint',style:'pixel'},
  {name:'Cherry Cloud',id:'clay-cherry',style:'clay'},
  {name:'Cherry Ink',id:'minimal-cherry',style:'minimalism'},
  {name:'Cherry Pop',id:'brutal-cherry',style:'brutal'},
  {name:'Cherry.exe',id:'cyber-cherry',style:'cyber'},
  {name:'Cherry Journal',id:'scrap-cherry',style:'scrapbook'},
  {name:'Cherry Chrome',id:'y2k-cherry',style:'y2k'},
  {name:'Cherry Glass',id:'glass-cherry',style:'glass'},
  {name:'Cherry Pixel',id:'pixel-cherry',style:'pixel'}
];
const themesForStyle = styleId => THEMES.filter(item => item.style === styleId);
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
  const peerRef = useRef(null);
  const callRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localRoomVideoRef = useRef(null);
  const dataConnectionsRef = useRef([]);
  const pendingConnectionsRef = useRef([]);
  const approvedPeerRef = useRef('');
  const isRoomHostRef = useRef(false);
  const [activeTab, setActiveTab] = useState('camera');
  const [syncedLocalPhotos, setSyncedLocalPhotos] = useState([]);
  const [syncedRemotePhotos, setSyncedRemotePhotos] = useState([]);
  const [syncedCaptureLabel, setSyncedCaptureLabel] = useState('');
  const [syncRunning, setSyncRunning] = useState(false);
  const syncBusyRef = useRef(false);
  const syncSessionsRef = useRef(new Set());
  const syncChunksRef = useRef(new Map());
  const [togetherSelected, setTogetherSelected] = useState('2004 Digicam');
  const [togetherIntensity, setTogetherIntensity] = useState(100);
  const [togetherGroup, setTogetherGroup] = useState('ALL');
  const [roomStatus, setRoomStatus] = useState('idle');
  const [roomCode, setRoomCode] = useState('');
  const [roomExpiresAt, setRoomExpiresAt] = useState(null);
  const [roomSecondsLeft, setRoomSecondsLeft] = useState(0);
  const [autoAcceptInvites, setAutoAcceptInvites] = useState(() => { try { return localStorage.getItem('y2k-auto-accept-invites') === 'true'; } catch { return false; } });
  const autoAcceptInvitesRef = useRef(autoAcceptInvites);
  useEffect(() => { autoAcceptInvitesRef.current = autoAcceptInvites; }, [autoAcceptInvites]);
  const [joinInput, setJoinInput] = useState('');
  const [remoteReady, setRemoteReady] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState({ level: 'checking', label: 'CHECKING', detail: 'Measuring connection' });
  const incomingCallRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [roomError, setRoomError] = useState('');
  const [roomMode, setRoomMode] = useState('call');
  const [incomingCall, setIncomingCall] = useState(null);
  const [remoteFilter, setRemoteFilter] = useState({ name: 'Original', intensity: 100 });
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [style,setStyle]=useState('clay');
  const [theme,setTheme]=useState('clay-vanilla');
  const [devices,setDevices]=useState({audioinput:[],videoinput:[],audiooutput:[]});
  const [micEnabled,setMicEnabled]=useState(true);
  const [videoEnabled,setVideoEnabled]=useState(true);
  const [audioInput,setAudioInput]=useState('');
  const [videoInput,setVideoInput]=useState('');
  const [audioOutput,setAudioOutput]=useState('');
  const [mirrorPreview,setMirrorPreview]=useState(true);
  const [showGrid,setShowGrid]=useState(false);
  const [dateStamp,setDateStamp]=useState(false);
  const [exposure,setExposure]=useState(0);
  const [lowLight,setLowLight]=useState(false);
  const [cameraQuality,setCameraQuality]=useState('720p');
  const [previewRatio,setPreviewRatio]=useState('16/9');
  const [meetingMessage,setMeetingMessage]=useState('');
  const [studioAlbum,setStudioAlbum]=useState('All photos');
  const [customAlbums,setCustomAlbums]=useState(()=>{try{const saved=JSON.parse(localStorage.getItem('y2k-photo-albums')||'null');return Array.isArray(saved)&&saved.length?saved:['Camera','Together','Edited'];}catch{return ['Camera','Together','Edited'];}});
  const [galleryLoaded,setGalleryLoaded]=useState(false);
  const galleryPersistedRef=useRef(new Map());
  const [collageSelection,setCollageSelection]=useState([]);
  const [editorPhoto,setEditorPhoto]=useState(null);
  const [editBrightness,setEditBrightness]=useState(100);
  const [editContrast,setEditContrast]=useState(100);
  const [editSaturation,setEditSaturation]=useState(100);
  const [editWarmth,setEditWarmth]=useState(0);
  const [editRotation,setEditRotation]=useState(0);
  const [editMirror,setEditMirror]=useState(false);
  const [editCrop,setEditCrop]=useState('original');
  const [photoBorder,setPhotoBorder]=useState('none');
  const [togetherLayout,setTogetherLayout]=useState('mirror');
  const [miniCamera,setMiniCamera]=useState(true);
  const [roomReactions,setRoomReactions]=useState([]);
  const miniRemoteVideoRef=useRef(null);
  const [torchAvailable,setTorchAvailable]=useState(false);
  const [torchEnabled,setTorchEnabled]=useState(false);


  useEffect(() => {
    if (!window.indexedDB) { setGalleryLoaded(true); return; }
    let cancelled = false;
    const openDb = () => new Promise((resolve, reject) => {
      const request = indexedDB.open('y2k-camera-library', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('photos', { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    openDb().then(db => new Promise((resolve, reject) => {
      const request = db.transaction('photos', 'readonly').objectStore('photos').getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    })).then(items => { if (!cancelled) { galleryPersistedRef.current=new Map(items.map(item=>[item.id,item])); setGallery(current => { const merged = new Map(items.map(item=>[item.id,item])); current.forEach(item=>merged.set(item.id,item)); return [...merged.values()].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)); }); setGalleryLoaded(true); } })
      .catch(() => { if (!cancelled) setGalleryLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { try { localStorage.setItem('y2k-photo-albums',JSON.stringify(customAlbums)); } catch {} }, [customAlbums]);

  useEffect(() => {
    if (!galleryLoaded || !('indexedDB' in window)) return;
    const openDb = () => new Promise((resolve, reject) => {
      const request = indexedDB.open('y2k-camera-library', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('photos', { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    openDb().then(db => {
      const previous=galleryPersistedRef.current;
      const current=new Map(gallery.map(photo=>[photo.id,photo]));
      const tx = db.transaction('photos', 'readwrite');
      const store = tx.objectStore('photos');
      previous.forEach((photo,id)=>{if(!current.has(id))store.delete(id);});
      current.forEach((photo,id)=>{if(previous.get(id)!==photo)store.put(photo);});
      tx.oncomplete=()=>{galleryPersistedRef.current=current;};
    }).catch(() => {});
  }, [gallery, galleryLoaded]);

  useEffect(() => {
    if (activeTab !== 'studio' || !miniCamera || !remoteStream || !miniRemoteVideoRef.current) return;
    miniRemoteVideoRef.current.srcObject = remoteStream;
    miniRemoteVideoRef.current.play().catch(() => {});
  }, [activeTab, miniCamera, remoteStream]);

  const activeFilter = useMemo(() => FILTERS.find(f => f.name === selected) || FILTERS[0], [selected]);
  const visibleFilters = useMemo(() => group === 'ALL' ? FILTERS : FILTERS.filter(f => f.group === group), [group]);
  const remoteActiveFilter = useMemo(() => FILTERS.find(f => f.name === remoteFilter.name) || FILTERS[0], [remoteFilter.name]);
  const togetherActiveFilter = useMemo(() => FILTERS.find(f => f.name === togetherSelected) || FILTERS[0], [togetherSelected]);
  const togetherVisibleFilters = useMemo(() => togetherGroup === 'ALL' ? FILTERS : FILTERS.filter(f => f.group === togetherGroup), [togetherGroup]);
  const liveStyle = { filter: filterAtIntensity(activeFilter.css, intensity), opacity: 1 };

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async (direction = facing, quality = cameraQuality) => {
    setCameraError('');
    stopCamera();
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access needs HTTPS or localhost, and a browser that supports getUserMedia.');
      return;
    }
    try {
      const [qualityWidth, qualityHeight] = quality === '1080p' ? [1920,1080] : quality === '480p' ? [854,480] : [1280,720];
      const stream = await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:direction},width:{ideal:qualityWidth},height:{ideal:qualityHeight}}});
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
  }, [facing, stopCamera, cameraQuality]);

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const refresh=()=>navigator.mediaDevices.enumerateDevices().then(list=>setDevices({audioinput:list.filter(d=>d.kind==='audioinput'),videoinput:list.filter(d=>d.kind==='videoinput'),audiooutput:list.filter(d=>d.kind==='audiooutput')})).catch(()=>{});
    refresh(); navigator.mediaDevices.addEventListener?.('devicechange',refresh);
    return ()=>navigator.mediaDevices.removeEventListener?.('devicechange',refresh);
  }, []);

  useEffect(() => {
    startCamera('user');
    return () => {
      peerRef.current?.destroy();
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!cameraReady && roomStatus === 'idle') return;
    navigator.mediaDevices?.enumerateDevices?.().then(list=>setDevices({
      audioinput:list.filter(d=>d.kind==='audioinput'),
      videoinput:list.filter(d=>d.kind==='videoinput'),
      audiooutput:list.filter(d=>d.kind==='audiooutput')
    })).catch(()=>{});
  }, [cameraReady, roomStatus]);

  useEffect(() => {
    const stream = streamRef.current;
    if (!cameraReady || !stream) return;
    const activeVideo = activeTab === 'together' ? localRoomVideoRef.current : videoRef.current;
    const inactiveVideo = activeTab === 'together' ? videoRef.current : localRoomVideoRef.current;
    if (inactiveVideo && inactiveVideo.srcObject === stream) inactiveVideo.srcObject = null;
    if (activeVideo) {
      if (activeVideo.srcObject !== stream) activeVideo.srcObject = stream;
      activeVideo.play().catch(() => {});
    }
  }, [cameraReady, activeTab, roomStatus]);

  useEffect(() => {
    const track = streamRef.current?.getVideoTracks()[0];
    const capabilities = track?.getCapabilities?.();
    setTorchAvailable(Boolean(capabilities?.torch));
    if (!capabilities?.torch) setTorchEnabled(false);
  }, [cameraReady, videoInput]);

  useEffect(() => {
    if (roomStatus !== 'connected' || !remoteReady) {
      setConnectionQuality({ level: 'checking', label: 'CHECKING', detail: 'Waiting for media connection' });
      return;
    }
    let cancelled = false;
    const measure = async () => {
      const pc = callRef.current?.peerConnection;
      if (!pc || pc.connectionState === 'closed') return;
      try {
        const stats = await pc.getStats();
        let rtt = null;
        let received = 0;
        let lost = 0;
        stats.forEach(report => {
          if (report.type === 'candidate-pair' && report.state === 'succeeded' && (report.nominated || report.selected)) {
            if (Number.isFinite(report.currentRoundTripTime)) rtt = report.currentRoundTripTime * 1000;
          }
          if (report.type === 'inbound-rtp' && !report.isRemote) {
            received += Number(report.packetsReceived || 0);
            lost += Number(report.packetsLost || 0);
          }
        });
        const loss = received + lost > 0 ? lost / (received + lost) : null;
        if (cancelled) return;
        const weak = (rtt !== null && rtt > 320) || (loss !== null && loss > .08);
        const fair = (rtt !== null && rtt > 180) || (loss !== null && loss > .025);
        const level = weak ? 'poor' : fair ? 'fair' : 'good';
        const detail = [rtt !== null ? Math.round(rtt) + ' ms RTT' : null, loss !== null ? (loss * 100).toFixed(1) + '% packet loss' : null].filter(Boolean).join(' · ') || 'Live media connected';
        setConnectionQuality({ level, label: level === 'good' ? 'GOOD' : level === 'fair' ? 'FAIR' : 'WEAK', detail });
      } catch {
        if (!cancelled) setConnectionQuality({ level: 'checking', label: 'CHECKING', detail: 'Connection stats unavailable' });
      }
    };
    measure();
    const timer = setInterval(measure, 2500);
    return () => { cancelled = true; clearInterval(timer); };
  }, [roomStatus, remoteReady]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => {});
    }
  }, [remoteStream, remoteReady]);

  const toggleMic=async()=>{
    try{
      const next=!micEnabled; let stream=streamRef.current;
      if(next&&!stream?.getAudioTracks().length){
        const fresh=await navigator.mediaDevices.getUserMedia({audio:audioInput?{deviceId:{exact:audioInput}}:true,video:false});
        const track=fresh.getAudioTracks()[0]; stream?.addTrack(track);
        if(callRef.current?.peerConnection&&stream)callRef.current.peerConnection.addTrack(track,stream);
      }
      streamRef.current?.getAudioTracks().forEach(t=>t.enabled=next);setMicEnabled(next);
    }catch{setRoomError('Microphone permission is unavailable.');}
  };
  const toggleVideo=()=>{const next=!videoEnabled;streamRef.current?.getVideoTracks().forEach(t=>t.enabled=next);setVideoEnabled(next);};
  const changeInput=async(kind,id)=>{
    if(!id)return;
    try{
      const old=streamRef.current;
      const constraints=kind==='video'?{video:{deviceId:{exact:id},width:{ideal:1280},height:{ideal:720}},audio:!!old?.getAudioTracks().length}:{audio:{deviceId:{exact:id}},video:!!old?.getVideoTracks().length};
      const fresh=await navigator.mediaDevices.getUserMedia(constraints);
      const track=kind==='video'?fresh.getVideoTracks()[0]:fresh.getAudioTracks()[0];
      fresh.getTracks().filter(t=>t!==track).forEach(t=>t.stop());
      track.enabled=kind==='video'?videoEnabled:true;
      const previous=kind==='video'?old?.getVideoTracks()[0]:old?.getAudioTracks()[0];
      if(previous){old.removeTrack(previous);previous.stop();} if(old)old.addTrack(track);else streamRef.current=fresh;
      if(kind==='video'){setVideoInput(id);[videoRef.current,localRoomVideoRef.current].forEach(v=>{if(v){v.srcObject=streamRef.current;v.play().catch(()=>{});}});}else{setAudioInput(id);setMicEnabled(true);}
      const sender=callRef.current?.peerConnection?.getSenders?.().find(s=>s.track?.kind===kind);if(sender)await sender.replaceTrack(track);
    }catch{setRoomError('Could not switch to that device.');}
  };
  const changeOutput=async id=>{setAudioOutput(id);if(remoteVideoRef.current?.setSinkId){try{await remoteVideoRef.current.setSinkId(id);}catch{setRoomError('Could not switch audio output.');}}else setRoomError('Audio output selection is unsupported in this browser.');};

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

  const renderVideoFrame = (video, filterName, filterStrength, mirror = false) => {
    if (!video || !video.videoWidth || !video.videoHeight) return null;
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 640 / video.videoWidth);
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    const captureFilter = FILTERS.find(f => f.name === filterName) || FILTERS[0];
    ctx.save();
    if (mirror) { ctx.translate(width, 0); ctx.scale(-1, 1); }
    ctx.filter = filterAtIntensity(captureFilter.css, filterStrength) + ' brightness(' + (1 + exposure/100) + ')';
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();
    if (captureFilter.tint && captureFilter.alpha) {
      ctx.save();
      ctx.globalCompositeOperation = captureFilter.blend || 'soft-light';
      ctx.globalAlpha = captureFilter.alpha * (filterStrength / 100);
      ctx.fillStyle = captureFilter.tint;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
    return canvas.toDataURL('image/jpeg', .64);
  };
  const renderFrame = (filterName = selected, filterStrength = intensity) =>
    renderVideoFrame(videoRef.current, filterName, filterStrength, facing === 'user');

  const takeOne = async (filterName = selected, filterStrength = intensity) => {
    const data = renderFrame(filterName, filterStrength);
    if (!data) return null;
    const item = { id: crypto.randomUUID(), data: await decoratePhoto(data), filter: filterName, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), createdAt: Date.now(), album: 'Camera', favorite: false };
    setShots(old => [...old, item]);
    setGallery(old => [item, ...old]);
    return item;
  };

  const takePhoto = async (filterName = selected, filterStrength = intensity) => {
    if (!cameraReady || busy) return;
    setBusy(true);
    const total = mode === 'strip' || mode === 'booth' ? 4 : 1;
    try {
      for (let i = 0; i < total; i++) {
        for (let n = countdown; n > 0; n--) {
          setTimer(n);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setTimer(0);
        setFlash(true); playShutter();
        await new Promise(resolve => setTimeout(resolve, 130));
        await takeOne(filterName, filterStrength);
        await new Promise(resolve => setTimeout(resolve, 520));
        setFlash(false);
        if (i < total - 1) await new Promise(resolve => setTimeout(resolve, 450));
      }
    } catch {
      setCameraError('The photo could not be captured. Check camera permission and try again.');
    } finally {
      setTimer(0); setFlash(false); setBusy(false);
    }
  };
  const attachRemoteCall = call => {
    callRef.current = call;
    call.on('stream', stream => {
      setRemoteStream(stream);
      setRemoteReady(true);
      setRoomStatus('connected');
    });
    call.on('close', () => { setRemoteReady(false); setRemoteStream(null); setDataReady(false); setRoomStatus('waiting'); });
    call.on('error', error => setRoomError(error.message || 'The video connection had a problem.'));
  };

  const prepareRoomCamera = async () => {
    let stream = streamRef.current;
    const liveVideoTrack = stream?.getVideoTracks().find(track => track.readyState === 'live');
    if (!liveVideoTrack) {
      await startCamera(facing, cameraQuality);
      stream = streamRef.current;
    }
    if (!stream) throw new Error('The camera could not be started. Please allow camera access and try again.');
    const liveAudioTrack = stream.getAudioTracks().find(track => track.readyState === 'live');
    if (!liveAudioTrack) {
      const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false
      });
      const audioTrack = audioOnlyStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = micEnabled;
        stream.addTrack(audioTrack);
      }
    }
    stream.getAudioTracks().forEach(track => { track.enabled = micEnabled; });
    stream.getVideoTracks().forEach(track => { track.enabled = videoEnabled; });
    streamRef.current = stream;
    setCameraReady(true);
    return stream;
  };

  const setupDataConnection = connection => {
    if (isRoomHostRef.current && approvedPeerRef.current !== connection.peer) { pendingConnectionsRef.current.push(connection); return; }
    dataConnectionsRef.current.push(connection);
    const sendCurrentFilter = () => connection.send({ type: 'Y2K_FILTER', name: togetherSelected, intensity: togetherIntensity });
    if (connection.open) { setDataReady(true); sendCurrentFilter(); }
    connection.on('open', () => { setDataReady(true); sendCurrentFilter(); });
    connection.on('data', message => {
      if (message && typeof message === 'object' && message.type === 'Y2K_HOST_HANDOFF') {
        const expiry = Number(message.expiresAt);
        if (Number.isFinite(expiry) && expiry > Date.now()) {
          callRef.current?.close(); callRef.current = null;
          peerRef.current?.destroy(); peerRef.current = null;
          dataConnectionsRef.current = []; pendingConnectionsRef.current = [];
          approvedPeerRef.current = ''; incomingCallRef.current = null;
          isRoomHostRef.current = true;
          setIncomingCall(null); setRemoteReady(false); setRemoteStream(null); setDataReady(false);
          setRoomStatus('starting');
          createRoom({ expiresAt: expiry });
        }
        return;
      }
      if (message && typeof message === 'object' && message.type === 'Y2K_SYNC_SHUTTER') {
        if (typeof message.sessionId === 'string' && message.sessionId.length <= 64 && [1, 4].includes(Number(message.count))) { const delay = [0, 3, 5, 10].includes(Number(message.countdown)) ? Number(message.countdown) : 3; runSyncedCapture(message.sessionId, message.count, delay); }
        return;
      }
      if (message && typeof message === 'object' && message.type === 'Y2K_SYNC_PHOTO_CHUNK') {
        if (typeof message.sessionId !== 'string' || message.sessionId.length > 64 || !Number.isInteger(message.index) || message.index < 0 || message.index > 3 || !Number.isInteger(message.total) || message.total < 1 || message.total > 64 || !Number.isInteger(message.part) || message.part < 0 || message.part >= message.total || typeof message.data !== 'string' || message.data.length > 16000) return;
        const key = message.sessionId + ':' + message.index;
        let packet = syncChunksRef.current.get(key);
        if (!packet) {
          if (syncChunksRef.current.size >= 8) return;
          packet = { parts: new Array(message.total), received: 0, filter: FILTERS.some(filter => filter.name === message.filter) ? message.filter : 'Original' };
          syncChunksRef.current.set(key, packet);
          window.setTimeout(() => { if (syncChunksRef.current.get(key) === packet) syncChunksRef.current.delete(key); }, 20000);
        }
        if (packet.parts.length !== message.total) return;
        if (packet.parts[message.part] == null) {
          packet.parts[message.part] = message.data;
          packet.received++;
        }
        if (packet.received === message.total) {
          const data = packet.parts.join('');
          syncChunksRef.current.delete(key);
          setSyncedRemotePhotos(old => {
            const updated = [...old];
            updated[message.index] = { data, filter: packet.filter };
            return updated;
          });
          setGallery(galleryOld=>[{id:crypto.randomUUID(),data,filter:packet.filter,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),createdAt:Date.now(),album:'Together',favorite:false,source:'THEIR CAMERA'},...galleryOld]);
        }
        return;
      }
      if (message && typeof message === 'object' && message.type === 'Y2K_REACTION') {
        if (['❤️','😂','✨','⭐','📸','🫶'].includes(message.emoji)) setRoomReactions(old=>[...old,{emoji:message.emoji,from:'THEM',id:crypto.randomUUID()}].slice(-8));
        return;
      }
      if (message && typeof message === 'object' && message.type === 'Y2K_FILTER') {
        const valid = FILTERS.some(filter => filter.name === message.name);
        const strength = Number(message.intensity);
        if (valid && Number.isFinite(strength)) setRemoteFilter({ name: message.name, intensity: Math.max(0, Math.min(100, strength)) });
      }
    });
    connection.on('close', () => {
      dataConnectionsRef.current = dataConnectionsRef.current.filter(item => item !== connection);
      if (!dataConnectionsRef.current.some(item => item.open)) setDataReady(false);
    });
  };

  useEffect(() => {
    dataConnectionsRef.current.forEach(connection => {
      if (connection.open) connection.send({ type: 'Y2K_FILTER', name: togetherSelected, intensity: togetherIntensity });
    });
  }, [togetherSelected, togetherIntensity]);

  const createRoom = async (resumeRecord = null) => {
    if (!navigator.mediaDevices?.getUserMedia) { setRoomError('Together Mode needs HTTPS and camera/microphone permissions.'); return; }
    try {
      setRoomError('');
      isRoomHostRef.current = true;
      approvedPeerRef.current = '';
      setRoomStatus('starting');
      await prepareRoomCamera();
      const code = resumeRecord?.code || makeRoomCode();
      const expiresAt = resumeRecord?.expiresAt || (Date.now() + 10 * 60 * 1000);
      setRoomExpiresAt(expiresAt);
      setRoomSecondsLeft(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
      try { localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify({ code, expiresAt })); } catch {}
      const peer = new Peer(code);
      peerRef.current = peer;
      peer.on('open', id => { setRoomCode(id); setRoomStatus('waiting'); });
      peer.on('call', call => {
        if (approvedPeerRef.current && approvedPeerRef.current !== call.peer) { call.close(); return; }
        if (callRef.current || incomingCallRef.current) { call.close(); return; }
        if (autoAcceptInvitesRef.current) {
          const stream = streamRef.current;
          if (!stream) { call.close(); return; }
          incomingCallRef.current = call;
          approvedPeerRef.current = call.peer;
          call.answer(stream);
          attachRemoteCall(call);
          pendingConnectionsRef.current.filter(connection => connection.peer === call.peer).forEach(setupDataConnection);
          pendingConnectionsRef.current = pendingConnectionsRef.current.filter(connection => connection.peer !== call.peer);
        } else { incomingCallRef.current = call; setIncomingCall(call); }
      });
      peer.on('connection', connection => {
        if (approvedPeerRef.current === connection.peer) setupDataConnection(connection);
        else if (pendingConnectionsRef.current.length < 4) pendingConnectionsRef.current.push(connection);
        else connection.close();
      });
      peer.on('error', error => {
        if (error.type === 'unavailable-id' && resumeRecord) {
          try { localStorage.removeItem(ROOM_STORAGE_KEY); } catch {}
          setRoomError('Your saved room code could not be reclaimed after refresh. Generate a new code.');
        } else setRoomError(error.type === 'unavailable-id' ? 'That code is already in use. Generate a new one.' : (error.message || 'Room connection error.'));
        setRoomStatus('error');
      });
    } catch (error) {
      setRoomError(error.name === 'NotAllowedError' ? 'Allow camera and microphone access to start a room.' : (error.message || 'Could not start your camera.'));
      setRoomStatus('error');
    }
  };

  useEffect(() => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(ROOM_STORAGE_KEY) || 'null'); } catch {}
    if (saved && /^[0-9]{6}$/.test(saved.code || '') && Number.isFinite(saved.expiresAt) && saved.expiresAt > Date.now()) createRoom(saved);
    else if (saved) { try { localStorage.removeItem(ROOM_STORAGE_KEY); } catch {} }
  }, []);

  useEffect(() => {
    if (!roomExpiresAt || !isRoomHostRef.current) return;
    const update = () => {
      const remaining = Math.max(0, Math.ceil((roomExpiresAt - Date.now()) / 1000));
      setRoomSecondsLeft(remaining);
      if (remaining <= 0) {
        peerRef.current?.destroy(); peerRef.current = null;
        callRef.current?.close(); callRef.current = null;
        try { localStorage.removeItem(ROOM_STORAGE_KEY); } catch {}
        setRoomCode(''); setRoomExpiresAt(null); setRoomStatus('idle');
        setRoomError('This room code expired after 10 minutes. Generate a new one.');
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [roomExpiresAt]);

  const joinRoom = async () => {
    const targetId = joinInput.replace(/\D/g, '').slice(0, 6);
    if (!/^[0-9]{6}$/.test(targetId)) { setRoomError('Enter the 6-digit room code.'); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setRoomError('Together Mode needs HTTPS and camera/microphone permissions.'); return; }
    try {
      setRoomError('');
      try { localStorage.removeItem(ROOM_STORAGE_KEY); } catch {}
      isRoomHostRef.current = false;
      approvedPeerRef.current = '';
      setRoomStatus('joining');
      const stream = await prepareRoomCamera();
      const peer = new Peer(makeRoomCode());
      peerRef.current = peer;
      peer.on('open', () => {
        const call = peer.call(targetId, stream);
        if (!call) { setRoomError('Could not reach that room. Ask for a new room code.'); setRoomStatus('error'); return; }
        attachRemoteCall(call);
        const connection = peer.connect(targetId, { reliable: true });
        connection.on('open', () => setupDataConnection(connection));
      });
      peer.on('error', error => {
        setRoomError(error.type === 'peer-unavailable' ? 'That room is offline. Ask the host to create a new invite.' : (error.message || 'Could not join the room.'));
        setRoomStatus('error');
      });
    } catch (error) {
      setRoomError(error.name === 'NotAllowedError' ? 'Allow camera and microphone access to join the room.' : (error.message || 'Could not join the room.'));
      setRoomStatus('error');
    }
  };

  const acceptIncomingCall = () => {
    const call = incomingCall || incomingCallRef.current;
    if (!call || !streamRef.current || (approvedPeerRef.current && approvedPeerRef.current !== call.peer)) return;
    const approvedPeer = call.peer;
    incomingCallRef.current = null;
    approvedPeerRef.current = approvedPeer;
    call.answer(streamRef.current);
    attachRemoteCall(call);
    pendingConnectionsRef.current.filter(connection => connection.peer === approvedPeer).forEach(setupDataConnection);
    pendingConnectionsRef.current = pendingConnectionsRef.current.filter(connection => connection.peer !== approvedPeer);
    setIncomingCall(null);
  };

  const rejectIncomingCall = () => {
    const rejectedPeer = incomingCall?.peer;
    incomingCallRef.current = null;
    incomingCall?.close();
    pendingConnectionsRef.current.filter(connection => connection.peer === rejectedPeer).forEach(connection => connection.close());
    pendingConnectionsRef.current = pendingConnectionsRef.current.filter(connection => connection.peer !== rejectedPeer);
    setIncomingCall(null);
  };

  const runSyncedCapture = async (sessionId, requestedCount = 1, requestedCountdown = countdown) => {
    if (!sessionId || syncSessionsRef.current.has(sessionId)) return;
    syncSessionsRef.current.add(sessionId);
    setSyncRunning(true);
    const total = Math.max(1, Math.min(4, Number(requestedCount) || 1));
    setSyncedLocalPhotos([]);
    setSyncedRemotePhotos([]);
    setSyncedCaptureLabel(total === 4 ? 'FOUR-POSE CONNECTED PHOTO STRIP' : 'SYNCHRONIZED PHOTO PAIR');
    try {
      for (let index = 0; index < total; index++) {
        if (index > 0) await new Promise(resolve => setTimeout(resolve, 650));
        setTimer(requestedCountdown);
        for (let n = requestedCountdown; n > 0; n--) {
          setTimer(n);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setTimer(0);
        const localVideo = localRoomVideoRef.current || videoRef.current;
        const rawData = renderVideoFrame(localVideo, togetherSelected, togetherIntensity, facing === 'user');
        if (!rawData) {
          setRoomError('Camera frame was not ready. Keep both camera previews open and try again.');
          syncSessionsRef.current.delete(sessionId);
          return;
        }
        const data = await decoratePhoto(rawData);
        setFlash(true);
        playShutter();
        const localPhoto = { data, filter: togetherSelected };
        setGallery(galleryOld=>[{id:crypto.randomUUID(),data,filter:togetherSelected,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),createdAt:Date.now(),album:'Together',favorite:false,source:'YOUR CAMERA'},...galleryOld]);
        setSyncedLocalPhotos(old => {
          const updated = [...old];
          updated[index] = localPhoto;
          return updated;
        });
        const chunkSize = 12000;
        const totalChunks = Math.ceil(data.length / chunkSize);
        dataConnectionsRef.current.forEach(connection => {
          if (!connection.open) return;
          for (let part = 0; part < totalChunks; part++) {
            connection.send({
              type: 'Y2K_SYNC_PHOTO_CHUNK', sessionId, index, part, total: totalChunks,
              filter: togetherSelected, data: data.slice(part * chunkSize, (part + 1) * chunkSize)
            });
          }
        });
        setFlash(false);
      }
    } catch {
      setRoomError('The synchronized capture was interrupted. Check the connection and try again.');
      syncSessionsRef.current.delete(sessionId);
    } finally {
      setTimer(0);
      setFlash(false);
      setSyncRunning(false);
    }
    setTimeout(() => syncSessionsRef.current.delete(sessionId), 30000);
  };

  const syncShutter = () => {
    if (syncBusyRef.current || syncRunning || !remoteReady || !dataReady) return;
    syncBusyRef.current = true;
    setSyncRunning(true);
    const sessionId = crypto.randomUUID();
    const count = mode === 'strip' || mode === 'booth' ? 4 : 1;
    setSyncedLocalPhotos([]);
    setSyncedRemotePhotos([]);
    dataConnectionsRef.current.forEach(connection => {
      if (connection.open) connection.send({ type: 'Y2K_SYNC_SHUTTER', sessionId, count, countdown });
    });
    runSyncedCapture(sessionId, count).finally(() => { syncBusyRef.current = false; setSyncRunning(false); });
  };

  const handleMainShutter = () => {
    if (roomStatus === 'connected' && roomMode === 'camera') {
      if (remoteReady && dataReady) syncShutter();
      return;
    }
    takePhoto();
  };

  const handoffAndLeave = () => {
    if (roomStatus !== 'connected') { leaveRoom(); return; }
    const expiry = roomExpiresAt || (Date.now() + 10 * 60 * 1000);
    dataConnectionsRef.current.forEach(connection => {
      if (connection.open) connection.send({ type: 'Y2K_HOST_HANDOFF', expiresAt: expiry });
    });
    setMeetingMessage('Passing the room to the other person…');
    window.setTimeout(() => leaveRoom(true), 500);
  };

  const leaveRoom = (skipConfirm = false) => {
    if (!skipConfirm && roomStatus !== 'idle' && !window.confirm('Leave this camera room? Your current photos will stay in your camera roll.')) return;
    callRef.current?.close();
    peerRef.current?.destroy();
    peerRef.current = null;
    callRef.current = null;
    dataConnectionsRef.current = [];
    pendingConnectionsRef.current.forEach(connection => connection.close());
    pendingConnectionsRef.current = [];
    approvedPeerRef.current = '';
    incomingCallRef.current = null;
    isRoomHostRef.current = false;
    setConnectionQuality({ level: 'checking', label: 'CHECKING', detail: 'Waiting for media connection' });
    setRemoteReady(false);
    setRemoteStream(null);
    setRemoteFilter({ name: 'Original', intensity: 100 });
    setDataReady(false);
    setRoomStatus('idle');
    setRoomCode('');
    setRoomExpiresAt(null);
    setRoomSecondsLeft(0);
    try { localStorage.removeItem(ROOM_STORAGE_KEY); } catch {}
    setRoomError('');
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localRoomVideoRef.current) localRoomVideoRef.current.srcObject = null;
    stopCamera();
    startCamera(facing);
  };

  const copyRoomCode = async () => {
    try { await navigator.clipboard.writeText(roomCode); setMeetingMessage('Room code copied.'); }
    catch { setRoomError('Could not copy automatically. Select and copy the room code.'); }
  };
  const copyInvite = async () => { try { await navigator.clipboard.writeText('Join my private camera room: '+roomCode+'\nOpen '+window.location.origin+' and enter this 6-digit code.'); setMeetingMessage('Invite message copied.'); } catch { setRoomError('Could not copy the invite.'); } };
  const toggleFullscreen = async () => { try { if(document.fullscreenElement) await document.exitFullscreen(); else await document.querySelector('.viewfinder')?.requestFullscreen(); } catch { setRoomError('Fullscreen is unavailable in this browser.'); } };
  const togglePiP = async () => { try { const video=videoRef.current; if(document.pictureInPictureElement) await document.exitPictureInPicture(); else if(video?.requestPictureInPicture) await video.requestPictureInPicture(); else setRoomError('Picture-in-picture is not supported here.'); } catch { setRoomError('Could not open picture-in-picture.'); } };
  const testSpeaker = () => { try { const Ctx=window.AudioContext||window.webkitAudioContext; const ctx=new Ctx(); const osc=ctx.createOscillator(); const gain=ctx.createGain(); osc.frequency.value=660; gain.gain.value=.08; osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+.35); osc.onended=()=>ctx.close(); } catch { setRoomError('Speaker test is unavailable.'); } };
  const undoLastShot = () => { const last=shots[shots.length-1]; if(!last)return; setShots(old=>old.slice(0,-1)); setGallery(old=>old.filter(item=>item.id!==last.id)); };
  const downloadAllPhotos = () => { gallery.forEach((item,index)=>window.setTimeout(()=>saveImage(item.data,'y2k-photo-'+(index+1)+'.jpg'),index*400)); };
  const clearGallery = () => { if(window.confirm('Delete every photo in your camera roll? This cannot be undone.')) setGallery([]); };
  useEffect(() => { const onKey=e=>{ if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)||e.ctrlKey||e.metaKey||e.altKey)return; if(e.key.toLowerCase()==='m'){e.preventDefault();toggleMic();} else if(e.key.toLowerCase()==='v'){e.preventDefault();toggleVideo();} else if(e.key.toLowerCase()==='f'){e.preventDefault();toggleFullscreen();} else if(e.key===' '&&!e.repeat){e.preventDefault();handleMainShutter();} }; window.addEventListener('keydown',onKey); return()=>window.removeEventListener('keydown',onKey); });


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
    await saveImage(canvas.toDataURL('image/png'), 'y2k-camera-strip.png');
  };

  const saveImage = async (data, filename) => {
    try {
      const response = await fetch(data);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

      // On phones, use the native share sheet so the user can choose Save Image,
      // Photos, Files, or another destination.
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: filename });
        return;
      }

      // Desktop and browsers without file sharing: trigger a real Blob download.
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      // Last-resort fallback: open the image itself so it can be saved manually.
      const tab = window.open();
      if (tab) tab.document.write('<img alt="Your Y2K Camera photo" style="max-width:100%;height:auto" src="' + data + '"/>');
      else window.alert('Your browser blocked the save action. Allow pop-ups for this site, then try again.');
    }
  };


  const saveTogetherPhotos = async () => {
    const local = syncedLocalPhotos.filter(photo => photo?.data);
    const remote = syncedRemotePhotos.filter(photo => photo?.data);
    if (!local.length || !remote.length) return;
    const files = [...local.map((photo, i) => ({ data: photo.data, name: 'you-' + (i + 1) + '.jpg' })),
      ...remote.map((photo, i) => ({ data: photo.data, name: 'your-person-' + (i + 1) + '.jpg' }))];
    try {
      const entries = await Promise.all(files.map(async item => ({
        name: new TextEncoder().encode(item.name),
        bytes: new Uint8Array(await (await fetch(item.data)).arrayBuffer())
      })));
      const crc32 = bytes => {
        let crc = 0xffffffff;
        for (const byte of bytes) {
          crc ^= byte;
          for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
        }
        return (crc ^ 0xffffffff) >>> 0;
      };
      const localParts = [], centralParts = [];
      let offset = 0;
      entries.forEach(entry => {
        const crc = crc32(entry.bytes), size = entry.bytes.length;
        const local = new Uint8Array(30 + entry.name.length);
        const lv = new DataView(local.buffer);
        lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true);
        lv.setUint32(14, crc, true); lv.setUint32(18, size, true); lv.setUint32(22, size, true);
        lv.setUint16(26, entry.name.length, true); local.set(entry.name, 30);
        localParts.push(local, entry.bytes);
        const central = new Uint8Array(46 + entry.name.length);
        const cv = new DataView(central.buffer);
        cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
        cv.setUint32(16, crc, true); cv.setUint32(20, size, true); cv.setUint32(24, size, true);
        cv.setUint16(28, entry.name.length, true); cv.setUint32(42, offset, true);
        central.set(entry.name, 46); centralParts.push(central);
        offset += local.length + size;
      });
      const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
      const end = new Uint8Array(22), ev = new DataView(end.buffer);
      ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, entries.length, true);
      ev.setUint16(10, entries.length, true); ev.setUint32(12, centralSize, true);
      ev.setUint32(16, offset, true);
      const blob = new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
      const file = new File([blob], 'y2k-together-photos.zip', { type: 'application/zip' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Our Y2K Camera photos' });
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = file.name;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      window.alert('Could not package the photos. Please try again once both cameras have finished sending.');
    }
  };

  const combineTogetherPhotos = async () => {
    const local = syncedLocalPhotos.filter(photo => photo?.data);
    const remote = syncedRemotePhotos.filter(photo => photo?.data);
    const pairs = Math.min(local.length, remote.length);
    if (!pairs) {
      window.alert('Wait until both cameras have sent at least one photo before combining.');
      return;
    }
    const load = data => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not load a photo'));
      img.src = data;
    });
    try {
      const images = await Promise.all(Array.from({ length: pairs }, (_, i) =>
        Promise.all([load(local[i].data), load(remote[i].data)])
      ));
      // Each capture remains a pair: YOU + YOUR PERSON. In heart mode only
      // the right-hand portrait is flipped, so the two people face inward.
      const pairCount = images.length;
      const stacked = togetherLayout === 'stack';
      const cellW = stacked ? 720 : 560;
      const cellH = stacked ? 430 : 440;
      const gap = 24, pad = 36, header = 88, footer = 72;
      const rowCount = stacked ? pairCount * 2 : pairCount;
      const canvas = document.createElement('canvas');
      canvas.width = pad * 2 + (stacked ? cellW : cellW * 2 + gap);
      canvas.height = pad * 2 + header + rowCount * cellH + (rowCount - 1) * gap + footer;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is unavailable');
      ctx.fillStyle = '#f7edf0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#542d3a';
      ctx.font = 'bold 26px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Y2K CAMERA  /  TOGETHER', pad, pad + 32);
      ctx.font = '15px monospace';
      ctx.fillStyle = '#9a6174';
      ctx.fillText(togetherLayout === 'mirror' ? 'MIRRORED HEART PAIR' : togetherLayout === 'stack' ? 'STACKED PAIRS' : 'SIDE-BY-SIDE PAIRS', pad, pad + 58);

      const drawPortrait = (img, x, y, w, h, flip = false, label = '') => {
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, y, w, h);
        ctx.beginPath();
        ctx.rect(x + 10, y + 10, w - 20, h - 20);
        ctx.clip();
        const scale = Math.min((w - 28) / img.width, (h - 48) / img.height);
        const dw = img.width * scale, dh = img.height * scale;
        const dx = x + (w - dw) / 2, dy = y + (h - dh) / 2;
        if (flip) {
          ctx.translate(x + w / 2, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(img, (x + (w - dw) / 2) - (x + w / 2), dy, dw, dh);
        } else {
          ctx.drawImage(img, dx, dy, dw, dh);
        }
        ctx.restore();
        ctx.fillStyle = '#7f5261';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(label, x + 14, y + h - 13);
      };

      images.forEach(([you, them], index) => {
        if (togetherLayout === 'stack') {
          const x = pad;
          const firstY = pad + header + index * 2 * (cellH + gap);
          drawPortrait(you, x, firstY, cellW, cellH, false, 'YOU');
          drawPortrait(them, x, firstY + cellH + gap, cellW, cellH, false, 'YOUR PERSON');
        } else {
          const y = pad + header + index * (cellH + gap);
          const leftX = pad;
          const rightX = pad + cellW + gap;
          drawPortrait(you, leftX, y, cellW, cellH, false, 'YOU');
          drawPortrait(them, rightX, y, cellW, cellH, togetherLayout === 'mirror', 'YOUR PERSON');
        }
      });
      ctx.fillStyle = '#9a6174';
      ctx.font = '15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('YOU  +  YOUR PERSON     ·     ' + new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 25);
      await saveImage(canvas.toDataURL('image/jpeg', 0.94), 'y2k-together-heart-pair.jpg');
    } catch {
      window.alert('Could not combine these photos. Please wait until both cameras have finished sending their pictures, then try again.');
    }
  };


  const decoratePhoto = async data => {
    if (photoBorder === 'none') return data;
    const img = await new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = data; });
    const pad = photoBorder === 'instant' ? 34 : photoBorder === 'film' ? 22 : 10;
    const footer = photoBorder === 'instant' ? 78 : 22;
    const canvas = document.createElement('canvas');
    canvas.width = img.width + pad * 2; canvas.height = img.height + pad * 2 + footer;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = photoBorder === 'dark' ? '#202329' : photoBorder === 'film' ? '#1f2428' : '#fffdf8';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,pad,pad);
    if (photoBorder === 'instant') { ctx.fillStyle='#777'; ctx.font='16px monospace'; ctx.textAlign='center'; ctx.fillText(new Date().toLocaleDateString(),canvas.width/2,canvas.height-27); }
    if (photoBorder === 'film') { ctx.fillStyle='#f2e9d9'; ctx.font='12px monospace'; ctx.textAlign='center'; ctx.fillText('Y2K CAMERA  •  '+new Date().toLocaleDateString(),canvas.width/2,canvas.height-7); }
    return canvas.toDataURL('image/jpeg',.9);
  };

  const toggleFavorite = id => setGallery(old => old.map(item => item.id === id ? {...item, favorite: !item.favorite} : item));
  const assignAlbum = (id, album) => setGallery(old => old.map(item => item.id === id ? {...item, album:album==='Favorites'?(item.album||'Camera'):album, favorite:album==='Favorites'?true:item.favorite} : item));
  const createAlbum = () => { const name=window.prompt('Name your new album:'); if(!name||!name.trim())return; const clean=name.trim().slice(0,32); if(customAlbums.some(album=>album.toLowerCase()===clean.toLowerCase())){window.alert('That album already exists.');return;} setCustomAlbums(old=>[...old,clean]); setStudioAlbum(clean); };
  const renamePhoto = id => { const current=gallery.find(item=>item.id===id); const name=window.prompt('Rename this photo:',current?.title||current?.filter||'Photo'); if(name&&name.trim())setGallery(old=>old.map(item=>item.id===id?{...item,title:name.trim().slice(0,60)}:item)); };
  const deleteSelectedPhotos = () => { if(!collageSelection.length)return; if(window.confirm('Delete '+collageSelection.length+' selected photos from this device?')){setGallery(old=>old.filter(item=>!collageSelection.includes(item.id)));setCollageSelection([]);} };
  const toggleCollagePhoto = id => setCollageSelection(old => old.includes(id) ? old.filter(value=>value!==id) : old.length < 6 ? [...old,id] : old);
  const makeCollage = async () => {
    const selectedPhotos = gallery.filter(item => collageSelection.includes(item.id)).slice(0,6);
    if (selectedPhotos.length < 2) { window.alert('Choose at least two photos for a collage.'); return; }
    const images = await Promise.all(selectedPhotos.map(item => new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=item.data;})));
    const cols = selectedPhotos.length === 2 ? 2 : selectedPhotos.length <= 4 ? 2 : 3;
    const rows = Math.ceil(images.length/cols), cellW=420, cellH=420, gap=16, pad=28;
    const canvas=document.createElement('canvas');canvas.width=pad*2+cols*cellW+(cols-1)*gap;canvas.height=pad*2+rows*cellH+(rows-1)*gap+52;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#f4f0e9';ctx.fillRect(0,0,canvas.width,canvas.height);
    images.forEach((img,i)=>{const x=pad+(i%cols)*(cellW+gap),y=pad+Math.floor(i/cols)*(cellH+gap);ctx.fillStyle='#fff';ctx.fillRect(x,y,cellW,cellH);const scale=Math.max(cellW/img.width,cellH/img.height);const w=img.width*scale,h=img.height*scale;ctx.save();ctx.beginPath();ctx.rect(x,y,cellW,cellH);ctx.clip();ctx.drawImage(img,x+(cellW-w)/2,y+(cellH-h)/2,w,h);ctx.restore();});
    ctx.fillStyle='#777';ctx.font='16px monospace';ctx.textAlign='center';ctx.fillText('Y2K CAMERA  /  LITTLE MOMENTS',canvas.width/2,canvas.height-17);
    await saveImage(canvas.toDataURL('image/jpeg',.92),'y2k-collage.jpg');
  };
  const saveEditedPhoto = async () => {
    if (!editorPhoto) return;
    const img=await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=editorPhoto.data;});
    let sx=0,sy=0,sw=img.width,sh=img.height;
    const ratio=editCrop==='square'?1:editCrop==='portrait'?3/4:editCrop==='landscape'?4/3:null;
    if(ratio){if(sw/sh>ratio){const width=sh*ratio;sx=(sw-width)/2;sw=width;}else{const height=sw/ratio;sy=(sh-height)/2;sh=height;}}
    const rotated=Math.abs(editRotation)%180===90, canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(rotated?sh:sw));canvas.height=Math.max(1,Math.round(rotated?sw:sh));
    const ctx=canvas.getContext('2d');ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(editRotation*Math.PI/180);if(editMirror)ctx.scale(-1,1);
    ctx.filter='brightness('+editBrightness/100+') contrast('+editContrast/100+') saturate('+editSaturation/100+') sepia('+(editWarmth/100*.35)+')';
    ctx.drawImage(img,sx,sy,sw,sh,-sw/2,-sh/2,sw,sh);
    const data=canvas.toDataURL('image/jpeg',.92), item={id:crypto.randomUUID(),data,filter:'EDITED',time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),createdAt:Date.now(),album:'Edited',favorite:false};
    setGallery(old=>[item,...old]);await saveImage(data,'y2k-edited-photo.jpg');setEditorPhoto(null);
  };
  const sendReaction = emoji => {
    setRoomReactions(old=>[...old,{emoji,from:'YOU',id:crypto.randomUUID()}].slice(-8));
    dataConnectionsRef.current.forEach(connection=>{if(connection.open)connection.send({type:'Y2K_REACTION',emoji});});
  };
  const toggleTorch = async () => {
    const track=streamRef.current?.getVideoTracks()[0];
    try { await track?.applyConstraints({advanced:[{torch:!torchEnabled}]});setTorchEnabled(!torchEnabled); }
    catch { setRoomError('Flash/torch is not supported by this camera or browser.'); }
  };

  const switchCamera = async () => {
    const next = facing === 'user' ? 'environment' : 'user';
    setFacing(next);
    await startCamera(next);
  };

  const clearShots = () => setShots([]);
  const deleteGalleryItem = id => setGallery(old => old.filter(item => item.id !== id));

  return (
    <div className="app-shell" data-theme={theme} data-style={style}>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Y2K Camera home">
          <span className="brand-mark">✳</span><span>Y2K<span className="brand-light">CAMERA</span></span>
        </a>
        <div className="top-meta"><span className="live-dot"></span> DIGITAL PHOTO STUDIO <span className="meta-divider">/</span> EST. 2004</div>
        <nav className="main-tabs" aria-label="Main sections"><button type="button" className={activeTab==='camera'?'active':''} aria-pressed={activeTab==='camera'} onClick={()=>setActiveTab('camera')}>📷 <span>CAMERA</span></button><button type="button" className={activeTab==='together'?'active':''} aria-pressed={activeTab==='together'} onClick={()=>setActiveTab('together')}>♡ <span>TOGETHER</span>{roomStatus==='connected'&&<i className="tab-live-dot"/>}</button><button type="button" className={activeTab==='studio'?'active':''} aria-pressed={activeTab==='studio'} onClick={()=>setActiveTab('studio')}>▦ <span>STUDIO</span></button></nav>
        <div className="top-actions"><button className="top-pill" onClick={() => {setShowGallery(false);setActiveTab('studio');}}>MY ROLL <span className="roll-count">{gallery.length}</span></button><button className="settings-icon-button" onClick={()=>setSettingsOpen(true)} aria-label="Open settings" title="Settings"><span></span><span></span><span></span></button></div>
      </header>

      <main>
        
        {activeTab === 'camera' && <><section className="intro"><div><h1>Y2K Camera</h1><p>A little digital camera for keeping the good bits.</p></div><div className="appearance-bar"><label>STYLE<select value={style} onChange={e=>{setStyle(e.target.value);setTheme(themesForStyle(e.target.value)[0]?.id);}}>{STYLES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>THEME<select value={theme} onChange={e=>setTheme(e.target.value)}>{themesForStyle(style).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label></div></section>

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
                <div className="viewfinder" style={{aspectRatio:previewRatio}}>
                  <video ref={videoRef} className={cx('camera-video', mirrorPreview && facing === 'user' && 'mirrored')} style={{...liveStyle,filter:filterAtIntensity(activeFilter.css,intensity)+' brightness('+(1+exposure/100)+')'}} playsInline muted />
                  {showGrid && <div className="composition-grid"><i/><i/><i/><i/></div>}
                  {dateStamp && <div className="date-stamp">{new Date().toLocaleDateString()}</div>}
                  {lowLight && <div className="lowlight-overlay">LOW LIGHT PREVIEW</div>}
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
                  <button className="shutter" onClick={handleMainShutter} disabled={!cameraReady || busy || (roomStatus === 'connected' && roomMode === 'camera' && (!remoteReady || !dataReady))} aria-label={roomStatus === 'connected' && roomMode === 'camera' ? 'Take photo on both cameras' : 'Take photo'}><span></span></button>
                  <button className={cx('round-control', sound && 'active')} title="Toggle shutter sound" onClick={() => setSound(!sound)}>♫</button>
                </div>
                <div className="camera-resolution">AUTO<br/>HD</div>
              </div>
            </div>
            <div className="meet-controls" aria-label="Microphone and camera controls">
              <button className={cx('meet-control', micEnabled && 'is-on')} onClick={toggleMic} aria-pressed={micEnabled} title={micEnabled ? 'Turn microphone off' : 'Turn microphone on'}>
                <span className="meet-control-icon">{micEnabled ? '🎙' : '🔇'}</span><span>{micEnabled ? 'MIC ON' : 'MIC OFF'}</span>
              </button>
              <button className={cx('meet-control', videoEnabled && 'is-on')} onClick={toggleVideo} aria-pressed={videoEnabled} title={videoEnabled ? 'Turn camera off' : 'Turn camera on'}>
                <span className="meet-control-icon">{videoEnabled ? '▣' : '▧'}</span><span>{videoEnabled ? 'CAMERA ON' : 'CAMERA OFF'}</span>
              </button>
              <span className="meet-controls-note">M MIC · V VIDEO · F FULLSCREEN · SPACE SNAP</span>
            </div>
            <div className="quick-tools"><button onClick={toggleFullscreen}>⛶ Fullscreen</button><button onClick={togglePiP}>▣ Picture-in-picture</button>{torchAvailable&&<button className={torchEnabled?'active':''} onClick={toggleTorch}>{torchEnabled?'TORCH ON':'TORCH OFF'}</button>}<button onClick={testSpeaker}>♫ Test speaker</button><button onClick={undoLastShot} disabled={!shots.length}>↶ Undo last</button></div>
            <div className="capture-preferences"><label>CAMERA QUALITY<select value={cameraQuality} onChange={e=>{setCameraQuality(e.target.value);startCamera(facing,e.target.value);}}><option value="480p">480p · Low data</option><option value="720p">720p · Balanced</option><option value="1080p">1080p · High</option></select></label><label>PREVIEW SHAPE<select value={previewRatio} onChange={e=>setPreviewRatio(e.target.value)}><option value="16/9">Widescreen</option><option value="4/3">Classic</option><option value="1/1">Square</option></select></label></div>
            {cameraError && <div className="camera-error"><span>!</span>{cameraError}<button onClick={() => startCamera(facing)}>TRY AGAIN ↗</button></div>}
            <div className="shoot-controls">
              <div className="control-block">
                <label>SELF TIMER</label>
                <div className="segmented">{[0,3,5,10].map(n => <button key={n} className={countdown===n?'selected':''} onClick={() => setCountdown(n)}>{n===0?'OFF':n+'s'}</button>)}</div>
              </div>
              <div className="control-block">
                <label>PHOTO MODE</label>
                <div className="segmented"><button className={mode==='single'?'selected':''} onClick={() => setMode('single')}>SINGLE</button><button className={mode==='strip'?'selected':''} onClick={() => setMode('strip')}>4-SHOT STRIP</button><button className={mode==='booth'?'selected':''} onClick={() => setMode('booth')}>PHOTO BOOTH</button></div>
              </div>
            </div>
            <section className="camera-options-panel"><div className="camera-options-heading"><div><span>CAMERA OPTIONS</span><small>Fine-tune your preview</small></div><span className="camera-option-count">05 CONTROLS</span></div>
              <div className="camera-option-toggles"><label><input type="checkbox" checked={mirrorPreview} onChange={e=>setMirrorPreview(e.target.checked)}/> Mirror selfie</label><label><input type="checkbox" checked={showGrid} onChange={e=>setShowGrid(e.target.checked)}/> Composition grid</label><label><input type="checkbox" checked={dateStamp} onChange={e=>setDateStamp(e.target.checked)}/> Date overlay</label><label><input type="checkbox" checked={lowLight} onChange={e=>setLowLight(e.target.checked)}/> Low-light guide</label></div><div className="camera-extra-controls"><label>EXPOSURE PRESET <select value={exposure} onChange={e=>setExposure(Number(e.target.value))}><option value={-20}>Low light</option><option value={0}>Auto</option><option value={15}>Bright</option><option value={30}>High key</option></select></label><label>PHOTO FRAME <select value={photoBorder} onChange={e=>setPhotoBorder(e.target.value)}><option value="none">No border</option><option value="instant">Instant print</option><option value="film">Film frame</option><option value="dark">Dark matte</option></select></label></div>
              <label className="exposure-control"><span>EXPOSURE <b>{exposure>0?'+':''}{exposure}</b></span><input className="setting-range" type="range" min="-40" max="40" value={exposure} onChange={e=>setExposure(Number(e.target.value))}/></label>
              <div className="camera-extra-note">YOUR CAMERA STAYS LOCAL · PHOTOS ARE SAVED TO YOUR ROLL</div>
            </section>
          </section>

          <aside className="filters-column">
            <div className="section-head"><span>FILTER LIBRARY</span><span className="mono-label">{FILTERS.length} LOOKS</span></div>
            <div className="filter-panel redesigned-filters">
              <div className="filter-current"><span className="mini-kicker">YOU ARE USING</span><h2>{activeFilter.name}</h2><p>{activeFilter.group} · {intensity}% STRENGTH</p></div>
              <div className="intensity-control"><div><label>FILTER STRENGTH</label><b>{intensity}%</b></div><input type="range" min="0" max="100" value={intensity} onChange={e=>setIntensity(Number(e.target.value))}/></div>
              <label className="filter-category-label">BROWSE A COLLECTION<select value={group} onChange={e=>setGroup(e.target.value)}>{GROUPS.map(g=><option key={g} value={g}>{g==='ALL'?'All filters':g.charAt(0)+g.slice(1).toLowerCase()}</option>)}</select></label>
              <div className="filter-grid redesigned-filter-grid">{visibleFilters.map((filter,index)=><button key={filter.name} className={cx('filter-tile redesigned-filter-tile',selected===filter.name&&'chosen')} onClick={()=>setSelected(filter.name)}><span className="filter-index">{String(index+1).padStart(2,'0')}</span><span className="filter-name">{filter.name}</span><span className="filter-group">{filter.group}</span><span className="filter-select-mark">{selected===filter.name?'SELECTED':'USE FILTER'}</span></button>)}</div>
            </div>
          </aside>
        </div>
                {settingsOpen && <div className="settings-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSettingsOpen(false);}}><section className="settings-dialog" role="dialog" aria-modal="true" aria-label="Camera settings"><div className="settings-dialog-head"><div><span>CONTROL ROOM</span><h2>Settings</h2><p>Devices, sound and your camera setup.</p></div><button onClick={()=>setSettingsOpen(false)} aria-label="Close settings">×</button></div>
          <div className="settings-dialog-grid"><section className="settings-section"><span className="settings-kicker">CALL DEVICES</span>
            <label className="setting-label">MICROPHONE INPUT</label><select value={audioInput} onChange={e=>changeInput('audio',e.target.value)}><option value="">System default</option>{devices.audioinput.map((d,i)=><option key={d.deviceId||i} value={d.deviceId}>{d.label||'Microphone '+(i+1)}</option>)}</select>
            <label className="setting-label">CAMERA INPUT</label><select value={videoInput} onChange={e=>changeInput('video',e.target.value)}><option value="">Current camera</option>{devices.videoinput.map((d,i)=><option key={d.deviceId||i} value={d.deviceId}>{d.label||'Camera '+(i+1)}</option>)}</select>
            <label className="setting-label">AUDIO OUTPUT</label><select value={audioOutput} onChange={e=>changeOutput(e.target.value)}><option value="">System default</option>{devices.audiooutput.map((d,i)=><option key={d.deviceId||i} value={d.deviceId}>{d.label||'Speaker '+(i+1)}</option>)}</select>
            <p className="settings-hint">Some browsers only show device names after camera or microphone permission is granted.</p></section>
            <section className="settings-section settings-appearance-section"><span className="settings-kicker">APPEARANCE</span><label className="setting-label">WEBSITE STYLE</label><select value={style} onChange={e=>{setStyle(e.target.value);setTheme(themesForStyle(e.target.value)[0]?.id);}}>{STYLES.map(s=><option key={s.id} value={s.id}>{s.name} — {s.description}</option>)}</select><label className="setting-label">COLOUR THEME</label><select value={theme} onChange={e=>setTheme(e.target.value)}>{themesForStyle(style).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
            <div className="settings-theme-preview"><span className="theme-preview-chip"></span><div><b>{STYLES.find(s=>s.id===style)?.name}</b><small>{THEMES.find(t=>t.id===theme)?.name} colour theme</small></div></div>
            <button className="settings-reset" onClick={()=>{setStyle('clay');setTheme('clay-vanilla');setMicEnabled(true);setVideoEnabled(true);setAudioInput('');setVideoInput('');setAudioOutput('');}}>RESET SETTINGS</button></section></div>
          </section></div>}
                
        <section className="results-section">
          <div className="section-head"><span><i className="tiny-square"></i> YOUR CONTACT SHEET</span><span className="mono-label">{shots.length} / 4 FRAMES</span></div>
          <div className="contact-sheet">
            {shots.length === 0 ? <div className="empty-sheet"><span>▧</span><strong>NOTHING DEVELOPED YET</strong><small>YOUR NEXT FAVOURITE PHOTO MIGHT BE ONE CLICK AWAY.</small></div> : <div className="shot-list">{shots.slice(-4).map((shot,i)=><div className="shot-card" key={shot.id}><img src={shot.data} alt={'Photo '+(i+1)}/><div><span>FRAME 0{i+1}</span><b>{shot.filter}</b><button onClick={() => saveImage(shot.data,'y2k-photo-'+(i+1)+'.jpg')}>SAVE ↗</button></div></div>)}</div>}
            <div className="sheet-actions"><button className="text-button" onClick={clearShots} disabled={!shots.length}>CLEAR FRAMES</button><button className="primary-button" onClick={makeStrip} disabled={!shots.length}>DOWNLOAD STRIP <span>↗</span></button></div>
          </div>
        </section>

        {showGallery && activeTab === 'camera' && <section className="gallery-section">
          <div className="section-head"><span><i className="tiny-square pink"></i> MY CAMERA ROLL</span><button className="text-button" onClick={() => setShowGallery(false)}>CLOSE ×</button></div>
          {gallery.length===0 ? <p className="gallery-empty">Your roll is empty. Go make a moment.</p> : <><div className="gallery-actions"><button onClick={downloadAllPhotos}>DOWNLOAD ALL ({gallery.length})</button><button onClick={clearGallery}>DELETE ALL</button></div><div className="gallery-grid">{gallery.map(item=><div className="gallery-item" key={item.id}><img src={item.data} alt="Saved camera roll photo"/><div><span>{item.filter}</span><button onClick={()=>saveImage(item.data,'y2k-'+item.id+'.jpg')}>↓</button><button onClick={()=>deleteGalleryItem(item.id)}>×</button></div></div>)}</div></>}
        </section>}
        </>}
        {activeTab === 'studio' && <section className="studio-page">
          <div className="studio-page-heading"><div><span className="room-kicker">YOUR PERSONAL PHOTO WORKSPACE</span><h1>Photo Studio</h1><p>Your pictures stay in this browser. Albums are saved locally on this device.</p></div>
            {roomStatus==='connected' && miniCamera && <div className="mini-camera-card"><video ref={miniRemoteVideoRef} autoPlay playsInline muted/><span>YOUR PERSON · LIVE</span><button onClick={()=>setMiniCamera(false)}>HIDE</button></div>}
          </div>
          <div className="studio-toolbar">
            <label>ALBUM <select value={studioAlbum} onChange={e=>setStudioAlbum(e.target.value)}>{['All photos',...customAlbums,'Favorites'].map(name=><option key={name}>{name}</option>)}</select></label><button onClick={createAlbum}>＋ NEW ALBUM</button><button onClick={deleteSelectedPhotos} disabled={!collageSelection.length}>DELETE SELECTED ({collageSelection.length})</button>
            <label>PHOTO BORDER <select value={photoBorder} onChange={e=>setPhotoBorder(e.target.value)}><option value="none">No border</option><option value="instant">Instant print</option><option value="film">Film frame</option><option value="dark">Dark matte</option></select></label>
            <button onClick={()=>setActiveTab('camera')}>OPEN CAMERA ↗</button>
            {roomStatus==='connected' && <button onClick={()=>setMiniCamera(v=>!v)}>{miniCamera?'HIDE MINI CAMERA':'SHOW MINI CAMERA'}</button>}
          </div>
          <div className="studio-tools-grid">
            <section className="studio-tool-card"><span className="room-kicker">01 / COLLAGE MAKER</span><h3>Make a collage</h3><p>Select 2–6 photos from your library below, then create a single image.</p><button className="primary-button" onClick={makeCollage} disabled={collageSelection.length<2}>CREATE COLLAGE ({collageSelection.length}/6) ↗</button></section>
            <section className="studio-tool-card"><span className="room-kicker">02 / PHOTO BOOTH</span><h3>Four-frame booth</h3><p>Return to the camera and choose PHOTO BOOTH for four timed frames.</p><button className="secondary-room-button" onClick={()=>{setMode('booth');setActiveTab('camera');}}>SET UP PHOTO BOOTH ↗</button></section>
            <section className="studio-tool-card"><span className="room-kicker">03 / SHARED MEMORIES</span><h3>Together album</h3><p>{gallery.filter(item=>item.album==='Together').length} pictures from synchronized sessions are stored in this browser.</p><button className="secondary-room-button" onClick={()=>setStudioAlbum('Together')}>VIEW TOGETHER PHOTOS ↗</button></section>
          </div>
          <div className="studio-library-head"><div><span className="room-kicker">LOCAL LIBRARY · INDEXEDDB</span><h2>{studioAlbum==='All photos'?'All photos':studioAlbum}</h2></div><span>{gallery.filter(item=>studioAlbum==='All photos'||(studioAlbum==='Favorites'?item.favorite:item.album===studioAlbum)).length} PHOTOS</span></div>
          {!galleryLoaded ? <p className="gallery-empty">Opening your local photo library…</p> : gallery.filter(item=>studioAlbum==='All photos'||(studioAlbum==='Favorites'?item.favorite:item.album===studioAlbum)).length===0 ? <p className="gallery-empty">No photos here yet. Take a few pictures and they'll appear here.</p> :
          <div className="studio-library-grid">{gallery.filter(item=>studioAlbum==='All photos'||(studioAlbum==='Favorites'?item.favorite:item.album===studioAlbum)).map(item=><article className="studio-photo-card" key={item.id}>
            <label className="collage-pick"><input type="checkbox" checked={collageSelection.includes(item.id)} onChange={()=>toggleCollagePhoto(item.id)}/> ADD TO COLLAGE</label>
            <img src={item.data} alt="Saved camera photo"/>
            <div className="studio-photo-meta"><b>{item.title||item.filter||'PHOTO'}</b><span>{item.source||item.album||'CAMERA'}</span></div>
            <div className="studio-photo-actions"><button onClick={()=>toggleFavorite(item.id)}>{item.favorite?'★ FAVOURITED':'☆ FAVOURITE'}</button><button onClick={()=>{setEditBrightness(100);setEditContrast(100);setEditSaturation(100);setEditWarmth(0);setEditRotation(0);setEditCrop('original');setEditMirror(false);setEditMirror(false);setEditorPhoto(item);}}>EDIT</button><button onClick={()=>renamePhoto(item.id)}>RENAME</button><button onClick={()=>saveImage(item.data,'y2k-'+item.id+'.jpg')}>SAVE ↓</button></div>
            <label className="album-assign">ALBUM <select value={item.album||'Camera'} onChange={e=>assignAlbum(item.id,e.target.value)}>{customAlbums.map(album=><option key={album}>{album}</option>)}</select></label>
            <button className="studio-delete" onClick={()=>deleteGalleryItem(item.id)}>DELETE PHOTO ×</button>
          </article>)}</div>}
          {editorPhoto && <div className="editor-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setEditorPhoto(null);}}><section className="editor-dialog" role="dialog" aria-modal="true" aria-label="Photo editor">
            <div className="editor-head"><div><span className="room-kicker">PHOTO LAB</span><h2>Edit photo</h2></div><button onClick={()=>setEditorPhoto(null)}>CLOSE ×</button></div>
            <img className="editor-preview" src={editorPhoto.data} alt="Photo being edited" style={{filter:'brightness('+editBrightness/100+') contrast('+editContrast/100+') saturate('+editSaturation/100+') sepia('+(editWarmth/100*.35)+')',transform:'rotate('+editRotation+'deg) scaleX('+(editMirror?-1:1)+')'}}/>
            <label>BRIGHTNESS · {editBrightness}%<input type="range" min="50" max="150" value={editBrightness} onChange={e=>setEditBrightness(Number(e.target.value))}/></label>
            <label>CONTRAST · {editContrast}%<input type="range" min="50" max="150" value={editContrast} onChange={e=>setEditContrast(Number(e.target.value))}/></label>
            <label>SATURATION · {editSaturation}%<input type="range" min="0" max="180" value={editSaturation} onChange={e=>setEditSaturation(Number(e.target.value))}/></label><label>WARMTH · {editWarmth}%<input type="range" min="0" max="100" value={editWarmth} onChange={e=>setEditWarmth(Number(e.target.value))}/></label><label className="editor-mirror-control"><input type="checkbox" checked={editMirror} onChange={e=>setEditMirror(e.target.checked)}/> MIRROR IMAGE ↔</label><label>CROP RATIO<select value={editCrop} onChange={e=>setEditCrop(e.target.value)}><option value="original">Original</option><option value="square">Square · 1:1</option><option value="portrait">Portrait · 3:4</option><option value="landscape">Landscape · 4:3</option></select></label>
            <div className="editor-actions"><button onClick={()=>setEditRotation(v=>(v+90)%360)}>ROTATE 90° ↻</button><button onClick={()=>{setEditBrightness(100);setEditContrast(100);setEditSaturation(100);setEditWarmth(0);setEditRotation(0);setEditCrop('original');}}>RESET</button><button className="primary-button" onClick={saveEditedPhoto}>SAVE EDITED COPY ↗</button></div>
          </section></div>}
        </section>}
                      {syncedLocalPhotos.length > 0 && <section className="synced-results" aria-live="polite">
            <div className="synced-results-head"><div><span className="room-kicker">BOTH CAMERAS · SHARED RESULT</span><h3>{syncedCaptureLabel}</h3></div><span>{syncedRemotePhotos.filter(Boolean).length}/{syncedLocalPhotos.filter(Boolean).length} RECEIVED</span></div>
            {syncedLocalPhotos.some(photo => photo?.data) && syncedRemotePhotos.some(photo => photo?.data) && <div className="synced-bulk-actions">
              <button className="synced-save-button" onClick={saveTogetherPhotos}>↓ SAVE BOTH PHOTOS</button>
              <button className="synced-save-button" onClick={combineTogetherPhotos}>▦ COMBINE INTO ONE</button><label className="layout-choice">LAYOUT <select value={togetherLayout} onChange={e=>setTogetherLayout(e.target.value)}><option value="mirror">Heart pair · mirror one</option><option value="side">Side by side</option><option value="stack">Stacked together</option></select></label>
            </div>}
            <div className={'synced-pair-grid synced-layout-'+togetherLayout}>
              {syncedLocalPhotos.map((localPhoto,index)=>{
                const remotePhoto=syncedRemotePhotos[index];
                return <div className="synced-pair-preview" key={localPhoto?.id||index} style={{display:'flex',flexDirection:togetherLayout==='stack'?'column':'row',gap:16}}>
                  <figure><img src={localPhoto?.data} alt={'Your synchronized photo '+(index+1)}/><figcaption>YOU · {localPhoto?.filter||'PHOTO'}{syncedLocalPhotos.length>1?' · '+(index+1):''}</figcaption><button className="synced-save-button" onClick={()=>saveImage(localPhoto.data,'y2k-together-you-'+(index+1)+'.jpg')}>↓ SAVE YOUR PHOTO</button></figure>
                  <figure>{remotePhoto?.data ? <img src={remotePhoto.data} alt={'Your person synchronized photo '+(index+1)} style={{transform:togetherLayout==='mirror'?'scaleX(-1)':'none'}}/> : <div className="synced-pending">Waiting for the other photo…</div>}<figcaption>YOUR PERSON · {remotePhoto?.filter||'RECEIVING'}{syncedRemotePhotos.length>1?' · '+(index+1):''}</figcaption>{remotePhoto?.data && <button className="synced-save-button" onClick={()=>saveImage(remotePhoto.data,'y2k-together-their-'+(index+1)+'.jpg')}>↓ SAVE THEIR PHOTO</button>}</figure>
                </div>;
              })}
            </div>
          </section>}
        {activeTab === 'together' && <section className="together-panel">
          <div className="section-head"><span><i className="tiny-square pink"></i> TOGETHER MODE</span><span className="mono-label">PRIVATE ROOM</span></div>
          <div className="together-intro"><div><span className="room-kicker">6-DIGIT ROOM CODE · WEBRTC</span><h2>Two cameras. One little moment.</h2><p>Create a room, share the six-digit code, and take pictures together from anywhere.</p></div><span className="room-status"><i className={roomStatus==='connected'?'connected':''}></i>{roomStatus==='connected'?'CONNECTED':roomStatus==='waiting'?'WAITING FOR YOUR PERSON':roomStatus==='joining'?'JOINING…':roomStatus==='starting'?'CREATING ROOM…':roomStatus==='error'?'CHECK CONNECTION':'NOT IN A ROOM'}</span>{roomStatus==='connected' && <span className={'connection-quality quality-'+connectionQuality.level} title={connectionQuality.detail}><i></i><b>{connectionQuality.label}</b><small>{connectionQuality.detail}</small></span>}</div>
          {roomStatus==='idle' || roomStatus==='error' ? <div className="room-entry">
            <div className="room-create"><span className="room-number">01 / HOST</span><h3>Start a private room</h3><p>Generate a 6-digit code to share with your person.</p><button className="primary-button" onClick={createRoom}>GENERATE ROOM CODE ↗</button></div>
            <div className="room-join"><span className="room-number">02 / JOIN</span><h3>Got an invite?</h3><p>Enter the 6-digit code they sent you.</p><input value={joinInput} onChange={e=>setJoinInput(e.target.value.replace(/\D/g, '').slice(0,6))} placeholder="e.g. 482915" maxLength={6} inputMode="numeric" autoComplete="off" /><button className="secondary-room-button" onClick={joinRoom}>JOIN ROOM ↗</button></div>
          </div> : <div className="room-active">
            {roomCode && <div className="invite-box"><div><span className="room-number">YOUR ROOM CODE</span><code className="room-code-display">{roomCode}</code><small className="room-expiry-note">EXPIRES IN {Math.floor(roomSecondsLeft/60)}:{String(roomSecondsLeft%60).padStart(2,'0')}</small></div><button className="primary-button" onClick={copyRoomCode}>COPY CODE ↗</button><button className="secondary-room-button" onClick={copyInvite}>COPY INVITE MESSAGE</button><button className="secondary-room-button" onClick={()=>{if(window.confirm('Create a new code? Anyone using the current code will be disconnected.')){callRef.current?.close();peerRef.current?.destroy();peerRef.current=null;callRef.current=null;dataConnectionsRef.current=[];pendingConnectionsRef.current.forEach(c=>c.close());pendingConnectionsRef.current=[];approvedPeerRef.current='';incomingCallRef.current=null;setIncomingCall(null);setRemoteReady(false);setRemoteStream(null);setDataReady(false);setRoomCode('');setRoomExpiresAt(null);try{localStorage.removeItem(ROOM_STORAGE_KEY);}catch{}setRoomStatus('idle');createRoom();}}}>NEW CODE ↻</button></div>}
            {roomStatus === 'connected' && <button className="secondary-room-button room-handoff-button" onClick={handoffAndLeave}>HAND OFF HOST & LEAVE ↗</button>}
            {incomingCall && <div className="incoming-invite"><div><b>♡ SOMEONE WANTS TO JOIN</b><span>They are asking to join your private camera room.</span></div><button className="primary-button" onClick={acceptIncomingCall}>ACCEPT ↗</button><button className="secondary-room-button" onClick={rejectIncomingCall}>DECLINE ×</button></div>}
            <div className="room-view-tabs"><button className={roomMode==='call'?'active':''} onClick={()=>setRoomMode('call')}>VIDEO CALL</button><button className={roomMode==='camera'?'active':''} onClick={()=>setRoomMode('camera')}>CAMERA TOGETHER</button></div>
            <div className="together-timer-control"><span>SYNC TIMER</span><div className="segmented">{[0,3,5,10].map(n=><button key={'together-timer-'+n} className={countdown===n?'selected':''} onClick={()=>setCountdown(n)}>{n===0?'OFF':n+'s'}</button>)}</div><label><input type="checkbox" checked={autoAcceptInvites} onChange={e=>{setAutoAcceptInvites(e.target.checked);try{localStorage.setItem('y2k-auto-accept-invites',String(e.target.checked));}catch{}}}/> AUTO-ACCEPT INVITES</label></div>
            <div className="together-device-controls"><button className={cx("meet-control",micEnabled&&"is-on")} onClick={toggleMic} aria-pressed={micEnabled}><span className="meet-control-icon">{micEnabled?"🎙":"🔇"}</span>{micEnabled?"MIC ON":"MIC OFF"}</button><button className={cx("meet-control",videoEnabled&&"is-on")} onClick={toggleVideo} aria-pressed={videoEnabled}><span className="meet-control-icon">{videoEnabled?"▣":"▧"}</span>{videoEnabled?"CAMERA ON":"CAMERA OFF"}</button><button className="secondary-room-button" onClick={switchCamera}>SWITCH CAMERA ↔</button></div>
            <div className="room-feeds">
              <div className="room-feed"><video ref={localRoomVideoRef} autoPlay muted playsInline style={{filter:filterAtIntensity(togetherActiveFilter.css,togetherIntensity)}}/><span>YOU · CAM 01</span></div>
              <div className="room-feed remote-feed">{remoteReady ? <video ref={remoteVideoRef} autoPlay playsInline style={{filter:filterAtIntensity(remoteActiveFilter.css,remoteFilter.intensity)}}/> : <div className="waiting-feed"><b>♡</b><span>WAITING FOR YOUR PERSON</span><small>Share your 6-character room code</small></div>}<span>YOUR PERSON · CAM 02</span></div>
            </div>
            {roomStatus==='connected' && <div className="room-reaction-bar"><span>QUICK REACTIONS</span>{['❤️','😂','✨','⭐','📸','🫶'].map(emoji=><button key={emoji} onClick={()=>sendReaction(emoji)}>{emoji}</button>)}<div className="reaction-history">{roomReactions.slice(-5).map(item=><span key={item.id} title={item.from}>{item.emoji}</span>)}</div></div>}
            {roomMode==='call' ? <div className="room-call-controls"><span>{remoteReady?'YOU ARE BOTH IN THE ROOM':'Your room is ready when they join.'}</span><button className="secondary-room-button" onClick={handoffAndLeave}>LEAVE & HAND OFF HOST ↗</button></div> : <div className="room-camera-controls"><p>Your Together filter is independent from the solo camera. Choose a look below; it applies to your preview and your saved synced photo.</p><div className="synced-mode-picker" role="group" aria-label="Synchronized capture mode"><button type="button" className={mode==='single'?'active':''} onClick={()=>setMode('single')} aria-pressed={mode==='single'}>ONE PHOTO</button><button type="button" className={mode==='strip'?'active':''} onClick={()=>setMode('strip')} aria-pressed={mode==='strip'}>4-PHOTO STRIP</button><button type="button" className={mode==='booth'?'active':''} onClick={()=>setMode('booth')} aria-pressed={mode==='booth'}>PHOTO BOOTH</button></div><button className="primary-button sync-shutter" onClick={syncShutter} disabled={!remoteReady || !dataReady || syncRunning}>◎ {syncRunning?'CAPTURING BOTH CAMERAS…':'SYNC SHUTTER — BOTH CAMERAS'}</button><button className="secondary-room-button" onClick={handoffAndLeave}>LEAVE & HAND OFF HOST ↗</button></div>}

          </div>}
          <section className="together-filter-panel"><div className="together-filter-head"><div><span className="room-kicker">YOUR TOGETHER LOOK</span><h3>{togetherActiveFilter.name}</h3></div><label>STRENGTH <b>{togetherIntensity}%</b><input type="range" min="0" max="100" value={togetherIntensity} onChange={e=>setTogetherIntensity(Number(e.target.value))}/></label></div><label className="filter-category-label">FILTER COLLECTION<select value={togetherGroup} onChange={e=>setTogetherGroup(e.target.value)}>{GROUPS.map(g=><option key={g} value={g}>{g==='ALL'?'All filters':g.charAt(0)+g.slice(1).toLowerCase()}</option>)}</select></label><div className="together-filter-grid">{togetherVisibleFilters.map((filter,index)=><button key={filter.name} className={cx('filter-tile redesigned-filter-tile',togetherSelected===filter.name&&'chosen')} onClick={()=>setTogetherSelected(filter.name)}><span className="filter-index">{String(index+1).padStart(2,'0')}</span><span className="filter-name">{filter.name}</span><span className="filter-group">{filter.group}</span><span className="filter-select-mark">{togetherSelected===filter.name?'SELECTED':'USE FILTER'}</span></button>)}</div></section>
          {roomError && <div className="room-error">{roomError}</div>}{meetingMessage && <div className="room-success" role="status">{meetingMessage}</div>}
          <div className="room-privacy">⌑ SHARE CODE ONLY WITH YOUR PERSON <span>·</span> HOST APPROVAL REQUIRED <span>·</span> VIDEO IS PEER-TO-PEER</div>
        </section>}
      </main>

      <footer><span>Y2K CAMERA © 2004—2026</span><span>MADE FOR THE MEMORIES, NOT THE ALGORITHM <b>✳</b></span><span>NO UPLOADS. JUST YOU.</span></footer>
      <canvas ref={canvasRef} className="hidden-canvas" />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
