import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Search, 
  AlertTriangle, 
  HeartCrack, 
  Banknote, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Layers,
  Database,
  Tag,
  Sparkles,
  Camera,
  Check
} from 'lucide-react';

interface HomeProps {
  onVerify: (code: string) => void;
  onNavigateToVerify: () => void;
  onNavigateToComplaints: () => void;
  onNavigateToSource: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onVerify,
  onNavigateToVerify,
  onNavigateToComplaints,
  onNavigateToSource
}) => {
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onVerify(inputCode.trim());
    }
  };

  const handlePresetClick = (code: string) => {
    setInputCode(code);
    onVerify(code);
  };

  return (
    <div className="space-y-16 py-8">
      
      {/* 1. HERO SECTION WITH ATTRACTIVE AMBIENT BACKDROP */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/90 via-blue-50/40 to-slate-50/80 border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12 bg-subtle-grid">
        
        {/* Decorative soft glowing orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-white/90 border border-blue-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>TrueTag™ Verification Engine</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-semibold normal-case">Anti-Counterfeiting Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              Protect Authenticity Before You Purchase or Unbox
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Counterfeits deceive millions of consumers every year. Enter your unique product code or scan the TrueTag holographic QR code to immediately verify authentic manufacturer records.
            </p>

            {/* Verification Form Card */}
            <div className="bg-white/95 backdrop-blur-md p-5 sm:p-7 rounded-2xl border border-slate-200/90 shadow-md shadow-slate-200/50 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Enter Unique Serial Code
                  </label>
                  <button
                    type="button"
                    onClick={onNavigateToVerify}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Open Optical Camera Scanner &rarr;
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="e.g. APPL-9821-X901"
                      className="w-full pl-11 pr-4 py-3.5 text-base font-mono font-bold tracking-wide uppercase bg-slate-50/80 border border-slate-300/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 shadow-inner"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 transition-all rounded-xl shadow-sm shadow-blue-500/25 cursor-pointer whitespace-nowrap"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Verify Product
                  </button>
                </div>

                {/* Instant Test Presets */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
                    <span className="font-semibold text-slate-700">Quick Test Scenarios:</span>
                    <button
                      type="button"
                      onClick={() => handlePresetClick('APPL-9821-X901')}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/90 rounded-md font-mono font-medium hover:bg-emerald-100 cursor-pointer transition-colors"
                      title="1st scan authentic test"
                    >
                      APPL-9821-X901 (Genuine)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetClick('NIKE-AIR-8899')}
                      className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-md font-mono font-medium hover:bg-amber-100 cursor-pointer transition-colors"
                      title="Repeated scan suspicious test"
                    >
                      NIKE-AIR-8899 (Suspicious)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetClick('RECALLED-BAT-001')}
                      className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200/90 rounded-md font-mono font-medium hover:bg-rose-100 cursor-pointer transition-colors"
                      title="Blocked recall test"
                    >
                      RECALLED-BAT-001 (Invalid)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetClick('FAKE-CODE-999')}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-mono font-medium hover:bg-slate-200 cursor-pointer transition-colors"
                      title="Unregistered test"
                    >
                      FAKE-CODE-999 (Not Found)
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Trust Markers */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Relational MySQL & JDBC Integrity
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Scan Frequency Anomaly Guard
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Admin Outcome Superpowers
              </span>
            </div>
          </div>

          {/* Right Visual Image Showcase */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Primary Showcase Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/90 bg-white group">
              <img
                src="/src/assets/images/hero_product_verification_1793253028095.jpg"
                alt="Product packaging with cryptographic security seal"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-white/95 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-800">TrueTag Tamper-Evident Seal</span>
                  <span className="font-mono text-blue-600 font-bold">ZXing QR 25x25</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  Unique serial codes are assigned at authorized manufacturing plants and permanently logged before consumer distribution.
                </p>
              </div>
            </div>

            {/* Secondary Trust Strip with Hologram Seal Image */}
            <div className="flex items-center gap-3 p-3 bg-white/90 rounded-xl border border-slate-200/80 shadow-2xs">
              <img
                src="/src/assets/images/security_tamper_shield_1793253028647.jpg"
                alt="Macro holographic security seal"
                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Cryptographic Anti-Copy Protection</span>
                <span className="text-[11px] text-slate-500">Duplicated or re-scanned tags trigger instant Suspicious flags.</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. THE SERIOUS RISKS OF FAKE PRODUCTS */}
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-block text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Consumer Safety Notice
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            The Critical Risks of Counterfeit Goods
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Illicit knockoffs cause tangible real-world harm. Here is why proactive verification matters:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
              <HeartCrack className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Health & Life Hazards</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Counterfeit lithium batteries risk sudden thermal runaway and residential fires. Fake cosmetics and pharmaceuticals contain banned chemical toxins, heavy metals (lead/mercury), and zero active therapeutic ingredients.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
              <Banknote className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Total Financial Loss</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Consumers pay authentic premium retail prices for brittle copies. Fake goods carry zero warranty, are ineligible for service centers, and cannot be resold without committing fraud.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Organized Illicit Trade</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Illicit supply chains evade safety testing, operate unregulated labor factories, and siphon billions from lawful manufacturers who invest in research, patents, and safety compliance.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW TRUETAG ARCHITECTURE WORKS */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            System Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How TrueTag Validates Authenticity
          </h2>
          <p className="text-sm text-slate-600">
            A three-tier verification pipeline connecting manufacturers, relational databases, and retail customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono shadow-xs">1</span>
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Manufacturer Provisioning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized manufacturers register products with unique cryptographic codes. The system generates high-density ZXing QR tags printed on tamper-evident packaging.
            </p>
          </div>

          <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono shadow-xs">2</span>
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Relational Database & JDBC</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Each query hits indexed MySQL tables via prepared statements. The engine validates product existence, active production status, and logs customer IP telemetry.
            </p>
          </div>

          <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono shadow-xs">3</span>
              <ShieldAlert className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Scan Frequency Analysis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an authentic serial number is copied and mass-printed onto 100 counterfeit units, the system flags scans beyond threshold (3 scans) as <strong>SUSPICIOUS</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onNavigateToVerify}
            className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-blue-500/25 cursor-pointer"
          >
            Launch TrueTag Verifier
          </button>
          <button
            onClick={onNavigateToSource}
            className="w-full sm:w-auto px-7 py-3 bg-white text-slate-700 border border-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Inspect Java Servlets Source Code &rarr;
          </button>
        </div>
      </section>

    </div>
  );
};
