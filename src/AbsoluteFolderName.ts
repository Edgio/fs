import { AbsoluteFileName } from "./AbsoluteFileName";
import { isAbsolutePath, isRelativePath, context } from "./Envirovment";
import { FSName } from "./FSName";
import { FileName } from "./FileName";
import { Name } from "./Name";
import { Serializer } from "./serializer/Serializer";
import { SerializerType } from "./serializer/SerializerType";
import { normalizePath } from "./utils/normalizePath";
import fs from "fs";



/**
 * Absolute folder name is a folder name that starts with slash and can contain parent folder that
 * must be absolute folder name or undefined (if folder is at the root)
 */
export class AbsoluteFolderName implements FSName {
    constructor(name: Name | string, parent?: AbsoluteFolderName, driveOrSlash?: string) {
        if (typeof name === "string") {
            const parsed = AbsoluteFolderName.parse(name);
            this.parent = parsed[1];
            this.name = parsed[0];
        } else {
            this.parent = parent;
            this.name = name;
        }   

        this.driveOrSlash = driveOrSlash ?? this.getDriveOrSlash(name, parent!);
        
        this.value = this.parent ?
            `${this.parent.value}/${this.name.value}` :
            `${this.driveOrSlash}${this.name.value}`;
    }

    readonly value: string;
    readonly name: Name;
    readonly driveOrSlash: string;
    readonly parent: AbsoluteFolderName | undefined;

    file<TContent = string>(fileName: FileName | string, type?: SerializerType | Serializer<TContent>) : AbsoluteFileName<TContent> {
        if (typeof fileName === "string")
            return new AbsoluteFileName<TContent>(new FileName(fileName), this, type);
        else
            return new AbsoluteFileName<TContent>(fileName, this, type);
    }

    folder(folderName: Name | string): AbsoluteFolderName {
        if (typeof folderName === "string")
            return new AbsoluteFolderName(new Name(folderName), this);
        else
            return new AbsoluteFolderName(folderName, this);
    }

    with<T extends {}>(children: (name: AbsoluteFolderName) => T): AbsoluteFolderName & T {
        const newDefinition = new AbsoluteFolderName(this.name, this.parent, this.driveOrSlash) as AbsoluteFolderName & T;
        const res = children(newDefinition);
        newDefinition.setChildren(res);
        return newDefinition;
    }

    private getDriveOrSlash(name: Name | string, parent: AbsoluteFolderName): string {
        if (context.isWindows) {
            if (typeof name === "string") {
                const driveLetter = name.substring(0, 1);
                return `${driveLetter}:/`;
            } else {
                return parent.driveOrSlash
            }
        } else {
            return "/";
        }
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

    static from(source: string): AbsoluteFolderName {
        return new AbsoluteFolderName(source);
    }

    static parse = (name: string): [Name, AbsoluteFolderName | undefined] => {
        if (isRelativePath(name))
            throw new Error("AbsoulteFolderName must start with slash, did you mean RelativeFolderName?")

        const normalized = normalizePath(name);
        const lastSlashIndex = normalized.lastIndexOf("/")
        
        // on windows we need to skip drive letter and colon
        // on linux we need don't need to skip anything as it
        // starts with slash
        const firstSlashIndex = context.isWindows ? 2 : 0;

        if (lastSlashIndex > firstSlashIndex) {
            const parent = new AbsoluteFolderName(normalized.substring(0, lastSlashIndex))
            const folder = new Name(normalized.substring(lastSlashIndex + 1))
            return [folder, parent]
        } else {
            const parent = undefined;
            const startToSkip = context.isWindows ? 3 : 1;

            // skip slash or drive letter
            const folder = new Name(normalized.substring(startToSkip))
            return [folder, parent]
        }
    }
}
