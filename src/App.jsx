import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  List, 
  Mic2, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Clock,
  Upload,
  ExternalLink,
  ChevronDown,
  Heart,
  Sun,
  ChevronLeft,
  ChevronRight,
  Lock,
  ChevronUp
} from 'lucide-react';

// --- DATEN STRUKTUR ---
// Hinweis: Da wir auf GitHub Pages und mit dem 'public' Ordner arbeiten,
// referenzieren wir die Dateien hier direkt als Strings.
const PLAYLIST_CONTENT = {
  morgen: {
    id: 'morgen',
    label: "Playlist am Morgen",
    icon: Sun,
    modFile: "Moderation.mp3",
    modTitle: "Die Lage am Morgen: Das Briefing",
    modAuthors: "Die wichtigsten Themen des Tages im Überblick.",
    articles: [
      {
        id: 1,
        title: "Verhandlungen über Friedenslösung: Hinter den Kulissen warnen die Europäer Selenskyj",
        authors: "Matthias Gebauer, Paul-Anton Krüger",
        modStart: 10,
        modEnd: 27,
        fileName: "Artikel 1.mp3",
        imageFile: "Bild Artikel 1.webp",
        readUrl: "https://www.spiegel.de/politik/deutschland/ukraine-gespraeche-hinter-den-kulissen-warnen-die-europaeer-selenskyj-a-08c9846e-6af5-4c69-b53a-8e802dc7aa77"
      },
      {
        id: 2,
        title: "Angeblicher Angriff auf Putins Residenz: Die drei großen Ungereimtheiten",
        authors: "Ann-Dorit Boy",
        modStart: 28,
        modEnd: 45,
        fileName: "Artikel 2.mp3",
        imageFile: "Bild Artikel 2.webp",
        readUrl: "https://www.spiegel.de/ausland/wladimir-putin-angeblicher-angriff-auf-residenz-zweifel-an-russischen-vorwuerfen-91-angeblich-abgewehrte-drohnen-und-viele-ungereimtheiten-a-456e4e4f-9dc5-4e22-ad75-a82d8e4b1934"
      },
      {
        id: 3,
        title: "US-Sanktionen gegen Deutsche: »Diese Regierung ist zu allem fähig«",
        authors: "Wolf Wiedmann-Schmidt",
        modStart: 46,
        modEnd: 60,
        fileName: "Artikel 3.mp3",
        imageFile: "Bild Artikel 3.webp",
        readUrl: "https://www.spiegel.de/politik/deutschland/sanktionen-gegen-hate-aid-weitere-us-massnahmen-gegen-deutsche-befuerchtet-a-e0c8b6d9-95e2-4e76-8360-4ea9e3e1dc3d"
      },
      {
        id: 4,
        title: "Preissprünge 2025: Butter, Kaffee, Kakao",
        authors: "Michael Kröger",
        modStart: 61,
        modEnd: 77,
        fileName: "Artikel 4.mp3",
        imageFile: "Bild Artikel 4.webp",
        readUrl: "https://www.manager-magazin.de/unternehmen/handel/inflation-das-waren-die-groessten-preisspruenge-bei-lebensmitteln-2025-1767088287-a-69823e02-dac4-476e-bfec-c8e695bb6e86"
      },
      {
        id: 5,
        title: "Alkoholfolgen: Das hilft Ihnen gegen den Kater",
        authors: "Simon Maurer",
        modStart: 79,
        modEnd: 106,
        fileName: "Artikel 5.mp3",
        imageFile: "Bild Artikel 5.webp",
        readUrl: "https://www.spiegel.de/gesundheit/alkohol-das-taugen-die-neuen-anti-kater-mittel-aus-asien-a-0ef45fa2-4fb7-4710-b0d3-3f6f07a4d741"
      },
      {
        id: 6,
        title: "FITNESS: Wie Ihre Muskeln die richtige Balance finden",
        authors: "Anne Paulsen",
        modStart: 107,
        modEnd: 133,
        fileName: "Artikel 6.mp3",
        imageFile: "Bild Artikel 6.webp",
        readUrl: "https://www.spiegel.de/fitness/balance-beim-muskeltraining-uebungen-fuer-laeufer-radsportler-und-fussballer-a-793e40f3-e682-4fec-b8b1-02bdba58cf43"
      }
    ]
  },
  liebe: {
    id: 'liebe',
    label: "Playlist der Liebe",
    icon: Heart,
    modFile: "Moderation Liebe.mp3",
    modTitle: "SPIEGEL Loveletter",
    modAuthors: "Psychologie & Partnerschaft – Die wichtigsten Erkenntnisse.",
    articles: [
      {
        id: 1,
        title: "Wie Sie erkennen, was Ihr Partner oder Ihre Partnerin wirklich mag",
        authors: "Sonja Bröning",
        modStart: 22,
        modEnd: 40,
        fileName: "Artikel 1 Liebe.mp3",
        readUrl: "https://www.spiegel.de/psychologie/fuenf-sprachen-der-liebe-wie-sie-erkennen-was-ihr-partner-oder-ihre-partnerin-wirklich-mag-a-5c2f582b-6ca0-4e3a-96e0-24a35041f644"
      },
      {
        id: 2,
        title: "Ich koche für Tina. Das ist meine Art, zu sagen: Ich liebe dich",
        authors: "Viktor Szukitsch",
        modStart: 41,
        modEnd: 56,
        fileName: "Artikel 2 Liebe.mp3",
        readUrl: "https://www.spiegel.de/psychologie/spiegel-loveletter-ich-koche-fuer-tina-das-ist-meine-art-zu-sagen-ich-liebe-dich-a-733f3809-54d9-4b62-b91c-1481e1933e45"
      },
      {
        id: 3,
        title: "Über diese Themen sollten Sie sprechen, bevor Sie sich verlieben",
        authors: "Eva Wlodarek",
        modStart: 57,
        modEnd: 75,
        fileName: "Artikel 3 Liebe.mp3",
        readUrl: "https://www.spiegel.de/psychologie/spiegel-loveletter-ueber-diese-themen-sollten-sie-sprechen-bevor-sie-sich-verlieben-a-f3265886-0929-4e12-8d77-62f97486e96f"
      },
      {
        id: 4,
        title: "Gleichberechtigung: Diese beiden haben geschafft, wovon andere träumen",
        authors: "Krishna Pandit und Shruthi Hangal",
        modStart: 76,
        modEnd: 94, 
        fileName: "Artikel 4 Liebe.mp3",
        readUrl: "https://www.spiegel.de/psychologie/gleichberechtigung-in-der-partnerschaft-diese-beiden-haben-geschafft-wvovon-andere-traeumen-a-76d499ed-be02-4029-9e80-8733230a108a"
      },
      {
        id: 5,
        title: "Am tiefsten Punkt unserer Beziehung heilte uns der Nackturlaub",
        authors: "Hanna Zobel",
        modStart: 95,
        modEnd: 112, 
        fileName: "Artikel 5 Liebe.mp3",
        readUrl: "https://www.spiegel.de/psychologie/beziehungskrise-am-tiefsten-punkt-unserer-beziehung-heilte-uns-der-nackturlaub-a-6943b17c-2191-4993-80f4-5f1655be23c4"
      },
      {
        id: 6,
        title: "So bewahren Sie den Spaß in Ihrer Beziehung",
        authors: "Anne Ahnis",
        modStart: 113,
        modEnd: 129,
        fileName: "Artikel 6 Liebe.mp3",
        readUrl: "https://www.spiegel.de/psychologie/spiegel-loveletter-so-bewahren-sie-den-spass-in-ihrer-beziehung-a-096895e6-ec18-466d-9be2-49da43292419"
      },
      {
        id: 7,
        title: "Benjamin Maack über das späte Glück",
        authors: "Benjamin Maack",
        modStart: 130,
        modEnd: 146,
        fileName: "Artikel 7 Liebe.mp3",
        readUrl: "https://www.spiegel.de/psychologie/spiegel-loveletter-benjamin-maack-ueber-das-spaete-glueck-a-2007823b-3195-48b4-938b-d54d24a9194e"
      }
    ]
  }
};

const App = () => {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // App State
  const [activePlaylist, setActivePlaylist] = useState('morgen'); 
  const [activeMode, setActiveMode] = useState('moderation'); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentArticleIdx, setCurrentArticleIdx] = useState(0);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  
  // Audio State
  const [modTime, setModTime] = useState(0);
  const [artTime, setArtTime] = useState(0);
  const [modDuration, setModDuration] = useState(0);
  const [artDuration, setArtDuration] = useState(0);
  
  // File Management State
  const [error, setError] = useState(null);
  const [needsFileLink, setNeedsFileLink] = useState(false);
  const [userFiles, setUserFiles] = useState({});

  const modAudioRef = useRef(null);
  const artAudioRef = useRef(null);

  const currentData = PLAYLIST_CONTENT[activePlaylist];

  const getSrc = (defaultName) => {
    // 1. Wenn Nutzer Datei manuell gewählt hat (Fallback für lokale Tests)
    if (userFiles[defaultName]) return userFiles[defaultName];
    // 2. Standard: Wir gehen davon aus, dass die Datei im public-Ordner liegt
    return defaultName;
  };

  const activeMarkerIdx = useMemo(() => {
    if (!currentData || !currentData.articles) return -1;
    return currentData.articles.findIndex(a => modTime >= a.modStart && modTime <= a.modEnd);
  }, [modTime, currentData]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.toLowerCase().trim() === 'spiegel') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  // Reset Player when switching Playlists
  useEffect(() => {
    setIsPlaying(false);
    setCurrentArticleIdx(0);
    setActiveMode('moderation');
    setModTime(0);
    setArtTime(0);
    if (modAudioRef.current) {
        modAudioRef.current.currentTime = 0;
        modAudioRef.current.load();
    }
    if (artAudioRef.current) {
        artAudioRef.current.currentTime = 0;
        artAudioRef.current.load();
    }
  }, [activePlaylist]);

  useEffect(() => {
    const handlePlayback = async () => {
      if (!isAuthenticated) return;

      try {
        const activeRef = activeMode === 'moderation' ? modAudioRef.current : artAudioRef.current;
        const inactiveRef = activeMode === 'moderation' ? artAudioRef.current : modAudioRef.current;

        if (inactiveRef) inactiveRef.pause();

        if (isPlaying && activeRef) {
          if (activeRef.readyState === 0) activeRef.load();
          const p = activeRef.play();
          if (p !== undefined) {
            await p;
            setError(null);
          }
        } else if (!isPlaying && activeRef) {
          activeRef.pause();
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Playback failed:", err);
          setNeedsFileLink(true);
          setIsPlaying(false);
        }
      }
    };
    handlePlayback();
  }, [isPlaying, activeMode, currentArticleIdx, userFiles, activePlaylist, isAuthenticated]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const jumpToArticle = () => {
    const idx = activeMarkerIdx !== -1 ? activeMarkerIdx : currentArticleIdx;
    setCurrentArticleIdx(idx);
    setActiveMode('article');
    setIsPlaying(true);
    if (artAudioRef.current) artAudioRef.current.currentTime = 0;
  };

  const backToOverview = () => {
    setActiveMode('moderation');
    if (modAudioRef.current) {
        modAudioRef.current.currentTime = currentData.articles[currentArticleIdx].modStart;
    }
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (activeMode === 'moderation') {
      const nextArticle = currentData.articles.find(a => a.modStart > modTime + 1);
      if (nextArticle && modAudioRef.current) {
        modAudioRef.current.currentTime = nextArticle.modStart;
        setIsPlaying(true);
      }
    } else {
      if (currentArticleIdx < currentData.articles.length - 1) {
        setCurrentArticleIdx(prev => prev + 1);
        setIsPlaying(true);
      }
    }
  };

  const handlePrev = () => {
     if (activeMode === 'moderation') {
       const tolerance = 2; 
       const prevArticle = [...currentData.articles].reverse().find(a => a.modStart < modTime - tolerance);
       
       if (prevArticle && modAudioRef.current) {
         modAudioRef.current.currentTime = prevArticle.modStart;
         setIsPlaying(true);
       } else if (modAudioRef.current) {
         modAudioRef.current.currentTime = 0;
       }
     } else {
        if (currentArticleIdx > 0) {
            setCurrentArticleIdx(prev => prev - 1);
            setIsPlaying(true);
        }
     }
  };

  const handleAudioError = (e, fileName) => {
    const err = e.currentTarget.error;
    if (err && err.code === 4) {
      if (!userFiles[fileName]) {
        setNeedsFileLink(true);
        setError(`Datei nicht gefunden: ${fileName}`);
      }
    }
    setIsPlaying(false);
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    const newMap = { ...userFiles };
    Array.from(files).forEach(file => {
      newMap[file.name] = URL.createObjectURL(file);
    });
    setUserFiles(newMap);
    setNeedsFileLink(false);
    setError(null);
    setIsPlaying(false); 
  };

  // Swipe handling
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchEndY, setTouchEndY] = useState(null);
  
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEndY(null);
    setTouchStartY(e.targetTouches[0].clientY);
  }
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  }
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart - touchEnd;
    const distanceY = touchStartY - touchEndY;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    } else {
        if (isDownSwipe && activeMode === 'moderation' && activeMarkerIdx !== -1) {
            jumpToArticle();
        } else if (isUpSwipe && activeMode === 'article') {
            backToOverview();
        }
    }
  }

  // --- LOGIN SCREEN RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex flex-col items-center justify-center p-4 font-sans text-slate-900">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-sm border border-slate-200">
          <div className="flex flex-col items-center mb-8">
            <img 
               src={getSrc('image_2dc4c5.png')} 
               alt="SPIEGEL" 
               className="h-10 object-contain mb-6"
               onError={(e) => e.target.style.display = 'none'}
            />
            <span className="text-red-600 font-black text-3xl tracking-tighter mb-1">SPIEGEL</span>
            <span className="text-slate-400 font-light text-sm tracking-widest uppercase">Audio Prototyp</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Zugangscode</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-serif"
                  placeholder="Passwort eingeben"
                  autoFocus
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {loginError && (
              <div className="text-red-600 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} />
                <span>Falsches Passwort. Bitte erneut versuchen.</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors uppercase tracking-wide text-sm shadow-md"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN APP RENDER ---
  let displayIndex = null;
  if (activeMode === 'article') {
    displayIndex = currentArticleIdx + 1;
  } else if (activeMode === 'moderation' && activeMarkerIdx !== -1) {
    displayIndex = activeMarkerIdx + 1;
  }

  const currentArticleForImage = activeMode === 'moderation' && activeMarkerIdx !== -1 
    ? currentData.articles[activeMarkerIdx] 
    : activeMode === 'article'
      ? currentData.articles[currentArticleIdx]
      : null;

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-slate-900 font-sans selection:bg-red-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <img 
               src={getSrc('image_2dc4c5.png')} 
               alt="SPIEGEL" 
               className="h-8 md:h-10 object-contain"
               onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
             />
             <span className="hidden text-red-600 font-black text-2xl tracking-tighter">SPIEGEL</span>
             <span className="hidden md:inline text-slate-400 font-light border-l border-slate-300 pl-4 text-sm tracking-wide uppercase">Audio</span>
          </div>
          
          <div className="relative">
             <button 
                onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                className="flex items-center gap-2 text-slate-900 font-bold text-sm tracking-wide hover:text-red-600 transition-colors h-16"
             >
                <List size={18} />
                <span>PLAYLISTS</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showPlaylistMenu ? 'rotate-180' : ''}`} />
             </button>

             {showPlaylistMenu && (
               <div className="absolute right-0 top-full mt-0 w-64 bg-white shadow-xl border border-slate-200 rounded-b-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                 <div className="py-2">
                   {Object.values(PLAYLIST_CONTENT).map(pl => (
                     <button
                       key={pl.id}
                       onClick={() => {
                         setActivePlaylist(pl.id);
                         setShowPlaylistMenu(false);
                       }}
                       className={`w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${activePlaylist === pl.id ? 'text-red-600 font-bold bg-red-50/50' : 'text-slate-700'}`}
                     >
                       <pl.icon size={18} />
                       {pl.label}
                     </button>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Fallback File Linker */}
        {needsFileLink && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-orange-600 shrink-0 mt-1" size={24} />
              <div className="space-y-3 flex-1">
                <h3 className="text-slate-900 font-bold text-lg font-serif">Dateizugriff erforderlich</h3>
                <p className="text-slate-700 text-sm leading-relaxed max-w-2xl">
                  Bitte stellen Sie sicher, dass alle Audio-Dateien (auch für die neue Playlist) im public-Ordner verfügbar sind.
                </p>
                <label className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 text-sm font-bold hover:bg-slate-700 transition-colors cursor-pointer">
                  <Upload size={16} />
                  <span>Dateien verknüpfen</span>
                  <input type="file" multiple accept="audio/*,image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Active Player */}
          <div className="lg:col-span-7 space-y-8">
            
            <div>
               <div className="flex items-center gap-3 mb-4">
                 <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                   <List size={10} />
                   {currentData.label}
                 </span>
               </div>

               {/* Image Display */}
               <div className="relative aspect-[16/9] bg-slate-100 rounded-lg overflow-hidden mb-4 group">
                 {currentArticleForImage && currentArticleForImage.imageFile ? (
                   <>
                     <a 
                       href={currentArticleForImage.readUrl || "#"} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="block w-full h-full relative"
                       onTouchStart={onTouchStart}
                       onTouchMove={onTouchMove}
                       onTouchEnd={onTouchEnd}
                     >
                       <img 
                         src={getSrc(currentArticleForImage.imageFile)} 
                         alt={currentArticleForImage.title}
                         className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                       />
                       
                       <div className="absolute top-4 left-4 flex items-center justify-center w-12 h-12 border-2 border-white rounded-full text-white font-serif font-bold text-2xl bg-black/30 backdrop-blur-sm z-10">
                         {displayIndex}
                       </div>

                       {activeMode === 'moderation' && (
                         <div 
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); jumpToArticle(); }}
                         >
                            <div className="bg-black/50 hover:bg-red-600 text-white p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm animate-bounce">
                                <ChevronDown size={28} />
                            </div>
                         </div>
                       )}

                       {activeMode === 'article' && (
                         <div 
                            className="absolute top-4 right-1/2 translate-x-1/2 z-20"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); backToOverview(); }}
                         >
                            <div className="bg-black/50 hover:bg-slate-700 text-white p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm">
                                <ChevronUp size={28} />
                            </div>
                         </div>
                       )}
                     </a>

                     {/* Desktop Arrows */}
                     <div className="hidden md:block absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                       <button onClick={handlePrev} className={`p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 transition-colors shadow-lg`}>
                         <ChevronLeft size={24} />
                       </button>
                     </div>
                     <div className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                       <button onClick={handleNext} className={`p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 transition-colors shadow-lg`}>
                         <ChevronRight size={24} />
                       </button>
                     </div>
                   </>
                 ) : (
                   // Fallback Text View (wenn kein Bild)
                   <div className="flex gap-4 items-start p-4">
                      {displayIndex ? (
                        <div className="shrink-0 w-12 h-12 flex items-center justify-center border-2 border-slate-900 rounded-full text-slate-900 font-serif font-bold text-2xl mt-1">
                          {displayIndex}
                        </div>
                      ) : (
                        <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-slate-100 rounded-full text-slate-400 mt-1">
                          <Mic2 size={24} />
                        </div>
                      )}

                      <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight text-slate-900">
                          {activeMode === 'moderation' 
                              ? (activeMarkerIdx !== -1 ? currentData.articles[activeMarkerIdx].title : currentData.modTitle)
                              : currentData.articles[currentArticleIdx].title
                          }
                        </h1>
                        <p className="text-slate-600 text-lg mt-3 font-serif italic pl-1">
                          {activeMode === 'moderation' 
                            ? (activeMarkerIdx !== -1 ? currentData.articles[activeMarkerIdx].authors : currentData.modAuthors)
                            : currentData.articles[currentArticleIdx].authors
                          }
                        </p>
                      </div>
                   </div>
                 )}
               </div>
            </div>

            {/* Player UI */}
            <div className="bg-white border border-slate-200 shadow-sm p-6 md:p-8 relative">
               <h4 className="text-sm font-serif font-bold text-slate-900 text-center mb-4 truncate px-4">
                  {activeMode === 'moderation' 
                      ? (activeMarkerIdx !== -1 ? currentData.articles[activeMarkerIdx].title : currentData.modTitle)
                      : currentData.articles[currentArticleIdx].title
                  }
               </h4>

               <div className="mb-6 md:mb-10">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                     <span>{formatTime(activeMode === 'moderation' ? modTime : artTime)}</span>
                     <span>{formatTime(activeMode === 'moderation' ? modDuration : artDuration)}</span>
                  </div>
                  
                  <div className="relative h-12 flex items-center cursor-pointer">
                     <div className="absolute w-full h-1 bg-slate-200"></div>
                     <div className="absolute h-1 bg-red-600 z-10 transition-all duration-300" style={{ width: `${((activeMode === 'moderation' ? modTime : artTime) / (activeMode === 'moderation' ? (modDuration || 1) : (artDuration || 1))) * 100}%` }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-md"></div>
                     </div>
                     <input 
                       type="range"
                       min="0"
                       max={activeMode === 'moderation' ? (modDuration || 0) : (artDuration || 0)}
                       step="0.1"
                       value={activeMode === 'moderation' ? modTime : artTime}
                       onChange={(e) => {
                         const val = parseFloat(e.target.value);
                         if (activeMode === 'moderation') { if (modAudioRef.current) modAudioRef.current.currentTime = val; }
                         else { if (artAudioRef.current) artAudioRef.current.currentTime = val; }
                       }}
                       className="absolute w-full h-full opacity-0 cursor-pointer z-40"
                     />
                  </div>
               </div>

               <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                  <div className="flex items-center justify-center gap-6 w-full md:w-auto">
                     <button onClick={handleRewind} className="text-slate-400 hover:text-slate-900 transition-colors"><SkipBack size={24} strokeWidth={1.5} /></button>
                     <button onClick={togglePlay} className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                     </button>
                     <button onClick={handleNext} className="text-slate-400 hover:text-slate-900 transition-colors"><SkipForward size={24} strokeWidth={1.5} /></button>
                  </div>

                  <div className="flex-1 flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                     {activeMode === 'moderation' && activeMarkerIdx !== -1 && (
                        <>
                           <button onClick={jumpToArticle} className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all group">
                              <span>ARTIKEL HÖREN</span> <ArrowRight size={18} />
                           </button>
                           {currentData.articles[activeMarkerIdx].readUrl && (
                              <a href={currentData.articles[activeMarkerIdx].readUrl} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider hover:text-red-600 transition-colors">
                                 <span>ARTIKEL LESEN</span> <ExternalLink size={14} />
                              </a>
                           )}
                        </>
                     )}
                     
                     {activeMode === 'article' && (
                        <div className="flex flex-col items-center md:items-end gap-2">
                           <button onClick={backToOverview} className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase tracking-wider hover:text-slate-900 transition-all">
                              <ArrowLeft size={18} /> <span>Zur Übersicht</span>
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
            
            <div className="bg-slate-100 p-6 text-sm text-slate-600 leading-relaxed font-serif">
              <span className="font-bold text-slate-900 block mb-2 font-sans text-xs uppercase tracking-widest">Hinweis zur Nutzung</span>
              Sie befinden sich im {activeMode === 'moderation' ? 'Playlist-Modus' : 'Artikel-Modus'}.
            </div>
          </div>

          {/* RIGHT: List */}
          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2"><List size={16} className="text-red-600" /> Inhalt der Playlist</h3>
               <span className="text-xs font-mono text-slate-400">{currentData.articles.length} Beiträge</span>
            </div>
            <div className="divide-y divide-slate-100">
               {currentData.articles.map((article, idx) => {
                 const isPlayingThis = activeMode === 'article' && currentArticleIdx === idx;
                 const isModerationFocus = activeMode === 'moderation' && activeMarkerIdx === idx;
                 return (
                   <button key={article.id} onClick={() => { setCurrentArticleIdx(idx); setActiveMode('article'); setIsPlaying(true); }} className={`w-full text-left p-5 transition-all group hover:bg-slate-50 flex gap-4 ${isPlayingThis ? 'bg-slate-50' : ''} ${isModerationFocus ? 'bg-red-50/30' : ''}`}>
                     <div className="shrink-0 pt-1">
                        {isPlayingThis ? <div className="w-6 h-6 flex items-center justify-center"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div></div> :
                         isModerationFocus ? <div className="w-6 h-6 flex items-center justify-center border border-red-200 text-red-600 text-xs font-bold rounded-full"><Mic2 size={12} /></div> :
                         <span className="text-slate-300 font-serif text-lg italic group-hover:text-red-400">{idx + 1}</span>}
                     </div>
                     <div className="space-y-1">
                        <h4 className={`text-base font-serif font-medium leading-snug ${isPlayingThis || isModerationFocus ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>{article.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 uppercase tracking-wide">
                           <span>{article.authors ? article.authors.split(',')[0] : 'Spiegel Audio'}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span className="flex items-center gap-1"><Clock size={10} /> {formatTime(article.modEnd - article.modStart)}</span>
                        </div>
                     </div>
                   </button>
                 );
               })}
            </div>
          </div>
        </main>

        <div className="hidden">
          <audio ref={modAudioRef} src={getSrc(currentData.modFile)} onLoadedMetadata={(e) => setModDuration(e.target.duration)} onTimeUpdate={(e) => setModTime(e.target.currentTime)} onEnded={() => setIsPlaying(false)} onError={(e) => handleAudioError(e, currentData.modFile)} />
          <audio ref={artAudioRef} src={getSrc(currentData.articles[currentArticleIdx].fileName)} onLoadedMetadata={(e) => setArtDuration(e.target.duration)} onTimeUpdate={(e) => setArtTime(e.target.currentTime)} onEnded={() => { if (currentArticleIdx < currentData.articles.length - 1) { setCurrentArticleIdx(prev => prev + 1); } else { setIsPlaying(false); } }} onError={(e) => handleAudioError(e, currentData.articles[currentArticleIdx].fileName)} />
        </div>
      </div>
    </div>
  );
};

export default App;