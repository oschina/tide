export function isWindows() {
  if (navigator.userAgent.indexOf('Windows') > -1) {
    return true;
  }
  return false;
}
