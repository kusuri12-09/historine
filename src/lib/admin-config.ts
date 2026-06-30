const ADMIN_API_DISABLED_VALUES = new Set(["0", "false", "no", "off", "disabled"]);

export function isAdminApiEnabled() {
  const value = process.env.ADMIN_API_ENABLED;

  if (!value) {
    return true;
  }

  return !ADMIN_API_DISABLED_VALUES.has(value.trim().toLowerCase());
}
