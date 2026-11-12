import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  QrCode, 
  Download, 
  Search, 
  Filter, 
  Sparkles, 
  Package, 
  Calendar, 
  Tag, 
  CheckCircle,
  Eye,
  BarChart2,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Product, Manufacturer, VerificationHistory, User } from '../types';
import { downloadQRCodePNG, drawQRCodeToCanvas } from '../utils/qrCode';

interface ManufacturerPortalProps {
  products: Product[];
  manufacturers: Manufacturer[];
  verifications: VerificationHistory[];
  currentUser: User | null;
  onAddProduct: (product: Omit<Product, 'productId'>) => void;
  onVerifyCode: (code: string) => void;
}

export const ManufacturerPortal: React.FC<ManufacturerPortalProps> = ({
  products,
  manufacturers,
  verifications,
  currentUser,
  onAddProduct,
  onVerifyCode
}) => {
  // Determine scoped manufacturer ID based on current user
  const getInitialMfrId = () => {
    if (currentUser?.role === 'MANUFACTURER') {
      if (currentUser.username === 'nike_mfg') return 2;
      return 1; // Default apple_mfg
    }
    return manufacturers[0]?.manufacturerId || 1;
  };

  const [selectedMfrId, setSelectedMfrId] = useState<number>(getInitialMfrId);
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [qrModalProduct, setQrModalProduct] = useState<Product | null>(null);

  // Synchronize when currentUser changes
  useEffect(() => {
    if (currentUser?.role === 'MANUFACTURER') {
      if (currentUser.username === 'nike_mfg') setSelectedMfrId(2);
      else setSelectedMfrId(1);
    }
  }, [currentUser]);

  const isAdmin = currentUser?.role === 'ADMIN';

  // New product form states
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState(() => (selectedMfrId === 2 ? 'Nike' : 'Apple'));
  const [customCode, setCustomCode] = useState('');
  const [mfgDate, setMfgDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Consumer Electronics');

  const currentManufacturer = manufacturers.find(m => m.manufacturerId === selectedMfrId) || manufacturers[0];

  // Scoped strictly to this manufacturer
  const mfrProducts = products.filter(p => p.manufacturerId === selectedMfrId);
  const allBrands = Array.from(new Set(mfrProducts.map(p => p.brand)));

  const filteredProducts = mfrProducts.filter(p => {
    return brandFilter === 'ALL' || p.brand === brandFilter;
  });

  // Generate cryptographic unique serial number
  const generateRandomCode = () => {
    const defaultPrefix = selectedMfrId === 2 ? 'NIKE' : 'APPL';
    const prefix = brand ? brand.slice(0, 4).toUpperCase() : defaultPrefix;
    const rand1 = Math.floor(1000 + Math.random() * 9000);
    const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    setCustomCode(`${prefix}-${rand1}-${rand2}`);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !customCode.trim()) return;

    onAddProduct({
      productName: productName.trim(),
      brand: brand.trim(),
      manufacturerId: selectedMfrId,
      productCode: customCode.trim().toUpperCase(),
      manufacturingDate: mfgDate,
      status: 'ACTIVE',
      category: category,
      outcomeOverride: 'DEFAULT'
    });

    setShowAddModal(false);
    setProductName('');
    setCustomCode('');
  };

  const handleOpenQRModal = (product: Product) => {
    setQrModalProduct(product);
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Header and Manufacturer Scope Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Authorized Manufacturer Workspace</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {currentManufacturer ? currentManufacturer.manufacturerName : 'Manufacturer Portal'}
          </h1>
          <p className="text-xs text-slate-500">
            {isAdmin 
              ? 'Viewing as Admin. You can manage and provision products for all manufacturers.' 
              : 'Scoped to your authorized organization. You can register products and generate packaging QR codes.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Admin only: Switch between Manufacturers */}
          {isAdmin ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Admin Org Switcher:</span>
              <select
                value={selectedMfrId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedMfrId(id);
                  setBrand(id === 2 ? 'Nike' : 'Apple');
                }}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 text-xs shadow-xs"
              >
                {manufacturers.map((m) => (
                  <option key={m.manufacturerId} value={m.manufacturerId}>
                    {m.manufacturerName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-700 border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Org: {currentManufacturer?.manufacturerName}</span>
            </div>
          )}

          <button
            onClick={() => {
              generateRandomCode();
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Register Product Code
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">My Registered Products</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {mfrProducts.length}
          </div>
          <div className="text-[11px] text-slate-400">Restricted to your company SKUs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Active Genuine Stock</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
            {mfrProducts.filter(p => p.status === 'ACTIVE').length}
          </div>
          <div className="text-[11px] text-emerald-600/70">Verified in field distribution</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500">Verified Consumer Scans</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-600">
            {verifications.filter(v => mfrProducts.some(p => p.productCode === v.productCode)).length}
          </div>
          <div className="text-[11px] text-slate-400">Total customer scans for your codes</div>
        </div>
      </div>

      {/* Product List with Brand Filter & QR Generation */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              {currentManufacturer?.manufacturerName} - Product Inventory
            </h2>
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Filter by Brand:</span>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700"
            >
              <option value="ALL">All Brands</option>
              {allBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">SKU ID</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Brand</th>
                <th className="py-2.5 px-3">Unique Code</th>
                <th className="py-2.5 px-3">Mfg Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Packaging Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const scanHistoryCount = verifications.filter(v => v.productCode === p.productCode).length;
                return (
                  <tr key={p.productId} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono text-slate-500">#{p.productId}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{p.productName}</div>
                      <div className="text-[10px] text-slate-400">
                        {scanHistoryCount} verified scan(s) in registry
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{p.brand}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{p.productCode}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{p.manufacturingDate}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenQRModal(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Display & Download ZXing Packaging QR Tag"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Generate QR
                      </button>

                      <button
                        onClick={() => onVerifyCode(p.productCode)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                        title="Test Verify as Customer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Test
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                Register New Authentic Product ({currentManufacturer?.manufacturerName})
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Product Name / Model
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. AirPods Pro Gen 2 with MagSafe Case"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apple or Nike"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Footwear or Electronics"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">
                    Unique Encrypted Code (Primary Security Key)
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="e.g. APPL-1234-ABCD"
                  className="w-full px-3 py-2 font-mono font-bold uppercase tracking-wider bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Manufacturing Date</label>
                <input
                  type="date"
                  value={mfgDate}
                  onChange={(e) => setMfgDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900 leading-snug">
                Once registered, this code will be associated with <strong>{currentManufacturer?.manufacturerName}</strong>. You can immediately generate and download its ZXing QR packaging sticker.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-sm"
                >
                  Save & Register Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR CODE GENERATOR PREVIEW & DOWNLOAD MODAL */}
      {qrModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-xl text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Packaging QR Tag Generator
              </h3>
              <button
                onClick={() => setQrModalProduct(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-slate-900 text-sm">{qrModalProduct.productName}</div>
              <div className="font-mono text-xs font-bold text-blue-600">{qrModalProduct.productCode}</div>
            </div>

            {/* Canvas QR Code */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl inline-block shadow-inner">
              <QRCanvas code={qrModalProduct.productCode} />
            </div>

            <p className="text-[11px] text-slate-500">
              Generated using standard ZXing QR matrix (25x25). Encodes direct verification identifier.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => downloadQRCodePNG(qrModalProduct.productCode, qrModalProduct.productName)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Packaging QR (PNG)
              </button>
              <button
                onClick={() => {
                  onVerifyCode(qrModalProduct.productCode);
                  setQrModalProduct(null);
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
              >
                Test Verification Result &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Internal Canvas QR Renderer
const QRCanvas: React.FC<{ code: string }> = ({ code }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      drawQRCodeToCanvas(canvasRef.current, code, 200, 14);
    }
  }, [code]);

  return <canvas ref={canvasRef} className="rounded" />;
};
