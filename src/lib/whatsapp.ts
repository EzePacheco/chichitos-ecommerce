const MIN_WHATSAPP_DIGITS = 8;

export function sanitizeWhatsAppPhoneNumber(phoneNumber?: string) {
  const digitsOnly = phoneNumber?.replace(/\D/g, "");

  if (!digitsOnly || digitsOnly.length < MIN_WHATSAPP_DIGITS) {
    return undefined;
  }

  return digitsOnly;
}

export function buildWhatsAppHref(phoneNumber: string | undefined, message: string) {
  const sanitizedPhoneNumber = sanitizeWhatsAppPhoneNumber(phoneNumber);

  if (!sanitizedPhoneNumber) {
    return undefined;
  }

  return `https://wa.me/${sanitizedPhoneNumber}?text=${encodeURIComponent(message)}`;
}
