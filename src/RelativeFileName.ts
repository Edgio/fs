import { FSName } from "./FSName";
import { RelativeFolderName } from "./RelativeFolderName";
import { FileName } from "./FileName";
import { normalizePath } from "./utils/normalizePath";

/**
 * Relative file name is a file name that can contain parent folder that
 * must be relative folder name or undefined (if file is at the root)
 */
export class RelativeFileName implements FSName {
    constructor(fileName: FileName, parent?: RelativeFolderName);
    constructor(name: string)
    constructor(p1: FileName | string, p2?: RelativeFolderName) {
        if (typeof p1 === "string") {
            const parsed = RelativeFileName.parse(p1)
            this.parent = parsed[0]
            this.name = parsed[1]
        } else {
            this.parent = p2
            this.name = p1
        }

        this.value = this.parent
            ? `${this.parent.value}/${this.name.value}`
            : this.name.value
    }

    readonly value: string = "";
    readonly name: FileName;
    readonly parent?: RelativeFolderName

    static parse = (name: string): [RelativeFolderName | undefined, FileName] => {
        if (name.startsWith("/"))
            throw new Error("RelativeFileName cannot start with slash, did you mean AbsoluteFileName?")

        if (name.endsWith("/"))
            throw new Error("RelativeFileName cannot end with slash, did you mean RelativeFolderName?")

        const normalized = normalizePath(name);
        const lastSlashIndex = normalized.lastIndexOf("/")

        if (lastSlashIndex > -1) {
            const parent = new RelativeFolderName(normalized.substring(0, lastSlashIndex))
            const fileName = new FileName(normalized.substring(lastSlashIndex + 1))
            return [parent, fileName]
        } else {
            const parent = undefined
            const fileName = new FileName(normalized)
            return [parent, fileName]
        }
    }
}
