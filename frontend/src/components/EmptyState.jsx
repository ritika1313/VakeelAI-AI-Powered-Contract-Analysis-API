import Icon from "./Icons";

// Props: icon (name from Icons.jsx), title, text, and an optional action (a button).
export default function EmptyState({ icon = "file", title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-sage px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-sage-light text-forest">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="mt-4 font-serif text-xl">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
