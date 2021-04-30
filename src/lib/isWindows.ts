export function isWindows() {
  const platform = process.env.PLATFORM || process.platform;
  return /^win/.test(platform);
}
