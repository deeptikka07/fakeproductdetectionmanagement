import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { VerifyProduct } from './components/VerifyProduct';
import { ResultPage } from './components/ResultPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ManufacturerPortal } from './components/ManufacturerPortal';
import { ComplaintPage } from './components/ComplaintPage';
import { JavaProjectViewer } from './components/JavaProjectViewer';
import { AboutContact } from './components/AboutContact';
import { AuthModal } from './components/AuthModal';

import { ProductDatabaseService, SUSPICIOUS_SCAN_THRESHOLD } from './data/sampleData';
import { 
  User, 
  Product, 
  VerificationHistory, 
  Complaint, 
  Manufacturer, 
  VerificationEvaluation,
  OutcomeOverride,
  VerificationResult
} from './types';
import { ShieldCheck, Download, Code2, Database, Lock, AlertCircle, Sliders, Building2, UserCheck } from 'lucide-react';
import { downloadProjectZip } from './utils/projectZip';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  // Default to Admin initially so user can explore all superpowers immediately, or allow switching
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = ProductDatabaseService.getCurrentUser();
    return saved || ProductDatabaseService.getUsers()[0]; // Default: admin
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Core Data Collections
  const [products, setProducts] = useState<Product[]>(() => ProductDatabaseService.getProducts());
  const [verifications, setVerifications] = useState<VerificationHistory[]>(() => ProductDatabaseService.getVerifications());
  const [complaints, setComplaints] = useState<Complaint[]>(() => ProductDatabaseService.getComplaints());
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(() => ProductDatabaseService.getManufacturers());
  const [users, setUsers] = useState<User[]>(() => ProductDatabaseService.getUsers());

  // Result state
  const [currentEvaluation, setCurrentEvaluation] = useState<VerificationEvaluation | null>(null);
  const [complaintPrefillCode, setComplaintPrefillCode] = useState<string>('');

  // Count suspicious scans
  const suspiciousCount = verifications.filter(v => v.result === 'SUSPICIOUS').length;

  const handleVerify = (code: string) => {
    // Execute core verification logic (respects Admin Outcome Override)
    const evalResult = ProductDatabaseService.verifyProductCode(code);
    setVerifications(ProductDatabaseService.getVerifications());
    setCurrentEvaluation(evalResult);
    setCurrentTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProduct = (newProduct: Omit<Product, 'productId'>) => {
    ProductDatabaseService.addProduct(newProduct);
    setProducts(ProductDatabaseService.getProducts());
  };

  const handleToggleProductStatus = (productId: number, newStatus: 'ACTIVE' | 'BLOCKED') => {
    ProductDatabaseService.updateProductStatus(productId, newStatus);
    setProducts(ProductDatabaseService.getProducts());
  };

  // ADMIN FEATURE: Change product outcome directly (Genuine, Suspicious, Invalid, Not Found, Default)
  const handleUpdateProductOutcome = (productId: number, outcome: OutcomeOverride) => {
    ProductDatabaseService.updateProductOutcome(productId, outcome);
    setProducts(ProductDatabaseService.getProducts());
  };

  const handleUpdateProduct = (productId: number, updates: Partial<Product>) => {
    ProductDatabaseService.updateProduct(productId, updates);
    setProducts(ProductDatabaseService.getProducts());
  };

  const handleDeleteProduct = (productId: number) => {
    ProductDatabaseService.deleteProduct(productId);
    setProducts(ProductDatabaseService.getProducts());
  };

  // ADMIN FEATURE: Change historical verification log outcome
  const handleUpdateVerificationOutcome = (verificationId: number, outcome: VerificationResult, notes?: string) => {
    ProductDatabaseService.updateVerificationOutcome(verificationId, outcome, notes);
    setVerifications(ProductDatabaseService.getVerifications());
  };

  const handleDeleteVerification = (verificationId: number) => {
    ProductDatabaseService.deleteVerification(verificationId);
    setVerifications(ProductDatabaseService.getVerifications());
  };

  const handleDeleteUser = (userId: number) => {
    ProductDatabaseService.deleteUser(userId);
    setUsers(ProductDatabaseService.getUsers());
  };

  const handleDeleteManufacturer = (manufacturerId: number) => {
    ProductDatabaseService.deleteManufacturer(manufacturerId);
    setManufacturers(ProductDatabaseService.getManufacturers());
  };

  const handleSubmitComplaint = (complaintData: Omit<Complaint, 'complaintId' | 'complaintDate' | 'status'>) => {
    ProductDatabaseService.submitComplaint(complaintData);
    setComplaints(ProductDatabaseService.getComplaints());
  };

  const handleUpdateComplaint = (complaintId: number, status: 'PENDING' | 'REVIEWED' | 'RESOLVED', remarks: string) => {
    ProductDatabaseService.updateComplaintStatus(complaintId, status, remarks);
    setComplaints(ProductDatabaseService.getComplaints());
  };

  const handleResetData = () => {
    if (window.confirm('Reset all sample database tables back to original default state?')) {
      ProductDatabaseService.resetToDefault();
      setProducts(ProductDatabaseService.getProducts());
      setVerifications(ProductDatabaseService.getVerifications());
      setComplaints(ProductDatabaseService.getComplaints());
      setManufacturers(ProductDatabaseService.getManufacturers());
      setUsers(ProductDatabaseService.getUsers());
      setCurrentEvaluation(null);
      setCurrentTab('home');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    ProductDatabaseService.setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setCurrentTab('admin');
    } else if (user.role === 'MANUFACTURER') {
      setCurrentTab('manufacturer');
    } else {
      setCurrentTab('verify');
    }
  };

  const handleSwitchRole = (role: 'ADMIN' | 'MANUFACTURER' | 'CUSTOMER', username?: string) => {
    const allUsers = ProductDatabaseService.getUsers();
    let targetUser: User;
    if (username) {
      targetUser = allUsers.find(u => u.username === username) || allUsers[0];
    } else {
      targetUser = allUsers.find(u => u.role === role) || allUsers[0];
    }

    setCurrentUser(targetUser);
    ProductDatabaseService.setCurrentUser(targetUser);

    if (role === 'ADMIN') {
      setCurrentTab('admin');
    } else if (role === 'MANUFACTURER') {
      setCurrentTab('manufacturer');
    } else {
      if (currentTab === 'admin' || currentTab === 'manufacturer') {
        setCurrentTab('home');
      }
    }
  };

  const handleLogout = () => {
    // Switch to Customer view
    const customerUser = users.find(u => u.role === 'CUSTOMER') || null;
    setCurrentUser(customerUser);
    ProductDatabaseService.setCurrentUser(customerUser);
    setCurrentTab('home');
  };

  const handleFileComplaintFromProduct = (code: string) => {
    setComplaintPrefillCode(code);
    setCurrentTab('complaint');
  };

  const isAdmin = currentUser?.role === 'ADMIN';
  const isManufacturer = currentUser?.role === 'MANUFACTURER';

  return (
    <div className="min-h-screen bg-ambient-glow flex flex-col text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Navbar with 3-Zone Top Bar Contract & Role Switcher */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        suspiciousCount={suspiciousCount}
      />

      {/* Main Content Area with RBAC Guard Enforcement */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Home */}
        {currentTab === 'home' && (
          <Home
            onVerify={handleVerify}
            onNavigateToVerify={() => setCurrentTab('verify')}
            onNavigateToComplaints={() => setCurrentTab('complaint')}
            onNavigateToSource={() => setCurrentTab('source')}
          />
        )}

        {/* Verify Product (Accessible to all) */}
        {currentTab === 'verify' && (
          <VerifyProduct onVerify={handleVerify} />
        )}

        {/* Result Page (Accessible to all) */}
        {currentTab === 'result' && currentEvaluation && (
          <ResultPage
            evaluation={currentEvaluation}
            onVerifyAnother={() => setCurrentTab('verify')}
            onFileComplaint={handleFileComplaintFromProduct}
          />
        )}

        {/* Admin Dashboard - Strictly Protected */}
        {currentTab === 'admin' && (
          isAdmin ? (
            <AdminDashboard
              products={products}
              verifications={verifications}
              complaints={complaints}
              manufacturers={manufacturers}
              users={users}
              onToggleProductStatus={handleToggleProductStatus}
              onUpdateProductOutcome={handleUpdateProductOutcome}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateVerificationOutcome={handleUpdateVerificationOutcome}
              onDeleteVerification={handleDeleteVerification}
              onDeleteUser={handleDeleteUser}
              onDeleteManufacturer={handleDeleteManufacturer}
              onUpdateComplaint={handleUpdateComplaint}
              onResetData={handleResetData}
              onVerifyCode={handleVerify}
            />
          ) : (
            <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Access Denied: Administrator Credentials Required
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are currently viewing as <strong>{currentUser?.role || 'CUSTOMER'}</strong>. As requested by the security policy, customers can only view verification outcomes and manufacturers can only manage their own products. Only the Administrator can access this central console and change product outcomes.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => handleSwitchRole('ADMIN', 'admin')}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Switch Session to Administrator
                </button>
                <button
                  onClick={() => setCurrentTab('home')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )
        )}

        {/* Manufacturer Portal - Scoped to Manufacturer or Admin */}
        {currentTab === 'manufacturer' && (
          (isManufacturer || isAdmin) ? (
            <ManufacturerPortal
              products={products}
              manufacturers={manufacturers}
              verifications={verifications}
              currentUser={currentUser}
              onAddProduct={handleAddProduct}
              onVerifyCode={handleVerify}
            />
          ) : (
            <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Access Denied: Manufacturer Portal Restricted
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customers can only view and verify products. To register products and download packaging QR codes, you must be logged in as an authorized manufacturer.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => handleSwitchRole('MANUFACTURER', 'apple_mfg')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Switch to Manufacturer (Apple)
                </button>
                <button
                  onClick={() => setCurrentTab('verify')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Go to Verify Product
                </button>
              </div>
            </div>
          )
        )}

        {/* Complaints (Customer file/track, Admin review) */}
        {currentTab === 'complaint' && (
          <ComplaintPage
            complaints={complaints}
            products={products}
            onSubmitComplaint={handleSubmitComplaint}
            defaultProductCode={complaintPrefillCode}
          />
        )}

        {/* Java / Tomcat Project Source */}
        {currentTab === 'source' && (
          <JavaProjectViewer />
        )}

        {(currentTab === 'about' || currentTab === 'contact') && (
          <AboutContact />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-slate-600">
            
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-slate-900 text-base">TrueTag</span>
              </div>
              <p className="leading-relaxed text-slate-500 text-xs">
                TrueTag™ Anti-Counterfeit Platform & College Mini-Project in Java Servlets, JSP, JDBC, MySQL, and Apache Tomcat.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">Role-Based Navigation</span>
              <ul className="space-y-1.5">
                <li><button onClick={() => setCurrentTab('home')} className="hover:text-blue-600 cursor-pointer">Home</button></li>
                <li><button onClick={() => setCurrentTab('verify')} className="hover:text-blue-600 cursor-pointer">Verify Product</button></li>
                <li><button onClick={() => setCurrentTab('complaint')} className="hover:text-blue-600 cursor-pointer">File Complaint</button></li>
                <li><button onClick={() => handleSwitchRole('MANUFACTURER', 'apple_mfg')} className="hover:text-blue-600 cursor-pointer">Manufacturer Portal</button></li>
                <li><button onClick={() => handleSwitchRole('ADMIN', 'admin')} className="hover:text-purple-600 font-semibold cursor-pointer">Admin Console (Full Control)</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">Java / Tomcat Project Files</span>
              <ul className="space-y-1.5">
                <li><button onClick={() => setCurrentTab('source')} className="hover:text-blue-600 cursor-pointer">database/schema.sql</button></li>
                <li><button onClick={() => setCurrentTab('source')} className="hover:text-blue-600 cursor-pointer">VerifyServlet.java (Outcome Logic)</button></li>
                <li><button onClick={() => setCurrentTab('source')} className="hover:text-blue-600 cursor-pointer">AuthFilter.java (RBAC Filter)</button></li>
                <li><button onClick={() => setCurrentTab('source')} className="hover:text-blue-600 cursor-pointer">ProductDAO.java (Outcome Override)</button></li>
                <li><button onClick={() => downloadProjectZip()} className="text-blue-600 font-semibold hover:underline cursor-pointer">Download Eclipse ZIP</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">Admin Outcome Controls</span>
              <div className="space-y-1 text-slate-500">
                <div>&bull; Admin sets &rarr; <span className="font-mono text-emerald-700 font-bold">GENUINE</span></div>
                <div>&bull; Admin sets &rarr; <span className="font-mono text-amber-700 font-bold">SUSPICIOUS</span></div>
                <div>&bull; Admin sets &rarr; <span className="font-mono text-rose-700 font-bold">INVALID</span></div>
                <div>&bull; Admin sets &rarr; <span className="font-mono text-slate-700 font-bold">NOT FOUND</span></div>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span>&copy; 2025 Fake Product Detection Management System. Complete Java Servlets & JSP Project.</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentTab('about')} className="hover:text-slate-600 cursor-pointer">About System</button>
              <button onClick={() => setCurrentTab('contact')} className="hover:text-slate-600 cursor-pointer">Contact</button>
              <button onClick={() => setCurrentTab('source')} className="hover:text-slate-600 cursor-pointer">View Source Tree</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Role-Based Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        users={users}
        onLogin={handleLogin}
      />

    </div>
  );
}
