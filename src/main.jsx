import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
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
const THEMES = [['Silver 2004','silver'],['Bubblegum','bubblegum'],['Cyber Lime','cyber-lime'],['Midnight Blue','midnight-blue'],['Cherry Chrome','cherry-chrome'],['Lavender Haze','lavender-haze'],['Sunset Blvd','sunset'],['Mint Condition','mint'],['Violet Arcade','violet'],['Desert Sand','desert'],['Toxic Green','toxic'],['Ocean Drive','ocean'],['Cocoa Club','cocoa'],['Red Alert','red'],['Mono Noir','noir']].map(([name,id])=>({name,id}));
const STYLES = [{name:'Y2K Camera',id:'y2k',description:'Retro point-and-shoot interface'},{name:'Editorial Magazine',id:'editorial',description:'A photo journal with a magazine layout'},{name:'Darkroom Studio',id:'studio',description:'A pro camera workstation'},{name:'Terminal OS',id:'terminal',description:'A retro computer interface'},{name:'Scrapbook',id:'scrapbook',description:'A tactile memory book'},{name:'Minimal Modern',id:'minimal',description:'A clean, borderless camera app'},{name:'Google Meet',id:'meet',description:'A familiar, clean video meeting layout'}];
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
  const [togetherSelected, setTogetherSelected] = useState('2004 Digicam');
  const [togetherIntensity, setTogetherIntensity] = useState(100);
  const [togetherGroup, setTogetherGroup] = useState('ALL');
  const [roomStatus, setRoomStatus] = useState('idle');
  const [roomCode, setRoomCode] = useState('');
  const [joinInput, setJoinInput] = useState('');
  const [remoteReady, setRemoteReady] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [roomError, setRoomError] = useState('');
  const [roomMode, setRoomMode] = useState('call');
  const [incomingCall, setIncomingCall] = useState(null);
  const [remoteFilter, setRemoteFilter] = useState({ name: 'Original', intensity: 100 });
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [style,setStyle]=useState('y2k');
  const [theme,setTheme]=useState('silver');
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
    if (cameraReady && activeTab === 'together' && localRoomVideoRef.current && streamRef.current) {
      localRoomVideoRef.current.srcObject = streamRef.current;
      localRoomVideoRef.current.play().catch(() => {});
    }
  }, [cameraReady, activeTab, roomStatus]);

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

  const renderFrame = (filterName = selected, filterStrength = intensity) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return null;
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.save();
    if (facing === 'user') { ctx.translate(width, 0); ctx.scale(-1, 1); }
    const captureFilter = FILTERS.find(f => f.name === filterName) || FILTERS[0];
    ctx.filter = filterAtIntensity(captureFilter.css, filterStrength) + ' brightness(' + (1 + exposure/100) + ')';
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();
    if (captureFilter.tint && captureFilter.alpha) {
      ctx.save();
      ctx.globalCompositeOperation = activeFilter.blend || 'soft-light';
      ctx.globalAlpha = captureFilter.alpha * (filterStrength / 100);
      ctx.fillStyle = captureFilter.tint;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
    return canvas.toDataURL('image/jpeg', .94);
  };

  const takeOne = async (filterName = selected, filterStrength = intensity) => {
    const data = renderFrame(filterName, filterStrength);
    if (!data) return null;
    const item = { id: crypto.randomUUID(), data, filter: filterName, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
    setShots(old => [...old, item]);
    setGallery(old => [item, ...old]);
    return item;
  };

  const takePhoto = async (filterName = selected, filterStrength = intensity) => {
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
      await takeOne(filterName, filterStrength);
      await new Promise(resolve => setTimeout(resolve, 520));
      setFlash(false);
      if (i < total - 1) await new Promise(resolve => setTimeout(resolve, 450));
    }
    setBusy(false);
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
    stopCamera();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
      video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    stream.getAudioTracks().forEach(track=>track.enabled=micEnabled);
    stream.getVideoTracks().forEach(track=>track.enabled=videoEnabled);
    streamRef.current = stream;
    if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
    setCameraReady(true);
    navigator.mediaDevices?.enumerateDevices?.().then(list=>setDevices({
      audioinput:list.filter(d=>d.kind==='audioinput'),
      videoinput:list.filter(d=>d.kind==='videoinput'),
      audiooutput:list.filter(d=>d.kind==='audiooutput')
    })).catch(()=>{});
    return stream;
  };

  const setupDataConnection = connection => {
    if (isRoomHostRef.current && approvedPeerRef.current !== connection.peer) { pendingConnectionsRef.current.push(connection); return; }
    dataConnectionsRef.current.push(connection);
    const sendCurrentFilter = () => connection.send({ type: 'Y2K_FILTER', name: togetherSelected, intensity: togetherIntensity });
    if (connection.open) { setDataReady(true); sendCurrentFilter(); }
    connection.on('open', () => { setDataReady(true); sendCurrentFilter(); });
    connection.on('data', message => {
      if (message === 'Y2K_SYNC_SHUTTER') { takePhoto(togetherSelected, togetherIntensity); return; }
      if (message && typeof message === 'object' && message.type === 'Y2K_FILTER') {
        const valid = FILTERS.some(filter => filter.name === message.name);
        if (valid) setRemoteFilter({ name: message.name, intensity: Math.max(0, Math.min(100, Number(message.intensity) || 0)) });
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

  const createRoom = async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setRoomError('Together Mode needs HTTPS and camera/microphone permissions.'); return; }
    try {
      setRoomError('');
      isRoomHostRef.current = true;
      approvedPeerRef.current = '';
      setRoomStatus('starting');
      const stream = await prepareRoomCamera();
      const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      let code = '';
      while (code.length < 6) { const bytes = crypto.getRandomValues(new Uint8Array(12)); for (const byte of bytes) { if (byte < 240) code += alphabet[byte % alphabet.length]; if (code.length === 6) break; } }
      const peer = new Peer(code);
      peerRef.current = peer;
      peer.on('open', id => {
        setRoomCode(id);
        setRoomStatus('waiting');
      });
      peer.on('call', call => {
        setIncomingCall(call);
      });
      peer.on('connection', connection => { if (approvedPeerRef.current === connection.peer) setupDataConnection(connection); else pendingConnectionsRef.current.push(connection); });
      peer.on('error', error => {
        setRoomError(error.type === 'unavailable-id' ? 'Could not create a room. Please try again.' : (error.message || 'Room connection error.'));
        setRoomStatus('error');
      });
    } catch (error) {
      setRoomError(error.name === 'NotAllowedError' ? 'Allow camera and microphone access to start a room.' : (error.message || 'Could not start your camera.'));
      setRoomStatus('error');
    }
  };

  const joinRoom = async () => {
    const targetId = joinInput.trim().toUpperCase().replace(/[^A-Z]/g, '');
    if (!/^[A-HJ-NP-Z]{6}$/.test(targetId)) { setRoomError('Enter the 6-character room code.'); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setRoomError('Together Mode needs HTTPS and camera/microphone permissions.'); return; }
    try {
      setRoomError('');
      isRoomHostRef.current = false;
      approvedPeerRef.current = '';
      setRoomStatus('joining');
      const stream = await prepareRoomCamera();
      const peer = new Peer();
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
    if (!incomingCall || !streamRef.current) return;
    const approvedPeer = incomingCall.peer;
    approvedPeerRef.current = approvedPeer;
    incomingCall.answer(streamRef.current);
    attachRemoteCall(incomingCall);
    pendingConnectionsRef.current.filter(connection => connection.peer === approvedPeer).forEach(setupDataConnection);
    pendingConnectionsRef.current = pendingConnectionsRef.current.filter(connection => connection.peer !== approvedPeer);
    setIncomingCall(null);
  };

  const rejectIncomingCall = () => {
    const rejectedPeer = incomingCall?.peer;
    incomingCall?.close();
    pendingConnectionsRef.current.filter(connection => connection.peer === rejectedPeer).forEach(connection => connection.close());
    pendingConnectionsRef.current = pendingConnectionsRef.current.filter(connection => connection.peer !== rejectedPeer);
    setIncomingCall(null);
  };

  const syncShutter = () => {
    dataConnectionsRef.current.forEach(connection => {
      if (connection.open) connection.send('Y2K_SYNC_SHUTTER');
    });
    takePhoto(togetherSelected, togetherIntensity);
  };

  const handleMainShutter = () => {
    if (roomStatus === 'connected' && roomMode === 'camera') {
      if (remoteReady && dataReady) syncShutter();
      return;
    }
    takePhoto();
  };

  const leaveRoom = () => {
    if (roomStatus !== 'idle' && !window.confirm('Leave this camera room? Your current photos will stay in your camera roll.')) return;
    callRef.current?.close();
    peerRef.current?.destroy();
    peerRef.current = null;
    callRef.current = null;
    dataConnectionsRef.current = [];
    pendingConnectionsRef.current.forEach(connection => connection.close());
    pendingConnectionsRef.current = [];
    approvedPeerRef.current = '';
    isRoomHostRef.current = false;
    setRemoteReady(false);
    setRemoteStream(null);
    setRemoteFilter({ name: 'Original', intensity: 100 });
    setDataReady(false);
    setRoomStatus('idle');
    setRoomCode('');
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
  const copyInvite = async () => { try { await navigator.clipboard.writeText('Join my private camera room: '+roomCode+'\nOpen '+window.location.origin+' and enter this 6-character code.'); setMeetingMessage('Invite message copied.'); } catch { setRoomError('Could not copy the invite.'); } };
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
        <div className="top-actions"><nav className="main-tabs" aria-label="Main sections"><button className={activeTab==='camera'?'active':''} onClick={()=>setActiveTab('camera')}>📷 <span>CAMERA</span></button><button className={activeTab==='together'?'active':''} onClick={()=>setActiveTab('together')}>♡ <span>TOGETHER</span>{roomStatus==='connected'&&<i className="tab-live-dot"/>}</button></nav><button className="top-pill" onClick={() => setShowGallery(!showGallery)}>MY ROLL <span className="roll-count">{gallery.length}</span></button><button className="settings-icon-button" onClick={()=>setSettingsOpen(true)} aria-label="Open settings" title="Settings"><span></span><span></span><span></span></button></div>
      </header>

      <main>
        
        {activeTab === 'camera' && <><section className="intro"><div><h1>Y2K Camera</h1><p>A little digital camera for keeping the good bits.</p></div><div className="appearance-bar"><label>STYLE<select value={style} onChange={e=>setStyle(e.target.value)}>{STYLES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>THEME<select value={theme} onChange={e=>setTheme(e.target.value)}>{THEMES.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label></div></section>

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
            <div className="quick-tools"><button onClick={toggleFullscreen}>⛶ Fullscreen</button><button onClick={togglePiP}>▣ Picture-in-picture</button><button onClick={testSpeaker}>♫ Test speaker</button><button onClick={undoLastShot} disabled={!shots.length}>↶ Undo last</button></div>
            <div className="capture-preferences"><label>CAMERA QUALITY<select value={cameraQuality} onChange={e=>{setCameraQuality(e.target.value);startCamera(facing,e.target.value);}}><option value="480p">480p · Low data</option><option value="720p">720p · Balanced</option><option value="1080p">1080p · High</option></select></label><label>PREVIEW SHAPE<select value={previewRatio} onChange={e=>setPreviewRatio(e.target.value)}><option value="16/9">Widescreen</option><option value="4/3">Classic</option><option value="1/1">Square</option></select></label></div>
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
            <section className="camera-options-panel"><div className="camera-options-heading"><div><span>CAMERA OPTIONS</span><small>Fine-tune your preview</small></div><span className="camera-option-count">05 CONTROLS</span></div>
              <div className="camera-option-toggles"><label><input type="checkbox" checked={mirrorPreview} onChange={e=>setMirrorPreview(e.target.checked)}/> Mirror selfie</label><label><input type="checkbox" checked={showGrid} onChange={e=>setShowGrid(e.target.checked)}/> Composition grid</label><label><input type="checkbox" checked={dateStamp} onChange={e=>setDateStamp(e.target.checked)}/> Date overlay</label><label><input type="checkbox" checked={lowLight} onChange={e=>setLowLight(e.target.checked)}/> Low-light guide</label></div>
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
            <section className="settings-section settings-appearance-section"><span className="settings-kicker">APPEARANCE</span><label className="setting-label">WEBSITE STYLE</label><select value={style} onChange={e=>setStyle(e.target.value)}>{STYLES.map(s=><option key={s.id} value={s.id}>{s.name} — {s.description}</option>)}</select><label className="setting-label">COLOUR THEME</label><select value={theme} onChange={e=>setTheme(e.target.value)}>{THEMES.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
            <div className="settings-theme-preview"><span className="theme-preview-chip"></span><div><b>{STYLES.find(s=>s.id===style)?.name}</b><small>{THEMES.find(t=>t.id===theme)?.name} colour theme</small></div></div>
            <button className="settings-reset" onClick={()=>{setTheme('silver');setStyle('y2k');setMicEnabled(true);setVideoEnabled(true);setAudioInput('');setVideoInput('');setAudioOutput('');}}>RESET SETTINGS</button></section></div>
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
          {gallery.length===0 ? <p className="gallery-empty">Your roll is empty. Go make a moment.</p> : <div className="gallery-actions"><button onClick={downloadAllPhotos}>DOWNLOAD ALL ({gallery.length})</button><button onClick={clearGallery}>DELETE ALL</button></div><div className="gallery-grid">{gallery.map(item=><div className="gallery-item" key={item.id}><img src={item.data} alt="Saved camera roll photo"/><div><span>{item.filter}</span><button onClick={()=>saveImage(item.data,'y2k-'+item.id+'.jpg')}>↓</button><button onClick={()=>deleteGalleryItem(item.id)}>×</button></div></div>)}</div>}
        </section>
        </>}
        {activeTab === 'together' && <section className="together-panel">
          <div className="section-head"><span><i className="tiny-square pink"></i> TOGETHER MODE</span><span className="mono-label">PRIVATE ROOM</span></div>
          <div className="together-intro"><div><span className="room-kicker">6-CHARACTER ROOM CODE · WEBRTC</span><h2>Two cameras. One little moment.</h2><p>Create a room, share the six-character code, and take pictures together from anywhere.</p></div><span className="room-status"><i className={roomStatus==='connected'?'connected':''}></i>{roomStatus==='connected'?'CONNECTED':roomStatus==='waiting'?'WAITING FOR YOUR PERSON':roomStatus==='joining'?'JOINING…':roomStatus==='starting'?'CREATING ROOM…':roomStatus==='error'?'CHECK CONNECTION':'NOT IN A ROOM'}</span></div>
          {roomStatus==='idle' || roomStatus==='error' ? <div className="room-entry">
            <div className="room-create"><span className="room-number">01 / HOST</span><h3>Start a private room</h3><p>Generate a 6-character code to share with your person.</p><button className="primary-button" onClick={createRoom}>GENERATE ROOM CODE ↗</button></div>
            <div className="room-join"><span className="room-number">02 / JOIN</span><h3>Got an invite?</h3><p>Enter the 6-character code they sent you.</p><input value={joinInput} onChange={e=>setJoinInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0,6))} placeholder="e.g. K7M2QX" maxLength={6} autoComplete="off" /><button className="secondary-room-button" onClick={joinRoom}>JOIN ROOM ↗</button></div>
          </div> : <div className="room-active">
            {roomCode && <div className="invite-box"><div><span className="room-number">YOUR ROOM CODE</span><code className="room-code-display">{roomCode}</code></div><button className="primary-button" onClick={copyRoomCode}>COPY CODE ↗</button><button className="secondary-room-button" onClick={copyInvite}>COPY INVITE MESSAGE</button></div>}
            {incomingCall && <div className="incoming-invite"><div><b>♡ SOMEONE WANTS TO JOIN</b><span>They are asking to join your private camera room.</span></div><button className="primary-button" onClick={acceptIncomingCall}>ACCEPT ↗</button><button className="secondary-room-button" onClick={rejectIncomingCall}>DECLINE ×</button></div>}
            <div className="room-view-tabs"><button className={roomMode==='call'?'active':''} onClick={()=>setRoomMode('call')}>VIDEO CALL</button><button className={roomMode==='camera'?'active':''} onClick={()=>setRoomMode('camera')}>CAMERA TOGETHER</button></div>
            <div className="together-device-controls"><button className={cx("meet-control",micEnabled&&"is-on")} onClick={toggleMic} aria-pressed={micEnabled}><span className="meet-control-icon">{micEnabled?"🎙":"🔇"}</span>{micEnabled?"MIC ON":"MIC OFF"}</button><button className={cx("meet-control",videoEnabled&&"is-on")} onClick={toggleVideo} aria-pressed={videoEnabled}><span className="meet-control-icon">{videoEnabled?"▣":"▧"}</span>{videoEnabled?"CAMERA ON":"CAMERA OFF"}</button><button className="secondary-room-button" onClick={switchCamera}>SWITCH CAMERA ↔</button></div>
            <div className="room-feeds">
              <div className="room-feed"><video ref={localRoomVideoRef} autoPlay muted playsInline style={{filter:filterAtIntensity(togetherActiveFilter.css,togetherIntensity)}}/><span>YOU · CAM 01</span></div>
              <div className="room-feed remote-feed">{remoteReady ? <video ref={remoteVideoRef} autoPlay playsInline style={{filter:filterAtIntensity(remoteActiveFilter.css,remoteFilter.intensity)}}/> : <div className="waiting-feed"><b>♡</b><span>WAITING FOR YOUR PERSON</span><small>Share your 6-character room code</small></div>}<span>YOUR PERSON · CAM 02</span></div>
            </div>
            {roomMode==='call' ? <div className="room-call-controls"><span>{remoteReady?'YOU ARE BOTH IN THE ROOM':'Your room is ready when they join.'}</span><button className="secondary-room-button" onClick={leaveRoom}>LEAVE ROOM ×</button></div> : <div className="room-camera-controls"><p>Your Together filter is independent from the solo camera. Choose a look below; it applies to your preview and your saved synced photo.</p><button className="primary-button sync-shutter" onClick={syncShutter} disabled={!remoteReady || !dataReady || busy}>◎ SYNC SHUTTER — BOTH CAMERAS</button><button className="secondary-room-button" onClick={leaveRoom}>LEAVE ROOM ×</button></div>}

          </div>
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
