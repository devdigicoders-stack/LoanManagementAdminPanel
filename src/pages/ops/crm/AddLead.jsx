import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, Mail, MapPin, Briefcase, IndianRupee, 
  Calendar, CheckCircle, ChevronRight, Save, X
} from 'lucide-react';

export default function AddLead() {
  const navigate = useNavigate();

  // Handle form submission (mock)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally you'd submit data to backend here
    navigate('/ops/leads');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/ops/leads')}>All Leads</span>
            <ChevronRight size={14} />
            <span className="font-semibold text-gray-900">Add New Lead</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Lead</h1>
        </div>
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={() => navigate('/ops/leads')}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            form="addLeadForm"
            type="submit" 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Save size={16} /> Create Lead
          </button>
        </div>
      </div>

      <form id="addLeadForm" onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        
        {/* Customer Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Customer Details</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Rahul Sharma" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+91</span>
                <input type="tel" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="9876543210" maxLength="10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alternate Mobile</label>
              <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="rahul@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase" placeholder="ABCDE1234F" maxLength="10" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar Number</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="1234 5678 9012" maxLength="12" />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Complete Address</label>
              <textarea rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Flat, Building, Street, Area..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Mumbai" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700">
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="400001" maxLength="6" />
            </div>
          </div>
        </div>

        {/* Loan Requirement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <IndianRupee className="text-green-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Loan Requirement</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Type <span className="text-red-500">*</span></label>
              <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700">
                <option value="">Select Type</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Auto Loan">Auto Loan</option>
                <option value="Education Loan">Education Loan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Required Amount (₹) <span className="text-red-500">*</span></label>
              <input type="number" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. 500000" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tenure (Months) <span className="text-red-500">*</span></label>
              <input type="number" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. 60" />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Purpose of Loan</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Home Renovation, Marriage, Working Capital" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Employment Type <span className="text-red-500">*</span></label>
              <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700">
                <option value="">Select Employment</option>
                <option value="Salaried">Salaried</option>
                <option value="Self Employed Professional">Self Employed Professional</option>
                <option value="Self Employed Business">Self Employed Business</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Income (₹) <span className="text-red-500">*</span></label>
              <input type="number" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. 75000" />
            </div>
          </div>
        </div>

        {/* Lead Source & Assignment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Briefcase className="text-purple-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Source & Assignment</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Lead Source <span className="text-red-500">*</span></label>
              <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700">
                <option value="">Select Source</option>
                <option value="Facebook">Facebook Ads</option>
                <option value="Instagram">Instagram Ads</option>
                <option value="Google">Google Search</option>
                <option value="Website">Website Organic</option>
                <option value="Referral">Referral</option>
                <option value="Field Executive">Field Executive</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-1">Assign to Executive</label>
                <select className="w-full px-3 py-2 border border-blue-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700">
                  <option value="">-- Unassigned --</option>
                  <option value="Rahul S">Rahul Sharma</option>
                  <option value="Priya M">Priya Mishra</option>
                  <option value="Vikram K">Vikram Kapoor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-900 mb-1">Branch / Location</label>
                <select className="w-full px-3 py-2 border border-blue-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700">
                  <option value="">Select Branch</option>
                  <option value="Mumbai HO">Mumbai HQ</option>
                  <option value="Delhi Branch">Delhi Branch</option>
                  <option value="Bangalore Branch">Bangalore Branch</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
