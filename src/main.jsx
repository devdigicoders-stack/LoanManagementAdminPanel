import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import toast from 'react-hot-toast'

// Global interceptor for Master Admins in Role-Based Portals
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [resource, config] = args;
  const method = (config?.method || 'GET').toUpperCase();
  
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const userRole = (localStorage.getItem('userRole') || '').toLowerCase();
    const isMasterAdmin = ['super admin', 'superadmin', 'admin', 'administrator'].includes(userRole);
    
    if (isMasterAdmin) {
      const path = window.location.pathname;
      // Define restricted portal roots where super admin is view-only
      const restrictedPortals = ['/telecaller', '/agent', '/ops', '/accountant'];
      
      const isInRestrictedPortal = restrictedPortals.some(portal => 
        path === portal || path.startsWith(`${portal}/`)
      );

      if (isInRestrictedPortal) {
        toast.error("Super Admin is in View-Only mode for employee portals.", {
          id: 'admin-view-only',
          duration: 4000
        });
        
        // Return a mocked 403 Forbidden response to halt the operation
        return Promise.resolve(new Response(JSON.stringify({ message: "Action blocked. View only mode." }), {
          status: 403,
          statusText: 'Forbidden',
          headers: { 'Content-Type': 'application/json' }
        }));
      }
    }
  }
  
  return originalFetch(...args);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
