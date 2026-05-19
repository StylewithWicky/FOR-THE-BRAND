import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const TraceProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const recordTrace = async () => {
      const email = localStorage.getItem('yolo_email');
      const token = localStorage.getItem('yolo_token');

      if (email && token) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
          const pathSegments = location.pathname.split('/').filter(Boolean);
          const moduleName = pathSegments[pathSegments.length - 1] || "Dashboard";
          
          await axios.post(`${apiUrl}/trace/log`, {
            action: "VIEW_PAGE",
            module: moduleName.toUpperCase(),
            details: `Admin navigated to ${location.pathname}`
          }, {
            headers: { 
              Authorization: `Bearer ${token}` 
            }
          });
        } catch (err) {
          console.error("Trace Log Failed:", err);
        }
      }
    };

    recordTrace();
  }, [location.pathname]);

  return <>{children}</>;
};