
const IsWindows = process.platform === "win32";
export const absoluthePathStart = IsWindows ?
    /^[a-zA-Z]:/ :
    /^\//;

export const isAbsolutePath = (path: string) => absoluthePathStart.test(path);
export const isRelativePath = (path: string) => !isAbsolutePath(path);