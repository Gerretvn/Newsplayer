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
  ChevronUp,
  Menu,
  Share2,
  Plus,
  X,
  Search,
  History,
  Link as LinkIcon,
  Lightbulb,
  MessageCircle,
  HelpCircle,
  FileQuestion,
  Gauge // Icon für Geschwindigkeit
} from 'lucide-react';

// --- DATEI IMPORT LOGIK ---
let importedFiles = {};
try {
  importedFiles = {
    logo: require('./image_2dc4c5.png'),
    // Morgen Playlist Audio
    mod_morgen: require('./Moderation.mp3'),
    art1_morgen: require('./Artikel 1.mp3'),
    art2_morgen: require('./Artikel 2.mp3'),
    art3_morgen: require('./Artikel 3.mp3'),
    art4_morgen: require('./Artikel 4.mp3'),
    art5_morgen: require('./Artikel 5.mp3'),
    art6_morgen: require('./Artikel 6.mp3'),
    // Bilder
    img1_morgen: require('./Bild Artikel 1.webp'),
    img2_morgen: require('./Bild Artikel 2.webp'),
    img2_2_morgen: require('./Bild 2 Artikel 2.png'),
    img3_morgen: require('./Bild Artikel 3.webp'),
    img4_morgen: require('./Bild Artikel 4.webp'),
    img5_morgen: require('./Bild Artikel 5.webp'),
    img6_morgen: require('./Bild Artikel 6.webp'),
  };
} catch (e) {
  importedFiles = { logo: "image_2dc4c5.png" };
}

// --- DATEN STRUKTUR ---
const PLAYLIST_CONTENT = {
  morgen: {
    id: 'morgen',
    label: "Playlist am Morgen",
    icon: Sun,
    modFile: "Moderation.mp3",
    modTitle: "Playlist am Morgen",
    modAuthors: "Die wichtigsten Themen des Tages im Überblick.",
    articles: [
      {
        id: 1,
        title: "Verhandlungen über Friedenslösung: Hinter den Kulissen warnen die Europäer Selenskyj",
        authors: "Matthias Gebauer, Paul-Anton Krüger",
        modStart: 10,
        modEnd: 28, 
        fileName: "Artikel 1.mp3",
        imageFile: "Bild Artikel 1.webp",
        readUrl: "https://www.spiegel.de/politik/deutschland/ukraine-gespraeche-hinter-den-kulissen-warnen-die-europaeer-selenskyj-a-08c9846e-6af5-4c69-b53a-8e802dc7aa77",
        context: [
          { id: 1, title: "Wie ist der aktuelle Stand der Friedensverhandlungen zwischen der Ukraine, Russland und den USA?", fileName: "Kontext 1 Artikel 1.mp3" },
          { id: 2, title: "Welche zentralen Streitpunkte stehen einer Einigung aktuell noch im Weg?", fileName: "Kontext 2 Artikel 1.mp3" },
          { id: 3, title: "Welche Hauptforderungen stellt die Ukraine für Friedensverhandlungen?", fileName: "Kontext 3 Artikel 1.mp3" },
          { id: 4, title: "Wie verhalten sich Russland und die Ukraine zu möglichen Gebietsabtretungen?", fileName: "Kontext 4 Artikel 1.mp3" },
          { id: 5, title: "Wie geht es in den nächsten Wochen und Monaten bei den Verhandlungen weiter?", fileName: "Kontext 5 Artikel 1.mp3" }
        ]
      },
      {
        id: 2,
        title: "Angeblicher Angriff auf Putins Residenz: Die drei großen Ungereimtheiten",
        authors: "Ann-Dorit Boy",
        modStart: 28,
        modEnd: 46,
        fileName: "Artikel 2.mp3",
        imageFile: "Bild Artikel 2.webp",
        readUrl: "https://www.spiegel.de/ausland/wladimir-putin-angeblicher-angriff-auf-residenz-zweifel-an-russischen-vorwuerfen-91-angeblich-abgewehrte-drohnen-und-viele-ungereimtheiten-a-456e4e4f-9dc5-4e22-ad75-a82d8e4b1934",
        secondaryImages: [
          { 
            startTime: 40, 
            imageFile: "Bild 2 Artikel 2.png", 
            fileKey: "img2_2_morgen",
            restrictMode: 'moderation'
          }
        ]
      },
      {
        id: 3,
        title: "US-Sanktionen gegen Deutsche: »Diese Regierung ist zu allem fähig«",
        authors: "Wolf Wiedmann-Schmidt",
        modStart: 46,
        modEnd: 61,
        fileName: "Artikel 3.mp3",
        imageFile: "Bild Artikel 3.webp",
        readUrl: "https://www.spiegel.de/politik/deutschland/sanktionen-gegen-hate-aid-weitere-us-massnahmen-gegen-deutsche-befuerchtet-a-e0c8b6d9-95e2-4e76-8360-4ea9e3e1dc3d"
      },
      {
        id: 4,
        title: "Preissprünge 2025: Butter, Kaffee, Kakao",
        authors: "Michael Kröger",
        modStart: 61,
        modEnd: 79,
        fileName: "Artikel 4.mp3",
        imageFile: "Bild Artikel 4.webp",
        readUrl: "https://www.manager-magazin.de/unternehmen/handel/inflation-das-waren-die-groessten-preisspruenge-bei-lebensmitteln-2025-1767088287-a-69823e02-dac4-476e-bfec-c8e695bb6e86"
      },
      {
        id: 5,
        title: "Alkoholfolgen: Das hilft Ihnen gegen den Kater",
        authors: "Simon Maurer",
        modStart: 79,
        modEnd: 107,
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
        imageFile: "Bild Artikel 1 Liebe.png",
        readUrl: "https://www.spiegel.de/partnerschaft/beziehung-wie-sie-erkennen-was-ihr-partner-oder-ihre-partnerin-wirklich-mag-a-5d40b34b-1c96-45d0-b914-0884de7532c2"
      },
      {
        id: 2,
        title: "Ich koche für Tina. Das ist meine Art, zu sagen: Ich liebe dich",
        authors: "Viktor Szukitsch",
        modStart: 41,
        modEnd: 56,
        fileName: "Artikel 2 Liebe.mp3",
        imageFile: "Bild Artikel 2 Liebe.png",
        readUrl: "https://www.spiegel.de/partnerschaft/kochen-als-love-language-wie-ich-meine-frau-ueber-das-essen-lieben-lernte-a-3b5ce60b-c017-4750-a38e-717d1cef4498"
      },
      {
        id: 3,
        title: "Über diese Themen sollten Sie sprechen, bevor Sie sich verlieben",
        authors: "Eva Wlodarek",
        modStart: 57,
        modEnd: 75,
        fileName: "Artikel 3 Liebe.mp3",
        imageFile: "Bild Artikel 3 Liebe.png",
        readUrl: "https://www.spiegel.de/partnerschaft/erstes-date-fehler-die-sie-vermeiden-sollten-a-6718e8dc-186d-4039-b29f-d2d8ea728d4f"
      },
      {
        id: 4,
        title: "Gleichberechtigung: Diese beiden haben geschafft, wovon andere träumen",
        authors: "Krishna Pandit und Shruthi Hangal",
        modStart: 76,
        modEnd: 94, 
        fileName: "Artikel 4 Liebe.mp3",
        imageFile: "Bild Artikel 4 Liebe.png",
        readUrl: "https://www.spiegel.de/partnerschaft/care-arbeit-dieses-nuernberger-paar-lebt-gleichberechtigt-a-22cf7a35-51c6-4b4b-8a19-c649e481e70b"
      },
      {
        id: 5,
        title: "Am tiefsten Punkt unserer Beziehung heilte uns der Nackturlaub",
        authors: "Hanna Zobel",
        modStart: 95,
        modEnd: 112, 
        fileName: "Artikel 5 Liebe.mp3",
        imageFile: "Bild Artikel 5 Liebe.png",
        readUrl: "https://www.spiegel.de/partnerschaft/naturismus-und-fkk-wie-der-nackturlaub-in-frankreich-meine-beziehung-heilte-a-32de7b87-bedb-47a6-8cd0-9bbc713e9d33"
      },
      {
        id: 6,
        title: "So bewahren Sie den Spaß in Ihrer Beziehung",
        authors: "Anne Ahnis",
        modStart: 113,
        modEnd: 129,
        fileName: "Artikel 6 Liebe.mp3",
        imageFile: "Bild Artikel 6 Liebe.png",
        readUrl: "https://www.spiegel.de/partnerschaft/langzeitbeziehungen-wie-sie-spass-und-leichtigkeit-in-ihre-beziehung-zurueckholen-a-51fef73a-1793-414b-8e93-f40574e5975b"
      },
      {
        id: 7,
        title: "Benjamin Maack über das späte Glück",
        authors: "Benjamin Maack",
        modStart: 130,
        modEnd: 146,
        fileName: "Artikel 7 Liebe.mp3",
        imageFile: "Bild Artikel 7 Liebe.png",
        readUrl: "https://www.spiegel.de/partnerschaft/liebe-und-partnerschaft-ploetzlich-so-was-von-verliebt-mit-46-a-6497303d-6118-40ce-804a-c2f91afc311f"
      }
    ]
  }
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [activePlaylist, setActivePlaylist] = useState('morgen'); 
  const [activeMode, setActiveMode] = useState('moderation'); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentArticleIdx, setCurrentArticleIdx] = useState(0);
  const [contextIdx, setContextIdx] = useState(0); 
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [expandedContextId, setExpandedContextId] = useState(null); 
  
  // Neuer State für Geschwindigkeit
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  
  const [modTime, setModTime] = useState(0);
  const [artTime, setArtTime] = useState(0);
  const [ctxTime, setCtxTime] = useState(0);
  
  const [modDuration, setModDuration] = useState(0);
  const [artDuration, setArtDuration] = useState(0);
  const [ctxDuration, setCtxDuration] = useState(0);
  
  const [error, setError] = useState(null);
  const [needsFileLink, setNeedsFileLink] = useState(false);
  const [userFiles, setUserFiles] = useState({});

  const modAudioRef = useRef(null);
  const artAudioRef = useRef(null);
  const ctxAudioRef = useRef(null);
  
  const playlistMenuRef = useRef(null);

  const currentData = PLAYLIST_CONTENT[activePlaylist];

  useEffect(() => {
    function handleClickOutside(event) {
      if (playlistMenuRef.current && !playlistMenuRef.current.contains(event.target)) {
        setShowPlaylistMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [playlistMenuRef]);

  // Effekt zum Setzen der Geschwindigkeit
  useEffect(() => {
    const refs = [modAudioRef, artAudioRef, ctxAudioRef];
    refs.forEach(ref => {
      if (ref.current) {
        ref.current.playbackRate = playbackSpeed;
      }
    });
  }, [playbackSpeed, activeMode, isPlaying]);

  const toggleSpeed = () => {
    setPlaybackSpeed(prev => {
      if (prev === 1.0) return 1.2;
      if (prev === 1.2) return 1.5;
      return 1.0;
    });
  };

  const getSrc = (defaultName) => {
    if (userFiles[defaultName]) return userFiles[defaultName];
    if (defaultName === "Bild 2 Artikel 2.png" && importedFiles.img2_2_morgen) return importedFiles.img2_2_morgen;
    const key = Object.keys(importedFiles).find(k => importedFiles[k] === defaultName); 
    return defaultName;
  };

  const activeMarkerIdx = useMemo(() => {
    if (!currentData || !currentData.articles) return -1;
    return currentData.articles.findIndex(a => modTime >= a.modStart && modTime <= a.modEnd);
  }, [modTime, currentData]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.toLowerCase().trim() === 'spiegel') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  useEffect(() => {
    setIsPlaying(false);
    setCurrentArticleIdx(0);
    setContextIdx(0);
    setActiveMode('moderation');
    setModTime(0);
    setArtTime(0);
    setCtxTime(0);
    setPlaybackSpeed(1.0); // Reset speed on playlist change
    if (modAudioRef.current) { modAudioRef.current.currentTime = 0; modAudioRef.current.load(); }
    if (artAudioRef.current) { artAudioRef.current.currentTime = 0; artAudioRef.current.load(); }
    if (ctxAudioRef.current) { ctxAudioRef.current.currentTime = 0; ctxAudioRef.current.load(); }
  }, [activePlaylist]);

  useEffect(() => {
    const handlePlayback = async () => {
      if (!isAuthenticated) return;

      try {
        const activeRef = activeMode === 'moderation' 
          ? modAudioRef.current 
          : activeMode === 'article' 
            ? artAudioRef.current 
            : ctxAudioRef.current;

        [modAudioRef, artAudioRef, ctxAudioRef].forEach(ref => {
          if (ref.current && ref.current !== activeRef) ref.current.pause();
        });

        if (isPlaying && activeRef) {
          if (activeRef.readyState === 0) activeRef.load();
          // Ensure speed is maintained
          activeRef.playbackRate = playbackSpeed;
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
  }, [isPlaying, activeMode, currentArticleIdx, contextIdx, userFiles, activePlaylist, isAuthenticated, playbackSpeed]);

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

  const jumpToContext = (targetCtxIdx = 0) => {
    setContextIdx(targetCtxIdx);
    setActiveMode('context');
    setIsPlaying(true);
    if (ctxAudioRef.current) ctxAudioRef.current.currentTime = 0;
  };

  const backToOverview = () => {
    setActiveMode('moderation');
    if (modAudioRef.current) {
        modAudioRef.current.currentTime = currentData.articles[currentArticleIdx].modStart;
    }
    setIsPlaying(true);
  };

  const backToArticle = () => {
    setActiveMode('article');
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (activeMode === 'moderation') {
      const nextArticle = currentData.articles.find(a => a.modStart > modTime + 1);
      if (nextArticle && modAudioRef.current) {
        modAudioRef.current.currentTime = nextArticle.modStart;
        setIsPlaying(true);
      }
    } else if (activeMode === 'article') {
      if (currentArticleIdx < currentData.articles.length - 1) {
        setCurrentArticleIdx(prev => prev + 1);
        setIsPlaying(true);
      }
    } else if (activeMode === 'context') {
      const currentArt = currentData.articles[currentArticleIdx];
      if (currentArt.context && contextIdx < currentArt.context.length - 1) {
        setContextIdx(prev => prev + 1);
        setIsPlaying(true);
      }
    }
  };

  const handlePrev = () => {
     if (activeMode === 'moderation') {
       const tolerance = 2; 
       const activeArticle = currentData.articles.find(a => modTime >= a.modStart && modTime <= a.modEnd + 5);
       
       if (activeArticle) {
           if (modTime > activeArticle.modStart + 3) {
               if (modAudioRef.current) modAudioRef.current.currentTime = activeArticle.modStart;
           } else {
               const currIndex = currentData.articles.indexOf(activeArticle);
               if (currIndex > 0) {
                   if (modAudioRef.current) modAudioRef.current.currentTime = currentData.articles[currIndex - 1].modStart;
               } else {
                   if (modAudioRef.current) modAudioRef.current.currentTime = 0;
               }
           }
       } else {
           const prevArticle = [...currentData.articles].reverse().find(a => a.modEnd < modTime);
           if (prevArticle && modAudioRef.current) {
                modAudioRef.current.currentTime = prevArticle.modStart;
           } else if (modAudioRef.current) {
               modAudioRef.current.currentTime = 0;
           }
       }
       setIsPlaying(true);
     } else if (activeMode === 'article') {
        if (currentArticleIdx > 0) {
            setCurrentArticleIdx(prev => prev - 1);
            setIsPlaying(true);
        } else if (artAudioRef.current) {
            artAudioRef.current.currentTime = 0;
        }
     } else if (activeMode === 'context') {
       if (contextIdx > 0) {
         setContextIdx(prev => prev - 1);
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
        if (isDownSwipe) {
           if (activeMode === 'moderation' && activeMarkerIdx !== -1) jumpToArticle();
           if (activeMode === 'article' && currentData.articles[currentArticleIdx].context) jumpToContext();
        } else if (isUpSwipe) {
           if (activeMode === 'article') backToOverview();
           if (activeMode === 'context') backToArticle();
        }
    }
  }

  // --- IMAGE LOGIC ---
  const getEffectiveImage = () => {
    let baseArticle = null;
    let time = 0;

    if (activeMode === 'moderation') {
        if (activeMarkerIdx !== -1) {
            baseArticle = currentData.articles[activeMarkerIdx];
            time = modTime;
        }
    } else {
        baseArticle = currentData.articles[currentArticleIdx];
        time = artTime;
    }

    if (!baseArticle) return null;

    let imageFile = baseArticle.imageFile;
    if (baseArticle.secondaryImages) {
        const activeSecondary = [...baseArticle.secondaryImages]
            .sort((a, b) => b.startTime - a.startTime)
            .find(img => {
                const timeMatch = time >= img.startTime;
                const modeMatch = !img.restrictMode || img.restrictMode === activeMode;
                return timeMatch && modeMatch;
            });
        
        if (activeSecondary) {
            imageFile = activeSecondary.imageFile;
        }
    }

    return { ...baseArticle, imageFile };
  }

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

  let displayIndex = null;
  if (activeMode === 'article' || activeMode === 'context') {
    displayIndex = currentArticleIdx + 1;
  } else if (activeMode === 'moderation' && activeMarkerIdx !== -1) {
    displayIndex = activeMarkerIdx + 1;
  }

  const isIntroMode = activeMode === 'moderation' && activeMarkerIdx === -1;
  const currentArticleForImage = getEffectiveImage();
  const currentArticle = currentData.articles[currentArticleIdx];
  const hasContext = currentArticle?.context && currentArticle.context.length > 0;

  let playerTitle = "";
  let playerLink = null;

  if (activeMode === 'moderation') {
    playerTitle = activeMarkerIdx !== -1 ? currentData.articles[activeMarkerIdx].title : currentData.modTitle;
    playerLink = activeMarkerIdx !== -1 ? currentData.articles[activeMarkerIdx].readUrl : null;
  } else if (activeMode === 'article') {
    playerTitle = currentData.articles[currentArticleIdx].title;
    playerLink = currentData.articles[currentArticleIdx].readUrl;
  } else if (activeMode === 'context') {
    playerTitle = "Kontext: " + currentData.articles[currentArticleIdx].title;
    playerLink = null;
  }

  let currTime = 0;
  let durTime = 0;
  if (activeMode === 'moderation') { currTime = modTime; durTime = modDuration; }
  else if (activeMode === 'article') { currTime = artTime; durTime = artDuration; }
  else if (activeMode === 'context') { currTime = ctxTime; durTime = ctxDuration; }

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-slate-900 font-sans selection:bg-red-100">
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
          
          <div className="relative" ref={playlistMenuRef}>
             <button 
                onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                className="flex items-center gap-2 text-slate-900 font-bold text-sm tracking-wide hover:text-red-600 transition-colors h-16"
             >
                <Menu size={24} className="md:hidden" />
                <List size={18} className="hidden md:block" />
                <span className="hidden md:inline">PLAYLISTS</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showPlaylistMenu ? 'rotate-180' : ''}`} />
             </button>

             {showPlaylistMenu && (
               <div className="absolute right-0 top-full mt-0 w-80 bg-white shadow-xl border border-slate-200 rounded-b-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
                 <div className="py-3 border-b border-slate-100">
                   <div className="px-5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktuelle Playlists</div>
                   {Object.values(PLAYLIST_CONTENT).map(pl => {
                     const IconComponent = pl.icon;
                     return (
                       <button
                         key={pl.id}
                         onClick={() => { setActivePlaylist(pl.id); setShowPlaylistMenu(false); }}
                         className={`w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${activePlaylist === pl.id ? 'text-red-600 font-bold bg-red-50/50' : 'text-slate-700'}`}
                       >
                         <IconComponent size={18} /> {pl.label}
                       </button>
                     );
                   })}
                 </div>
                 <div className="py-3 border-b border-slate-100 bg-slate-50/30">
                   <div className="px-5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entdecke weitere</div>
                   <div className="px-5 py-2 text-sm text-slate-500">
                     Weitere kuratierte Listen folgen <button onClick={() => setShowExamplesModal(true)} className="text-red-600 hover:underline font-medium">in Kürze, zum Beispiel</button>
                   </div>
                 </div>
                 <div className="py-3">
                   <div className="px-5 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deine Playlists</div>
                   {["Aktuelles zu Werder", "Das Neueste zum Konflikt in Venezuela", "Artikel zu KI"].map((title, i) => (
                     <button key={i} className="w-full text-left px-5 py-2 text-sm text-slate-600 hover:bg-slate-50 truncate transition-colors flex items-center gap-2">
                       <List size={14} className="text-slate-400" />
                       {title}
                     </button>
                   ))}
                   <button 
                     onClick={() => { setShowCreateModal(true); setShowPlaylistMenu(false); }}
                     className="w-full text-left px-5 py-3 mt-2 flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider hover:bg-red-50 transition-colors"
                   >
                     <Plus size={16} /> Erzeuge eine neue Playlist
                   </button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </nav>

      {showExamplesModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowExamplesModal(false); }}
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-serif font-bold text-slate-900">Bald verfügbar: Kuratierte Playlists</h2>
              <button onClick={() => setShowExamplesModal(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="mb-4 text-sm text-slate-600 font-medium">Höre kuratierte Playlists...</div>
              <ul className="space-y-3">
                {["mit den aktuellen Themen des Tages (Morgen, Mittag, Abend)", "mit Artikeln bestimmter Autoren", "zu bestimmten aktuellen Themen", "mit ausgesuchten User-Beiträgen aus dem Forum", "mit Best-Of-Artikeln (Woche, Jahr, Archiv)", "zu verschiedenen Extras"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></div> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">Neue Playlist erstellen</h2>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    Das Erstellen neuer Playlists kann einige Minuten dauern - wenn Deine Playlist fertig ist, findest Du sie im Menü. Du kannst zehn Playlists pro Woche erstellen.
                  </p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors -mt-1 -mr-1"><X size={20} /></button>
              </div>
            </div>
            <div className="p-8 space-y-8">
               <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider">Links einfügen</label>
                <textarea className="w-full h-24 p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm" placeholder="https://www.spiegel.de/..."></textarea>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="h-px bg-slate-200 flex-1"></div><span className="text-xs font-bold uppercase">ODER</span><div className="h-px bg-slate-200 flex-1"></div>
              </div>
              <div>
                <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all group">
                  <History size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">Generiere Playlist basierend auf meiner Lesehistorie</span>
                </button>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="h-px bg-slate-200 flex-1"></div><span className="text-xs font-bold uppercase">ODER</span><div className="h-px bg-slate-200 flex-1"></div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider">Playlist zu einem Thema</label>
                <div className="flex gap-2">
                  <input type="text" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm" placeholder="z.B. Künstliche Intelligenz, Klimawandel..." />
                  <button className="bg-slate-900 text-white px-6 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">Erstellen</button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md">Playlist generieren</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        
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
                  <Upload size={16} /> <span>Dateien verknüpfen</span>
                  <input type="file" multiple accept="audio/*,image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-8">
            
            <div>
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                     <List size={10} />
                     {currentData.label}
                   </span>
                   <div className="relative group/share cursor-help">
                     <Share2 size={16} className="text-slate-400 hover:text-red-600 transition-colors" />
                     <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-48 bg-slate-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover/share:opacity-100 transition-opacity pointer-events-none z-50">
                       <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
                       Hier wirst Du bald Deine persönlichen Playlists teilen können
                     </div>
                   </div>
                 </div>
               </div>

               <div className="relative aspect-[4/3] md:aspect-[16/9] bg-slate-100 rounded-lg overflow-hidden mb-4 group cursor-pointer">
                 
                 <div 
                   className="block w-full h-full relative"
                   onClick={togglePlay}
                   onTouchStart={onTouchStart}
                   onTouchMove={onTouchMove}
                   onTouchEnd={onTouchEnd}
                 >
                    {/* NEW: Left Tap Zone for Previous */}
                   <div 
                      className="absolute left-0 top-0 bottom-0 w-1/5 z-20"
                      onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                   />
                   {/* NEW: Right Tap Zone for Next */}
                   <div 
                      className="absolute right-0 top-0 bottom-0 w-1/5 z-20"
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                   />

                   {isIntroMode ? (
                     <div className="w-full h-full bg-slate-900 relative overflow-hidden">
                       <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-40">
                         {currentData.articles.slice(0, 6).map((art, i) => (
                           <div key={i} className="relative overflow-hidden border border-slate-900/20">
                             {art.imageFile ? <img src={getSrc(art.imageFile)} className="w-full h-full object-cover filter grayscale" alt="" /> : <div className="w-full h-full bg-slate-800"></div>}
                           </div>
                         ))}
                       </div>
                       <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 md:p-8 text-center">
                         {!isPlaying && (
                           <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white mb-4 shadow-2xl animate-pulse">
                             <Play size={32} fill="currentColor" className="ml-1" />
                           </div>
                         )}
                         <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 shadow-black drop-shadow-lg">{currentData.modTitle}</h2>
                         <p className="text-slate-300 text-sm md:text-base font-medium max-w-md mb-6">{currentData.modAuthors}</p>
                       </div>
                       <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20">
                         <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-lg"><ChevronRight size={24} /></button>
                       </div>
                     </div>
                   ) : activeMode === 'context' ? (
                     <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center pt-24 pb-8 px-8 md:p-12 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10"><FileQuestion size={200} className="text-white" /></div>
                       <div className="relative z-10 text-center">
                         <div className="inline-block bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest mb-4 rounded">Frage {contextIdx + 1} / {currentArticle.context.length}</div>
                         <h2 className="text-xl md:text-2xl font-serif font-bold text-white leading-relaxed">
                           {currentArticle.context[contextIdx].title}
                         </h2>
                       </div>
                     </div>
                   ) : (
                     currentArticleForImage && currentArticleForImage.imageFile ? (
                       <img 
                         src={getSrc(currentArticleForImage.imageFile)} 
                         alt={currentArticleForImage.title}
                         className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400"><Mic2 size={48} /></div>
                     )
                   )}
                 </div>

                 {!isIntroMode && (
                   <>
                     <div className="absolute top-4 left-4 flex items-center justify-center w-12 h-12 border-2 border-white rounded-full text-white font-serif font-bold text-2xl bg-black/30 backdrop-blur-sm z-10 pointer-events-none">
                       {displayIndex}
                     </div>

                     {activeMode === 'moderation' && (
                       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
                          <span className="text-white text-[10px] font-bold uppercase tracking-wider drop-shadow-md text-shadow-sm">Artikel hören</span>
                          <button 
                              className="bg-black/50 hover:bg-red-600 text-white p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm animate-bounce"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); jumpToArticle(); }}
                          >
                              <ChevronDown size={28} />
                          </button>
                       </div>
                     )}
                     
                     {activeMode === 'article' && hasContext && (
                       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
                          <span className="text-white text-[10px] font-bold uppercase tracking-wider drop-shadow-md text-shadow-sm">Mehr Kontext</span>
                          <button 
                              className="bg-black/50 hover:bg-indigo-600 text-white p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm animate-bounce"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); jumpToContext(); }}
                          >
                              <ChevronDown size={28} />
                          </button>
                       </div>
                     )}

                     {activeMode === 'article' && (
                       <div className="absolute top-4 right-1/2 translate-x-1/2 z-20 flex flex-col items-center gap-1">
                          <span className="text-white text-[10px] font-bold uppercase tracking-wider drop-shadow-md mb-1 text-shadow-sm">zurück zur Playlist</span>
                          <button 
                              className="bg-black/50 hover:bg-slate-700 text-white p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); backToOverview(); }}
                          >
                              <ChevronUp size={28} />
                          </button>
                       </div>
                     )}
                     
                     {activeMode === 'context' && (
                       <div className="absolute top-4 right-1/2 translate-x-1/2 z-20 flex flex-col items-center gap-1">
                          <span className="text-white text-[10px] font-bold uppercase tracking-wider drop-shadow-md mb-1 text-shadow-sm">zurück zum Artikel</span>
                          <button 
                              className="bg-black/50 hover:bg-slate-700 text-white p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); backToArticle(); }}
                          >
                              <ChevronUp size={28} />
                          </button>
                       </div>
                     )}

                     <div className="hidden md:block absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                       <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 transition-colors shadow-lg"><ChevronLeft size={24} /></button>
                     </div>
                     <div className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                       <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-900 transition-colors shadow-lg"><ChevronRight size={24} /></button>
                     </div>
                   </>
                 )}
               </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm p-6 md:p-8 relative">
               
               <div className="text-center mb-6 px-4">
                 {playerLink ? (
                   <a 
                     href={playerLink} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-start justify-center gap-2 group/link text-slate-900 hover:text-red-600 transition-colors"
                   >
                     <h4 className="text-sm font-serif font-bold leading-snug">
                        {playerTitle}
                     </h4>
                     <ExternalLink size={12} className="shrink-0 mt-1 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                   </a>
                 ) : (
                   <h4 className="text-sm font-serif font-bold text-slate-900 leading-snug">
                      {playerTitle}
                   </h4>
                 )}
               </div>

               <div className="mb-6 md:mb-10">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                     <span>{formatTime(currTime)}</span>
                     <span>{formatTime(durTime)}</span>
                  </div>
                  
                  <div className="relative h-12 flex items-center cursor-pointer">
                     <div className="absolute w-full h-1 bg-slate-200"></div>
                     <div className="absolute h-1 bg-red-600 z-10 transition-all duration-300" style={{ width: `${((currTime) / (durTime || 1)) * 100}%` }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-md"></div>
                     </div>
                     
                     {activeMode === 'moderation' && modDuration > 0 && currentData.articles.map((a) => {
                       const isActive = modTime >= a.modStart && modTime <= a.modEnd;
                       return (
                         <div 
                           key={a.id}
                           className="absolute top-1/2 -translate-y-1/2 z-20 group/marker"
                           style={{ left: `${(a.modStart / modDuration) * 100}%` }}
                         >
                           <div className={`rounded-full transition-all duration-300 shadow-sm ${isActive ? 'w-4 h-4 bg-red-600 border-2 border-white shadow-md scale-110' : 'w-2 h-2 bg-slate-400 hover:bg-slate-600 hover:scale-125'}`}></div>
                           <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover/marker:block bg-slate-900 text-white text-[10px] px-2 py-1 whitespace-nowrap z-50 rounded shadow-lg">
                             <span className="font-bold text-red-400 mr-1">{a.id}.</span> {a.title.substring(0, 20)}...
                             <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                           </div>
                         </div>
                       );
                     })}

                     <input 
                       type="range"
                       min="0"
                       max={durTime || 0}
                       step="0.1"
                       value={currTime}
                       onChange={(e) => {
                         const val = parseFloat(e.target.value);
                         if (activeMode === 'moderation') { if (modAudioRef.current) modAudioRef.current.currentTime = val; }
                         else if (activeMode === 'article') { if (artAudioRef.current) artAudioRef.current.currentTime = val; }
                         else if (activeMode === 'context') { if (ctxAudioRef.current) ctxAudioRef.current.currentTime = val; }
                       }}
                       className="absolute w-full h-full opacity-0 cursor-pointer z-40"
                     />
                  </div>
               </div>

               <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                  <div className="flex items-center justify-center gap-6 w-full md:w-auto">
                     <button onClick={handlePrev} className="text-slate-400 hover:text-slate-900 transition-colors"><SkipBack size={24} strokeWidth={1.5} /></button>
                     <button onClick={togglePlay} className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                     </button>
                     <button onClick={handleNext} className="text-slate-400 hover:text-slate-900 transition-colors"><SkipForward size={24} strokeWidth={1.5} /></button>
                     {/* Speed Toggle Button */}
                     <button 
                       onClick={toggleSpeed}
                       className="w-10 h-10 flex items-center justify-center text-slate-500 font-bold text-xs hover:bg-slate-100 rounded-full transition-colors ml-2"
                       title="Geschwindigkeit ändern"
                     >
                       {playbackSpeed}x
                     </button>
                  </div>

                  <div className="flex-1 flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                     {activeMode === 'moderation' && activeMarkerIdx !== -1 && (
                        <>
                           <button onClick={jumpToArticle} className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all group">
                              <span>ARTIKEL HÖREN</span> <ArrowRight size={18} />
                           </button>
                        </>
                     )}
                     
                     {activeMode === 'article' && (
                        <div className="flex flex-col items-center md:items-end gap-2">
                           <button onClick={backToOverview} className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase tracking-wider hover:text-slate-900 transition-all">
                              <ArrowLeft size={18} /> <span>Zurück zur Playlist</span>
                           </button>
                           
                           {/* New Context Text Button */}
                           {hasContext && (
                               <button 
                                   onClick={() => jumpToContext()}
                                   className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider hover:text-indigo-800 transition-all"
                               >
                                   <span>Mehr Kontext</span> <ChevronDown size={18} />
                               </button>
                           )}

                           {currentData.articles[currentArticleIdx].readUrl && (
                              <a href={currentData.articles[currentArticleIdx].readUrl} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider hover:text-red-600 transition-colors">
                                 <span>Artikel lesen</span> <ExternalLink size={14} />
                              </a>
                           )}
                        </div>
                     )}
                     
                     {activeMode === 'context' && (
                        <div className="flex flex-col items-center md:items-end gap-2">
                           <button onClick={backToArticle} className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase tracking-wider hover:text-slate-900 transition-all">
                              <ChevronUp size={18} /> <span>Zurück zum Artikel</span>
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
            
            <div className="bg-slate-100 p-6 text-sm text-slate-600 leading-relaxed font-serif">
              <span className="font-bold text-slate-900 block mb-2 font-sans text-xs uppercase tracking-widest">Hinweis zur Nutzung</span>
              Sie befinden sich im {activeMode === 'moderation' ? 'Playlist-Modus' : activeMode === 'article' ? 'Artikel-Modus' : 'Kontext-Modus'}.
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2"><List size={16} className="text-red-600" /> Inhalt der Playlist</h3>
               <span className="text-xs font-mono text-slate-400">{currentData.articles.length} Beiträge</span>
            </div>
            <div className="divide-y divide-slate-100">
               {currentData.articles.map((article, idx) => {
                 const isPlayingThis = (activeMode === 'article' || activeMode === 'context') && currentArticleIdx === idx;
                 const isModerationFocus = activeMode === 'moderation' && activeMarkerIdx === idx;
                 const showContext = expandedContextId === idx;
                 
                 return (
                   <div key={article.id} className="group">
                     <button 
                       onClick={() => { setCurrentArticleIdx(idx); setActiveMode('article'); setIsPlaying(true); }} 
                       className={`w-full text-left p-5 transition-all hover:bg-slate-50 flex gap-4 ${isPlayingThis ? 'bg-slate-50' : ''} ${isModerationFocus ? 'bg-red-50/30' : ''}`}
                     >
                       <div className="shrink-0 pt-1">
                          {isPlayingThis ? <div className="w-6 h-6 flex items-center justify-center"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div></div> :
                           isModerationFocus ? <div className="w-6 h-6 flex items-center justify-center border border-red-200 text-red-600 text-xs font-bold rounded-full"><Mic2 size={12} /></div> :
                           <span className="text-slate-300 font-serif text-lg italic group-hover:text-red-400">{idx + 1}</span>}
                       </div>
                       <div className="space-y-1 flex-1">
                          <h4 className={`text-base font-serif font-medium leading-snug ${isPlayingThis || isModerationFocus ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>{article.title}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 text-xs text-slate-400 uppercase tracking-wide">
                               <span>{article.authors ? article.authors.split(',')[0] : 'Spiegel Audio'}</span>
                               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                               <span className="flex items-center gap-1"><Clock size={10} /> {formatTime(article.modEnd - article.modStart)}</span>
                            </div>
                            
                            {article.context && (
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  setExpandedContextId(showContext ? null : idx);
                                }}
                                className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer px-2 py-1 rounded transition-colors ${showContext ? 'bg-indigo-50 text-indigo-600' : 'text-indigo-400 hover:bg-indigo-50'}`}
                              >
                                <HelpCircle size={12} />
                                Kontext
                                <ChevronDown size={12} className={`transition-transform ${showContext ? 'rotate-180' : ''}`} />
                              </div>
                            )}
                          </div>
                       </div>
                     </button>

                     {showContext && article.context && (
                       <div className="bg-indigo-50/50 border-y border-indigo-100 px-5 py-3 animate-in slide-in-from-top-2">
                         <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Deep Dive Fragen</div>
                         <div className="space-y-1">
                           {article.context.map((ctx, cIdx) => (
                             <button
                               key={ctx.id}
                               onClick={() => {
                                 setCurrentArticleIdx(idx);
                                 jumpToContext(cIdx);
                               }}
                               className={`w-full text-left py-2 px-3 rounded text-sm hover:bg-white transition-colors flex items-start gap-2 ${activeMode === 'context' && currentArticleIdx === idx && contextIdx === cIdx ? 'bg-white text-indigo-700 font-medium shadow-sm' : 'text-slate-600'}`}
                             >
                               <span className="mt-0.5 text-indigo-300">•</span>
                               {ctx.title}
                             </button>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 );
               })}
            </div>
          </div>
        </main>

        <div className="hidden">
          <audio ref={modAudioRef} src={getSrc(currentData.modFile)} onLoadedMetadata={(e) => setModDuration(e.target.duration)} onTimeUpdate={(e) => setModTime(e.target.currentTime)} onEnded={() => { setActiveMode('article'); setCurrentArticleIdx(0); setIsPlaying(true); }} onError={(e) => handleAudioError(e, currentData.modFile)} />
          <audio ref={artAudioRef} src={getSrc(currentData.articles[currentArticleIdx].fileName)} onLoadedMetadata={(e) => setArtDuration(e.target.duration)} onTimeUpdate={(e) => setArtTime(e.target.currentTime)} onEnded={() => { if (currentArticleIdx < currentData.articles.length - 1) { setCurrentArticleIdx(prev => prev + 1); setIsPlaying(true); } else { setIsPlaying(false); } }} onError={(e) => handleAudioError(e, currentData.articles[currentArticleIdx].fileName)} />
          {currentData.articles[currentArticleIdx]?.context && (
             <audio 
               ref={ctxAudioRef} 
               src={getSrc(currentData.articles[currentArticleIdx].context[contextIdx]?.fileName)} 
               onLoadedMetadata={(e) => setCtxDuration(e.target.duration)} 
               onTimeUpdate={(e) => setCtxTime(e.target.currentTime)} 
               onEnded={() => {
                 if (contextIdx < currentData.articles[currentArticleIdx].context.length - 1) {
                   setContextIdx(prev => prev + 1);
                   setIsPlaying(true);
                 } else {
                   // Alle Kontext-Clips fertig -> Zurück zum Artikel
                   backToArticle();
                 }
               }} 
               onError={(e) => handleAudioError(e, "Context Audio")} 
             />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;