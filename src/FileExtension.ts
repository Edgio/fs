import { FSName } from "./FSName";

/**
 * File extension is a string that starts with dot and doesn't contain slash
 * 
 * Examples:
 * - .txt
 * - .png
 * 
 * File extension can be empty string
 * 
 */
export class FileExtension implements FSName {
    constructor(name?: string)
    {
        this.value = name === undefined
            ? ""
            : FileExtension.parse(name);
    }

    readonly value: string;

    get valueWithoutDot(): string {
        return this.isEmpty
            ? ""
            : this.value.substring(1);
    }

    get isEmpty(): boolean {
        return this.value === "";
    }

    static parse = (name: string): string => {
        if (name.indexOf("/") > -1)
            throw new Error("FileExtension cannot contain slash");

        if (name.indexOf(".") == -1)
            throw new Error("FileExtension must contain dot");

        return name;
    }
}
