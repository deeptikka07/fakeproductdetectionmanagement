import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Flag, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Tag, 
  Hash, 
  AlertOctagon,
  Info,
  Copy,
  Check,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VerificationEvaluation } from '../types';

interface ResultPageProps {
  evaluation: VerificationEvaluation;
  onVerifyAnother: () => void;
  onFileComplaint: (code: string) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  evaluation,
  onVerifyAnother,
  onFileComplaint
}) => {
  const { result, product, manufacturer, totalScanCount, threshold, verificationDate, verificationTime, message } = evaluation;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result === 'GENUINE') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  const copyCode = () => {
    const code = product?.productCode || evaluation.product?.productCode || '';
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      
      {/* Top Banner & Status Badge */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
        
        {/* Dynamic Status Header */}
        {result === 'GENUINE' && (
          <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 text-white p-7 sm:p-9 text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mx-auto mb-2 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold uppercase tracking-wider">
              TrueTag™ Verification Passed
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              VERIFIED GENUINE PRODUCT
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto">
              Authentic record confirmed in official manufacturer registry.
            </p>
          </div>
        )}

        {result === 'SUSPICIOUS' && (
          <div className="bg-gradient-to-b from-amber-500 to-amber-600 text-white p-7 sm:p-9 text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-900/30 backdrop-blur-xs flex items-center justify-center mx-auto mb-2 shadow-inner">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <div className="inline-block px-3.5 py-1 bg-amber-900/40 backdrop-blur-xs rounded-full text-xs font-bold uppercase tracking-wider">
              Security Anomaly · Scan Limit Exceeded
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SUSPICIOUS PRODUCT CODE
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm max-w-lg mx-auto">
              This unique serial number has been scanned <strong>{totalScanCount} times</strong> across different sessions (Threshold is {threshold}). High likelihood of packaging duplication or cloned counterfeit labels.
            </p>
          </div>
        )}

        {result === 'INVALID' && (
          <div className="bg-gradient-to-b from-rose-600 to-rose-700 text-white p-7 sm:p-9 text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mx-auto mb-2 shadow-inner">
              <AlertOctagon className="w-10 h-10 text-white" />
            </div>
            <div className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold uppercase tracking-wider">
              Revocation Alert
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              INVALID / RECALLED PRODUCT
            </h1>
            <p className="text-rose-100 text-xs sm:text-sm max-w-md mx-auto">
              Product status has been blocked or recalled by manufacturer authorization. Do not consume or operate.
            </p>
          </div>
        )}

        {result === 'NOT_FOUND' && (
          <div className="bg-gradient-to-b from-slate-700 to-slate-800 text-white p-7 sm:p-9 text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto mb-2 shadow-inner">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <div className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold uppercase tracking-wider">
              Unrecognized Security Token
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              CODE NOT FOUND IN DATABASE
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-md mx-auto">
              No matching manufacturing record found. High probability of counterfeit item.
            </p>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Detailed Message Box */}
          <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
            result === 'GENUINE' 
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950' 
              : result === 'SUSPICIOUS' 
              ? 'bg-amber-50/90 border-amber-300 text-amber-950' 
              : result === 'INVALID'
              ? 'bg-rose-50/90 border-rose-200 text-rose-950'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 shrink-0" />
              <span>TrueTag System Evaluation:</span>
            </div>
            <p className="text-xs sm:text-sm">{message}</p>
          </div>

          {/* Product Specifications Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Product & Registration Telemetry
              </h2>
              <button
                onClick={copyCode}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Code Copied' : 'Copy Serial Code'}
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white text-xs sm:text-sm shadow-2xs">
              <div className="grid grid-cols-3 p-3.5 bg-slate-50/60">
                <span className="font-semibold text-slate-500">Scanned Serial Code</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">
                  {product?.productCode || evaluation.product?.productCode || 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3.5">
                <span className="font-semibold text-slate-500">Product Name</span>
                <span className="col-span-2 font-bold text-slate-900">
                  {product?.productName || 'Unregistered Item'}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3.5 bg-slate-50/60">
                <span className="font-semibold text-slate-500">Brand</span>
                <span className="col-span-2 text-slate-800 font-medium">
                  {product?.brand || 'Unidentified'}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3.5">
                <span className="font-semibold text-slate-500">Authorized Manufacturer</span>
                <span className="col-span-2 text-slate-800">
                  {manufacturer ? (
                    <div>
                      <div className="font-bold text-slate-900">{manufacturer.manufacturerName}</div>
                      <div className="text-[11px] text-slate-500">{manufacturer.address}</div>
                    </div>
                  ) : (
                    'Not linked to verified manufacturer'
                  )}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3.5 bg-slate-50/60">
                <span className="font-semibold text-slate-500">Manufacturing Date</span>
                <span className="col-span-2 text-slate-800 font-mono">
                  {product?.manufacturingDate || 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-3 p-3.5">
                <span className="font-semibold text-slate-500">Verification Timestamp</span>
                <span className="col-span-2 text-slate-800 font-mono">
                  {verificationDate} at {verificationTime} UTC
                </span>
              </div>

              <div className="grid grid-cols-3 p-3.5 bg-slate-50/60">
                <span className="font-semibold text-slate-500">Historical Scans Recorded</span>
                <span className="col-span-2 font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    totalScanCount > threshold ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {totalScanCount} scan(s) in central ledger
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* CRITICAL SECURITY ADVISORY */}
          <div className="p-4 rounded-2xl border border-blue-200/80 bg-blue-50/60 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>TrueTag™ Consumer Security Advisory</span>
            </div>
            <p className="leading-relaxed">
              <strong>Notice:</strong> An authentic code result provides basic digital cryptographic verification. Illicit counterfeiters frequently attempt to duplicate packaging or copy valid QR codes onto multiple fake units. Always verify physical tamper seals, examine laser-etched holograms, and ensure purchases are completed through certified distributors.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onVerifyAnother}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Verify Another Product
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print Certificate
            </button>

            {result !== 'GENUINE' && (
              <button
                onClick={() => onFileComplaint(product?.productCode || '')}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <Flag className="w-4 h-4" />
                Report Counterfeit / File Grievance
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
