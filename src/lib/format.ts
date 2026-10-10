const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export const toFa = (v: string | number) => String(v).replace(/\d/g, (d) => FA[+d]!);

export const formatToman = (v?: number | null) =>
  v == null ? "—" : toFa(Math.round(v).toLocaleString("en-US"));

export const discountPercent = (p: number, c?: number | null) =>
  !c || c <= p ? null : Math.round(((c - p) / c) * 100);

export const formatFaDate = (v: string | Date) =>
  new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(typeof v === "string" ? new Date(v) : v);
