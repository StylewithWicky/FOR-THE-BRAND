import React, { createContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const TraceProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const email = localStorage.getItem('yolo_email');
  const token = localStorage.getItem('yolo_token');

  useEffect(() => {
    const recordTrace = async () => {
      if (email && token) {
        try {
          // Identify the module based on the URL path
          const pathSegments = location.pathname.split('/').filter(Boolean);
          const moduleName = pathSegments[0] || "Dashboard";
          
          await axios.post('http://localhost:8000/api/v1/trace/log', {
            action: "VIEW_PAGE",
            module: moduleName.toUpperCase(),
            details: `Admin navigated to ${location.pathname}`
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error("Trace Log Failed:", err);
        }
      }
    };

    recordTrace();
  }, [location.pathname, email, token]);

  return <>{children}</>;
};