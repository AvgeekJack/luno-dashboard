import { CommandCard } from "./CommandCard";

interface Command {
  name: string;
  description: string;
  enabled?: boolean;
}

interface CommandGridProps {
  commands: Command[];
  onCommandToggle?: (commandName: string, enabled: boolean) => void;
  onCommandSettings?: (commandName: string) => void;
  onCommandHelp?: (commandName: string, description: string) => void;
}

export function CommandGrid({ commands, onCommandToggle, onCommandSettings, onCommandHelp }: CommandGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {commands.map((command, index) => (
        <CommandCard
          key={index}
          name={command.name}
          description={command.description}
          enabled={command.enabled}
          onToggle={onCommandToggle ? (enabled) => onCommandToggle(command.name, enabled) : undefined}
          onSettings={onCommandSettings ? () => onCommandSettings(command.name) : undefined}
          onHelp={onCommandHelp ? () => onCommandHelp(command.name, command.description) : undefined}
        />
      ))}
    </div>
  );
}
