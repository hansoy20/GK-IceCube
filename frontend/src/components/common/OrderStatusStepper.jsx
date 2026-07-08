const STEPS = [
  { key: "PENDING", label: "Ordered" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PACKED", label: "Packed" },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function OrderStatusStepper({ status }) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-lg bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="flex items-center">
      {STEPS.map((step, index) => {
        const done = index <= currentIndex;
        return (
          <li key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full font-mono text-xs ${
                  done ? "bg-glacier text-white" : "bg-ink/10 text-ink/40"
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-xs ${done ? "text-arctic" : "text-ink/40"} whitespace-nowrap`}>
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 ${index < currentIndex ? "bg-glacier" : "bg-ink/10"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
