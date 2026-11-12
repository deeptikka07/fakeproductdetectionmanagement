import React, { useState } from 'react';
import { 
  Flag, 
  Send, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  FileText,
  HelpCircle
} from 'lucide-react';
import { Complaint, Product } from '../types';

interface ComplaintPageProps {
  complaints: Complaint[];
  products: Product[];
  onSubmitComplaint: (complaint: Omit<Complaint, 'complaintId' | 'complaintDate' | 'status'>) => void;
  defaultProductCode?: string;
}

export const ComplaintPage: React.FC<ComplaintPageProps> = ({
  complaints,
  products,
  onSubmitComplaint,
  defaultProductCode = ''
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Submit Form States
  const [productCode, setProductCode] = useState(defaultProductCode);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState<number | null>(null);

  // Track Form States
  const [trackQuery, setTrackQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productCode.trim() || !description.trim()) return;

    const created = onSubmitComplaint({
      productCode: productCode.trim().toUpperCase(),
      userName: userName.trim() || 'Anonymous Consumer',
      userEmail: userEmail.trim() || 'consumer@mail.com',
      description: description.trim()
    });

    setSubmittedSuccess(100 + Math.floor(Math.random() * 900));
    setProductCode('');
    setDescription('');
  };

  const matchingComplaints = complaints.filter(c => {
    if (!trackQuery.trim()) return false;
    const q = trackQuery.trim().toLowerCase();
    return c.productCode.toLowerCase().includes(q) ||
           String(c.complaintId) === q ||
           c.userName.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200">
          <Flag className="w-3.5 h-3.5" />
          <span>TrueTag™ Consumer Grievance & Counterfeit Investigation Cell</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          File or Track a Counterfeit Product Report
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Help regulatory bodies and brand protection teams eliminate illicit goods by reporting suspicious serial codes, counterfeit packaging, or retailer fraud.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold text-slate-600">
        <button
          onClick={() => { setActiveTab('submit'); setSubmittedSuccess(null); }}
          className={`pb-3 cursor-pointer transition-colors ${
            activeTab === 'submit' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-900'
          }`}
        >
          Submit New Complaint
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`pb-3 cursor-pointer transition-colors ${
            activeTab === 'track' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-900'
          }`}
        >
          Track Grievance Status ({complaints.length})
        </button>
      </div>

      {/* TAB 1: SUBMIT COMPLAINT */}
      {activeTab === 'submit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          {submittedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs sm:text-sm space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Grievance Successfully Registered! Reference ID: #{submittedSuccess}
              </div>
              <p className="text-emerald-700">
                Your report has been submitted to the compliance database. Administrators review suspicious lot entries within 24–48 hours.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Serial Code / Barcode Queried <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value.toUpperCase())}
                placeholder="e.g. NIKE-AIR-8899"
                className="w-full px-4 py-2.5 font-mono uppercase bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Email Address (for Resolution Notice)
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Description of Defect / Counterfeit Evidence <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe where the item was purchased (retail shop name or website URL), packaging discrepancies, unusual smells, blurry barcode print, or system verification warnings..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
              Submitted grievances are recorded into the MySQL <code>COMPLAINT</code> table and reviewed directly by system administrators.
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Submit Grievance to Compliance Cell
            </button>
          </form>

        </div>
      )}

      {/* TAB 2: TRACK STATUS */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Lookup Existing Grievance Status
            </h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => { setTrackQuery(e.target.value); setSearched(true); }}
                  placeholder="Search by Product Code (e.g. NIKE-AIR-8899) or Complaint ID..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* List of Complaints */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {trackQuery.trim() ? 'Matching Records' : 'All Recent Complaints'}
            </h4>

            {(trackQuery.trim() ? matchingComplaints : complaints).map((c) => (
              <div key={c.complaintId} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">#{c.complaintId}</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{c.productCode}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Submitted on <span className="font-mono">{c.complaintDate}</span> by {c.userName}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    c.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : c.status === 'REVIEWED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed">
                  "{c.description}"
                </p>

                {c.adminRemarks ? (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-xs text-blue-900 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide text-blue-700">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Official Investigation Resolution:
                    </span>
                    <p className="leading-relaxed">{c.adminRemarks}</p>
                    {c.resolvedAt && (
                      <span className="text-[10px] text-blue-600 block font-mono">
                        Resolved on {c.resolvedAt}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Pending compliance officer review and store dispatch.
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
