import React, { useState, useEffect } from 'react';
import { Check, CheckSquare, Square, Building2, User, Wallet, FileText, ArrowRight } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export default function PublicOnboarding() {
  const { id } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('employees');
    if (saved) {
      const empList = JSON.parse(saved);
      const found = empList.find(e => e.id === id);
      if (found) {
        setEmployeeDetails({
          employeeId: found.id,
          fullName: found.name,
          email: found.email,
          phone: "9874563211", // Placeholder
          designation: found.designation,
          division: "Sales", // Placeholder
          location: "Byron Bazar", // Placeholder
          role: found.role,
          pan: "KISPA1208J", // Placeholder
          aadhar: "124578963214" // Placeholder
        });
        return;
      }
    }
    
    // Fallback if ID is invalid
    setEmployeeDetails({
      employeeId: id || "UNKNOWN",
      fullName: "Employee Not Found",
      email: "N/A",
      phone: "N/A",
      designation: "N/A",
      division: "N/A",
      location: "N/A",
      role: "N/A",
      pan: "N/A",
      aadhar: "N/A"
    });
  }, [id]);

  if (!employeeDetails) {
    return <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center font-sans text-gray-500">Loading onboarding details...</div>;
  }

  const salaryStructure = {
    grossMonthly: "32,000",
    grossYearly: "3,84,000",
    transportation: "2,000",
    performance: "1,000",
    achievement: "1,000",
    incentives: "1,000"
  };

  const requiredDocuments = [
    { name: "Aadhar Card", status: true },
    { name: "PAN Card", status: true },
    { name: "Recent Passport Photo", status: true },
    { name: "6 Month Bank Statement", status: true },
    { name: "Cancelled Cheque", status: true },
    { name: "10th Marksheet (Mandatory)", status: true },
    { name: "12th Marksheet (Mandatory)", status: true },
    { name: "Graduation Certificate (Mandatory)", status: true },
    { name: "Present Address Proof", status: true },
    { name: "Previous Company Documents (if experienced)", status: false },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] py-6 px-4 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto space-y-5">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-[12px] flex items-center justify-center text-white font-bold text-xl shadow-md">
              N
            </div>
            <div>
              <h1 className="text-[17px] font-bold text-gray-900 leading-tight">NuoG Housing Payment's Limited</h1>
              <p className="text-[13px] text-gray-400 font-medium">Loan Operations & Lead Management</p>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[13px] font-semibold border border-blue-100">
            Employee Onboarding
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-sm border border-blue-700">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            Welcome, {employeeDetails.fullName}! <span className="text-xl">👋</span>
          </h2>
          <p className="text-[14px] text-blue-50 max-w-3xl leading-relaxed">
            You have been onboarded as a member of NuoG Housing Payment's Limited. Please review your details below and click <strong>Proceed to Form</strong> to complete your onboarding process.
          </p>
        </div>

        {/* Your Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <User size={16} className="text-blue-500" />
            <h3 className="font-bold text-[14px]">Your Details</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-y-3">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">Employee ID</span>
                <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.employeeId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">Full Name</span>
                <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.fullName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">Email</span>
                <span className="text-gray-900 font-bold text-[14px] flex items-center gap-1.5">
                  <span className="text-gray-400">✉</span> {employeeDetails.email}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">Phone</span>
                <span className="text-gray-900 font-bold text-[14px] flex items-center gap-1.5">
                  <span className="text-gray-400">📞</span> {employeeDetails.phone}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">Designation</span>
                <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.designation}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">Division</span>
                <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.division}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">Location</span>
                <span className="text-gray-900 font-bold text-[14px] flex items-center gap-1.5">
                  <span className="text-gray-400">📍</span> {employeeDetails.location}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">Role</span>
                <span className="text-blue-700 font-bold text-[14px]">{employeeDetails.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">PAN Number</span>
                <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.pan}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500 text-[14px] font-medium">Aadhar Number</span>
                <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.aadhar}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Structure */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <Wallet size={16} className="text-green-500" />
            <h3 className="font-bold text-[14px]">Your Salary Structure</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="border border-gray-100 rounded-xl p-3 shadow-sm">
                <p className="text-gray-500 text-[12px] font-medium mb-0.5">Gross Monthly</p>
                <p className="text-lg font-bold text-blue-600">₹{salaryStructure.grossMonthly}</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 shadow-sm">
                <p className="text-gray-500 text-[12px] font-medium mb-0.5">Gross Yearly</p>
                <p className="text-lg font-bold text-blue-600">₹{salaryStructure.grossYearly}</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 shadow-sm">
                <p className="text-gray-500 text-[12px] font-medium mb-0.5">Transportation</p>
                <p className="text-lg font-bold text-gray-900">₹{salaryStructure.transportation}</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 shadow-sm">
                <p className="text-gray-500 text-[12px] font-medium mb-0.5">Perf. Bonus</p>
                <p className="text-lg font-bold text-gray-900">₹{salaryStructure.performance}</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 shadow-sm">
                <p className="text-gray-500 text-[12px] font-medium mb-0.5">Achieve. Bonus</p>
                <p className="text-lg font-bold text-gray-900">₹{salaryStructure.achievement}</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 shadow-sm">
                <p className="text-gray-500 text-[12px] font-medium mb-0.5">Incentives</p>
                <p className="text-lg font-bold text-gray-900">₹{salaryStructure.incentives}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents You'll Need */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
            <Building2 size={16} className="text-purple-500" />
            <h3 className="font-bold text-[14px]">Documents You'll Need</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
              {requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  {doc.status ? (
                    <div className="w-4 h-4 bg-green-500 rounded-[3px] flex items-center justify-center text-white flex-shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-4 h-4 border-[2px] border-gray-300 rounded-[3px] flex-shrink-0"></div>
                  )}
                  <span className="text-[13px] text-gray-700 font-medium">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="pt-6 pb-10 flex flex-col items-center">
          <p className="text-gray-500 text-[13px] mb-4">
            Please keep all documents ready. The form has 9 steps and takes about 10-15 minutes.
          </p>
          <Link 
            to={`/onboarding/${id}/form`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-[14px] rounded-lg font-bold shadow-sm flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            Proceed to Form
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
