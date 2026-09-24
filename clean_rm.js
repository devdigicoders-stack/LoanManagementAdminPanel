import fs from 'fs';
const path = 'd:/DigiCoders Projects/Loan_Management/frontend/src/pages/sales/RMDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/<Link[\s\S]*?to="\/sales\/team-tree"[\s\S]*?<\/Link>/, 
`<div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field Team (RO/RE)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{metrics.fieldTeamCount || 0}</p>
          <p className="text-[11px] font-semibold text-purple-600 mt-1">Active Field Officers</p>
        </div>`);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated RMDashboard.jsx');
