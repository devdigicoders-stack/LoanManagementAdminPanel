import React from "react";
import Highcharts from 'highcharts';
import HighchartsReactOriginal from 'highcharts-react-official';

const HighchartsReact = HighchartsReactOriginal.default || HighchartsReactOriginal;
import { 
  BarChart3, TrendingUp, DollarSign, Download, Filter, 
  Calendar, FileText, ArrowUpRight, ArrowDownRight, Target, X
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ReportsAnalytics() {
  
  // Highcharts configurations
  const revenueChartOptions = {
    chart: { type: 'areaspline', backgroundColor: 'transparent', height: 320, style: { fontFamily: 'inherit' } },
    title: { text: '' },
    xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], lineColor: '#f1f5f9', tickColor: 'transparent', labels: { style: { color: '#64748b', fontWeight: 'bold' } } },
    yAxis: { title: { text: '' }, gridLineColor: '#f1f5f9', labels: { style: { color: '#64748b' }, formatter: function() { return '₹' + this.value + 'L'; } } },
    plotOptions: { areaspline: { fillOpacity: 0.1, marker: { enabled: true, radius: 4, symbol: 'circle' } } },
    series: [
      { name: 'Disbursals', data: [120, 180, 250, 200, 310, 420], color: '#489b0d', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, '#489b0d'], [1, 'rgba(72, 155, 13, 0)']] } },
      { name: 'Revenue', data: [30, 45, 60, 55, 80, 110], color: '#3b82f6', fillColor: { linearGradient: [0, 0, 0, 300], stops: [[0, '#3b82f6'], [1, 'rgba(59, 130, 246, 0)']] } }
    ],
    credits: { enabled: false },
    legend: { itemStyle: { color: '#475569', fontWeight: 'bold' } },
    tooltip: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: 8, shadow: true, style: { fontWeight: 'bold' } }
  };

  const portfolioChartOptions = {
    chart: { type: 'pie', backgroundColor: 'transparent', height: 280, style: { fontFamily: 'inherit' } },
    title: { text: '' },
    plotOptions: { pie: { innerSize: '60%', borderWidth: 2, borderColor: '#ffffff', dataLabels: { enabled: false }, showInLegend: true } },
    series: [{
      name: 'Total Loans',
      colorByPoint: true,
      data: [
        { name: 'Personal', y: 45, color: '#3b82f6' },
        { name: 'Home', y: 30, color: '#489b0d' },
        { name: 'Business', y: 15, color: '#f59e0b' },
        { name: 'Education', y: 10, color: '#8b5cf6' }
      ]
    }],
    credits: { enabled: false },
    legend: { align: 'right', verticalAlign: 'middle', layout: 'vertical', itemStyle: { color: '#475569', fontWeight: 'bold' } }
  };

  const statusChartOptions = {
    chart: { type: 'column', backgroundColor: 'transparent', height: 280, style: { fontFamily: 'inherit' } },
    title: { text: '' },
    xAxis: { categories: ['Received', 'Processing', 'Approved', 'Rejected'], lineColor: '#f1f5f9', tickColor: 'transparent', labels: { style: { color: '#64748b', fontWeight: 'bold' } } },
    yAxis: { title: { text: '' }, gridLineColor: '#f1f5f9', labels: { style: { color: '#64748b' } } },
    plotOptions: { column: { borderRadius: 4, pointPadding: 0.1, colorByPoint: true } },
    colors: ['#64748b', '#f59e0b', '#489b0d', '#ef4444'],
    series: [{ name: 'Applications', data: [1200, 450, 680, 150], showInLegend: false }],
    credits: { enabled: false }
  };

  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const handleDownload = (format) => {
    Swal.fire({
      title: 'Generating Report...',
      text: `Preparing your ${format} file. Please wait.`,
      icon: 'info',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => {
      toast.success(`Report downloaded successfully as ${format}!`);
    });
  };

  const handleApplyFilter = (e) => {
    e.preventDefault();
    setIsFilterModalOpen(false);
    toast.success("Filters applied successfully. Charts updated.");
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Reports & Analytics</h1>
          <p className="text-[12px] font-medium text-slate-500">Monitor business performance and comprehensive metrics</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 px-3 flex items-center justify-between rounded-lg border border-slate-200 text-[13px] font-bold text-slate-600 bg-white min-w-[160px] shadow-sm cursor-pointer hover:bg-slate-50">
            <span className="truncate">H1 2025 (Jan-Jun)</span>
            <Calendar size={14} className="text-[#489b0d] ml-2" />
          </div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter size={14} /> Filter Data
          </button>
          <button 
            onClick={() => handleDownload('PDF')}
            className="h-10 px-5 flex items-center justify-center gap-2 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center relative z-10">
              <DollarSign size={20} />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded text-[#489b0d]">
              <ArrowUpRight size={12}/> +12.5%
            </span>
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-800">₹14.28 Cr</h3>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#489b0d]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#489b0d]/10 text-[#489b0d] flex items-center justify-center relative z-10">
              <BarChart3 size={20} />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded text-[#489b0d]">
              <ArrowUpRight size={12}/> +8.2%
            </span>
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Active Loans</p>
            <h3 className="text-2xl font-black text-slate-800">4,825</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center relative z-10">
              <Target size={20} />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded text-[#489b0d]">
              <ArrowUpRight size={12}/> +4.1%
            </span>
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Recovery Rate</p>
            <h3 className="text-2xl font-black text-slate-800">96.8%</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center relative z-10">
              <TrendingUp size={20} />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
              <ArrowDownRight size={12}/> -1.2%
            </span>
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">NPA Ratio</p>
            <h3 className="text-2xl font-black text-slate-800">2.4%</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[15px] font-extrabold text-slate-800">Financial Overview</h3>
              <p className="text-[12px] font-medium text-slate-500">Revenue & Disbursal Trends</p>
            </div>
          </div>
          <HighchartsReact highcharts={Highcharts} options={revenueChartOptions} />
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-[15px] font-extrabold text-slate-800">Loan Portfolio</h3>
            <p className="text-[12px] font-medium text-slate-500">Distribution by category</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <HighchartsReact highcharts={Highcharts} options={portfolioChartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-[15px] font-extrabold text-slate-800">Application Status</h3>
            <p className="text-[12px] font-medium text-slate-500">Current pipeline breakdown</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <HighchartsReact highcharts={Highcharts} options={statusChartOptions} />
          </div>
        </div>

        {/* Recent Reports Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-[15px] font-extrabold text-slate-800">Generated Reports</h3>
              <p className="text-[12px] font-medium text-slate-500">Recently downloaded files</p>
            </div>
            <button className="text-[12px] font-bold text-[#489b0d] hover:text-[#3e850b] transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-3 px-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Report Name</th>
                  <th className="py-3 px-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Generated By</th>
                  <th className="py-3 px-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center"><FileText size={14}/></div>
                    <span className="text-[13px] font-bold text-slate-700">Monthly Performance - May</span>
                  </td>
                  <td className="py-3 px-5 text-[13px] font-semibold text-slate-600">System Admin</td>
                  <td className="py-3 px-5 text-[12px] font-semibold text-slate-500">Today, 10:30 AM</td>
                  <td className="py-3 px-5 text-right">
                    <button onClick={() => handleDownload('PDF')} className="text-[12px] font-bold text-blue-600 hover:underline">Download PDF</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#489b0d]/10 text-[#489b0d] flex items-center justify-center"><FileText size={14}/></div>
                    <span className="text-[13px] font-bold text-slate-700">NPA Analysis Q1 2025</span>
                  </td>
                  <td className="py-3 px-5 text-[13px] font-semibold text-slate-600">Risk Manager</td>
                  <td className="py-3 px-5 text-[12px] font-semibold text-slate-500">Yesterday, 04:15 PM</td>
                  <td className="py-3 px-5 text-right">
                    <button onClick={() => handleDownload('CSV')} className="text-[12px] font-bold text-[#489b0d] hover:underline">Download CSV</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center"><FileText size={14}/></div>
                    <span className="text-[13px] font-bold text-slate-700">Lead Conversion Matrix</span>
                  </td>
                  <td className="py-3 px-5 text-[13px] font-semibold text-slate-600">Sales Head</td>
                  <td className="py-3 px-5 text-[12px] font-semibold text-slate-500">16 May 2025</td>
                  <td className="py-3 px-5 text-right">
                    <button onClick={() => handleDownload('PDF')} className="text-[12px] font-bold text-blue-600 hover:underline">Download PDF</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                <Filter size={16} className="text-[#489b0d]" /> Filter Reports Data
              </h3>
              <button 
                onClick={() => setIsFilterModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-slate-200/50 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleApplyFilter} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Date Range</label>
                <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]">
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>H1 2025 (Jan-Jun)</option>
                  <option>This Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Loan Type</label>
                <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]">
                  <option>All Types</option>
                  <option>Personal Loans</option>
                  <option>Home Loans</option>
                  <option>Business Loans</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Application Status</label>
                <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]">
                  <option>All Statuses</option>
                  <option>Approved</option>
                  <option>Processing</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 h-10 rounded-lg border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 h-10 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
