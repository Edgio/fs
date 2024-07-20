import { AbsoluteFolderName } from "./AbsoluteFolderName";
import { FSName } from "./FSName";
import { FileName } from "./FileName";
import fs from "fs";
import { Serializer } from "./serializer/Serializer";
import { SerializerType } from "./serializer/SerializerType";
import { createJsonSerializer } from "./serializer/createJsonSerializer";
import { createRawSerializer } from "./serializer/createRawSerializer";
import { context } from "./Envirovment";
import { normalizePath } from "./utils/normalizePath";
import { Name } from "./Name";
/**
 * Absolute file name is a file name that starts with slash and can contain parent folder that
 * must be absolute folder name or undefined (if file is at the root)
 */
export class AbsoluteFileName<TContent = string> implements FSName {
    constructor(fileName: FileName, parent?: AbsoluteFolderName, type?: SerializerType | Serializer<TContent>) 
    constructor(fileName: string, type?: SerializerType | Serializer<TContent>)
    constructor(fileName: FileName | string, p2: any, p3?: any) {
        if (typeof fileName === "string") {
            const parsed = AbsoluteFileName.parse(fileName)
            this.parent = parsed[0]
            this.name = parsed[1]
            this.serializer = typeof p2 === "object"
                ? p2
                : p2 === "json" ? createJsonSerializer<TContent>() : createRawSerializer();
        } else {
            this.parent = p2
            this.name = fileName
            this.serializer = typeof p3 === "object"
                ? p3
                : p3 === "json" ? createJsonSerializer<TContent>() : createRawSerializer();
        }

        this.value = this.parent 
            ? `${this.parent.value}/${this.name.value}` 
            : `/${this.name.value}`;
    }

    private contentInternal?: TContent;
    private serializer: Serializer<TContent>;

    readonly value: string;
    readonly name: FileName;
    readonly parent?: AbsoluteFolderName;

    // We have several sections here, so we can easily find what we need, unfortunately
    // there are no partail classes in typescript, so we have to use comments

    // ----------------------------------- helpers -----------------------------------

    exists(): boolean {
        return fs.existsSync(this.value);
    }

    delete(ignoreIfNotExists?: boolean): void {
        if (this.exists()) {
            fs.rmSync(this.value);
            return;
        }

        if (!ignoreIfNotExists)
            throw new Error(`File ${this.value} doesn't exist`);
    }

    copyTo(target: AbsoluteFolderName | AbsoluteFileName<TContent>, overwrite?: boolean): void {
        if (!this.exists())
            throw new Error(`File ${this.value} doesn't exist`);

        const targetFileName = target instanceof AbsoluteFolderName
            ? target.file(this.name)
            : target;

        if (targetFileName.exists() && !overwrite)
            throw new Error(`Folder ${target.value} already exists`);

        fs.copyFileSync(this.value, targetFileName.value);
    }

    // ----------------------------------- content -----------------------------------

    contentReload() {
        this.contentInternal = this.serializer.deserialize(this.value);
    }

    get content(): TContent {
        if (this.contentInternal === undefined) {
            if (!this.exists())
                throw new Error(`File '${this.value}' doesn't exist`);

            this.contentInternal = this.serializer.deserialize(this.value);
        }

        return this.contentInternal!;
    }

    write(content: TContent, overwrite?: boolean): void {
        if (this.exists() && !overwrite)
            throw new Error(`File ${this.value} already exists`);

        this.serializer.serialize(this.value, content);
    }

    // ----------------------------------- parsing -----------------------------------

    static from<T = string>(source: string): AbsoluteFileName<T> {
        return new AbsoluteFileName<T>(source);
    }

    static parse = (name: string): [AbsoluteFolderName | undefined, FileName] => {
        if (name.endsWith("/"))
            throw new Error("AbsoluteFileName cannot end with slash, did you mean AbsoluteFolderName?")

        const normalized = normalizePath(name);
        const lastSlashIndex = normalized.lastIndexOf("/")
        const rest = normalized.substring(0, lastSlashIndex)
        const parent = new AbsoluteFolderName(rest.length === 0 ? "/" : rest);
        const fileName = new FileName(normalized.substring(lastSlashIndex + 1));
        return [parent, fileName];
    }
}
