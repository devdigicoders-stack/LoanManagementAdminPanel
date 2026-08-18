import { ChevronRight, Download, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BulkImport() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Bulk Import Users</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">User Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">Manage Users</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800">Bulk Import</span>
          </div>
        </div>
        
        <Link to="/users" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center gap-2">
           &larr; Back to Users
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column - Instructions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-slate-800 mb-2">Download Sample File</h3>
            <p className="text-[12px] font-medium text-slate-500 mb-6">Download the sample Excel file and follow the format to import users.</p>
            
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-all shadow-sm">
              <Download size={16} strokeWidth={2.5} />
              Download Sample Excel
            </button>
          </div>

          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-slate-800 mb-4">Import Instructions</h3>
            
            <ol className="list-decimal list-inside space-y-3 text-[13px] font-medium text-slate-600">
              <li>Download and fill the sample file</li>
              <li>Ensure all required fields are filled</li>
              <li>Email must be unique for each user</li>
              <li>Password will be auto-generated</li>
              <li>Maximum file size: 5MB</li>
            </ol>
          </div>
        </div>

        {/* Right Column - Upload Area */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-[15px] font-bold text-slate-800 mb-4">Upload File</h3>
          
          <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-8 bg-slate-50/50 hover:bg-slate-50 hover:border-[#489b0d]/50 transition-all group">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-[#489b0d] mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud size={32} />
            </div>
            
            <h4 className="text-[14px] font-bold text-slate-800 mb-1">Drag & drop your file here</h4>
            <p className="text-[12px] font-medium text-slate-500 mb-6">or</p>
            
            <button className="px-6 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-all shadow-sm mb-6">
              Choose File
            </button>

            <div className="text-center">
              <p className="text-[11px] font-bold text-slate-500">Supports .xlsx, .xls</p>
              <p className="text-[11px] font-bold text-slate-500 mt-1">Maximum file size: 5MB</p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        <Link to="/users" className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm">
          Cancel
        </Link>
        <button className="px-6 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm">
          Import Users
        </button>
      </div>

    </div>
  );
}
