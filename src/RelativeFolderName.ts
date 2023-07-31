import { FSName } from "./FSName";
import { Name } from "./Name";
import { Lazy } from "./utils/Lazy";
import { normalizePath } from "./utils/normalizePath";

/**
 * Relative folder name is a folder name that can contain parent folder that
 * must be relative folder name or undefined (if folder is at the root)
 */
export class RelativeFolderName implements FSName {
    constructor(name: Name, parent?: RelativeFolderName);
    constructor(name: string);
    constructor(p1: Name | string, p2?: RelativeFolderName) {
        if (typeof p1 === "string") {
            const parsed = RelativeFolderName.parse(p1);
            this.parent = parsed[0];
            this.folder = parsed[1];
        } else {
            this.parent = p2;
            this.folder = p1;
        }

        this.value = this.parent ?
            this.parent.value + "/" + this.folder.value :
            this.folder.value;

        this.fullPathLazy = new Lazy(() => {
            return this.parent
                ? this.parent.fullPath + "/" + this.folder.value
                : this.folder.value;
        });
    }

    readonly value: string = "";
    readonly folder: Name;
    readonly parent?: RelativeFolderName;

    private fullPathLazy: Lazy<string>;
    get fullPath() { return this.fullPathLazy.value; }

    static parse = (name: string): [RelativeFolderName | undefined, Name] => {
        if (name.startsWith("/"))
            throw new Error("RelativeFolderName cannot start with slash, did you mean AbsoluteFolderName?")
        
        const normalized = normalizePath(name);
        const lastSlashIndex = normalized.lastIndexOf("/")

        if (lastSlashIndex > -1) {
            const parent = new RelativeFolderName(normalized.substring(0, lastSlashIndex))
            const folder = new Name(normalized.substring(lastSlashIndex + 1))
            return [parent, folder]
        } else {
            const parent = undefined
            const folder = new Name(normalized)
            return [parent, folder]
        }
    }
}

