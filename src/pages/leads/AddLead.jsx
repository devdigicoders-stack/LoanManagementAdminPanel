import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import toast from 'react-hot-toast';

export default function AddLead() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', mobile: '', altMobile: '', email: '', 
    source: '', expectedAmount: '', loanPurpose: '', 
    preferredBranch: '', address: '', remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.source || !formData.loanPurpose || !formData.expectedAmount || !formData.preferredBranch) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Lead added successfully!');
        navigate('/leads');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to add lead');
      }
    } catch (error) {
      toast.error('Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Add New Lead</h1>
        <div className="flex items-center text-[12px] font-medium text-slate-500">
          <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
            Lead & Work Management
          </span>
          <ChevronRight size={14} className="mx-1" />
          <Link to="/leads" className="hover:text-[#489b0d] transition-colors">
            All Leads
          </Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-[#489b0d] font-bold">Add Lead</span>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Column 1: Personal Information */}
            <div className="space-y-6">
              <h3 className="text-[14px] font-extrabold text-slate-800 border-b border-slate-100 pb-2">
                Personal Information
              </h3>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Alternate Mobile
                </label>
                <input
                  type="tel"
                  name="altMobile"
                  value={formData.altMobile}
                  onChange={handleChange}
                  placeholder="Enter alternate number"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Column 2: Lead Information */}
            <div className="space-y-6">
              <h3 className="text-[14px] font-extrabold text-slate-800 border-b border-slate-100 pb-2">
                Lead Information
              </h3>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Source <span className="text-red-500">*</span>
                </label>
                <select name="source" value={formData.source} onChange={handleChange} className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white appearance-none">
                  <option value="" disabled>Select source</option>
                  <option>Website</option>
                  <option>Referral</option>
                  <option>Walk-in</option>
                  <option>Tele Calling</option>
                  <option>Social Media</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Expected Loan Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="expectedAmount"
                  value={formData.expectedAmount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Loan Purpose <span className="text-red-500">*</span>
                </label>
                <select name="loanPurpose" value={formData.loanPurpose} onChange={handleChange} className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white appearance-none">
                  <option value="" disabled>Select purpose</option>
                  <option>Home Loan</option>
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                  <option>Education Loan</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Preferred Branch <span className="text-red-500">*</span>
                </label>
                <select name="preferredBranch" value={formData.preferredBranch} onChange={handleChange} className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white appearance-none">
                  <option value="" disabled>Select branch</option>
                  <option>Lucknow Main Branch</option>
                  <option>Gomti Nagar Branch</option>
                  <option>Aliganj Branch</option>
                </select>
              </div>
            </div>

            {/* Column 3: Additional Information */}
            <div className="space-y-6">
              <h3 className="text-[14px] font-extrabold text-slate-800 border-b border-slate-100 pb-2">
                Additional Information (Optional)
              </h3>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows="4"
                  className="w-full p-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks"
                  rows="4"
                  className="w-full p-4 rounded-md border border-slate-200 text-[13px] text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          <Link to="/leads">
            <button type="button" className="px-6 py-2.5 rounded-md border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-100 transition-colors">
              Cancel
            </button>
          </Link>
          <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
