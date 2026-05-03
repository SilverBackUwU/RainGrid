import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";

type StatusPillProps = {
  status: string;
};

export function StatusPill({ status }: StatusPillProps) {
  const normalized = status.toLowerCase();
  const isPositive = normalized === "available" || normalized === "accepted";
  const isComplete = normalized === "fulfilled";
  const isNegative = normalized === "inactive" || normalized === "rejected";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
        isPositive
          ? "bg-emerald-50 text-emerald-700"
          : isComplete
            ? "bg-sky-50 text-sky-700"
            : isNegative
              ? "bg-zinc-100 text-zinc-600"
              : "bg-amber-50 text-amber-700"
      }`}
    >
      {isNegative ? (
        <XCircle className="h-3 w-3" aria-hidden="true" />
      ) : isPositive || isComplete ? (
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      ) : (
        <CircleDashed className="h-3 w-3" aria-hidden="true" />
      )}
      {status}
    </span>
  );
}
