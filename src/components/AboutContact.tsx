import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  Layers, 
  Database, 
  Lock,
  Cpu
} from 'lucide-react';

export const AboutContact: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'contact'>('about');
  const [contactSent, setContactSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-3 cursor-pointer transition-colors ${
            activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-900'
          }`}
        >
          About The Project & Architecture
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`pb-3 cursor-pointer transition-colors ${
            activeTab === 'contact' ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-slate-900'
          }`}
        >
          Contact Grievance Cell
        </button>
      </div>

      {activeTab === 'about' && (
        <div className="space-y-8">
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded">
              <BookOpen className="w-3.5 h-3.5" />
              <span>College Mini-Project Documentation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              TrueTag — Fake Product Detection Management System
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed as an academic capstone demonstration combining enterprise Java web technologies, cryptographic code validation, and real-time anomalous scan detection. The architecture strictly follows the Model-View-Controller (MVC) software engineering paradigm.
            </p>
          </div>

          {/* Architecture Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">MVC Pattern</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Separates Model (POJOs & DAOs), View (Bootstrap 5 & JSP), and Controller (Java Servlets) to ensure modular testability and scalability.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">JDBC & PreparedStatements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guards all database transactions against SQL Injection attacks. Includes connection pooling via HikariCP and indexed search on product codes.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">BCrypt & AuthFilter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cryptographic one-way hashing for user passwords (10 salt rounds) and session-based Servlet Filter enforcing RBAC across admin and manufacturer endpoints.
              </p>
            </div>
          </div>

          {/* Database Relations */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Database Entity-Relationship Structure (MySQL)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-blue-700 block mb-1">USERS</span>
                user_id (PK), username, password_hash, role ('ADMIN', 'MANUFACTURER', 'CUSTOMER'), created_at
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-blue-700 block mb-1">MANUFACTURER</span>
                manufacturer_id (PK), manufacturer_name, address, contact, email
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-blue-700 block mb-1">PRODUCT</span>
                product_id (PK), product_name, brand, manufacturer_id (FK), product_code (UNIQUE), manufacturing_date, status
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-blue-700 block mb-1">VERIFICATION_HISTORY</span>
                verification_id (PK), product_code, verification_date, verification_time, result ('GENUINE', 'INVALID', 'SUSPICIOUS', 'NOT_FOUND'), ip_address
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2">
                <span className="font-mono font-bold text-blue-700 block mb-1">COMPLAINT</span>
                complaint_id (PK), product_id (FK), user_id (FK), product_code, description, complaint_date, status ('PENDING', 'REVIEWED', 'RESOLVED')
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'contact' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Grievance Officer & Support Liaison
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              For academic review inquiries, manufacturer registration, or urgent counterfeit product investigations.
            </p>
          </div>

          {contactSent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your inquiry has been forwarded to the compliance division.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prof. R. Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sharma@college.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message / Inquiry</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message or project evaluation query..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                Send Inquiry
              </button>
            </form>

            <div className="space-y-4 text-xs text-slate-600 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Central Compliance Secretariat</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>College of Engineering & Technology, Department of Computer Science & Engineering</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-mono">anti-counterfeit@collegereview.edu</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>+1 (800) 555-0199 / Lab Room CS-402</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
