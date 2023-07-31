import { AbsoluteFileName } from "./AbsoluteFileName";
import { FSName } from "./FSName";
import { FileName } from "./FileName";
import { Name } from "./Name";
import { normalizePath } from "./utils/normalizePath";
import fs from "fs";

/**
 * Absolute folder name is a folder name that starts with slash and can contain parent folder that
 * must be absolute folder name or undefined (if folder is at the root)
 */
export class AbsoluteFolderName implements FSName {
    constructor(name: Name | string, parent?: AbsoluteFolderName) {
        if (typeof name === "string") {
            const parsed = AbsoluteFolderName.parse(name);
            this.parent = parsed[1];
            this.name = parsed[0];
        } else {
            this.parent = parent!;
            this.name = name;
        }

        this.value = this.parent ?
            `${this.parent.value}/${this.name.value}` :
            `/${this.name.value}`;
    }

    readonly value: string;
    readonly name: Name;
    readonly parent: AbsoluteFolderName | undefined;

    file(fileName: FileName | string) : AbsoluteFileName {
        if (typeof fileName === "string")
            return new AbsoluteFileName(new FileName(fileName), this);
        else
            return new AbsoluteFileName(fileName, this);
    }

    folder(folderName: Name | string): AbsoluteFolderName {
        if (typeof folderName === "string")
            return new AbsoluteFolderName(new Name(folderName), this);
        else
            return new AbsoluteFolderName(folderName, this);
    }

    with<T extends {}>(children: (name: AbsoluteFolderName) => T): AbsoluteFolderName & T {
        const newDefinition = new AbsoluteFolderName(this.name, this.parent) as AbsoluteFolderName & T;
        const res = children(newDefinition);
        newDefinition.setChildren(res);
        return newDefinition;
    }

    private setChildren<T extends {}>(children: T) {
        // read keys/values from children and inject into this class
        for (const key in children) {
            (this as any)[key] = (children as any)[key];
        }
    }

    exists(): boolean {
        return fs.existsSync(this.value);
    }

    create(ignoreExisting?: boolean): void {
        if (!this.exists()) {
            fs.mkdirSync(this.value, { recursive: true });
            return;
        } 
        
        if (!ignoreExisting)
            throw new Error(`Folder ${this.value} already exists`);
    }

    recreate(): void {
        this.delete(true);
        fs.mkdirSync(this.value, { recursive: true });
    }

    delete(ignoreIfNotExists?: boolean): void {
        if (this.exists()) {
            fs.rmSync(this.value, { recursive: true });
            return;
        }

        if (!ignoreIfNotExists)
            throw new Error(`Folder ${this.value} doesn't exist`);
    }

    static parse = (name: string): [Name, AbsoluteFolderName | undefined] => {
        if (!name.startsWith("/"))
            throw new Error("AbsoulteFolderName must start with slash, did you mean RelativeFolderName?")

        const normalized = normalizePath(name);
        const lastSlashIndex = normalized.lastIndexOf("/")
    
        if (lastSlashIndex > 0) {
            const parent = new AbsoluteFolderName(normalized.substring(0, lastSlashIndex))
            const folder = new Name(normalized.substring(lastSlashIndex + 1))
            return [folder, parent]
        } else {
            const parent = undefined;
            // skip first slash as this is absolute path
            const folder = new Name(normalized.substring(1))
            return [folder, parent]
        }
    }
}
