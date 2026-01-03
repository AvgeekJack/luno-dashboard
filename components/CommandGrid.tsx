import { CommandCard } from "./CommandCard";

interface Command {
  name: string;
  description: string;
  enabled?: boolean;
}

interface CommandGridProps {
  commands: Command[];
  onCommandToggle?: (commandName: string, enabled: boolean) => void;
}

export function CommandGrid({ commands, onCommandToggle }: CommandGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {commands.map((command, index) => (
        <CommandCard
          key={index}
          name={command.name}
          description={command.description}
          enabled={command.enabled}
          onToggle={onCommandToggle ? (enabled) => onCommandToggle(command.name, enabled) : undefined}
        />
      ))}
    </div>
  );
}
