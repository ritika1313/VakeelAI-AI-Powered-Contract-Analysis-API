// Props: title, text (a subtitle) and optional actions (buttons on the right).
export default function PageHeader({ title, text, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-4xl font-medium tracking-tight">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-muted">{text}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
