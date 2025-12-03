/**
 * Input validation utilities
 */

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validates GSTIN format (15 characters, alphanumeric)
 */
export function isValidGSTIN(gstin: string): boolean {
    if (!gstin || typeof gstin !== 'string') return false;
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin.trim().toUpperCase());
}

/**
 * Validates PAN format (10 characters: 5 letters, 4 digits, 1 letter)
 */
export function isValidPAN(pan: string): boolean {
    if (!pan || typeof pan !== 'string') return false;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.trim().toUpperCase());
}

/**
 * Validates Aadhaar format (12 digits)
 */
export function isValidAadhaar(aadhaar: string): boolean {
    if (!aadhaar || typeof aadhaar !== 'string') return false;
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
}

/**
 * Validates IFSC code format (11 characters: 4 letters, 0, 6 alphanumeric)
 */
export function isValidIFSC(ifsc: string): boolean {
    if (!ifsc || typeof ifsc !== 'string') return false;
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc.trim().toUpperCase());
}

/**
 * Validates bank account number (10-18 digits)
 */
export function isValidBankAccount(account: string): boolean {
    if (!account || typeof account !== 'string') return false;
    const accountRegex = /^[0-9]{10,18}$/;
    return accountRegex.test(account.replace(/\s/g, ''));
}

/**
 * Validates CIN format (21 characters)
 */
export function isValidCIN(cin: string): boolean {
    if (!cin || typeof cin !== 'string') return false;
    const cinRegex = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
    return cinRegex.test(cin.trim().toUpperCase());
}

/**
 * Validates DIN format (8 digits)
 */
export function isValidDIN(din: string): boolean {
    if (!din || typeof din !== 'string') return false;
    const dinRegex = /^[0-9]{8}$/;
    return dinRegex.test(din.replace(/\s/g, ''));
}

/**
 * Validates phone number (Indian format: 10 digits, optional +91)
 */
export function isValidPhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    const phoneRegex = /^(\+91[\s-]?)?[6-9][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Validates that input is not empty after trimming
 */
export function isNotEmpty(value: string): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates minimum length
 */
export function hasMinLength(value: string, min: number): boolean {
    return typeof value === 'string' && value.trim().length >= min;
}

/**
 * Validates maximum length
 */
export function hasMaxLength(value: string, max: number): boolean {
    return typeof value === 'string' && value.trim().length <= max;
}

