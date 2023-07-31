import { FileExtension } from "./FileExtension";
import { FSName } from "./FSName";
import { Name } from "./Name";

/**
 * Represents the file name, which is composed of name and extension. This is just the name of the file,
 * withouth folder path, so slashes are not allowed. If you want to represent file name with folder path,
 * use RelativeFileName or AbsoluteFileName.
 */
export class FileName implements FSName {
    constructor(name: Name, extension?: FileExtension)
    constructor(name: string)
    constructor(p1: Name | string, p2?: FileExtension) {
        if (typeof p1 === "string") {
            const parsed = FileName.parse(p1)
            this.name = parsed[0]
            this.extension = parsed[1]
        } else {
            this.name = p1
            this.extension = p2 ?? new FileExtension("")
        }

        this.value = this.name.value + this.extension!.value
    }

    readonly value: string;
    readonly name: Name;
    readonly extension: FileExtension;

    static parse = (name: string): [Name, FileExtension] => {
        if (name.indexOf("/") > -1)
            throw new Error("FileName cannot contain slash")

        const dotIndex = name.lastIndexOf(".")
        
        if (dotIndex > -1) {
            const nameWithoutExtension = new Name(name.substring(0, dotIndex))
            const extension = new FileExtension(name.substring(dotIndex))
            return [nameWithoutExtension, extension]
        } else {
            const nameWithoutExtension = new Name(name)
            const extension = new FileExtension();
            return [nameWithoutExtension, extension]
        }
    }
}
