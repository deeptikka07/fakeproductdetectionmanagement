import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  User as UserIcon, 
  LogOut, 
  Code2, 
  ShieldAlert, 
  ChevronDown, 
  Lock, 
  Building2, 
  Eye, 
  Sparkles,
  Sliders,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { User } from '../types';
import { downloadProjectZip } from '../utils/projectZip';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSwitchRole: (role: 'ADMIN' | 'MANUFACTURER' | 'CUSTOMER', username?: string) => void;
  suspiciousCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onSwitchRole,
  suspiciousCount
}) => {
  const [downloading, setDownloading] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadProjectZip();
    } finally {
      setDownloading(false);
    }
  };

  const isAdmin = currentUser?.role === 'ADMIN';
  const isManufacturer = currentUser?.role === 'MANUFACTURER';
  const isCustomer = currentUser?.role === 'CUSTOMER' || !currentUser;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Zone 1: Single Brand Wordmark "TrueTag" */}
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-all">
              <Tag className="w-5 h-5 -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-blue-800 bg-clip-text text-transparent">
                TrueTag
              </span>
              <span className="hidden sm:inline-block text-[10px] text-slate-500 -mt-1 font-medium tracking-wide">
                Anti-Counterfeit Protection
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button
              onClick={() => setCurrentTab('home')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1 ${
                currentTab === 'home' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('verify')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1 ${
                currentTab === 'verify' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
              }`}
            >
              Verify Product
            </button>
            <button
              onClick={() => setCurrentTab('complaint')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1 ${
                currentTab === 'complaint' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
              }`}
            >
              Complaints
            </button>

            {/* Manufacturer Tab */}
            {(isManufacturer || isAdmin) && (
              <button
                onClick={() => setCurrentTab('manufacturer')}
                className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                  currentTab === 'manufacturer' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                {isAdmin ? 'Manufacturer Portal' : 'My Manufacturer Portal'}
              </button>
            )}

            {/* Admin Console Tab */}
            {isAdmin && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`relative hover:text-purple-700 transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1.5 ${
                  currentTab === 'admin' ? 'text-purple-700 font-bold border-b-2 border-purple-700' : ''
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-purple-600" />
                Admin Console
                {suspiciousCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded-md">
                    {suspiciousCount} flags
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setCurrentTab('source')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer py-1 flex items-center gap-1 ${
                currentTab === 'source' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''
              }`}
            >
              <Code2 className="w-4 h-4 text-slate-400" />
              Java/JSP Source
            </button>
          </nav>

          {/* Zone 3: Actions & Active Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Download Project ZIP */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              title="Download Complete Java Servlets/JSP Eclipse Project ZIP"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50/80 border border-blue-200/80 rounded-lg hover:bg-blue-100/90 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              {downloading ? 'Packing...' : 'Download Project ZIP'}
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all shadow-2xs ${
                  isAdmin 
                    ? 'bg-purple-50/80 text-purple-950 border-purple-200 hover:bg-purple-100'
                    : isManufacturer
                    ? 'bg-blue-50/80 text-blue-950 border-blue-200 hover:bg-blue-100'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isAdmin ? (
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse inline-block" />
                ) : isManufacturer ? (
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                )}
                
                <span className="whitespace-nowrap font-medium">
                  {isAdmin 
                    ? 'Admin (Full Control)' 
                    : isManufacturer 
                    ? `Manufacturer (${currentUser?.username === 'apple_mfg' ? 'Apple' : 'Nike'})` 
                    : 'Customer (View Only)'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200/90 py-2 z-50 text-xs"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                    Switch Active Session Role
                  </div>

                  {/* 1. Admin Option */}
                  <button
                    onClick={() => {
                      onSwitchRole('ADMIN', 'admin');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-purple-50/50 cursor-pointer ${
                      isAdmin ? 'bg-purple-50/70 font-semibold text-purple-900' : 'text-slate-700'
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        Administrator
                        <span className="text-[10px] px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-normal">Full Control</span>
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        Can change everything & override product outcomes (Genuine, Suspicious, Invalid, Not Found).
                      </div>
                    </div>
                  </button>

                  {/* 2. Manufacturer: Apple */}
                  <button
                    onClick={() => {
                      onSwitchRole('MANUFACTURER', 'apple_mfg');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-blue-50/50 cursor-pointer ${
                      currentUser?.username === 'apple_mfg' ? 'bg-blue-50/70 font-semibold text-blue-900' : 'text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        Manufacturer (Apple Asia)
                        <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-normal">Scoped</span>
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        Can only access & manage Apple products & generate packaging QR codes.
                      </div>
                    </div>
                  </button>

                  {/* 3. Manufacturer: Nike */}
                  <button
                    onClick={() => {
                      onSwitchRole('MANUFACTURER', 'nike_mfg');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-blue-50/50 cursor-pointer ${
                      currentUser?.username === 'nike_mfg' ? 'bg-blue-50/70 font-semibold text-blue-900' : 'text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        Manufacturer (Nike Global)
                        <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-normal">Scoped</span>
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        Can only access & manage Nike products & generate packaging QR codes.
                      </div>
                    </div>
                  </button>

                  {/* 4. Customer */}
                  <button
                    onClick={() => {
                      onSwitchRole('CUSTOMER', 'john_customer');
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 hover:bg-slate-50 cursor-pointer ${
                      isCustomer ? 'bg-emerald-50/70 font-semibold text-emerald-900' : 'text-slate-700'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        Customer
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-normal">View Only</span>
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        Verify products, view results, and submit grievances. Cannot access admin or manufacturer portals.
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Logout button */}
            {currentUser && (
              <button
                onClick={onLogout}
                title="Sign out / reset to public customer view"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden border-t border-slate-100 px-4 py-2 bg-slate-50/80 flex items-center gap-3 overflow-x-auto text-xs font-medium text-slate-600">
        <button 
          onClick={() => setCurrentTab('home')} 
          className={`whitespace-nowrap px-2.5 py-1 rounded-md font-semibold ${currentTab === 'home' ? 'bg-blue-600 text-white' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentTab('verify')} 
          className={`whitespace-nowrap px-2.5 py-1 rounded-md font-semibold ${currentTab === 'verify' ? 'bg-blue-600 text-white' : ''}`}
        >
          Verify
        </button>
        <button 
          onClick={() => setCurrentTab('complaint')} 
          className={`whitespace-nowrap px-2.5 py-1 rounded-md font-semibold ${currentTab === 'complaint' ? 'bg-blue-600 text-white' : ''}`}
        >
          Complaints
        </button>
        {(isManufacturer || isAdmin) && (
          <button 
            onClick={() => setCurrentTab('manufacturer')} 
            className={`whitespace-nowrap px-2.5 py-1 rounded-md font-semibold ${currentTab === 'manufacturer' ? 'bg-blue-600 text-white' : ''}`}
          >
            Manufacturer
          </button>
        )}
        {isAdmin && (
          <button 
            onClick={() => setCurrentTab('admin')} 
            className={`whitespace-nowrap px-2.5 py-1 rounded-md font-semibold ${currentTab === 'admin' ? 'bg-purple-600 text-white' : ''}`}
          >
            Admin Console
          </button>
        )}
        <button 
          onClick={() => setCurrentTab('source')} 
          className={`whitespace-nowrap px-2.5 py-1 rounded-md font-semibold ${currentTab === 'source' ? 'bg-blue-600 text-white' : ''}`}
        >
          Source Code
        </button>
      </div>
    </header>
  );
};
