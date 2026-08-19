import React from 'react';
import { HardHat } from 'lucide-react';

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] w-full text-center">
      <div className="bg-[#f4fdf5] p-6 rounded-full mb-6">
        <HardHat size={64} className="text-[#489b0d]" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Page Under Construction</h2>
      <p className="text-slate-500 max-w-md text-base">
        We're currently working on this feature. It will be available in a future update.
      </p>
    </div>
  );
}
