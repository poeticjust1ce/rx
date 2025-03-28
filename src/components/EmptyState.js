// components/ui/empty-state.js
import { cn } from "@/lib/utils";

export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed",
        className
      )}
    >
      <div className="mb-4 p-4 bg-muted/50 rounded-full">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
}
