export function tranferStr(str?: string) {
  if (!str) return "";
  return str.replace(/\n/g, "<br>");
}
