import { CommandCard } from "./CommandCard";

interface Command {
  name: string;
  description: string;
  enabled?: boolean;
}

interface CommandGridProps {
  commands: Command[];
}

export function CommandGrid({ commands }: CommandGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {commands.map((command, index) => (
        <CommandCard
          key={index}
          name={command.name}
          description={command.description}
          enabled={command.enabled}
        />
      ))}
    </div>
  );
}
