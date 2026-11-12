import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  FileText, 
  Database, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink,
  Layers,
  Server,
  BookOpen
} from 'lucide-react';
import { JAVA_PROJECT_FILES, ProjectFile } from '../data/javaProjectFiles';
import { downloadProjectZip } from '../utils/projectZip';

export const JavaProjectViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadProjectZip();
    } finally {
      setDownloading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'database', label: 'MySQL Schema' },
    { id: 'servlet', label: 'Servlets' },
    { id: 'dao', label: 'JDBC DAOs' },
    { id: 'model', label: 'POJOs' },
    { id: 'util', label: 'Utilities' },
    { id: 'filter', label: 'Filters' },
    { id: 'jsp', label: 'JSPs' },
    { id: 'config', label: 'pom.xml & web.xml' },
    { id: 'docs', label: 'Setup Guide' }
  ];

  const filteredFiles = activeCategory === 'all'
    ? JAVA_PROJECT_FILES
    : JAVA_PROJECT_FILES.filter(f => f.category === activeCategory);

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'database':
        return <Database className="w-4 h-4 text-emerald-600" />;
      case 'servlet':
      case 'dao':
      case 'model':
      case 'util':
      case 'filter':
        return <FileCode className="w-4 h-4 text-blue-600" />;
      case 'jsp':
        return <FileCode className="w-4 h-4 text-indigo-600" />;
      case 'config':
        return <Layers className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Top Banner with Download ZIP Button */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold">
            <Server className="w-3.5 h-3.5" />
            <span>Apache Tomcat & Maven Project Source Code</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            TrueTag™ Java Servlets / JSP / JDBC Source Repository
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Ready-to-run Eclipse IDE & IntelliJ IDEA project structure. Includes MySQL DDL schema, PreparedStatement DAOs, BCrypt security, ZXing QR generation, Role Filters, and Bootstrap 5 JSPs.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-900 bg-white hover:bg-blue-50 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Download className="w-5 h-5 text-blue-600" />
          {downloading ? 'Bundling ZIP...' : 'Download Full Project (.ZIP)'}
        </button>
      </div>

      {/* Main Two-Column File Explorer & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: File Tree Explorer */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-blue-600" />
              Project Files ({JAVA_PROJECT_FILES.length})
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1 pb-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 border border-blue-200 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {getFileIcon(file.category)}
                  <div className="flex-1 truncate">
                    <div className="truncate font-mono">{file.path}</div>
                    <div className="text-[10px] text-slate-400 truncate">{file.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer with Copy Button */}
        <div className="lg:col-span-8 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg space-y-0">
          
          {/* File Header Bar */}
          <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate text-slate-200 text-xs">
              <span className="font-mono font-bold text-blue-400">{selectedFile.path}</span>
              <span className="hidden sm:inline text-slate-400">·</span>
              <span className="hidden sm:inline text-slate-400 truncate">{selectedFile.description}</span>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-700/80 hover:bg-slate-700 hover:text-white rounded-md transition-colors cursor-pointer shrink-0 border border-slate-600"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code Container */}
          <div className="p-4 overflow-x-auto max-h-[600px] text-xs font-mono text-slate-200 bg-slate-950/70 leading-relaxed selection:bg-blue-900 selection:text-white">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>

        </div>

      </div>

      {/* Quick Setup Checklist for College Submissions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Step-by-Step College Run Checklist (Tomcat & MySQL)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">1. Run MySQL Script</span>
            <p className="text-slate-600">
              Open MySQL Workbench, run <code>database/schema.sql</code> to create the database, tables, and sample dataset.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">2. Import in Eclipse/IntelliJ</span>
            <p className="text-slate-600">
              File &rarr; Import &rarr; Existing Maven Projects. Select extracted folder with <code>pom.xml</code>. Maven will pull <code>mysql-connector-j</code>, <code>jbcrypt</code>, and <code>zxing</code> automatically.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">3. Run on Apache Tomcat</span>
            <p className="text-slate-600">
              Deploy to Tomcat 9.0 or 10.1. Visit <code>http://localhost:8080/fake-product-detection/</code> to test all servlets.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
