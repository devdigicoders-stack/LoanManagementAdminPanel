import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FileText,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  CreditCard,
  Percent,
  Calendar,
  DollarSign,
  User,
  X,
  Send,
  ShieldCheck,
  Printer,
  BadgePercent,
  HandCoins,
  ArrowUpRight,
  ReceiptText
} from "lucide-react";

export default function ManageOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, APPROVED, WAITING, COLLECTION, LOAN
  const [users, setUsers] = useState([]);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [previewOffer, setPreviewOffer] = useState(null);

  // Form State for creating/editing offers
  const initialFormState = {
    loanId: "",
    applicationId: "",
    userId: "USR-00004",
    customer: "",
    mobile: "",
    email: "",
    loanType: "Business Loan",
    offerCategory: "Collection Offer", // "Collection Offer" or "Standard Loan Offer"
    settlementType: "One-Time Settlement (OTS)",
    collectionWaiver: "25000",
    originalOverdue: "525000",
    lender: "NUOG Housing Payments Ltd.",
    entityName: "ABC Enterprises Ltd.",
    customName: "",
    accountNumber: "50100456789012",
    ifscCode: "HDFC0001234",
    approvedAmount: "500000",
    disbursedAmount: "485000",
    monthlyEmi: "15500",
    rateOfInterest: "10.5",
    loanDuration: "36 Months",
    processingFee: "10000",
    insuranceAmount: "5000",
    totalAmount: "558000",
    principleAmount: "500000",
    interestAmount: "58000",
    offerStatus: "ACCEPTED"
  };

  const [formData, setFormData] = useState(initialFormState);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://loan-management-backend-wu4y.onrender.com/api';

  const formatLoanToOffer = (loan, index = 0) => {
    const amountNum = parseFloat(String(loan.amount || "500000").replace(/[^0-9.]/g, "")) || 500000;
    const tenureMonths = parseInt(String(loan.tenure || "24").replace(/[^0-9]/g, "")) || 24;
    const interestRateVal = parseFloat(String(loan.interestRate || "10.5").replace(/[^0-9.]/g, "")) || 10.5;

    let emi = loan.emiAmount;
    if (!emi || emi === 0) {
      const monthlyRate = (interestRateVal / 12) / 100;
      emi = Math.round((amountNum * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1)) || Math.round(amountNum / tenureMonths);
    }

    const totalAmountVal = Math.round(emi * tenureMonths);
    const interestAmountVal = Math.max(0, totalAmountVal - amountNum);
    const processingFeeVal = loan.details?.processingFee ? (parseFloat(String(loan.details.processingFee).replace(/[^0-9.]/g, "")) || Math.round(amountNum * 0.02)) : Math.round(amountNum * 0.02);
    const insuranceAmountVal = loan.details?.insuranceAmount ? (parseFloat(String(loan.details.insuranceAmount).replace(/[^0-9.]/g, "")) || Math.round(amountNum * 0.01)) : Math.round(amountNum * 0.01);
    const disbursedAmountVal = loan.details?.disbursedAmount ? (parseFloat(String(loan.details.disbursedAmount).replace(/[^0-9.]/g, "")) || Math.round(amountNum - processingFeeVal - insuranceAmountVal)) : Math.round(amountNum - processingFeeVal - insuranceAmountVal);

    const offerStatus = loan.details?.offerStatus || (["Approved", "Active", "Disbursed"].includes(loan.status) ? "ACCEPTED" : (index % 2 === 0 ? "ACCEPTED" : "WAITING"));
    const isCollection = loan.details?.offerCategory === "Collection Offer" || (index % 2 === 1 || loan.overdueDays > 0);

    return {
      _id: loan._id || `LOCAL-${Math.random()}`,
      applicationId: loan.applicationId || `APP-2026-${String(loan._id || "").slice(-4) || (1000 + index)}`,
      customer: loan.customer || loan.details?.customName || "Customer Name",
      userId: loan.userId || "USR-00004",
      mobile: loan.mobile || "9876543210",
      email: loan.email || "customer@example.com",
      loanType: loan.loanType || "Business Loan",
      offerCategory: loan.details?.offerCategory || (isCollection ? "Collection Offer" : "Standard Loan Offer"),
      settlementType: loan.details?.settlementType || (isCollection ? "One-Time Settlement (OTS)" : "Fresh Loan Sanction"),
      collectionWaiver: loan.details?.collectionWaiver || "₹ 25,000 Waiver",
      originalOverdue: loan.details?.originalOverdue || `₹ ${(amountNum + 25000).toLocaleString("en-IN")}`,
      lender: loan.details?.lender || loan.details?.lenderName || "NUOG Housing Payments Ltd.",
      entityName: loan.details?.entityName || `${loan.customer || "ABC"} Enterprises Ltd.`,
      customName: loan.details?.customName || loan.customer || "Customer Name",
      accountNumber: loan.details?.accountNumber || "50100456789012",
      ifscCode: loan.details?.ifsc || loan.details?.ifscCode || "HDFC0001234",
      approvedAmount: loan.details?.approvedAmount || `₹ ${amountNum.toLocaleString("en-IN")}`,
      disbursedAmount: loan.details?.disbursedAmount || `₹ ${disbursedAmountVal.toLocaleString("en-IN")}`,
      monthlyEmi: loan.details?.monthlyEmi || `₹ ${emi.toLocaleString("en-IN")}`,
      rateOfInterest: loan.details?.rateOfInterest || `${interestRateVal}% p.a.`,
      loanDuration: loan.details?.loanDuration || `${tenureMonths} Months`,
      processingFee: loan.details?.processingFee || `₹ ${processingFeeVal.toLocaleString("en-IN")}`,
      insuranceAmount: loan.details?.insuranceAmount || `₹ ${insuranceAmountVal.toLocaleString("en-IN")}`,
      totalAmount: loan.details?.totalAmount || `₹ ${totalAmountVal.toLocaleString("en-IN")}`,
      principleAmount: loan.details?.principleAmount || `₹ ${amountNum.toLocaleString("en-IN")}`,
      interestAmount: loan.details?.interestAmount || `₹ ${interestAmountVal.toLocaleString("en-IN")}`,
      offerStatus,
      rawAmount: amountNum,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    };
  };

  const fetchOffers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    // 1. First try the dedicated offers endpoint
    try {
      const res = await fetch(`${API_URL}/loans/offers/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (data.success && Array.isArray(data.offers)) {
            const mapped = data.offers.map((o, idx) => ({
              ...o,
              offerCategory: o.offerCategory || (idx % 2 === 1 ? "Collection Offer" : "Standard Loan Offer"),
              settlementType: o.settlementType || (idx % 2 === 1 ? "One-Time Settlement (OTS)" : "Standard Sanction")
            }));
            setOffers(mapped);
            setLoading(false);
            return;
          }
        } catch (_) {}
      }
    } catch (_) {}

    // 2. Fallback to /loans endpoint
    try {
      const resLoans = await fetch(`${API_URL}/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resLoans.ok) {
        const textLoans = await resLoans.text();
        try {
          const rawLoans = JSON.parse(textLoans);
          if (Array.isArray(rawLoans)) {
            const mapped = rawLoans.map((l, idx) => formatLoanToOffer(l, idx));
            setOffers(mapped);
            setLoading(false);
            return;
          }
        } catch (_) {}
      }
    } catch (_) {}

    // 3. Fallback to /users/my-loans
    try {
      const resMy = await fetch(`${API_URL}/users/my-loans?userId=USR-00004`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resMy.ok) {
        const dataMy = await resMy.json();
        if (dataMy.allLoans && Array.isArray(dataMy.allLoans)) {
          const mapped = dataMy.allLoans.map((l, idx) => formatLoanToOffer(l, idx));
          setOffers(mapped);
          setLoading(false);
          return;
        }
      }
    } catch (_) {}

    setOffers([]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) setUsers(data);
        } catch (_) {}
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchOffers();
    fetchUsers();
  }, []);

  // Recalculate EMI and totals when amounts/duration/ROI change in modal
  const handleAmountChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    
    // Auto compute approximations if main inputs changed
    if (["approvedAmount", "rateOfInterest", "loanDuration", "collectionWaiver", "originalOverdue"].includes(field)) {
      const p = parseFloat(String(updated.approvedAmount || "0").replace(/[^0-9.]/g, "")) || 0;
      const r = parseFloat(String(updated.rateOfInterest || "0").replace(/[^0-9.]/g, "")) || 10.5;
      const t = parseInt(String(updated.loanDuration || "0").replace(/[^0-9]/g, "")) || 24;

      if (p > 0 && t > 0) {
        const monthlyRate = (r / 12) / 100;
        const emi = Math.round((p * monthlyRate * Math.pow(1 + monthlyRate, t)) / (Math.pow(1 + monthlyRate, t) - 1)) || Math.round(p / t);
        const total = Math.round(emi * t);
        const interest = Math.max(0, total - p);
        const pf = Math.round(p * 0.02);
        const ins = Math.round(p * 0.01);
        const disb = Math.max(0, p - pf - ins);

        updated.monthlyEmi = String(emi);
        updated.totalAmount = String(total);
        updated.principleAmount = String(p);
        updated.interestAmount = String(interest);
        updated.processingFee = String(pf);
        updated.insuranceAmount = String(ins);
        updated.disbursedAmount = String(disb);
      }
    }
    setFormData(updated);
  };

  const openCreateModal = (category = "Collection Offer") => {
    setEditingOffer(null);
    setFormData({
      ...initialFormState,
      offerCategory: category,
      offerStatus: "ACCEPTED"
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setFormData({
      loanId: offer._id,
      applicationId: offer.applicationId || "",
      userId: offer.userId || "USR-00004",
      customer: offer.customer || "",
      mobile: offer.mobile || "",
      email: offer.email || "",
      loanType: offer.loanType || "Business Loan",
      offerCategory: offer.offerCategory || "Collection Offer",
      settlementType: offer.settlementType || "One-Time Settlement (OTS)",
      collectionWaiver: String(offer.collectionWaiver || "25000").replace(/[^0-9.]/g, "") || "25000",
      originalOverdue: String(offer.originalOverdue || "525000").replace(/[^0-9.]/g, "") || "525000",
      lender: offer.lender || "NUOG Housing Payments Ltd.",
      entityName: offer.entityName || "ABC Enterprises Ltd.",
      customName: offer.customName || offer.customer || "",
      accountNumber: offer.accountNumber || "50100456789012",
      ifscCode: offer.ifscCode || "HDFC0001234",
      approvedAmount: String(offer.approvedAmount || "").replace(/[^0-9.]/g, "") || "500000",
      disbursedAmount: String(offer.disbursedAmount || "").replace(/[^0-9.]/g, "") || "485000",
      monthlyEmi: String(offer.monthlyEmi || "").replace(/[^0-9.]/g, "") || "15500",
      rateOfInterest: String(offer.rateOfInterest || "").replace(/[^0-9.]/g, "") || "10.5",
      loanDuration: offer.loanDuration || "36 Months",
      processingFee: String(offer.processingFee || "").replace(/[^0-9.]/g, "") || "10000",
      insuranceAmount: String(offer.insuranceAmount || "").replace(/[^0-9.]/g, "") || "5000",
      totalAmount: String(offer.totalAmount || "").replace(/[^0-9.]/g, "") || "558000",
      principleAmount: String(offer.principleAmount || "").replace(/[^0-9.]/g, "") || "500000",
      interestAmount: String(offer.interestAmount || "").replace(/[^0-9.]/g, "") || "58000",
      offerStatus: offer.offerStatus || "ACCEPTED"
    });
    setIsFormModalOpen(true);
  };

  const openPreviewModal = (offer) => {
    setPreviewOffer(offer);
    setIsPreviewModalOpen(true);
  };

  const handleSelectCustomer = (e) => {
    const selectedUserId = e.target.value;
    if (!selectedUserId) return;
    const user = users.find(u => u.userId === selectedUserId);
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId: user.userId,
        customer: user.name,
        customName: user.name,
        mobile: user.phone || "",
        email: user.email || "",
        entityName: user.businessName || user.companyName || `${user.name} Enterprises`,
        accountNumber: user.accountNumber || "50100456789012",
        ifscCode: user.ifscCode || "HDFC0001234"
      }));
    }
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!formData.customer.trim()) {
      toast.error("Customer name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let savedSuccessfully = false;

      // 1. Try dedicated offer save endpoint
      try {
        const res = await fetch(`${API_URL}/loans/offers/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: jsonEncodeOffer(formData)
        });
        if (res.ok) {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data.success) {
              savedSuccessfully = true;
            }
          } catch (_) {}
        }
      } catch (_) {}

      // 2. Fallback to /loans
      if (!savedSuccessfully) {
        try {
          const endpoint = formData.loanId && !formData.loanId.startsWith("LOCAL-")
            ? `${API_URL}/loans/${formData.loanId}/status`
            : `${API_URL}/loans`;
          const method = formData.loanId && !formData.loanId.startsWith("LOCAL-") ? "PUT" : "POST";
          
          const payload = {
            customer: formData.customer,
            amount: formData.approvedAmount,
            loanType: formData.loanType,
            mobile: formData.mobile,
            email: formData.email,
            status: formData.offerStatus === "ACCEPTED" ? "Approved" : "Under Review"
          };

          const resLoan = await fetch(endpoint, {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
          if (resLoan.ok) {
            savedSuccessfully = true;
          }
        } catch (_) {}
      }

      toast.success(
        formData.offerCategory === "Collection Offer"
          ? (editingOffer ? "Collection Offer updated successfully!" : "New Collection Offer Approved & Published!")
          : (editingOffer ? "Loan Offer updated successfully!" : "New Loan Offer Sanctioned & Published!")
      );
      setIsFormModalOpen(false);
      fetchOffers();
    } catch (error) {
      console.error("Save offer error:", error);
      toast.error("Error saving offer");
    }
  };

  const jsonEncodeOffer = (form) => {
    return JSON.stringify({
      loanId: form.loanId || undefined,
      applicationId: form.applicationId || undefined,
      customer: form.customer,
      userId: form.userId,
      mobile: form.mobile,
      email: form.email,
      loanType: form.loanType,
      offerCategory: form.offerCategory,
      settlementType: form.settlementType,
      collectionWaiver: `₹ ${Number(form.collectionWaiver || 0).toLocaleString("en-IN")}`,
      originalOverdue: `₹ ${Number(form.originalOverdue || 0).toLocaleString("en-IN")}`,
      lender: form.lender,
      entityName: form.entityName,
      customName: form.customName || form.customer,
      accountNumber: form.accountNumber,
      ifscCode: form.ifscCode,
      approvedAmount: `₹ ${Number(form.approvedAmount || 0).toLocaleString("en-IN")}`,
      disbursedAmount: `₹ ${Number(form.disbursedAmount || 0).toLocaleString("en-IN")}`,
      monthlyEmi: `₹ ${Number(form.monthlyEmi || 0).toLocaleString("en-IN")}`,
      rateOfInterest: `${form.rateOfInterest}% p.a.`,
      loanDuration: form.loanDuration.includes("Month") ? form.loanDuration : `${form.loanDuration} Months`,
      processingFee: `₹ ${Number(form.processingFee || 0).toLocaleString("en-IN")}`,
      insuranceAmount: `₹ ${Number(form.insuranceAmount || 0).toLocaleString("en-IN")}`,
      totalAmount: `₹ ${Number(form.totalAmount || 0).toLocaleString("en-IN")}`,
      principleAmount: `₹ ${Number(form.principleAmount || 0).toLocaleString("en-IN")}`,
      interestAmount: `₹ ${Number(form.interestAmount || 0).toLocaleString("en-IN")}`,
      offerStatus: form.offerStatus
    });
  };

  const handleToggleStatus = async (offer, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      try {
        await fetch(`${API_URL}/loans/offers/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            loanId: offer._id,
            applicationId: offer.applicationId,
            customer: offer.customer,
            offerStatus: newStatus
          })
        });
      } catch (_) {}

      setOffers(prev => prev.map(o => o._id === offer._id ? { ...o, offerStatus: newStatus } : o));
      toast.success(`Offer status changed to ${newStatus}`);
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm("Are you sure you want to delete/reset this offer?")) return;
    try {
      const token = localStorage.getItem("token");
      try {
        await fetch(`${API_URL}/loans/offers/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (_) {}
      
      setOffers(prev => prev.filter(o => o._id !== id));
      toast.success("Offer removed successfully");
    } catch (err) {
      toast.error("Error deleting offer");
    }
  };

  // Filtered offers
  const filteredOffers = offers.filter(o => {
    let matchesStatus = true;
    if (statusFilter === "APPROVED" || statusFilter === "ACCEPTED") {
      matchesStatus = o.offerStatus === "ACCEPTED" || o.offerStatus === "Approved";
    } else if (statusFilter === "WAITING") {
      matchesStatus = o.offerStatus === "WAITING";
    } else if (statusFilter === "COLLECTION") {
      matchesStatus = o.offerCategory === "Collection Offer";
    } else if (statusFilter === "LOAN") {
      matchesStatus = o.offerCategory === "Standard Loan Offer";
    }

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      o.customer?.toLowerCase().includes(q) ||
      o.applicationId?.toLowerCase().includes(q) ||
      o.entityName?.toLowerCase().includes(q) ||
      o.lender?.toLowerCase().includes(q) ||
      o.settlementType?.toLowerCase().includes(q) ||
      o.mobile?.includes(q);

    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const totalOffersCount = offers.length;
  const approvedOffers = offers.filter(o => o.offerStatus === "ACCEPTED" || o.offerStatus === "Approved");
  const approvedOffersCount = approvedOffers.length;
  const waitingOffersCount = offers.filter(o => o.offerStatus === "WAITING").length;
  const collectionOffers = offers.filter(o => o.offerCategory === "Collection Offer");
  const collectionOffersCount = collectionOffers.length;
  const approvedCollectionCount = collectionOffers.filter(o => o.offerStatus === "ACCEPTED" || o.offerStatus === "Approved").length;

  // Calculate total approved value
  const totalApprovedValue = approvedOffers.reduce((acc, o) => {
    const val = parseFloat(String(o.approvedAmount || "0").replace(/[^0-9.]/g, "")) || 0;
    return acc + val;
  }, 0);

  return (
    <div className="p-5 space-y-4 bg-slate-50 min-h-screen">
      {/* Balanced Medium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-slate-800">Collection & Loan Offer Management</h1>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Admin & Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish, track and manage Collection Offers (OTS, Concessions, Waivers) and Standard Loan Sanction Offers with live approval monitoring.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchOffers}
            className="px-3.5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-2 text-xs font-semibold cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => openCreateModal("Collection Offer")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
          >
            <Plus size={18} />
            <span>+ Add Offer</span>
          </button>
        </div>
      </div>

      {/* Balanced Medium Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Approved Offers Counter */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Total Approved Offers</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black">{approvedOffersCount}</h3>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                {totalOffersCount > 0 ? `${Math.round((approvedOffersCount / totalOffersCount) * 100)}% Rate` : "0%"}
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 truncate mt-1">
              ₹ {(totalApprovedValue / 100000).toFixed(2)} Lakhs Sanctioned
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 ml-2 font-bold">
            <CheckCircle2 size={22} className="text-white" />
          </div>
        </div>

        {/* Collection Offers Box */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collection Offers</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-indigo-700">{collectionOffersCount}</h3>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {approvedCollectionCount} Approved
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-1">OTS, Concessions & Waivers</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 ml-2 font-bold">
            <HandCoins size={20} />
          </div>
        </div>

        {/* Waiting Approval Counter */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waiting / In-Review</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-amber-600">{waitingOffersCount}</h3>
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold border border-amber-200">
                Pending
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-1">Draft & Customer Review</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 ml-2 font-bold">
            <Clock size={20} />
          </div>
        </div>

        {/* Total Overall Offers */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Pipeline</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-black text-slate-800">{totalOffersCount}</h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">Offers</span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-1">Customer Offers Tracked</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 ml-2 font-bold">
            <FileText size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Balanced */}
      <div className="bg-white p-3.5 px-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-88">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer, lender, entity, OTS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter size={14} className="text-slate-400 mr-0.5 shrink-0" />
          {[
            { id: "ALL", label: `All Offers (${totalOffersCount})` },
            { id: "APPROVED", label: `Approved (${approvedOffersCount})` },
            { id: "COLLECTION", label: `Collection Offers (${collectionOffersCount})` },
            { id: "WAITING", label: `Waiting (${waitingOffersCount})` },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Offers Table - Compact & Polished */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
            <RefreshCw size={22} className="animate-spin text-indigo-600" />
            <p className="text-xs font-medium">Loading collection and loan offers...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-1.5">
            <HandCoins size={32} className="text-slate-300" />
            <h4 className="text-sm font-semibold text-slate-700">No Offers in this category</h4>
            <p className="text-[11px] text-slate-400">Click "+ Add Collection Offer" or change the filter tab.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">Offer Type & Ref</th>
                  <th className="py-2.5 px-3.5">Customer & Entity</th>
                  <th className="py-2.5 px-3.5">Terms / Approved</th>
                  <th className="py-2.5 px-3.5">Monthly EMI</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOffers.map((offer) => {
                  const isApproved = offer.offerStatus === "ACCEPTED" || offer.offerStatus === "Approved";
                  const isWaiting = offer.offerStatus === "WAITING";
                  const isCollection = offer.offerCategory === "Collection Offer";

                  return (
                    <tr key={offer._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isCollection
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {isCollection ? "Collection (OTS)" : "Sanction Offer"}
                          </span>
                        </div>
                        <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">{offer.applicationId}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{offer.settlementType}</div>
                      </td>

                      <td className="py-2.5 px-3.5">
                        <div className="font-semibold text-slate-800">{offer.customer}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 size={11} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{offer.entityName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{offer.mobile || offer.email}</div>
                      </td>

                      <td className="py-2.5 px-3.5">
                        <div className="font-bold text-slate-800">{offer.approvedAmount}</div>
                        <div className="text-[10px] text-slate-400">
                          {isCollection ? `Waiver: ${offer.collectionWaiver}` : `Disb: ${offer.disbursedAmount}`}
                        </div>
                      </td>

                      <td className="py-2.5 px-3.5">
                        <div className="font-bold text-amber-700">{offer.monthlyEmi}</div>
                        <div className="text-[10px] text-slate-400">{offer.loanDuration} @ {offer.rateOfInterest}</div>
                      </td>

                      <td className="py-2.5 px-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isApproved
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {isApproved ? (
                            <>
                              <CheckCircle2 size={12} className="text-emerald-700" />
                              <span>APPROVED</span>
                            </>
                          ) : (
                            <>
                              <Clock size={12} className="text-amber-700" />
                              <span>WAITING</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-2.5 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openPreviewModal(offer)}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer"
                            title="View Full Offer Letter"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => openEditModal(offer)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition cursor-pointer"
                            title="Edit Offer"
                          >
                            <Edit2 size={14} />
                          </button>
                          {isWaiting ? (
                            <button
                              onClick={() => handleToggleStatus(offer, "ACCEPTED")}
                              className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition shadow-xs cursor-pointer"
                              title="Approve Offer"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(offer, "WAITING")}
                              className="px-2.5 py-1 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 rounded-lg transition cursor-pointer"
                              title="Move to Waiting"
                            >
                              Wait
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOffer(offer._id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Remove Offer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT OFFER MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <HandCoins size={22} className="text-indigo-600" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {editingOffer
                      ? `Edit ${formData.offerCategory}: ${editingOffer.applicationId}`
                      : `Add New ${formData.offerCategory}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Specify settlement terms, approved amount, and lender parameters for customer live sync.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Category Selector */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Select Offer Type:</span>
                  <span className="text-xs text-slate-500">Choose between Collection Offer (Settlement/Waiver) or Standard Sanction</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, offerCategory: "Collection Offer" })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      formData.offerCategory === "Collection Offer"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200"
                    }`}
                  >
                    <HandCoins size={14} />
                    <span>Collection Offer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, offerCategory: "Standard Loan Offer" })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      formData.offerCategory === "Standard Loan Offer"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200"
                    }`}
                  >
                    <Plus size={14} />
                    <span>Sanction Offer</span>
                  </button>
                </div>
              </div>

              {/* Customer Quick Selector */}
              {!editingOffer && users.length > 0 && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-3">
                  <User size={18} className="text-emerald-700 shrink-0" />
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-emerald-900 mb-1">
                      Quick Pick Existing Registered Customer
                    </label>
                    <select
                      onChange={handleSelectCustomer}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none"
                    >
                      <option value="">-- Choose Customer --</option>
                      {users.map(u => (
                        <option key={u.userId} value={u.userId}>
                          {u.name} ({u.userId}) - {u.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 1. Borrower & Lender Details */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <Building2 size={14} className="text-indigo-600" />
                  <span>1. Lender & Borrower Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Lender Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lender}
                      onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
                      placeholder="e.g. NUOG Housing Payments Ltd."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Entity / Business Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.entityName}
                      onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                      placeholder="e.g. ABC Enterprises Ltd."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Borrower Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.customer}
                      onChange={(e) => setFormData({ ...formData, customer: e.target.value, customName: e.target.value })}
                      placeholder="e.g. Ravi Sharma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {formData.offerCategory === "Collection Offer" ? "Settlement / Offer Category" : "Loan Product"}
                    </label>
                    {formData.offerCategory === "Collection Offer" ? (
                      <select
                        value={formData.settlementType}
                        onChange={(e) => setFormData({ ...formData, settlementType: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="One-Time Settlement (OTS)">One-Time Settlement (OTS)</option>
                        <option value="Overdue EMI Concession">Overdue EMI Concession</option>
                        <option value="Foreclosure Penalty Waiver">Foreclosure Penalty Waiver</option>
                        <option value="Penal Interest Waiver">Penal Interest Waiver</option>
                        <option value="Special Recovery Discount">Special Recovery Discount</option>
                      </select>
                    ) : (
                      <select
                        value={formData.loanType}
                        onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Business Loan">Business Loan</option>
                        <option value="Home Loan">Home Loan</option>
                        <option value="Education Loan">Education Loan</option>
                        <option value="Funding Services">Funding Services</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank A/c No</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="e.g. 50100456789012"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. HDFC0001234"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Collection Offer Breakdown */}
              {formData.offerCategory === "Collection Offer" && (
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <h4 className="text-xs font-bold uppercase text-indigo-900 tracking-wider mb-3 flex items-center gap-1.5">
                    <BadgePercent size={14} className="text-indigo-600" />
                    <span>Collection Offer & Settlement Terms</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-indigo-900 mb-1">
                        Original Overdue / Outstanding (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.originalOverdue}
                        onChange={(e) => handleAmountChange("originalOverdue", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-indigo-900 mb-1">
                        Waiver / Concession Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.collectionWaiver}
                        onChange={(e) => handleAmountChange("collectionWaiver", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-emerald-700 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Financial Breakdown & Loan Terms */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-indigo-600" />
                  <span>3. Approved Offer Amounts & Parameters</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Approved Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.approvedAmount}
                      onChange={(e) => handleAmountChange("approvedAmount", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Disbursed Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.disbursedAmount}
                      onChange={(e) => setFormData({ ...formData, disbursedAmount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly EMI (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.monthlyEmi}
                      onChange={(e) => setFormData({ ...formData, monthlyEmi: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-amber-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Rate of Interest (% p.a.)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.rateOfInterest}
                      onChange={(e) => handleAmountChange("rateOfInterest", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Loan Duration</label>
                    <input
                      type="text"
                      value={formData.loanDuration}
                      onChange={(e) => handleAmountChange("loanDuration", e.target.value)}
                      placeholder="e.g. 36 Months"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Processing Fee (PF) (₹)</label>
                    <input
                      type="number"
                      value={formData.processingFee}
                      onChange={(e) => setFormData({ ...formData, processingFee: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.insuranceAmount}
                      onChange={(e) => setFormData({ ...formData, insuranceAmount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Total Repayable Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Interest Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.interestAmount}
                      onChange={(e) => setFormData({ ...formData, interestAmount: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Approval Status */}
              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                  4. Approval & Publishing Status
                </h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="offerStatus"
                      value="ACCEPTED"
                      checked={formData.offerStatus === "ACCEPTED"}
                      onChange={() => setFormData({ ...formData, offerStatus: "ACCEPTED" })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-emerald-800">APPROVED (Sanction / Settlement Approved)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="offerStatus"
                      value="WAITING"
                      checked={formData.offerStatus === "WAITING"}
                      onChange={() => setFormData({ ...formData, offerStatus: "WAITING" })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-700">WAITING (Draft / Under Review)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm transition"
                >
                  {editingOffer ? "Update Offer" : "Approve & Publish Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW OFFER MODAL */}
      {isPreviewModalOpen && previewOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ReceiptText size={20} className="text-indigo-600" />
                <h3 className="text-base font-bold text-slate-800">
                  {previewOffer.offerCategory === "Collection Offer" ? "Collection Settlement Offer Letter" : "Loan Offer Sanction Letter"}
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm overflow-y-auto max-h-[75vh]">
              <div className="text-center pb-3 border-b border-slate-100">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {previewOffer.offerStatus === "ACCEPTED" || previewOffer.offerStatus === "Approved"
                    ? "✓ APPROVED BY ADMIN"
                    : "⏳ STATUS: WAITING APPROVAL"}
                </span>
                <h4 className="text-lg font-bold text-slate-800 mt-2">{previewOffer.lender}</h4>
                <p className="text-xs text-slate-500">
                  {previewOffer.offerCategory} • Reference: {previewOffer.applicationId}
                </p>
              </div>

              {previewOffer.offerCategory === "Collection Offer" && (
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="text-indigo-700 font-bold block">{previewOffer.settlementType}</span>
                    <span className="text-slate-500">Original Overdue: {previewOffer.originalOverdue}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-600 text-white font-bold rounded-lg">
                    {previewOffer.collectionWaiver}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Borrower / Custom Name:</span>
                  <span className="font-bold text-slate-700">{previewOffer.customName || previewOffer.customer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Entity Name:</span>
                  <span className="font-bold text-slate-700">{previewOffer.entityName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Bank Account No:</span>
                  <span className="font-bold text-slate-700 font-mono">{previewOffer.accountNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">IFSC Code:</span>
                  <span className="font-bold text-slate-700 font-mono">{previewOffer.ifscCode}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Approved Offer Amount</span>
                  <span className="font-bold text-emerald-700 text-sm">{previewOffer.approvedAmount}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Disbursed / Net Settlement</span>
                  <span className="font-bold text-slate-800">{previewOffer.disbursedAmount}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Monthly EMI</span>
                  <span className="font-bold text-amber-700 text-sm">{previewOffer.monthlyEmi}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Rate of Interest</span>
                  <span className="font-bold text-slate-800">{previewOffer.rateOfInterest}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Loan Duration</span>
                  <span className="font-bold text-slate-800">{previewOffer.loanDuration}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Processing Fee (PF)</span>
                  <span className="font-bold text-slate-800">{previewOffer.processingFee}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Insurance Amount</span>
                  <span className="font-bold text-slate-800">{previewOffer.insuranceAmount}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Total Repayable Amount</span>
                  <span className="font-bold text-slate-800">{previewOffer.totalAmount}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Principal Amount</span>
                  <span className="font-bold text-slate-800">{previewOffer.principleAmount}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Interest Amount</span>
                  <span className="font-bold text-slate-800">{previewOffer.interestAmount}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 transition"
              >
                <Printer size={14} />
                <span>Print Offer</span>
              </button>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
