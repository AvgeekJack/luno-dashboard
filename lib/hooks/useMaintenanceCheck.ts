import { useState, useEffect } from 'react';

export function useMaintenanceCheck() {
  const [maintenanceMode, setMaintenanceMode] = useState<boolean | null>(null);
  const [bypassMaintenance, setBypassMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await fetch('/api/maintenance-status');
        if (res.ok) {
          const data = await res.json();
          setMaintenanceMode(data.maintenanceMode);
        }
      } catch (error) {
        console.error('Failed to check maintenance status:', error);
        setMaintenanceMode(false);
      } finally {
        setLoading(false);
      }
    };

    // Check if developer has bypassed maintenance
    const bypass = sessionStorage.getItem('maintenanceBypass') === 'true';
    setBypassMaintenance(bypass);
    
    checkMaintenance();
  }, []);

  const shouldShowMaintenance = maintenanceMode && !bypassMaintenance;

  return { maintenanceMode, bypassMaintenance, shouldShowMaintenance, loading };
}
