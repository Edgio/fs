/**
 * Normalize path by removing all consecutive slashes and slash at the end
 */
export const normalizePath = (value: string) => {
    const normalized = value
        // replace windows backslashes with slashes
        .replace(/\\/g, "/")
        // then remove all consecutive slashes
        .replace(/\/+/g, "/")
        // then remove slash at the end
        .replace(/\/+$/, '')

    return normalized;
}