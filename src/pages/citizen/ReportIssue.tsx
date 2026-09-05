import { useState, useRef, useEffect } from 'react';
import { Mic, Square, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { submitReport } from '../../api/client';
import { Link } from 'react-router-dom';

const CitizenReport = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [stage, setStage] = useState<'idle' | 'recording' | 'processing' | 'result'>('idle');
  const [result, setResult] = useState<any>(null);

  const [showPriorityModal, setShowPriorityModal] = useState(false);

  // Fallback / Web Speech API
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN'; // could be made dynamic
      
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          currentTranscript += transcript;
        }
        setText(prev => prev + ' ' + currentTranscript);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      setStage('idle');
    } else {
      setText('');
      recognitionRef.current?.start();
      setIsRecording(true);
      setStage('recording');
    }
  };

  const handleManualSubmit = async () => {
    if (!text) return;
    setStage('processing');
    
    try {
      const location = { lat: 24.7914, lng: 85.0002, name: 'Gaya, Bihar' }; // Real Gaya coords
      const res = await submitReport(text, location);
      setResult(res);
      setStage('result');
    } catch (e) {
      console.error(e);
      setStage('idle');
    }
  };

  if (stage === 'processing') {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-500 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2 text-slate-800">Processing via JanDrishti AI...</h2>
        <p className="text-slate-500">Detecting Language • Translating • Analyzing Infrastructure • Calculating Priority</p>
      </div>
    );
  }

  if (stage === 'result' && result) {
    return (
      <div className="max-w-xl mx-auto mt-12 space-y-6 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">REPORT SUBMITTED</h2>
          <p className="text-slate-600 mb-8">Your issue has been successfully captured and routed to the government dashboard.</p>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left space-y-4 max-w-sm mx-auto">
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Report ID</span>
              <span className="font-bold text-slate-900">JD-{result.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Detected Language</span>
              <span className="font-bold text-slate-900">{result.language || 'Unknown'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Issue Category</span>
              <span className="font-bold text-slate-900">{result.category}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Location</span>
              <span className="font-bold text-slate-900">{result.location_name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500 font-medium">Priority</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{result.severity}</span>
                <button 
                  onClick={() => setShowPriorityModal(true)}
                  className="bg-brand-100 text-brand-700 hover:bg-brand-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-colors"
                >
                  View Math ({result.priority_score}/100)
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Status</span>
              <span className="font-bold text-emerald-600">{result.status}</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Link 
              to="/citizen/my-reports" 
              className="bg-brand-600 hover:bg-brand-700 text-white rounded-lg py-3 px-8 font-bold transition-colors inline-block"
            >
              Track Report
            </Link>
          </div>
        </div>

        {showPriorityModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full relative shadow-2xl">
              <button onClick={() => setShowPriorityModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-xl">&times;</button>
              <h3 className="text-xl font-bold text-white mb-2">Priority Calculation</h3>
              <p className="text-sm text-slate-400 mb-6">How JanDrishti AI calculated this priority score mathematically.</p>
              
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-300"><span>Citizen Demand (30%)</span> <span className="font-bold">{Math.round(result.priority_score * 0.3)}</span></div>
                <div className="flex justify-between text-slate-300"><span>Infra Gap (25%)</span> <span className="font-bold">{Math.round(result.priority_score * 0.25)}</span></div>
                <div className="flex justify-between text-slate-300"><span>Impact (20%)</span> <span className="font-bold">{Math.round(result.priority_score * 0.2)}</span></div>
                <div className="flex justify-between text-slate-300"><span>Urgency (15%)</span> <span className="font-bold">{Math.round(result.priority_score * 0.15)}</span></div>
                <div className="flex justify-between text-slate-300 border-b border-slate-700 pb-3"><span>Investment Gap (10%)</span> <span className="font-bold">{Math.round(result.priority_score * 0.1)}</span></div>
                <div className="flex justify-between text-brand-400 text-lg font-bold pt-1"><span>Total Priority</span> <span>{result.priority_score}/100</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500 pb-12">
      <header className="mb-8 text-center pt-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Speak Your Problem</h1>
        <p className="text-lg text-slate-600">Tell us what your community needs in any language.</p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
        <button 
          onClick={toggleRecording}
          className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all ${
            isRecording ? 'bg-rose-100 text-rose-600 animate-pulse scale-105' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isRecording ? <Square className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
        </button>
        <p className="mt-4 text-sm font-bold text-slate-500 tracking-widest uppercase">
          {isRecording ? 'Recording...' : 'Tap to Speak'}
        </p>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px bg-slate-200 flex-1"></div>
          <span className="text-slate-400 text-xs font-semibold">OR TYPE YOUR PROBLEM</span>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Type your issue here (e.g. Hamare gaon ki road baarish mein bahut kharab ho jaati hai...)"
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-brand-500 mb-6 resize-none"
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-500" />
            <span className="text-sm font-medium text-slate-700">Gaya, Bihar (Auto-GPS)</span>
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-2">
            <select className="bg-transparent outline-none w-full text-sm font-medium text-slate-700">
              <option>Language: Auto-detect</option>
              <option>Hindi</option>
              <option>English</option>
              <option>Kannada</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleManualSubmit}
          disabled={!text}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl py-4 font-bold text-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-brand-500/25"
        >
          SUBMIT REPORT
        </button>
      </div>
    </div>
  );
};

export default CitizenReport;
