// Class strings reused in many places, so every button and card looks identical.
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

export const primaryButton = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-forest px-4 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50 ${focus}`;

export const secondaryButton = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-line bg-paper px-4 py-2.5 text-sm font-medium text-forest transition-colors hover:border-sage hover:bg-sage-light disabled:cursor-not-allowed disabled:opacity-50 ${focus}`;

export const iconButton = `inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-paper text-ink transition-colors hover:bg-sage-light ${focus}`;

export const inputStyle = `h-10 rounded-md border border-line bg-paper px-3 text-sm text-ink placeholder:text-muted ${focus}`;

export const card = "rounded-md border border-line bg-paper";

export const smallLabel =
  "text-xs font-semibold uppercase tracking-[0.14em] text-muted";
