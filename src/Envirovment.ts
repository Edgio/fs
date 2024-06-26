// Adding global cntex to control hat type of OS is running
// using jest mock yields to wrong results
export const context = {
    isWindows: process.platform === "win32",
}

export const absoluthePathStart = () => context.isWindows ?
    /^[a-zA-Z]:/ :
    /^\//;

export const isAbsolutePath = (path: string) => absoluthePathStart().test(path);
export const isRelativePath = (path: string) => !isAbsolutePath(path);