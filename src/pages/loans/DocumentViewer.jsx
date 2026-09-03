import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, Download, ZoomIn, ZoomOut, RotateCw, FileText, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { hasPermission } from '../../utils/permissions';

export default function DocumentViewer() {
  const { userId, docIndex } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const fetchUserAndDocument = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data);
        if (data.documents && data.documents[docIndex]) {
          setDocument(data.documents[docIndex]);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndDocument();
  }, [userId, docIndex]);

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/documents/${docIndex}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleVerify = () => {
    Swal.fire({
      title: 'Verify Document?',
      text: `Are you sure you want to verify ${document.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Verify!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateStatus('Verified');
        toast.success(`${document.name} verified successfully.`);
        setTimeout(() => window.close(), 1500);
      }
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: 'Reject Document?',
      text: "Please provide a reason for rejection.",
      input: 'textarea',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Reject Document',
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage('Reason is required');
        }
        return reason;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateStatus('Rejected');
        toast.error(`Document rejected. SMS sent to customer for re-upload.`);
        setTimeout(() => window.close(), 2000);
      }
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading Document...</div>;
  }

  if (!document) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <h2 className="text-2xl font-bold mb-4">Document Not Found</h2>
        <button onClick={() => window.close()} className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700">Close Tab</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0f172a] text-white flex flex-col font-sans overflow-hidden">
      <div className="h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => window.close()} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-[15px]">{document.name}</h1>
            <p className="text-[12px] text-slate-400">Applicant: {user?.name} ({userId}) • Uploaded: {document.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-r border-slate-700 pr-4 mr-2">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300" title="Zoom Out"><ZoomOut size={18}/></button>
          <span className="text-[12px] font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300" title="Zoom In"><ZoomIn size={18}/></button>
          <button onClick={() => setRotation(r => r + 90)} className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 ml-2" title="Rotate"><RotateCw size={18}/></button>
          {hasPermission('Download Documents') ? (
            <a href={document.url} download target="_blank" rel="noreferrer" className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 ml-2" title="Download"><Download size={18}/></a>
          ) : (
            <div className="p-2 rounded text-slate-600 ml-2 cursor-not-allowed" title="You don't have download permission">
              <Lock size={18}/>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {hasPermission('Verify Documents') ? (
            <>
              <button onClick={handleReject} className="h-9 px-4 flex items-center justify-center gap-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold text-[13px] transition-colors">
                <XCircle size={16} /> Reject
              </button>
              <button onClick={handleVerify} className="h-9 px-4 flex items-center justify-center gap-2 rounded bg-[#489b0d] text-white hover:bg-[#3e850b] font-bold text-[13px] transition-colors">
                <CheckCircle2 size={16} /> Verify
              </button>
            </>
          ) : (
            <div className="h-9 px-4 flex items-center gap-2 rounded bg-slate-700/50 text-slate-500 text-[12px] font-medium cursor-not-allowed">
              <Lock size={14} /> No Verification Access
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center bg-[#090e17] p-8">
        <div 
          className="transition-transform duration-200 ease-out shadow-2xl"
          style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
        >
          {document.type === 'PDF' ? (
            <div className="w-[800px] h-[1000px] bg-white rounded-lg flex items-center justify-center text-slate-800 flex-col">
              <FileText size={64} className="text-slate-300 mb-4" />
              <h2 className="text-xl font-bold">{document.name}</h2>
              <p className="text-slate-500 mt-2">Mock PDF Document View</p>
            </div>
          ) : (
            <img 
              src={document.url} 
              alt={document.name} 
              className="max-w-[1200px] max-h-[1200px] object-contain rounded bg-white shadow-2xl"
              crossOrigin="anonymous"
            />
          )}
        </div>
      </div>
    </div>
  );
}
