export function normalizeAdminEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getBootstrapAdminEmails(
  rawEmails = process.env.ADMIN_BOOTSTRAP_EMAILS,
) {
  if (!rawEmails) {
    return [];
  }

  return Array.from(
    new Set(rawEmails.split(",").map(normalizeAdminEmail).filter(Boolean)),
  );
}

export function isBootstrapAdminEmail(
  email: string,
  rawEmails = process.env.ADMIN_BOOTSTRAP_EMAILS,
) {
  return getBootstrapAdminEmails(rawEmails).includes(
    normalizeAdminEmail(email),
  );
}
