import Icon from "./Icons";

// A message bar for success or error feedback.
// Props: type ("success" | "error"), children (the message), onDismiss (optional function).
export default function Notice({ type = "success", children, onDismiss }) {
  const isSuccess = type === "success";
  const style = isSuccess
    ? "border-risk-low bg-risk-low-bg text-risk-low"
    : "border-risk-critical bg-risk-critical-bg text-risk-critical";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-md border-l-4 px-4 py-3 text-sm ${style}`}
    >
      <Icon name={isSuccess ? "check" : "alert"} className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1 break-words">{children}</div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss message" className="shrink-0">
          <Icon name="x" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
