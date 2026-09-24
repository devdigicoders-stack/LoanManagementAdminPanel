import React from 'react';

// Pure in-bundle vector logos for Indian Banks & NBFCs (Guaranteed 100% render with zero network dependencies)
export function BankBrandLogo({ code, name, className = "w-full h-full" }) {
  const c = (code || name || '').toUpperCase();

  // 1. HDFC Bank
  if (c.includes('HDFC')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#004C8F" />
        <rect x="22" y="22" width="56" height="56" fill="#ED1C24" rx="6" />
        <rect x="36" y="36" width="28" height="28" fill="#FFFFFF" rx="3" />
        <rect x="44" y="14" width="12" height="72" fill="#FFFFFF" />
        <rect x="14" y="44" width="72" height="12" fill="#FFFFFF" />
        <rect x="46" y="22" width="8" height="56" fill="#004C8F" />
        <rect x="22" y="46" width="56" height="8" fill="#004C8F" />
      </svg>
    );
  }

  // 2. ICICI Bank
  if (c.includes('ICICI')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#F37021" />
        <circle cx="50" cy="50" r="32" fill="#8B1D18" />
        <circle cx="50" cy="50" r="20" fill="#F37021" />
        <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
        <path d="M50 18 L64 50 L50 82" stroke="#FFFFFF" strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // 3. Kotak Mahindra Bank
  if (c.includes('KOTAK') || c.includes('KKBK')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#ED1C24" />
        <path d="M28 28 L28 72 M28 50 L64 28 M38 44 L68 72" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="74" cy="50" r="6" fill="#003366" />
      </svg>
    );
  }

  // 4. State Bank of India (SBI)
  if (c.includes('SBI') || c.includes('STATE BANK')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#280071" />
        <circle cx="50" cy="44" r="28" fill="#00A5DF" />
        <circle cx="50" cy="44" r="10" fill="#280071" />
        <rect x="45" y="44" width="10" height="34" fill="#280071" />
      </svg>
    );
  }

  // 5. Axis Bank
  if (c.includes('AXIS') || c.includes('UTIB')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#97144D" />
        <path d="M50 20 L24 74 L42 74 L50 56 L58 74 L76 74 Z" fill="#FFFFFF" />
        <path d="M50 20 L58 74 L42 74 Z" fill="#ED1C24" />
      </svg>
    );
  }

  // 6. IDFC First Bank
  if (c.includes('IDFC') || c.includes('IDFB')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#9B1B1E" />
        <rect x="22" y="24" width="24" height="24" fill="#FFFFFF" rx="4" />
        <rect x="54" y="24" width="24" height="24" fill="#F8B133" rx="4" />
        <rect x="22" y="52" width="24" height="24" fill="#F8B133" rx="4" />
        <rect x="54" y="52" width="24" height="24" fill="#FFFFFF" rx="4" />
      </svg>
    );
  }

  // 7. YES Bank
  if (c.includes('YES')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#004481" />
        <path d="M22 28 L40 60 L40 76 M78 28 L60 60 L40 60" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M48 24 L76 52 L62 76" stroke="#ED1C24" strokeWidth="8" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 8. Bajaj Finance / Finserv
  if (c.includes('BAJAJ')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#003366" />
        <path d="M26 30 C45 30 52 42 52 50 C52 58 45 70 26 70 Z" fill="none" stroke="#0080FF" strokeWidth="10" strokeLinejoin="round" />
        <path d="M50 30 C68 30 74 42 74 50 C74 58 68 70 50 70 Z" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinejoin="round" />
      </svg>
    );
  }

  // 9. TATA Capital
  if (c.includes('TATA')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#005B94" />
        <path d="M20 32 L80 32 M50 32 L50 74" stroke="#00A3E0" strokeWidth="12" strokeLinecap="round" />
        <path d="M30 46 L70 46 M50 46 L50 74" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  // 10. Poonawalla Fincorp
  if (c.includes('POONA') || c.includes('POONAWALLA')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#7C3AED" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#FBBF24" strokeWidth="8" />
        <path d="M38 34 L38 66 M38 34 C54 34 62 42 62 50 C62 58 54 66 38 66" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  }

  // 11. Piramal Finance
  if (c.includes('PIRAMAL')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#0891B2" />
        <path d="M30 25 L70 25 L50 50 Z" fill="#F97316" />
        <path d="M30 75 L70 75 L50 50 Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 12. Cholamandalam Finance
  if (c.includes('CHOLA')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#D97706" />
        <path d="M68 34 C60 26 42 26 34 36 C24 48 24 64 36 72 C46 78 62 76 68 64" fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
        <circle cx="50" cy="50" r="8" fill="#DC2626" />
      </svg>
    );
  }

  // 13. Godrej Capital
  if (c.includes('GODREJ')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#059669" />
        <path d="M30 35 C42 22 68 22 74 38 M26 50 C26 70 50 75 66 70 L66 52 L48 52" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 14. PNB / PNB Housing
  if (c.includes('PNB')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#A20032" />
        <circle cx="50" cy="50" r="28" fill="#F8B133" />
        <path d="M40 32 L40 68 M40 32 C54 32 60 38 60 46 C60 54 54 60 40 60" fill="none" stroke="#A20032" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }

  // 15. Bank of Baroda
  if (c.includes('BARODA') || c.includes('BOB')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#F26522" />
        <circle cx="50" cy="50" r="28" fill="#FFFFFF" />
        <path d="M50 26 L50 74 M32 38 L68 62 M32 62 L68 38" stroke="#F26522" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }

  // 16. Aditya Birla Finance / Housing
  if (c.includes('ADITYA') || c.includes('BIRLA') || c.includes('ABFL')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#B91C1C" />
        <polygon points="50,22 76,46 50,70 24,46" fill="#F59E0B" />
        <polygon points="50,32 66,46 50,60 34,46" fill="#FFFFFF" />
      </svg>
    );
  }

  // 17. LIC Housing Finance
  if (c.includes('LIC')) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <rect width="100" height="100" rx="20" fill="#004C8F" />
        <circle cx="50" cy="40" r="16" fill="#FBBF24" />
        <path d="M26 74 C26 56 40 52 50 52 C60 52 74 56 74 74 Z" fill="#FBBF24" />
        <path d="M50 20 L50 80" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // Default Vector Emblem
  return (
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white font-black text-xs shadow-xs">
      {(code || name || 'BANK').substring(0, 3).toUpperCase()}
    </div>
  );
}
