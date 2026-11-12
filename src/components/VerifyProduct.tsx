import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCode, 
  Keyboard, 
  Camera, 
  ShieldCheck, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Video,
  VideoOff
} from 'lucide-react';
import { ProductDatabaseService } from '../data/sampleData';

interface VerifyProductProps {
  onVerify: (code: string) => void;
  defaultCode?: string;
}

export const VerifyProduct: React.FC<VerifyProductProps> = ({ onVerify, defaultCode = '' }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'camera' | 'upload'>('manual');
  const [code, setCode] = useState(defaultCode);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanSimulating, setScanSimulating] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (defaultCode) {
      setCode(defaultCode);
    }
  }, [defaultCode]);

  // Clean up camera stream on unmount or tab switch
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access error or sandbox restriction:', err);
      setCameraError('Camera access unavailable or blocked in this browser environment. You can use the instant barcode simulator below or upload a QR image.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleTabChange = (tab: 'manual' | 'camera' | 'upload') => {
    if (activeTab === 'camera' && tab !== 'camera') {
      stopCamera();
    }
    setActiveTab(tab);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onVerify(code.trim());
    }
  };

  // Simulate instant optical QR scan from camera
  const triggerCameraScanSimulation = (simCode: string) => {
    setScanSimulating(true);
    setTimeout(() => {
      setScanSimulating(false);
      stopCamera();
      onVerify(simCode);
    }, 900);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate reading QR tag from uploaded image file
      setScanSimulating(true);
      setTimeout(() => {
        setScanSimulating(false);
        // Extract known code or default
        onVerify('NIKE-AIR-4421');
      }, 1000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>TrueTag Verification Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verify Product Authenticity
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Scan the TrueTag encrypted packaging QR code or enter the printed serial number to validate against manufacturer records.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
        
        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
          <button
            onClick={() => handleTabChange('manual')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            Enter Serial Code
          </button>

          <button
            onClick={() => handleTabChange('camera')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            Live Camera Scanner
          </button>

          <button
            onClick={() => handleTabChange('upload')}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload QR Image
          </button>
        </div>

        {/* Tab 1: Manual Code Input */}
        {activeTab === 'manual' && (
          <div className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                  Unique Product Code (Alphanumeric)
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. APPL-9821-X901"
                  className="w-full px-4 py-3 text-lg font-mono font-bold tracking-wider uppercase bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-sm placeholder:text-slate-400"
                  required
                  autoFocus
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Codes are typically 10 to 16 characters (e.g., printed below the barcode or on the scratch-off authenticity seal).
                </p>
              </div>

              {/* Sample Presets */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Select a test scenario to evaluate:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => { setCode('APPL-9821-X901'); onVerify('APPL-9821-X901'); }}
                    className="p-2 text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded text-xs transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-emerald-800 block">1. Genuine</span>
                    <span className="font-mono text-[10px] text-emerald-700">APPL-9821-X901</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCode('NIKE-AIR-8899'); onVerify('NIKE-AIR-8899'); }}
                    className="p-2 text-left bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded text-xs transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-amber-800 block">2. Suspicious</span>
                    <span className="font-mono text-[10px] text-amber-700">NIKE-AIR-8899</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCode('RECALLED-BAT-001'); onVerify('RECALLED-BAT-001'); }}
                    className="p-2 text-left bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded text-xs transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-rose-800 block">3. Invalid/Recall</span>
                    <span className="font-mono text-[10px] text-rose-700">RECALLED-BAT-001</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCode('FAKE-9999-XYZ'); onVerify('FAKE-9999-XYZ'); }}
                    className="p-2 text-left bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-slate-800 block">4. Not Found</span>
                    <span className="font-mono text-[10px] text-slate-600">FAKE-9999-XYZ</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                <ShieldCheck className="w-5 h-5" />
                Run Verification Check
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Live Camera Scanner */}
        {activeTab === 'camera' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            
            <div className="relative mx-auto w-full max-w-sm aspect-square bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-blue-400">
              
              {/* Video Element */}
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {/* Viewfinder Overlay Frame */}
              <div className="absolute inset-8 border-2 border-blue-400/80 rounded-lg pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-blue-400/70 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              </div>

              {/* Inactive Placeholder */}
              {!cameraActive && (
                <div className="p-6 text-center text-slate-300 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-blue-400">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Align QR code inside frame. Ensure proper room illumination.
                  </p>
                </div>
              )}

              {/* Scanning indicator */}
              {scanSimulating && (
                <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-xs flex items-center justify-center text-white space-y-2 flex-col">
                  <RefreshCw className="w-8 h-8 animate-spin text-white" />
                  <span className="text-xs font-semibold">Decoding Barcode...</span>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Video className="w-4 h-4" />
                  Start Camera Feed
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <VideoOff className="w-4 h-4" />
                  Stop Camera
                </button>
              )}

              <button
                type="button"
                onClick={() => triggerCameraScanSimulation('APPL-9821-X901')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-300"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Simulate Camera Scan (Genuine)
              </button>
              <button
                type="button"
                onClick={() => triggerCameraScanSimulation('NIKE-AIR-8899')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-slate-300"
              >
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Simulate Camera Scan (Suspicious)
              </button>
            </div>

          </div>
        )}

        {/* Tab 3: Upload Image File */}
        {activeTab === 'upload' && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-500 transition-colors bg-slate-50/50">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800 mb-1">
                Upload Packaging QR Photo
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                Select an image file (PNG, JPG) taken from your product label or package sticker.
              </p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 cursor-pointer shadow-sm">
                Browse Image File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {scanSimulating && (
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Reading QR matrix and querying database...</span>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Security Advisory footer note */}
      <div className="text-xs text-slate-500 text-center max-w-lg mx-auto">
        Verification checks are recorded in the immutable audit log with timestamp, client IP, and result status for counterfeit trend monitoring.
      </div>

    </div>
  );
};
