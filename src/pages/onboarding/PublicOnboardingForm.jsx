import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Upload, FileText, Trash2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const steps = [
  { id: 1, label: 'Verify Details' },
  { id: 2, label: 'Salary Info' },
  { id: 3, label: 'Personal' },
  { id: 4, label: 'References' },
  { id: 5, label: 'Education' },
  { id: 6, label: 'Experience' },
  { id: 7, label: 'Bank Details' },
  { id: 8, label: 'Documents' },
  { id: 9, label: 'Submit' },
];

const UploadBox = ({ title, required, types, documents, setDocuments }) => {
  const fileInputRef = useRef(null);
  const uploadedFile = documents[title];
  
  const handleFileClick = () => {
    if (!uploadedFile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 10MB.`);
        return;
      }
      setDocuments(prev => ({ ...prev, [title]: file }));
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setDocuments(prev => {
      const newDocs = { ...prev };
      delete newDocs[title];
      return newDocs;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const acceptTypes = types.toLowerCase().split(' / ').map(t => `.${t}`).join(',');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-gray-700">{title}</span>
        {uploadedFile ? (
          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">✓ Uploaded</span>
        ) : required ? (
          <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase">Required</span>
        ) : (
          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-bold uppercase">Optional</span>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept={acceptTypes}
      />

      {uploadedFile ? (
        <div className="border-2 border-green-500 bg-green-50 rounded-xl h-24 flex flex-col justify-center px-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-purple-500 shrink-0">
              {uploadedFile.name.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? <ImageIcon size={20} /> : <FileText size={20} />}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-bold text-gray-800 truncate" title={uploadedFile.name}>{uploadedFile.name}</p>
              <p className="text-[11px] text-gray-500">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <button onClick={handleDelete} className="absolute right-3 bottom-3 text-red-500 hover:text-red-700">
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <div 
          onClick={handleFileClick}
          className={`border-2 border-dashed ${required ? 'border-red-200 bg-red-50/30 cursor-pointer hover:bg-red-50' : 'border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-gray-100'} rounded-xl h-24 flex flex-col items-center justify-center gap-1 transition-colors`}
        >
          <Upload size={18} className={required ? 'text-red-300' : 'text-gray-400'} />
          <span className={`text-[11px] font-bold ${required ? 'text-red-300' : 'text-gray-400'}`}>{types}</span>
        </div>
      )}
    </div>
  );
};

export default function PublicOnboardingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isExperienced, setIsExperienced] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [documents, setDocuments] = useState({});

  // Form Data State
  const [formData, setFormData] = useState({
    // Step 3
    fathersName: '', mothersName: '', fathersMobile: '', maritalStatus: 'Single',
    drivingLicence: '', vehicleNumber: '', presentAddress: '', permanentAddress: '',
    landmark: '', pincode: '', district: 'Auto-filled from pincode', state: '',
    // Step 4
    ref1Rel: '', ref1Name: '', ref1Mobile: '', ref1Address: '',
    ref2Rel: '', ref2Name: '', ref2Mobile: '', ref2Address: '',
    // Step 5
    qual1Type: 'Graduation', qual1Inst: '', qual1Dist: '', qual1Year: '', qual1Perc: '',
    // Step 6
    expCompany: '', expPosition: '', expPhone: '', expStart: '', expEnd: '', 
    expGross: '', expMonthly: '', expReason: '', expAddress: '',
    expRmName: '', expRmDesig: '', expRmMobile: '', expRmEmail: '', expRmBranch: '',
    // Step 7
    bankAccType: 'Savings Account', bankAccName: '', bankName: '', bankBranch: '',
    bankAccNum: '', bankAccNumConfirm: '', bankIfsc: '',
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/onboarding/${id}`);
        if (res.ok) {
          const data = await res.json();
            setEmployeeDetails({
              employeeId: data.empId,
              fullName: data.name,
              email: data.email,
              phone: data.mobile || "N/A",
              designation: data.designation,
              division: data.division || "N/A",
              role: data.role,
              pan: data.pan || "N/A",
              aadhar: data.aadhar || "N/A",
              grossMonthly: data.grossMonthly || 0,
              transportation: data.transportation || 0,
              performance: data.performance || 0,
              achievement: data.achievement || 0,
              incentives: data.incentives || 0
            });
            if (data.onboardingStatus === 'Done') {
              setCurrentStep(8);
            }
        } else {
          setEmployeeDetails({
            employeeId: id || "UNKNOWN",
            fullName: "Employee Not Found",
            email: "N/A", phone: "N/A", designation: "N/A", division: "N/A", role: "N/A", pan: "N/A", aadhar: "N/A"
          });
        }
      } catch (error) {
        setEmployeeDetails({
          employeeId: id || "UNKNOWN",
          fullName: "Employee Not Found",
          email: "N/A", phone: "N/A", designation: "N/A", division: "N/A", role: "N/A", pan: "N/A", aadhar: "N/A"
        });
      }
    };
    
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const validateStep = (step) => {
    switch(step) {
      case 3:
        if (!formData.fathersName || !formData.mothersName || !formData.maritalStatus || !formData.presentAddress || !formData.permanentAddress || !formData.pincode || !formData.district || !formData.state) {
          toast.error("Please fill all required fields in Personal Details.");
          return false;
        }
        return true;
      case 4:
        if (!formData.ref1Rel || !formData.ref1Name || !formData.ref1Mobile || !formData.ref2Rel || !formData.ref2Name || !formData.ref2Mobile) {
          toast.error("Please fill all required fields for both references.");
          return false;
        }
        if (formData.ref1Mobile.length !== 10 || formData.ref2Mobile.length !== 10) {
          toast.error("Mobile numbers must be exactly 10 digits.");
          return false;
        }
        return true;
      case 5:
        if (!formData.qual1Type || !formData.qual1Inst) {
          toast.error("Please fill required Educational Qualification fields.");
          return false;
        }
        return true;
      case 7:
        if (!formData.bankAccType || !formData.bankAccName || !formData.bankName || !formData.bankAccNum || !formData.bankAccNumConfirm || !formData.bankIfsc) {
          toast.error("Please fill all required Bank Details.");
          return false;
        }
        if (formData.bankAccNum !== formData.bankAccNumConfirm) {
          toast.error("Account Numbers do not match.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 9) setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      
      // Append normal text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append files and their metadata
      const serializedDocs = [];
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          serializedDocs.push({
            key: key,
            name: documents[key].name,
            type: documents[key].type
          });
          // Fieldname will be the key
          formDataToSend.append(key, documents[key]);
        }
      });
      
      formDataToSend.append('documents', JSON.stringify(serializedDocs));

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/onboarding/${id}`, {
        method: 'POST',
        // Omit Content-Type, fetch will automatically set it to multipart/form-data with the correct boundary
        body: formDataToSend
      });
      
      if (res.ok) {
        setIsSubmitted(true);
        toast.success("Onboarding Details Submitted!");
      } else {
        toast.error("Failed to submit onboarding details");
      }
    } catch (error) {
      toast.error("Server error while submitting");
    }
  };

  if (!employeeDetails) {
    return <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center font-sans text-gray-500">Loading form...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans text-gray-800">
      
      {/* Top Bar */}
      {!isSubmitted && (
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-[8px] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              N
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-gray-900 leading-tight">NuoGM</h1>
              <p className="text-[12px] text-gray-400 font-medium">Employee Onboarding</p>
            </div>
          </div>
          <div className="text-[13px] font-medium text-gray-500">
            {employeeDetails.fullName} <span className="mx-2">·</span> <span className="font-bold text-gray-900">{employeeDetails.employeeId}</span>
          </div>
        </div>
        
        {/* Stepper */}
        <div className="max-w-5xl mx-auto px-5 py-3 overflow-x-auto hide-scroll">
          <div className="flex items-center justify-between min-w-[700px]">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-1 flex-1 relative">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold z-10 transition-colors
                      ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : step.id}
                  </div>
                  <span className={`text-[11px] font-bold ${isActive ? 'text-blue-600' : isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                  
                  {/* Connecting Line */}
                  {step.id < 9 && (
                    <div className={`absolute top-3.5 left-[50%] w-[100%] h-[2px] -z-0
                      ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-100'}`} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-6">
            {/* Step 1: Verify Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 1 — Verify Your Details</h2>
                  <p className="text-gray-500 text-[14px]">Please verify the information below is correct before proceeding.</p>
                </div>
                
                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                  <div className="grid grid-cols-1 gap-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-[14px] font-medium">Full Name</span>
                      <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.fullName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-[14px] font-medium">Employee ID</span>
                      <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.employeeId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-[14px] font-medium">Email</span>
                      <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-[14px] font-medium">Mobile</span>
                      <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-[14px] font-medium">Designation</span>
                      <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.designation}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-[14px] font-medium">Division</span>
                      <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.division}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-[14px] font-medium">Role</span>
                      <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.role}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200/50">
                      <span className="text-gray-500 text-[14px] font-medium">PAN Number</span>
                      <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.pan}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500 text-[14px] font-medium">Aadhar</span>
                      <span className="text-gray-900 font-bold text-[14px]">{employeeDetails.aadhar}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-yellow-800 text-[14px] font-medium">
                  If any information is incorrect, contact HR before proceeding.
                </div>
              </div>
            )}

            {/* Step 2: Salary Info */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 2 — Your Salary Structure</h2>
                  <p className="text-gray-500 text-[14px]">Verify your salary details as set by HR.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50/30">
                    <p className="text-gray-500 text-[13px] font-medium mb-1">Gross Monthly</p>
                    <p className="text-2xl font-bold text-blue-600">₹{employeeDetails.grossMonthly}</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50/30">
                    <p className="text-gray-500 text-[13px] font-medium mb-1">Gross Yearly</p>
                    <p className="text-2xl font-bold text-blue-600">₹{employeeDetails.grossMonthly * 12}</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50/30">
                    <p className="text-gray-500 text-[13px] font-medium mb-1">Transportation Allowance</p>
                    <p className="text-2xl font-bold text-blue-600">₹{employeeDetails.transportation}</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50/30">
                    <p className="text-gray-500 text-[13px] font-medium mb-1">Performance Bonus</p>
                    <p className="text-2xl font-bold text-blue-600">₹{employeeDetails.performance}</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50/30">
                    <p className="text-gray-500 text-[13px] font-medium mb-1">Achievement Bonus</p>
                    <p className="text-2xl font-bold text-blue-600">₹{employeeDetails.achievement}</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50/30">
                    <p className="text-gray-500 text-[13px] font-medium mb-1">Business Incentives</p>
                    <p className="text-2xl font-bold text-blue-600">₹{employeeDetails.incentives}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Personal Details */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 3 — Personal Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Father's Name <span className="text-red-500">*</span></label>
                    <input type="text" name="fathersName" value={formData.fathersName} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Mother's Name <span className="text-red-500">*</span></label>
                    <input type="text" name="mothersName" value={formData.mothersName} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Father's Mobile</label>
                    <input type="text" name="fathersMobile" value={formData.fathersMobile} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Marital Status <span className="text-red-500">*</span></label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Driving Licence No</label>
                    <input type="text" name="drivingLicence" value={formData.drivingLicence} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Vehicle Number</label>
                    <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Present Address <span className="text-red-500">*</span></label>
                    <textarea name="presentAddress" value={formData.presentAddress} onChange={handleChange} rows="2" className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Permanent Address <span className="text-red-500">*</span></label>
                    <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} rows="2" className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Pincode <span className="text-red-500">*</span></label>
                    <input type="text" name="pincode" placeholder="6-digit" value={formData.pincode} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">District (auto-filled) <span className="text-red-500">*</span></label>
                    <input type="text" name="district" value={formData.district} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">State (auto-filled) <span className="text-red-500">*</span></label>
                    <select name="state" value={formData.state} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option value="">Select state</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Maharashtra">Maharashtra</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Reference Details */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 4 — Reference Details</h2>
                  <p className="text-gray-500 text-[14px]">Minimum 2 references required.</p>
                </div>
                
                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 mb-4">
                  <h3 className="font-bold text-gray-800 mb-4">Reference 1</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Relationship <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Friend, Colleague..." name="ref1Rel" value={formData.ref1Rel} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" name="ref1Name" value={formData.ref1Name} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Mobile (10-digit) <span className="text-red-500">*</span></label>
                      <input type="text" name="ref1Mobile" value={formData.ref1Mobile} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Address</label>
                      <input type="text" name="ref1Address" value={formData.ref1Address} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4">Reference 2</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Relationship <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Friend, Colleague..." name="ref2Rel" value={formData.ref2Rel} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" name="ref2Name" value={formData.ref2Name} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Mobile (10-digit) <span className="text-red-500">*</span></label>
                      <input type="text" name="ref2Mobile" value={formData.ref2Mobile} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Address</label>
                      <input type="text" name="ref2Address" value={formData.ref2Address} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <button className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-medium text-[13px] border border-blue-100 hover:bg-blue-100 transition-colors">
                    <span className="text-lg leading-none">+</span> Add Reference
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Educational Qualification */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 5 — Educational Qualification</h2>
                  <p className="text-gray-500 text-[14px]">Add your educational qualifications.</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-[14px]">Qualification 1</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Qualification <span className="text-red-500">*</span></label>
                      <select name="qual1Type" value={formData.qual1Type} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        <option>10th</option>
                        <option>12th</option>
                        <option>Graduation</option>
                        <option>Post Graduation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Institution Name <span className="text-red-500">*</span></label>
                      <input type="text" name="qual1Inst" value={formData.qual1Inst} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">District / State</label>
                      <input type="text" placeholder="e.g. Bilaspur, Chhattisgarh" name="qual1Dist" value={formData.qual1Dist} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Passing Year</label>
                      <input type="text" placeholder="e.g. 2020" name="qual1Year" value={formData.qual1Year} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Percentage / CGPA</label>
                      <input type="text" placeholder="e.g. 75 or 8.5" name="qual1Perc" value={formData.qual1Perc} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-medium text-[13px] border border-blue-100 hover:bg-blue-100 transition-colors">
                  <span className="text-lg leading-none">+</span> Add Qualification
                </button>
              </div>
            )}

            {/* Step 6: Previous Experience */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Step 6 — Previous Experience</h2>
                  
                  <div className="flex bg-white rounded-lg p-1 border border-gray-200 mb-6">
                    <button 
                      onClick={() => setIsExperienced(false)}
                      className={`flex-1 py-2.5 text-[14px] font-bold rounded-md transition-colors ${!isExperienced ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      Fresher
                    </button>
                    <button 
                      onClick={() => setIsExperienced(true)}
                      className={`flex-1 py-2.5 text-[14px] font-bold rounded-md transition-colors ${isExperienced ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      Experienced
                    </button>
                  </div>
                </div>

                {!isExperienced ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg py-4 px-6 text-center font-medium text-[14px]">
                    No previous experience — proceed to next step.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Company Name</label>
                      <input type="text" name="expCompany" value={formData.expCompany} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Position / Designation</label>
                      <input type="text" name="expPosition" value={formData.expPosition} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Company Phone</label>
                      <input type="text" name="expPhone" value={formData.expPhone} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Start Date</label>
                      <input type="date" name="expStart" value={formData.expStart} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Last Working Date</label>
                      <input type="date" name="expEnd" value={formData.expEnd} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Gross Salary (₹)</label>
                      <input type="text" name="expGross" value={formData.expGross} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Monthly Salary (₹)</label>
                      <input type="text" name="expMonthly" value={formData.expMonthly} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Reason for Leaving</label>
                      <input type="text" name="expReason" value={formData.expReason} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Company Address</label>
                      <input type="text" name="expAddress" value={formData.expAddress} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Reporting Manager Name</label>
                      <input type="text" name="expRmName" value={formData.expRmName} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">RM Designation</label>
                      <input type="text" name="expRmDesig" value={formData.expRmDesig} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">RM Mobile</label>
                      <input type="text" name="expRmMobile" value={formData.expRmMobile} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">RM Email</label>
                      <input type="text" name="expRmEmail" value={formData.expRmEmail} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-700 mb-1.5">RM Branch</label>
                      <input type="text" name="expRmBranch" value={formData.expRmBranch} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 7: Bank Details */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 7 — Bank Details</h2>
                  <p className="text-gray-500 text-[14px]">Your salary will be credited to this account.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Account Type <span className="text-red-500">*</span></label>
                    <select name="bankAccType" value={formData.bankAccType} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Savings Account</option>
                      <option>Current Account</option>
                      <option>Salary Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Account Holder Name <span className="text-red-500">*</span></label>
                    <input type="text" name="bankAccName" value={formData.bankAccName} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Bank Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. State Bank of India" name="bankName" value={formData.bankName} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Branch Name</label>
                    <input type="text" name="bankBranch" value={formData.bankBranch} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Account Number <span className="text-red-500">*</span></label>
                    <input type="text" name="bankAccNum" value={formData.bankAccNum} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Re-enter Account Number <span className="text-red-500">*</span></label>
                    <input type="text" name="bankAccNumConfirm" value={formData.bankAccNumConfirm} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">IFSC Code <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. SBIN0001234" name="bankIfsc" value={formData.bankIfsc} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Documents */}
            {currentStep === 8 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 8 — Upload Documents</h2>
                  <p className="text-gray-500 text-[14px]">Upload all required documents. Max 10MB per file.</p>
                </div>
                
                <div className="space-y-4">
                  {/* Employee Photo */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between border-l-4 border-l-pink-500">
                      <h3 className="font-bold text-gray-800 text-[14px]">Employee Photo</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-4">
                      <UploadBox title="Passport Photo" required={true} types="JPG / PNG" documents={documents} setDocuments={setDocuments} />
                    </div>
                  </div>

                  {/* Identity Documents */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between border-l-4 border-l-blue-600">
                      <h3 className="font-bold text-gray-800 text-[14px]">Identity Documents</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <UploadBox title="Aadhar Card (Front)" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="Aadhar Card (Back)" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="PAN Card" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                    </div>
                  </div>

                  {/* Educational Certificates */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between border-l-4 border-l-purple-600">
                      <h3 className="font-bold text-gray-800 text-[14px]">Educational Certificates (10th, 12th, Graduation, Diploma)</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <UploadBox title="10th Marksheet" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="12th Marksheet" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="Degree Certificate" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="Diploma Certificate" required={false} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                    </div>
                  </div>

                  {/* Bank Documents */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between border-l-4 border-l-teal-600">
                      <h3 className="font-bold text-gray-800 text-[14px]">Bank Documents</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <UploadBox title="Passbook / Cancelled Cheque" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="Bank Statement (3 months)" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                    </div>
                  </div>

                  {/* Father / Mother Documents */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between border-l-4 border-l-green-600">
                      <h3 className="font-bold text-gray-800 text-[14px]">Father / Mother Documents (Aadhar, Photo)</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <UploadBox title="Father's Aadhar" required={false} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="Mother's Aadhar" required={false} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="Father's Photo" required={false} types="JPG / PNG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="Mother's Photo" required={false} types="JPG / PNG" documents={documents} setDocuments={setDocuments} />
                    </div>
                  </div>

                  {/* Address Proof */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between border-l-4 border-l-indigo-800">
                      <h3 className="font-bold text-gray-800 text-[14px]">Address Proof & Field Executive Documents</h3>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <UploadBox title="Address Proof" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="Driving Licence" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                      <UploadBox title="RC Book / Affidavit" required={true} types="PDF / PNG / JPEG" documents={documents} setDocuments={setDocuments} />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-yellow-800 text-[13px] font-medium leading-relaxed">
                  Required: Photo, Aadhar (front+back), PAN, 10th & 12th marksheets, Degree Cert, Bank Passbook, Bank Statement, Address Proof, Driving Licence, RC Book
                </div>
              </div>
            )}

            {/* Step 9: Submit */}
            {currentStep === 9 && !isSubmitted && (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300 py-10">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle2 size={48} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Submit!</h2>
                  <p className="text-gray-500 text-[15px] max-w-md mx-auto mb-8">
                    All your details have been filled. Click Submit to send your onboarding form to HR for review.
                  </p>
                  
                  <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 text-left w-full max-w-sm shadow-sm">
                    <p className="font-bold text-gray-800 mb-3 text-[14px]">Completed sections:</p>
                    <ul className="space-y-2 text-[14px] text-green-600 font-medium">
                      <li className="flex items-center gap-2"><Check size={16} /> Verify Details</li>
                      <li className="flex items-center gap-2"><Check size={16} /> Salary Info</li>
                      <li className="flex items-center gap-2"><Check size={16} /> Personal Details</li>
                      <li className="flex items-center gap-2"><Check size={16} /> References</li>
                      <li className="flex items-center gap-2"><Check size={16} /> Education</li>
                      <li className="flex items-center gap-2"><Check size={16} /> Experience</li>
                      <li className="flex items-center gap-2"><Check size={16} /> Bank Details</li>
                      <li className="flex items-center gap-2"><Check size={16} /> Documents</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Submitted Success Screen */}
            {isSubmitted && (
              <div className="animate-in fade-in zoom-in duration-500 py-16 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-green-50 border-8 border-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-sm">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Onboarding Submitted!</h2>
                <p className="text-gray-500 text-[16px] max-w-md mx-auto mb-10 leading-relaxed">
                  Your form is submitted successfully. HR will review and share login credentials shortly.
                </p>
                
                <div className="bg-green-50/70 border border-green-100 text-green-800 font-bold px-8 py-3.5 rounded-xl shadow-sm">
                  Employee ID: <span className="bg-blue-600 text-white px-2 py-0.5 rounded ml-1">{employeeDetails.employeeId}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {!isSubmitted && (
            <div className="mt-10 flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              {currentStep > 1 && (
                <button 
                  onClick={handleBack}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors text-[14px]"
                >
                  Back
                </button>
              )}
              
              {currentStep < 9 ? (
                <button 
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-[14px]"
                >
                  Save & Continue
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors text-[14px] shadow-sm shadow-green-200"
                >
                  Submit Onboarding
                </button>
              )}
            </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
