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
  ExternalLink
} from 'lucide-react';

// --- DATEI IMPORT LOGIK FÜR BUILD-SYSTEME ---
// In einer echten React-App (Vite/CRA) werden Assets idealerweise importiert.
// Dieser Block versucht, Importe zu nutzen, hat aber einen Fallback für diese Vorschau-Umgebung.

let assets = {
  mod: null,
  art1: null, art2: null, art3: null, art4: null, art5: null, art6: null,
  logo: null
};

try {
  // Versuche Standard-Requires (für Webpack/CRA Umgebungen)
  assets = {
    mod: require('./Moderation.mp3'),
    art1: require('./Artikel 1.mp3'),
    art2: require('./Artikel 2.mp3'),
    art3: require('./Artikel 3.mp3'),
    art4: require('./Artikel 4.mp3'),
    art5: require('./Artikel 5.mp3'),
    art6: require('./Artikel 6.mp3'),
    logo: require('./image_2dc4c5.png')
  };
} catch (e) {
  // Fallback: Nutze Dateinamen als Strings (für Public Folder / GitHub Pages raw access)
  // Hinweis: Stellen Sie sicher, dass die Dateien im 'public'-Ordner Ihres Projekts liegen.
  assets = {
    mod: "Moderation.mp3",
    art1: "Artikel 1.mp3",
    art2: "Artikel 2.mp3",
    art3: "Artikel 3.mp3",
    art4: "Artikel 4.mp3",
    art5: "Artikel 5.mp3",
    art6: "Artikel 6.mp3",
    logo: "image_2dc4c5.png"
  };
}

const ARTICLES_DATA = [
  {
    id: 1,
    title: "Verhandlungen über Friedenslösung: Hinter den Kulissen warnen die Europäer Selenskyj",
    authors: "Matthias Gebauer, Paul-Anton Krüger",
    modStart: 10,
    modEnd: 27,
    fileKey: 'art1',
    fileName: "Artikel 1.mp3",
    readUrl: "https://www.spiegel.de/politik/deutschland/ukraine-gespraeche-hinter-den-kulissen-warnen-die-europaeer-selenskyj-a-08c9846e-6af5-4c69-b53a-8e802dc7aa77"
  },
  {
    id: 2,
    title: "Angeblicher Angriff auf Putins Residenz: Die drei großen Ungereimtheiten",
    authors: "Ann-Dorit Boy",
    modStart: 28,
    modEnd: 45,
    fileKey: 'art2',
    fileName: "Artikel 2.mp3",
    readUrl: "https://www.spiegel.de/ausland/wladimir-putin-angeblicher-angriff-auf-residenz-zweifel-an-russischen-vorwuerfen-91-angeblich-abgewehrte-drohnen-und-viele-ungereimtheiten-a-456e4e4f-9dc5-4e22-ad75-a82d8e4b1934"
  },
  {
    id: 3,
    title: "US-Sanktionen gegen Deutsche: »Diese Regierung ist zu allem fähig«",
    authors: "Wolf Wiedmann-Schmidt",
    modStart: 46,
    modEnd: 60,
    fileKey: 'art3',
    fileName: "Artikel 3.mp3",
    readUrl: "https://www.spiegel.de/politik/deutschland/sanktionen-gegen-hate-aid-weitere-us-massnahmen-gegen-deutsche-befuerchtet-a-e0c8b6d9-95e2-4e76-8360-4ea9e3e1dc3d"
  },
  {
    id: 4,
    title: "Preissprünge 2025: Butter, Kaffee, Kakao",
    authors: "Michael Kröger",
    modStart: 61,
    modEnd: 77,
    fileKey: 'art4',
    fileName: "Artikel 4.mp3",
    readUrl: "https://www.manager-magazin.de/unternehmen/handel/inflation-das-waren-die-groessten-preisspruenge-bei-lebensmitteln-2025-1767088287-a-69823e02-dac4-476e-bfec-c8e695bb6e86"
  },
  {
    id: 5,
    title: "Alkoholfolgen: Das hilft Ihnen gegen den Kater",
    authors: "Simon Maurer",
    modStart: 79,
    modEnd: 106,
    fileKey: 'art5',
    fileName: "Artikel 5.mp3",
    readUrl: "https://www.spiegel.de/gesundheit/alkohol-das-taugen-die-neuen-anti-kater-mittel-aus-asien-a-0ef45fa2-4fb7-4710-b0d3-3f6f07a4d741"
  },
  {
    id: 6,
    title: "FITNESS: Wie Ihre Muskeln die richtige Balance finden",
    authors: "Anne Paulsen",
    modStart: 107,
    modEnd: 133,
    fileKey: 'art6',
    fileName: "Artikel 6.mp3",
    readUrl: "https://www.spiegel.de/fitness/balance-beim-muskeltraining-uebungen-fuer-laeufer-radsportler-und-fussballer-a-793e40f3-e682-4fec-b8b1-02bdba58cf43"
  }
];

const App = () => {
  const [activeMode, setActiveMode] = useState('moderation'); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentArticleIdx, setCurrentArticleIdx] = useState(0);
  
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

  // Verbesserte Source-Ermittlung: User-Datei > Import > Fallback-Pfad
  const getSrc = (key, defaultName) => {
    // 1. Priorität: Manuell vom Nutzer ausgewählte Datei (File Picker)
    if (userFiles[defaultName]) return userFiles[defaultName];
    
    // 2. Priorität: Importiertes Modul (Vite/Webpack Build)
    const imported = assets[key];
    if (imported && typeof imported === 'object' && imported.default) {
      return imported.default; // ES Module Default Export
    }
    if (imported && typeof imported === 'string' && imported.length > 0) {
      return imported; // String Pfad (Public Folder oder Require result)
    }

    // 3. Fallback: Relativer Pfad
    return defaultName;
  };

  const activeMarkerIdx = useMemo(() => {
    return ARTICLES_DATA.findIndex(a => modTime >= a.modStart && modTime <= a.modEnd);
  }, [modTime]);

  useEffect(() => {
    const handlePlayback = async () => {
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
  }, [isPlaying, activeMode, currentArticleIdx, userFiles]);

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
    const nextIdx = currentArticleIdx + 1;
    if (nextIdx < ARTICLES_DATA.length && modAudioRef.current) {
      modAudioRef.current.currentTime = ARTICLES_DATA[nextIdx].modStart;
    }
    setIsPlaying(true);
  };

  const handleSkip = () => {
    if (activeMode === 'moderation') {
      const nextArticle = ARTICLES_DATA.find(a => a.modStart > modTime + 1);
      if (nextArticle && modAudioRef.current) {
        modAudioRef.current.currentTime = nextArticle.modStart;
        setIsPlaying(true);
      }
    } else {
      if (currentArticleIdx < ARTICLES_DATA.length - 1) {
        setCurrentArticleIdx(prev => prev + 1);
        setIsPlaying(true);
      }
    }
  };

  const handleRewind = () => {
     const ref = activeMode === 'moderation' ? modAudioRef : artAudioRef;
     if(ref.current) ref.current.currentTime -= 10;
  };

  const handleAudioError = (e, fileName) => {
    const err = e.currentTarget.error;
    // Wenn Fehlercode 4 (SRC not supported) auftritt, liegt es meist an fehlenden Pfaden
    if (err && err.code === 4) {
      // Wir prüfen erst, ob wir nicht schon eine User-Datei haben, die vielleicht defekt ist
      if (!userFiles[fileName]) {
        setNeedsFileLink(true);
        setError(`Audio-Datei nicht gefunden.`);
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

  // Determine current number to display
  let displayIndex = null;
  if (activeMode === 'article') {
    displayIndex = currentArticleIdx + 1;
  } else if (activeMode === 'moderation' && activeMarkerIdx !== -1) {
    displayIndex = activeMarkerIdx + 1;
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] text-slate-900 font-sans selection:bg-red-100">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* Logo Handling */}
             <img 
               src={getSrc('logo', 'image_2dc4c5.png')} 
               alt="SPIEGEL" 
               className="h-8 md:h-10 object-contain"
               onError={(e) => {
                 e.target.style.display = 'none';
                 e.target.nextSibling.style.display = 'block';
               }}
             />
             <span className="hidden text-red-600 font-black text-2xl tracking-tighter">SPIEGEL</span>
             <span className="hidden md:inline text-slate-400 font-light border-l border-slate-300 pl-4 text-sm tracking-wide uppercase">Audio</span>
          </div>
          <div className="flex gap-6 text-sm font-bold tracking-wide">
             <button 
                onClick={() => setActiveMode('moderation')}
                className={`relative h-16 flex items-center gap-2 transition-colors ${activeMode === 'moderation' ? 'text-red-600' : 'text-slate-500 hover:text-slate-900'}`}
             >
                <Mic2 size={18} />
                <span>BRIEFING</span>
                {activeMode === 'moderation' && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600"></div>}
             </button>
             <button 
                onClick={() => setActiveMode('article')}
                className={`relative h-16 flex items-center gap-2 transition-colors ${activeMode === 'article' ? 'text-red-600' : 'text-slate-500 hover:text-slate-900'}`}
             >
                <List size={18} />
                <span>PLAYLIST</span>
                {activeMode === 'article' && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600"></div>}
             </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Fallback File Linker */}
        {needsFileLink && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-orange-600 shrink-0 mt-1" size={24} />
              <div className="space-y-3 flex-1">
                <h3 className="text-slate-900 font-bold text-lg font-serif">Dateizugriff erforderlich (Lokaler Modus)</h3>
                <p className="text-slate-700 text-sm leading-relaxed max-w-2xl">
                  Wenn Sie diese App lokal ohne Webserver testen, blockiert der Browser oft Audio-Dateien. 
                  Für die GitHub Pages Version ist dies nicht nötig, sofern die Dateien im 'public' Ordner liegen.
                  Hier können Sie die Dateien manuell verknüpfen:
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

        {/* Main Content Area */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: The "Active" Experience */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Dynamic Header */}
            <div>
               <div className="flex items-center gap-3 mb-4">
                 <span className="inline-block bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                   {activeMode === 'moderation' ? 'Briefing' : 'Playlist'}
                 </span>
               </div>
               
               <div className="flex gap-4 items-start">
                  {/* Dynamic Number Display */}
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
                          ? (activeMarkerIdx !== -1 ? ARTICLES_DATA[activeMarkerIdx].title : "Die Lage am Morgen: Das Briefing")
                          : ARTICLES_DATA[currentArticleIdx].title
                      }
                    </h1>
                    <p className="text-slate-600 text-lg mt-3 font-serif italic pl-1">
                      {activeMode === 'moderation' 
                        ? (activeMarkerIdx !== -1 ? ARTICLES_DATA[activeMarkerIdx].authors : "Die wichtigsten Themen des Tages im Überblick.")
                        : ARTICLES_DATA[currentArticleIdx].authors
                      }
                    </p>
                  </div>
               </div>
            </div>

            {/* THE PLAYER MODULE */}
            <div className="bg-white border border-slate-200 shadow-sm p-8 relative">
               
               {/* Timeline Visualization */}
               <div className="mb-10">
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                     <span>{formatTime(activeMode === 'moderation' ? modTime : artTime)}</span>
                     <span>{formatTime(activeMode === 'moderation' ? modDuration : artDuration)}</span>
                  </div>
                  
                  <div className="relative h-12 flex items-center cursor-pointer">
                     {/* Base Track */}
                     <div className="absolute w-full h-1 bg-slate-200"></div>

                     {/* Progress */}
                     <div 
                        className="absolute h-1 bg-red-600 z-10 transition-all duration-300"
                        style={{ width: `${((activeMode === 'moderation' ? modTime : artTime) / (activeMode === 'moderation' ? (modDuration || 1) : (artDuration || 1))) * 100}%` }}
                     >
                        {/* Playhead */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-md"></div>
                     </div>

                     {/* Context Markers (Only in Moderation Mode) */}
                     {activeMode === 'moderation' && modDuration > 0 && ARTICLES_DATA.map((a) => (
                       <div 
                         key={a.id}
                         className={`absolute h-4 w-1 top-1/2 -translate-y-1/2 z-20 transition-all duration-500 group/marker ${modTime >= a.modStart && modTime <= a.modEnd ? 'bg-red-600 h-6 w-1.5' : 'bg-slate-300 hover:bg-slate-400'}`}
                         style={{ left: `${(a.modStart / modDuration) * 100}%` }}
                       >
                         {/* Hover Tooltip */}
                         <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover/marker:block bg-slate-900 text-white text-[10px] px-2 py-1 whitespace-nowrap z-50 rounded shadow-lg">
                           <span className="font-bold text-red-400 mr-1">{a.id}.</span>
                           {a.title.substring(0, 20)}...
                           <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                         </div>
                       </div>
                     ))}
                     
                     {/* Scrubbing Input */}
                     <input 
                       type="range"
                       min="0"
                       max={activeMode === 'moderation' ? (modDuration || 0) : (artDuration || 0)}
                       step="0.1"
                       value={activeMode === 'moderation' ? modTime : artTime}
                       onChange={(e) => {
                         const val = parseFloat(e.target.value);
                         if (activeMode === 'moderation') {
                           if (modAudioRef.current) modAudioRef.current.currentTime = val;
                         } else {
                           if (artAudioRef.current) artAudioRef.current.currentTime = val;
                         }
                       }}
                       className="absolute w-full h-full opacity-0 cursor-pointer z-40"
                     />
                  </div>
               </div>

               {/* Controls */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <button onClick={handleRewind} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <SkipBack size={24} strokeWidth={1.5} />
                     </button>
                     <button 
                        onClick={togglePlay}
                        className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                     >
                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                     </button>
                     <button onClick={handleSkip} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <SkipForward size={24} strokeWidth={1.5} />
                     </button>
                  </div>

                  {/* Context Action Button Stack */}
                  <div className="flex-1 flex flex-col items-end gap-2">
                     {activeMode === 'moderation' && activeMarkerIdx !== -1 && (
                        <>
                           <button 
                              onClick={jumpToArticle}
                              className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all group"
                           >
                              <span>ARTIKEL HÖREN</span>
                              <ArrowRight size={18} />
                           </button>
                           
                           {ARTICLES_DATA[activeMarkerIdx].readUrl && (
                              <a 
                                 href={ARTICLES_DATA[activeMarkerIdx].readUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider hover:text-red-600 transition-colors"
                              >
                                 <span>ARTIKEL LESEN</span>
                                 <ExternalLink size={14} />
                              </a>
                           )}
                        </>
                     )}
                     
                     {activeMode === 'article' && (
                        <div className="flex flex-col items-end gap-2">
                           <button 
                              onClick={backToOverview}
                              className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase tracking-wider hover:text-slate-900 transition-all"
                           >
                              <ArrowLeft size={18} />
                              <span>Zur Übersicht</span>
                           </button>

                           {ARTICLES_DATA[currentArticleIdx].readUrl && (
                              <a 
                                 href={ARTICLES_DATA[currentArticleIdx].readUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider hover:text-red-600 transition-colors"
                              >
                                 <span>Artikel lesen</span>
                                 <ExternalLink size={14} />
                              </a>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            </div>
            
            {/* Info Box */}
            <div className="bg-slate-100 p-6 text-sm text-slate-600 leading-relaxed font-serif">
              <span className="font-bold text-slate-900 block mb-2 font-sans text-xs uppercase tracking-widest">Hinweis zur Nutzung</span>
              Sie befinden sich im {activeMode === 'moderation' ? 'Briefing-Modus' : 'Playlist-Modus'}. 
              {activeMode === 'moderation' 
                 ? " Hier erhalten Sie eine kuratierte Zusammenfassung. Bei Interesse an einem Thema können Sie jederzeit in die Tiefe gehen."
                 : " Hier hören Sie die vollständige Reportage. Über 'Zurück' gelangen Sie nahtlos an Ihre letzte Stelle im Briefing."
              }
            </div>
          </div>

          {/* RIGHT COLUMN: The List / Context */}
          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                 <List size={16} className="text-red-600" />
                 Inhalt der Sendung
               </h3>
               <span className="text-xs font-mono text-slate-400">{ARTICLES_DATA.length} Beiträge</span>
            </div>
            
            <div className="divide-y divide-slate-100">
               {ARTICLES_DATA.map((article, idx) => {
                 const isPlayingThis = activeMode === 'article' && currentArticleIdx === idx;
                 const isModerationFocus = activeMode === 'moderation' && activeMarkerIdx === idx;
                 
                 return (
                   <button 
                     key={article.id}
                     onClick={() => {
                        setCurrentArticleIdx(idx);
                        setActiveMode('article');
                        setIsPlaying(true);
                     }}
                     className={`w-full text-left p-5 transition-all group hover:bg-slate-50 flex gap-4 ${
                       isPlayingThis ? 'bg-slate-50' : ''
                     } ${isModerationFocus ? 'bg-red-50/30' : ''}`}
                   >
                     {/* Number / State Indicator */}
                     <div className="shrink-0 pt-1">
                        {isPlayingThis ? (
                           <div className="w-6 h-6 flex items-center justify-center">
                              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                           </div>
                        ) : isModerationFocus ? (
                           <div className="w-6 h-6 flex items-center justify-center border border-red-200 text-red-600 text-xs font-bold rounded-full">
                              <Mic2 size={12} />
                           </div>
                        ) : (
                           <span className="text-slate-300 font-serif text-lg italic group-hover:text-red-400">{idx + 1}</span>
                        )}
                     </div>

                     <div className="space-y-1">
                        <h4 className={`text-base font-serif font-medium leading-snug ${isPlayingThis || isModerationFocus ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                           {article.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 uppercase tracking-wide">
                           <span>{article.authors.split(',')[0]}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {formatTime(article.modEnd - article.modStart)}
                           </span>
                        </div>
                     </div>
                   </button>
                 );
               })}
            </div>
          </div>

        </main>

        {/* Audio Core (Hidden) */}
        <div className="hidden">
          <audio 
            ref={modAudioRef}
            src={getSrc('mod', "Moderation.mp3")}
            onLoadedMetadata={(e) => setModDuration(e.target.duration)}
            onTimeUpdate={(e) => setModTime(e.target.currentTime)}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => handleAudioError(e, "Moderation.mp3")}
          />
          <audio 
            ref={artAudioRef}
            src={getSrc(ARTICLES_DATA[currentArticleIdx].fileKey, ARTICLES_DATA[currentArticleIdx].fileName)}
            onLoadedMetadata={(e) => setArtDuration(e.target.duration)}
            onTimeUpdate={(e) => setArtTime(e.target.currentTime)}
            onEnded={() => {
              if (currentArticleIdx < ARTICLES_DATA.length - 1) {
                setCurrentArticleIdx(prev => prev + 1);
              } else {
                setIsPlaying(false);
              }
            }}
            onError={(e) => handleAudioError(e, ARTICLES_DATA[currentArticleIdx].fileName)}
          />
        </div>

      </div>
    </div>
  );
};

export default App;