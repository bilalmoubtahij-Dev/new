import DOMPurify from 'dompurify';

/**
 * Sanitizes an input string by removing potentially malicious HTML/JS.
 * Helps prevent Cross-Site Scripting (XSS) vulnerabilities.
 * @param input The raw input string
 * @returns The sanitized string safe for rendering or storing
 */
export const sanitizeInput = (input: string | undefined | null): string => {
    if (!input) return '';
    // Use DOMPurify to strip any malicious scripts or attributes
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [], // No HTML tags allowed, plain text only
        ALLOWED_ATTR: [], // No attributes allowed
    });
};
