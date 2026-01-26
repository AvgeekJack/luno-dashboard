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
    
    checkMaintenance();
  }, []);

  const shouldShowMaintenance = maintenanceMode && !bypassMaintenance;

  const handleBypass = () => {
    setBypassMaintenance(true);
  };

  return { maintenanceMode, bypassMaintenance, shouldShowMaintenance, loading, handleBypass };
}
