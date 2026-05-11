export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function absoluteUrl(path = "") {
  const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${appUrl}${path}`;
}

export function truncate(value: string, length = 120) {
  return value.length > length ? `${value.slice(0, length).trim()}...` : value;
}
