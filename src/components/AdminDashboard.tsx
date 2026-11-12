import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Search, 
  Filter, 
  MessageSquare, 
  Users, 
  Building, 
  Ban, 
  Check, 
  Clock, 
  BarChart3,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet,
  Edit,
  Trash2,
  Sliders,
  Sparkles,
  HelpCircle,
  AlertOctagon
} from 'lucide-react';
import { Product, VerificationHistory, Complaint, Manufacturer, User, OutcomeOverride, VerificationResult } from '../types';
import { exportVerificationsToCSV } from '../utils/csvExport';

interface AdminDashboardProps {
  products: Product[];
  verifications: VerificationHistory[];
  complaints: Complaint[];
  manufacturers: Manufacturer[];
  users: User[];
  onToggleProductStatus: (productId: number, newStatus: 'ACTIVE' | 'BLOCKED') => void;
  onUpdateProductOutcome: (productId: number, outcome: OutcomeOverride) => void;
  onUpdateProduct: (productId: number, updates: Partial<Product>) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateVerificationOutcome: (verificationId: number, outcome: VerificationResult, notes?: string) => void;
  onDeleteVerification: (verificationId: number) => void;
  onDeleteUser: (userId: number) => void;
  onDeleteManufacturer: (manufacturerId: number) => void;
  onUpdateComplaint: (complaintId: number, status: 'PENDING' | 'REVIEWED' | 'RESOLVED', remarks: string) => void;
  onResetData: () => void;
  onVerifyCode: (code: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  verifications,
  complaints,
  manufacturers,
  users,
  onToggleProductStatus,
  onUpdateProductOutcome,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateVerificationOutcome,
  onDeleteVerification,
  onDeleteUser,
  onDeleteManufacturer,
  onUpdateComplaint,
  onResetData,
  onVerifyCode
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'audit' | 'complaints' | 'users'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [adminRemarkInput, setAdminRemarkInput] = useState('');
  const [complaintStatusInput, setComplaintStatusInput] = useState<'PENDING' | 'REVIEWED' | 'RESOLVED'>('REVIEWED');

  // Verification Edit Modal
  const [editingVerification, setEditingVerification] = useState<VerificationHistory | null>(null);
  const [verifNewOutcome, setVerifNewOutcome] = useState<VerificationResult>('GENUINE');
  const [verifNewNotes, setVerifNewNotes] = useState('');

  // Product Edit Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdBrand, setEditProdBrand] = useState('');
  const [editProdOutcome, setEditProdOutcome] = useState<OutcomeOverride>('DEFAULT');
  const [editProdStatus, setEditProdStatus] = useState<'ACTIVE' | 'BLOCKED'>('ACTIVE');

  // Stats calculation
  const totalProducts = products.length;
  const totalVerifications = verifications.length;
  const genuineCount = verifications.filter(v => v.result === 'GENUINE').length;
  const suspiciousCount = verifications.filter(v => v.result === 'SUSPICIOUS').length;
  const invalidCount = verifications.filter(v => v.result === 'INVALID').length;
  const notFoundCount = verifications.filter(v => v.result === 'NOT_FOUND').length;
  const pendingComplaints = complaints.filter(c => c.status === 'PENDING').length;

  // Identify frequently queried suspicious codes
  const codeFrequency: Record<string, number> = {};
  verifications.forEach(v => {
    codeFrequency[v.productCode] = (codeFrequency[v.productCode] || 0) + 1;
  });
  const suspiciousRepeatedCodes = Object.entries(codeFrequency)
    .filter(([_, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1]);

  // Filter verification audit log
  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = v.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (v.notes && v.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesResult = resultFilter === 'ALL' || v.result === resultFilter;
    return matchesSearch && matchesResult;
  });

  const filteredProducts = products.filter(p => {
    return p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.brand.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditProdName(p.productName);
    setEditProdBrand(p.brand);
    setEditProdOutcome(p.outcomeOverride || 'DEFAULT');
    setEditProdStatus(p.status);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct.productId, {
        productName: editProdName,
        brand: editProdBrand,
        outcomeOverride: editProdOutcome,
        status: editProdStatus
      });
      setEditingProduct(null);
    }
  };

  const handleOpenEditVerification = (v: VerificationHistory) => {
    setEditingVerification(v);
    setVerifNewOutcome(v.result);
    setVerifNewNotes(v.notes || '');
  };

  const handleSaveVerificationEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVerification) {
      onUpdateVerificationOutcome(editingVerification.verificationId, verifNewOutcome, verifNewNotes);
      setEditingVerification(null);
    }
  };

  const handleOpenComplaintModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setComplaintStatusInput(c.status);
    setAdminRemarkInput(c.adminRemarks || '');
  };

  const handleSaveComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedComplaint) {
      onUpdateComplaint(selectedComplaint.complaintId, complaintStatusInput, adminRemarkInput);
      setSelectedComplaint(null);
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Top Header & Admin Superpowers Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-900 mb-1">
            <Sliders className="w-3.5 h-3.5 text-purple-700" />
            <span>Administrator Super-User Mode (Full Read & Write & Outcome Override)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Administrator Central Command
          </h1>
          <p className="text-xs text-slate-500">
            You have full authority to modify any product, set product verification outcomes (Genuine, Suspicious, Invalid, Not Found), edit audit logs, resolve complaints, and manage users.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportVerificationsToCSV(verifications)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV Audit Report
          </button>

          <button
            onClick={onResetData}
            title="Reset database to default sample records"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Sample DB
          </button>
        </div>
      </div>

      {/* SUSPICIOUS CODE REPEATED SCANS ALERT BANNER */}
      {suspiciousRepeatedCodes.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-200/80 rounded-lg text-amber-900 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-amber-800" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-bold text-amber-900">
                Security Alert: Repeated Verification Anomaly Detected
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                The following product codes have exceeded the standard customer verification threshold. As Admin, you can click on any code to immediately test it or change its outcome to Genuine, Invalid, or Suspicious:
              </p>
              <div className="flex flex-wrap gap-2 pt-1.5">
                {suspiciousRepeatedCodes.map(([code, count]) => (
                  <button
                    key={code}
                    onClick={() => onVerifyCode(code)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-amber-300 rounded-md text-xs font-mono font-bold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <span>{code}</span>
                    <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded text-[10px] font-bold">
                      {count} scans
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* METRIC SCORECARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Products</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {totalProducts}
          </div>
          <div className="text-[11px] text-slate-500">
            {products.filter(p => p.status === 'ACTIVE').length} Active · {products.filter(p => p.status === 'BLOCKED').length} Blocked
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Verifications</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {totalVerifications}
          </div>
          <div className="text-[11px] text-slate-500">
            All customer attempts logged
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Suspicious Flags</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700">
            {suspiciousCount}
          </div>
          <div className="text-[11px] text-amber-700/80">
            &gt; 3 verification scans
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-rose-700 uppercase tracking-wide">Active Complaints</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-700">
            {pendingComplaints}
          </div>
          <div className="text-[11px] text-slate-500">
            {complaints.length} Total grievances filed
          </div>
        </div>
      </div>

      {/* OUTCOME DISTRIBUTION BARS */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">
              System Outcome Metrics (Chart.js Telemetry)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Total Queries: <strong className="font-mono text-slate-800">{totalVerifications}</strong>
          </span>
        </div>

        <div className="space-y-3">
          <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${totalVerifications ? (genuineCount / totalVerifications) * 100 : 0}%` }} 
              className="bg-emerald-500 h-full transition-all duration-500" 
              title={`Genuine: ${genuineCount}`}
            />
            <div 
              style={{ width: `${totalVerifications ? (suspiciousCount / totalVerifications) * 100 : 0}%` }} 
              className="bg-amber-500 h-full transition-all duration-500" 
              title={`Suspicious: ${suspiciousCount}`}
            />
            <div 
              style={{ width: `${totalVerifications ? (invalidCount / totalVerifications) * 100 : 0}%` }} 
              className="bg-rose-500 h-full transition-all duration-500" 
              title={`Invalid: ${invalidCount}`}
            />
            <div 
              style={{ width: `${totalVerifications ? (notFoundCount / totalVerifications) * 100 : 0}%` }} 
              className="bg-slate-400 h-full transition-all duration-500" 
              title={`Not Found: ${notFoundCount}`}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
              <span className="text-slate-600">Genuine:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {genuineCount} ({totalVerifications ? Math.round((genuineCount / totalVerifications) * 100) : 0}%)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-amber-500 shrink-0" />
              <span className="text-slate-600">Suspicious:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {suspiciousCount} ({totalVerifications ? Math.round((suspiciousCount / totalVerifications) * 100) : 0}%)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-rose-500 shrink-0" />
              <span className="text-slate-600">Invalid:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {invalidCount} ({totalVerifications ? Math.round((invalidCount / totalVerifications) * 100) : 0}%)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-slate-400 shrink-0" />
              <span className="text-slate-600">Not Found:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {notFoundCount} ({totalVerifications ? Math.round((notFoundCount / totalVerifications) * 100) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS FOR MANAGING THE SYSTEM */}
      <div className="space-y-4">
        
        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 cursor-pointer transition-colors ${
              activeTab === 'products' ? 'text-purple-600 border-b-2 border-purple-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Product Catalog & Outcome Control ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 cursor-pointer transition-colors ${
              activeTab === 'audit' ? 'text-purple-600 border-b-2 border-purple-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Verification Audit Log & Reclassification ({verifications.length})
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`relative pb-3 cursor-pointer transition-colors ${
              activeTab === 'complaints' ? 'text-purple-600 border-b-2 border-purple-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Complaints Management
            {pendingComplaints > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold bg-rose-100 text-rose-800 rounded">
                {pendingComplaints}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 cursor-pointer transition-colors ${
              activeTab === 'users' ? 'text-purple-600 border-b-2 border-purple-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Users & Manufacturers
          </button>
        </div>

        {/* TAB 1: PRODUCT CATALOG & OUTCOME CONTROL */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-purple-50/60 p-3 rounded-lg border border-purple-200">
              <div className="text-xs text-purple-900">
                <span className="font-bold block">Admin Outcome Override Feature:</span>
                You can change any product's outcome directly to <strong>GENUINE</strong>, <strong>SUSPICIOUS</strong>, <strong>INVALID</strong>, or <strong>NOT FOUND</strong>. When a customer scans or enters that code, it will immediately evaluate to your chosen outcome!
              </div>
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products or codes..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">SKU ID</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Brand</th>
                    <th className="py-2.5 px-3">Unique Code</th>
                    <th className="py-2.5 px-3">Active Status</th>
                    <th className="py-2.5 px-3">Admin Outcome Override</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const currentOverride = p.outcomeOverride || 'DEFAULT';
                    return (
                      <tr key={p.productId} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-mono text-slate-500">#{p.productId}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-900 block">{p.productName}</span>
                          <span className="text-[10px] text-slate-400">Mfg: {p.manufacturingDate}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{p.brand}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{p.productCode}</td>
                        
                        {/* Status Toggle */}
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => onToggleProductStatus(p.productId, p.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE')}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                              p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {p.status === 'ACTIVE' ? <Check className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                            {p.status}
                          </button>
                        </td>

                        {/* Direct Outcome Dropdown Override */}
                        <td className="py-2.5 px-3">
                          <select
                            value={currentOverride}
                            onChange={(e) => onUpdateProductOutcome(p.productId, e.target.value as OutcomeOverride)}
                            className={`px-2 py-1 text-xs font-bold rounded border cursor-pointer ${
                              currentOverride === 'GENUINE'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : currentOverride === 'SUSPICIOUS'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : currentOverride === 'INVALID'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : currentOverride === 'NOT_FOUND'
                                ? 'bg-slate-100 text-slate-800 border-slate-300'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="DEFAULT">DEFAULT (Auto-Logic)</option>
                            <option value="GENUINE">GENUINE (Force Authentic)</option>
                            <option value="SUSPICIOUS">SUSPICIOUS (Force Warning)</option>
                            <option value="INVALID">INVALID (Force Recalled)</option>
                            <option value="NOT_FOUND">NOT_FOUND (Force Blacklist)</option>
                          </select>
                        </td>

                        {/* Edit & Delete Actions */}
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <button
                            onClick={() => onVerifyCode(p.productCode)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                            title="Test verify as customer"
                          >
                            Test Verify
                          </button>
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Edit details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete product ${p.productName}?`)) {
                                onDeleteProduct(p.productId);
                              }
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFICATION AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-4">
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by product code or notes..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={resultFilter}
                  onChange={(e) => setResultFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700"
                >
                  <option value="ALL">All Outcomes</option>
                  <option value="GENUINE">GENUINE</option>
                  <option value="SUSPICIOUS">SUSPICIOUS</option>
                  <option value="INVALID">INVALID</option>
                  <option value="NOT_FOUND">NOT FOUND</option>
                </select>
              </div>
            </div>

            {/* Audit Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Product Code</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Outcome</th>
                    <th className="py-2.5 px-3">Client IP</th>
                    <th className="py-2.5 px-3">Evaluation Notes</th>
                    <th className="py-2.5 px-3 text-right">Admin Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVerifications.length > 0 ? (
                    filteredVerifications.map((v) => (
                      <tr key={v.verificationId} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-mono text-slate-500">#{v.verificationId}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{v.productCode}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono">
                          {v.verificationDate} {v.verificationTime}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            v.result === 'GENUINE' 
                              ? 'bg-emerald-100 text-emerald-800'
                              : v.result === 'SUSPICIOUS'
                              ? 'bg-amber-100 text-amber-800'
                              : v.result === 'INVALID'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-800'
                          }`}>
                            {v.result}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{v.ipAddress || '127.0.0.1'}</td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={v.notes}>
                          {v.notes}
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditVerification(v)}
                            className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors cursor-pointer"
                            title="Reclassify outcome"
                          >
                            Reclassify
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this verification audit record?')) {
                                onDeleteVerification(v.verificationId);
                              }
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete log entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No verification records match your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs p-4 space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Product Code</th>
                    <th className="py-2.5 px-3">Filed By</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Admin Remarks</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <tr key={c.complaintId} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-mono text-slate-500">#{c.complaintId}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.productCode}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">{c.userName}</div>
                        <div className="text-[10px] text-slate-400">{c.userEmail}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{c.complaintDate}</td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs">{c.description}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          c.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : c.status === 'REVIEWED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] italic">
                        {c.adminRemarks || 'No remarks recorded yet'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleOpenComplaintModal(c)}
                          className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition-colors cursor-pointer"
                        >
                          Resolve / Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USERS & MANUFACTURERS */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Manufacturers Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600" />
                Verified Manufacturers
              </h3>
              <div className="space-y-3">
                {manufacturers.map((m) => (
                  <div key={m.manufacturerId} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{m.manufacturerName}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-purple-600 font-semibold">ID #{m.manufacturerId}</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete manufacturer ${m.manufacturerName}?`)) {
                              onDeleteManufacturer(m.manufacturerId);
                            }
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete manufacturer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-500">{m.address}</div>
                    <div className="flex items-center gap-3 text-slate-600 pt-1">
                      <span>Tel: {m.contact}</span>
                      <span>·</span>
                      <span>{m.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Registered System Accounts (RBAC)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2 px-2">User ID</th>
                      <th className="py-2 px-2">Username</th>
                      <th className="py-2 px-2">Role</th>
                      <th className="py-2 px-2">Created</th>
                      <th className="py-2 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.userId}>
                        <td className="py-2 px-2 font-mono text-slate-500">#{u.userId}</td>
                        <td className="py-2 px-2 font-semibold text-slate-800">{u.username}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : u.role === 'MANUFACTURER' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2 px-2 font-mono text-slate-500">{u.createdAt}</td>
                        <td className="py-2 px-2 text-right">
                          {u.userId !== 1 && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete user ${u.username}?`)) {
                                  onDeleteUser(u.userId);
                                }
                              }}
                              className="text-rose-600 hover:text-rose-800 font-semibold"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* EDIT PRODUCT MODAL (OUTCOME OVERRIDE & DETAILS) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit Product & Outcome Policy
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Code (Immutable Key)</label>
                <input
                  type="text"
                  value={editingProduct.productCode}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 font-mono font-bold text-slate-600 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editProdBrand}
                    onChange={(e) => setEditProdBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editProdStatus}
                    onChange={(e) => setEditProdStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BLOCKED">BLOCKED (Recalled)</option>
                  </select>
                </div>
              </div>

              {/* OUTCOME OVERRIDE SECTION */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-1.5">
                <label className="block font-bold text-purple-900">
                  Direct Verification Outcome Policy
                </label>
                <p className="text-[11px] text-purple-700">
                  Force what status the customer will see when scanning this product code:
                </p>
                <select
                  value={editProdOutcome}
                  onChange={(e) => setEditProdOutcome(e.target.value as OutcomeOverride)}
                  className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg text-purple-900 font-bold"
                >
                  <option value="DEFAULT">DEFAULT (Run Automatic Verification Algorithm)</option>
                  <option value="GENUINE">GENUINE (Always return Verified Authentic)</option>
                  <option value="SUSPICIOUS">SUSPICIOUS (Always return Suspicious Warning)</option>
                  <option value="INVALID">INVALID (Always return Blocked / Recalled)</option>
                  <option value="NOT_FOUND">NOT_FOUND (Always return Unrecognized / Blacklisted)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT VERIFICATION AUDIT RECORD MODAL */}
      {editingVerification && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Reclassify Verification Record #{editingVerification.verificationId}
              </h3>
              <button onClick={() => setEditingVerification(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleSaveVerificationEdit} className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Product Code:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{editingVerification.productCode}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reclassify Outcome</label>
                <select
                  value={verifNewOutcome}
                  onChange={(e) => setVerifNewOutcome(e.target.value as VerificationResult)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="GENUINE">GENUINE</option>
                  <option value="SUSPICIOUS">SUSPICIOUS</option>
                  <option value="INVALID">INVALID</option>
                  <option value="NOT_FOUND">NOT FOUND</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Reclassification Notes</label>
                <textarea
                  rows={3}
                  value={verifNewNotes}
                  onChange={(e) => setVerifNewNotes(e.target.value)}
                  placeholder="Reason for manual outcome adjustment..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingVerification(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer shadow-sm"
                >
                  Save Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLAINT REVIEW MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Review Complaint #{selectedComplaint.complaintId}
              </h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-500">Product Code:</span>{' '}
                <span className="font-mono font-bold text-blue-700">{selectedComplaint.productCode}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Filed by:</span>{' '}
                <span>{selectedComplaint.userName} ({selectedComplaint.userEmail})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-700">
                {selectedComplaint.description}
              </div>
            </div>

            <form onSubmit={handleSaveComplaint} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Update Resolution Status
                </label>
                <select
                  value={complaintStatusInput}
                  onChange={(e) => setComplaintStatusInput(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="REVIEWED">REVIEWED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Administrative Remarks
                </label>
                <textarea
                  rows={3}
                  value={adminRemarkInput}
                  onChange={(e) => setAdminRemarkInput(e.target.value)}
                  placeholder="Detail investigation findings, retailer audit status, or recall certification provided to consumer..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer shadow-sm"
                >
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
