export function getBootstrapAdminEmails(rawEmails = process.env.ADMIN_BOOTSTRAP_EMAILS) {
  if (!rawEmails) {
    return [];
  }

  return rawEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isBootstrapAdminEmail(email: string, rawEmails = process.env.ADMIN_BOOTSTRAP_EMAILS) {
  return getBootstrapAdminEmails(rawEmails).includes(email.trim().toLowerCase());
}
