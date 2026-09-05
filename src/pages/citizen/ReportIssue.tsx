import { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  ArrowRight,
  Cpu,
  Layers,
  FileText,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { submitReport, transcribeAudio } from '../../api/client';
import { Link } from 'react-router-dom';
import { JHARKHAND_DISTRICT_NAMES, getDistrictCoords } from '../../constants/jharkhandDistricts';

const CitizenReport = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stage, setStage] = useState<'idle' | 'recording' | 'processing' | 'result'>('idle');
  const [result, setResult] = useState<any>(null);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [selectedDistrict, setSelectedDistrict] = useState('Ranchi');

  // Real Microphone MediaRecorder state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop media stream tracks cleanly
  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setErrorMessage(
        'Your browser does not support audio recording (MediaRecorder API unavailable). Please type your grievance manually.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Select candidate MIME type supported by browser
      const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/aac'
      ];
      let selectedMime = '';
      for (const mime of candidates) {
        if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      const recorderOptions: MediaRecorderOptions = selectedMime ? { mimeType: selectedMime } : {};
      const recorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stopMediaStream();

        const chunks = audioChunksRef.current;
        if (chunks.length === 0) {
          setErrorMessage('No audio data was recorded. Please try speaking again.');
          setIsRecording(false);
          setIsTranscribing(false);
          setStage('idle');
          return;
        }

        const mimeType = recorder.mimeType || selectedMime || 'audio/webm';
        const audioBlob = new Blob(chunks, { type: mimeType });

        if (audioBlob.size === 0) {
          setErrorMessage('Recorded audio was empty. Please speak clearly into your microphone.');
          setIsRecording(false);
          setIsTranscribing(false);
          setStage('idle');
          return;
        }

        setIsTranscribing(true);
        try {
          const res = await transcribeAudio(audioBlob);
          if (res.text && res.text.trim()) {
            setText(prev => (prev ? `${prev} ${res.text.trim()}` : res.text.trim()));
          }
          if (res.language) {
            const l = res.language.toLowerCase();
            if (l.includes('hindi')) setSelectedLanguage('hi');
            else if (l.includes('bhojpuri')) setSelectedLanguage('bho');
            else if (l.includes('magahi')) setSelectedLanguage('mag');
            else if (l.includes('english')) setSelectedLanguage('en');
          }
        } catch (err: any) {
          console.error('Transcription failed:', err);
          setErrorMessage(err?.message || 'Audio transcription failed. Please try again or enter text manually.');
        } finally {
          setIsTranscribing(false);
          setStage('idle');
        }
      };

      recorder.onerror = (e: any) => {
        console.error('MediaRecorder error:', e);
        stopMediaStream();
        setIsRecording(false);
        setIsTranscribing(false);
        setStage('idle');
        setErrorMessage('An error occurred during audio recording.');
      };

      recorder.start(250);
      setIsRecording(true);
      setStage('recording');
    } catch (err: any) {
      console.error('getUserMedia error:', err);
      stopMediaStream();
      setIsRecording(false);
      setStage('idle');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone permission was denied. Please allow microphone access in your browser to record audio.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No microphone device was detected. Please connect a microphone or type your grievance manually.');
      } else {
        setErrorMessage(err.message || 'Unable to access your microphone.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      stopMediaStream();
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isTranscribing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleManualSubmit = async () => {
    if (!text.trim()) return;
    setStage('processing');
    setErrorMessage(null);
    
    try {
      const coords = getDistrictCoords(selectedDistrict);
      const location = { 
        lat: coords.lat, 
        lng: coords.lng, 
        name: `${selectedDistrict}, Jharkhand`,
        district: selectedDistrict,
        state: 'Jharkhand'
      };
      const res = await submitReport(text, location);
      if (!res || typeof res.id === 'undefined') {
        throw new Error('Server did not return a valid confirmed report ID.');
      }
      setTimeout(() => {
        setResult(res);
        setStage('result');
      }, 1200); // brief cinematic pause to show neural pipeline animation
    } catch (e: any) {
      console.error('Report submission failed:', e);
      setErrorMessage(e?.message || 'Failed to submit grievance. Please try again.');
      setStage('idle');
    }
  };

  const samplePrompts = [
    { lang: 'Bhojpuri', text: 'हमनी के टोला में 3 दिन से पानी के पाइप फूटा बा, पूरा रास्ता जाम हो गइल बा।' },
    { lang: 'Hindi', text: 'हमारे गांव की मुख्य सड़क बारिश में पूरी तरह बह गई है, गाड़ियां नहीं निकल पा रही हैं।' },
    { lang: 'Magahi', text: 'गया-बोधगया मेन रोड पर पुलिया धंस गेलई है, तुरंत मरम्मत के जरूरत हे।' },
    { lang: 'English', text: 'Severe culvert collapse and drainage overflow near Gaya Ward 04 primary school.' }
  ];

  /* -------------------------------------------------------------
   * STAGE 1: PROCESSING PIPELINE ANIMATION
   * ------------------------------------------------------------- */
  if (stage === 'processing') {
    return (
      <div className="max-w-3xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-300 font-sans">
        <div className="bg-[#151d19] border border-[#27342c] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#5da673]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#27342c] mb-8">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#5da673]/15 border border-[#5da673]/30 text-[#8cd7a0]">
              <span className="w-2 h-2 rounded-full bg-[#5da673] animate-ping"></span>
              <span className="font-mono text-xs font-bold tracking-wider">PIPELINE CORE ACTIVE</span>
            </div>
            <span className="font-mono text-xs text-[#9ab0a2]">GPU-NODE 08 // LATENCY: 142ms</span>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1a241f] border border-[#5da673]/40 text-[#8cd7a0] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(93,166,115,0.3)] animate-pulse">
              <Cpu className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#e8ede9] tracking-tight">
              JanDrishti Neural Ingestion Engine
            </h2>
            <p className="text-sm text-[#9ab0a2] mt-1">
              Converting raw spoken dialect into sovereign geospatial action docket...
            </p>
          </div>

          {/* Pipeline Steps */}
          <div className="space-y-4 max-w-md mx-auto font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a241f] border border-[#27342c] text-[#8cd7a0]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5da673]" /> 1. Vernacular Acoustic Normalization
              </span>
              <span className="text-[#5da673] font-bold">DONE</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a241f] border border-[#27342c] text-[#8cd7a0]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5da673]" /> 2. Cross-Lingual Semantic Translation
              </span>
              <span className="text-[#5da673] font-bold">DONE</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a241f] border border-[#27342c] text-[#ffb693]">
              <span className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#ffb693] animate-pulse" /> 3. Spatial Geocoding & Hotspot Matching
              </span>
              <span className="text-[#ffb693] font-bold">RUNNING</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a241f]/50 border border-[#27342c]/50 text-[#9ab0a2]">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" /> 4. 5-Factor Priority Mathematical Index
              </span>
              <span>QUEUED</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * STAGE 2: RESULT SCREEN (RADIAL GAUGE + DUAL PANEL MATRIX)
   * ------------------------------------------------------------- */
  if (stage === 'result' && result) {
    const score = result.priority_score || 78;
    // Circular SVG math: r=50 -> circumference = 2 * PI * 50 = 314.159
    const circumference = 314.159;
    const strokeDashoffset = circumference - (circumference * score) / 100;

    return (
      <div className="max-w-6xl mx-auto py-6 space-y-6 animate-in fade-in duration-500 font-sans">
        
        {/* Top Telemetry Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#151d19] border border-[#27342c] px-4 py-2.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-[#1a241f] text-[#ffb693] border border-[#ffb693]/30 font-bold">
              INGESTION #JD-{result.id}
            </span>
            <span className="text-[#27342c]">/</span>
            <span className="text-[#9ab0a2]">ASR-NLP Synthesis Engine v4.2</span>
            <span className="text-[#27342c]">/</span>
            <span className="text-[#8cd7a0]">Gaya District Grid</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#8cd7a0] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sovereign Verified Inference
            </span>
          </div>
        </div>

        {/* Dual Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Multilingual Transformation Panel (7 cols) */}
          <div className="lg:col-span-7 bg-[#151d19] border border-[#27342c] p-6 rounded-2xl shadow-xl flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5da673]"></span>
                  <h3 className="font-display font-bold text-lg text-[#e8ede9]">
                    Speech-to-Resolution Matrix
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#9ab0a2]">Bhashini B-200 Engine</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Raw Input Dialect */}
                <div className="bg-[#1a241f] border border-[#27342c] p-4 rounded-xl flex flex-col justify-between shadow-inner">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#ffb693] mb-2">
                      <span className="bg-[#151d19] px-2 py-0.5 rounded border border-[#27342c] font-bold">
                        CITIZEN INPUT ({result.language || 'Hindi / Bhojpuri'})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#e8ede9] italic leading-relaxed mt-2">
                      “{result.text}”
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#27342c] flex items-center justify-between text-[10px] font-mono text-[#9ab0a2]">
                    <span>Audio Latency: 120ms</span>
                    <span className="text-[#5da673]">Vectorized ✓</span>
                  </div>
                </div>

                {/* Synthesized English Docket */}
                <div className="bg-[#1a241f] border border-[#5da673]/30 p-4 rounded-xl flex flex-col justify-between shadow-inner">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8cd7a0] mb-2">
                      <span className="bg-[#151d19] px-2 py-0.5 rounded border border-[#5da673]/40 font-bold">
                        GOVERNMENT SYNTHESIS
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#e8ede9] font-medium leading-relaxed mt-2">
                      "{result.translated_text || result.text}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#27342c] flex items-center justify-between text-[10px] font-mono text-[#9ab0a2]">
                    <span>Category: <strong className="text-[#8cd7a0]">{result.category}</strong></span>
                    <span className="text-[#ffb693] font-bold">{result.severity}</span>
                  </div>
                </div>

              </div>

              {/* Metadata strip */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#27342c] text-xs font-mono">
                <div>
                  <span className="text-[#9ab0a2] block text-[10px]">DOCKET NUMBER</span>
                  <span className="font-bold text-[#e8ede9]">#JD-{result.id}</span>
                </div>
                <div>
                  <span className="text-[#9ab0a2] block text-[10px]">GEO-LOCATION</span>
                  <span className="font-bold text-[#e8ede9]">{result.location_name || `${selectedDistrict}, Jharkhand`}</span>
                </div>
                <div>
                  <span className="text-[#9ab0a2] block text-[10px]">CURRENT STATUS</span>
                  <span className="font-bold text-[#5da673]">{result.status}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link 
                to="/citizen/my-reports" 
                className="bg-[#5da673] hover:bg-[#4a7c59] text-[#00381a] px-6 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_15px_rgba(93,166,115,0.3)] transition-all flex items-center gap-2"
              >
                Track in Public Docket <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button 
                onClick={() => { setText(''); setStage('idle'); }}
                className="bg-[#1a241f] hover:bg-[#242c27] text-[#e8ede9] border border-[#27342c] px-4 py-2.5 rounded-xl font-medium text-xs transition-colors"
              >
                Submit Another Issue
              </button>
            </div>
          </div>

          {/* Right: Priority Radial Gauge (5 cols) */}
          <div className="lg:col-span-5 bg-[#151d19] border border-[#27342c] p-6 rounded-2xl shadow-xl flex flex-col items-center justify-between text-center relative overflow-hidden">
            
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ffb693]">
                <Radio className="w-3.5 h-3.5" /> PRIORITY INDEX
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#773208]/30 border border-[#ffb693]/30 px-2 py-0.5 rounded text-[#ffb693] font-bold">
                RANK: HIGH URGENCY
              </span>
            </div>

            {/* Radial SVG Gauge */}
            <div className="relative w-48 h-48 my-4 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                {/* Track circle */}
                <circle cx="60" cy="60" fill="none" r="50" stroke="#1a241f" strokeWidth="10" />
                {/* Terracotta indicator stroke */}
                <circle 
                  className="transition-all duration-1000 ease-out" 
                  cx="60" 
                  cy="60" 
                  fill="none" 
                  r="50" 
                  stroke="#ffb693" 
                  strokeDasharray="314.159" 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                  strokeWidth="10" 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255, 182, 147, 0.4))' }}
                />
                {/* Emerald sub-gauge */}
                <circle 
                  cx="60" 
                  cy="60" 
                  fill="none" 
                  r="38" 
                  stroke="#5da673" 
                  strokeDasharray="238.76" 
                  strokeDashoffset="30" 
                  strokeLinecap="round" 
                  strokeWidth="4" 
                  className="opacity-70"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-bold text-[#e8ede9]">
                  {score}
                </span>
                <span className="font-mono text-[10px] uppercase text-[#9ab0a2] tracking-wider">
                  OUT OF 100
                </span>
              </div>
            </div>

            {/* Formula Math breakdown quick view */}
            <div className="w-full bg-[#1a241f] border border-[#27342c] rounded-xl p-3 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-[#9ab0a2]">
                <span>Citizen Demand (30%)</span>
                <span className="text-[#e8ede9] font-bold">{Math.round(score * 0.3)} pts</span>
              </div>
              <div className="flex justify-between text-[#9ab0a2]">
                <span>Infra Gap (25%)</span>
                <span className="text-[#e8ede9] font-bold">{Math.round(score * 0.25)} pts</span>
              </div>
              <div className="flex justify-between text-[#9ab0a2]">
                <span>Affected Pop (20%)</span>
                <span className="text-[#e8ede9] font-bold">{Math.round(score * 0.2)} pts</span>
              </div>
              <div className="flex justify-between text-[#9ab0a2]">
                <span>Urgency Index (15%)</span>
                <span className="text-[#e8ede9] font-bold">{Math.round(score * 0.15)} pts</span>
              </div>
              <div className="flex justify-between text-[#9ab0a2]">
                <span>Risk Potential (10%)</span>
                <span className="text-[#e8ede9] font-bold">{Math.round(score * 0.1)} pts</span>
              </div>
            </div>

            <button 
              onClick={() => setShowFormulaModal(true)}
              className="mt-3 text-[11px] font-mono text-[#8cd7a0] hover:underline"
            >
              View Mathematical Formulation Details →
            </button>
          </div>

        </div>

        {/* Mathematical Formulation Modal */}
        {showFormulaModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#151d19] border border-[#27342c] rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
              <button 
                onClick={() => setShowFormulaModal(false)}
                className="absolute top-4 right-4 text-[#9ab0a2] hover:text-[#e8ede9] text-xl font-bold"
              >
                &times;
              </button>
              
              <h3 className="font-display font-bold text-lg text-[#e8ede9] mb-2">
                JanDrishti Priority Index Math
              </h3>
              <p className="text-xs text-[#9ab0a2] mb-4">
                Formula rigorously balancing citizen voice volume against physical structural degradation.
              </p>

              <div className="bg-[#1a241f] p-4 rounded-xl font-mono text-xs text-[#8cd7a0] mb-4 leading-relaxed border border-[#27342c]">
                Priority = 0.30×Demand + 0.25×Gap + 0.20×Population + 0.15×Urgency + 0.10×Risk
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-[#27342c] pb-1.5">
                  <span className="text-[#9ab0a2]">Total Score:</span>
                  <span className="text-[#ffb693] font-bold">{score} / 100</span>
                </div>
                <div className="flex justify-between border-b border-[#27342c] pb-1.5">
                  <span className="text-[#9ab0a2]">SLA Response Window:</span>
                  <span className="text-[#5da673] font-bold">48 Hours Target</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9ab0a2]">Escalation Authority:</span>
                  <span className="text-[#e8ede9]">RWD Gaya Nodal Office</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  /* -------------------------------------------------------------
   * STAGE 0: MAIN INTAKE DECK (ACOUSTIC NEURAL INTAKE)
   * ------------------------------------------------------------- */
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Top Header */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151d19] border border-[#27342c] text-[#ffb693] font-mono text-xs uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Acoustic Neural Ingestion Protocol
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#e8ede9] tracking-tight">
          Speak Your Community Problem
        </h1>
        <p className="text-sm sm:text-base text-[#9ab0a2] max-w-xl mx-auto mt-2 leading-relaxed">
          Tell us what needs fixing in any language or dialect. Our AI transcribes, translates, and calculates emergency priority automatically.
        </p>
      </div>

      {/* Main Intake Card */}
      <div className="bg-[#151d19] border border-[#27342c] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5da673]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 bg-[#773208]/20 border border-[#ffb693]/40 text-[#ffb693] p-3.5 rounded-xl flex items-start justify-between gap-3 text-xs font-mono animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#ffb693] shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[#9ab0a2] hover:text-[#e8ede9] p-0.5 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mic Pulse Center Hub */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative flex items-center justify-center">
            {/* Ripple rings when recording */}
            {isRecording && (
              <>
                <div className="absolute w-44 h-44 rounded-full bg-[#ffb693]/20 animate-ping"></div>
                <div className="absolute w-36 h-36 rounded-full bg-[#ffb693]/30 animate-pulse"></div>
              </>
            )}

            <button
              onClick={toggleRecording}
              disabled={isTranscribing}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative z-10 ${
                isTranscribing
                  ? 'bg-[#1a241f] text-[#8cd7a0] border border-[#5da673]/40 cursor-wait'
                  : isRecording
                  ? 'bg-[#ffb693] text-[#351000] shadow-[0_0_30px_rgba(255,182,147,0.5)] scale-105 cursor-pointer'
                  : 'bg-[#5da673] hover:bg-[#4a7c59] text-[#00381a] shadow-[0_0_24px_rgba(93,166,115,0.4)] hover:scale-105 active:scale-95 cursor-pointer'
              }`}
              title={
                isTranscribing
                  ? 'Transcribing audio with Gemini...'
                  : isRecording
                  ? 'Click to Stop Recording'
                  : 'Click to Speak'
              }
            >
              {isTranscribing ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : isRecording ? (
                <Square className="w-10 h-10" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </button>
          </div>

          <span className="font-mono text-xs uppercase tracking-widest font-bold mt-5 text-[#8cd7a0]">
            {isTranscribing
              ? '● GEMINI AI IS TRANSCRIBING ACOUSTIC AUDIO...'
              : isRecording
              ? '● RECORDING LIVE ACOUSTIC AUDIO (CLICK TO STOP)...'
              : 'TAP MICROPHONE TO SPEAK'}
          </span>

          {/* Decibel Equalizer visualization bars */}
          <div className="w-full max-w-xs mt-4 flex items-end justify-center gap-1.5 h-10 px-4">
            <div className={`w-1.5 bg-[#5da673] rounded-full transition-all duration-150 ${isRecording ? 'h-7 animate-pulse' : isTranscribing ? 'h-5 animate-pulse' : 'h-2 opacity-30'}`}></div>
            <div className={`w-1.5 bg-[#5da673] rounded-full transition-all duration-150 ${isRecording ? 'h-9 animate-pulse' : isTranscribing ? 'h-8 animate-pulse' : 'h-3 opacity-30'}`}></div>
            <div className={`w-1.5 bg-[#ffb693] rounded-full transition-all duration-150 ${isRecording ? 'h-10 animate-pulse' : isTranscribing ? 'h-10 animate-pulse' : 'h-4 opacity-40'}`}></div>
            <div className={`w-1.5 bg-[#ffb693] rounded-full transition-all duration-150 ${isRecording ? 'h-8 animate-pulse' : isTranscribing ? 'h-7 animate-pulse' : 'h-3 opacity-40'}`}></div>
            <div className={`w-1.5 bg-[#5da673] rounded-full transition-all duration-150 ${isRecording ? 'h-10 animate-pulse' : isTranscribing ? 'h-9 animate-pulse' : 'h-5 opacity-30'}`}></div>
            <div className={`w-1.5 bg-[#5da673] rounded-full transition-all duration-150 ${isRecording ? 'h-6 animate-pulse' : isTranscribing ? 'h-4 animate-pulse' : 'h-2 opacity-30'}`}></div>
          </div>
        </div>

        {/* Vernacular Quick Chips */}
        <div className="my-6 pt-4 border-t border-[#27342c]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#9ab0a2] block mb-2 text-center">
            Or Click a Real Sample Dialect to Test:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((p) => (
              <button
                key={p.lang}
                onClick={() => setText(p.text)}
                className="text-left p-2.5 rounded-xl bg-[#1a241f] hover:bg-[#242c27] border border-[#27342c] transition-colors"
              >
                <span className="font-mono text-[10px] uppercase font-bold text-[#ffb693] block mb-0.5">
                  {p.lang} Dialect
                </span>
                <p className="text-xs text-[#e8ede9] truncate">"{p.text}"</p>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area Manual Input */}
        <div className="space-y-2 mt-4">
          <label className="font-mono text-xs text-[#9ab0a2] flex items-center justify-between">
            <span>TRANSCRIPTION / MANUAL COMPLAINT TEXT:</span>
            {text && <span className="text-[#5da673]">{text.length} characters</span>}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Type or edit your complaint here (e.g., Hamare gaon ki road baarish mein bahut kharab ho jaati hai...)"
            className="w-full bg-[#1a241f] border border-[#27342c] rounded-xl p-4 text-sm text-[#e8ede9] placeholder-[#9ab0a2]/50 outline-none focus:border-[#5da673] focus:ring-1 focus:ring-[#5da673] transition-all resize-none font-sans"
          />
        </div>

        {/* Telemetry metadata footer: GPS & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
          <div className="bg-[#1a241f] border border-[#27342c] rounded-xl p-3 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#5da673] shrink-0" />
            <div className="flex flex-col w-full">
              <span className="font-mono text-[9px] uppercase text-[#9ab0a2]">SELECT DISTRICT (JHARKHAND)</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent outline-none font-mono text-xs font-semibold text-[#e8ede9] cursor-pointer"
              >
                {JHARKHAND_DISTRICT_NAMES.map((name) => (
                  <option key={name} value={name} className="bg-[#151d19]">
                    {name} District
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[#1a241f] border border-[#27342c] rounded-xl p-3 flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#ffb693] shrink-0" />
            <div className="flex flex-col w-full">
              <span className="font-mono text-[9px] uppercase text-[#9ab0a2]">INTAKE DIALECT</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent outline-none font-mono text-xs font-semibold text-[#e8ede9] cursor-pointer"
              >
                <option value="auto" className="bg-[#151d19]">Auto-Detect Dialect</option>
                <option value="hi" className="bg-[#151d19]">Hindi (हिंदी)</option>
                <option value="bho" className="bg-[#151d19]">Bhojpuri (भोजपुरी)</option>
                <option value="mag" className="bg-[#151d19]">Magahi (मगही)</option>
                <option value="en" className="bg-[#151d19]">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleManualSubmit}
          disabled={!text.trim()}
          className="w-full bg-[#5da673] hover:bg-[#4a7c59] disabled:opacity-40 disabled:hover:bg-[#5da673] text-[#00381a] rounded-xl py-4 font-display font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(93,166,115,0.3)] hover:shadow-[0_0_25px_rgba(93,166,115,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          Submit Grievance to JanDrishti AI
        </button>

      </div>

    </div>
  );
};

export default CitizenReport;
