import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface CommandCardProps {
  name: string;
  description: string;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  onSettings?: () => void;
  onHelp?: () => void;
}

export function CommandCard({ 
  name, 
  description, 
  enabled = true,
  onToggle,
  onSettings,
  onHelp 
}: CommandCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-bold text-sm sm:text-base truncate">{name}</h3>
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-1">{description}</p>
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={onToggle}
        />
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button 
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white flex-1 text-xs sm:text-sm py-1 sm:py-2"
          onClick={onSettings}
        >
          Settings
        </Button>
        <button 
          className="text-orange-600 hover:text-orange-700 text-xs sm:text-sm px-1.5 sm:px-2 py-1"
          onClick={onHelp}
        >
          Help
        </button>
      </div>
    </div>
  );
}