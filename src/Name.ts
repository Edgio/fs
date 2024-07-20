import { FSName } from "./FSName";

/**
 * Represents the name on the FileSystem. This is just the name of the file or folder,
 * withouth folder path, so there is only limitation that name cannot contain slash.
 */
export class Name implements FSName {
    constructor(name: string, root = false) {
        this.value = Name.parse(name, root);
    }

    readonly value: string = "";

    static from(source: string): Name {
        return new Name(source);
    }

    static parse = (name: string, root = false): string => {
        if (root)
            return name;
        
        const slashIndex = name.indexOf("/");
    
        if (slashIndex > -1)
            throw new Error("Name cannot contain slash");
    
        return name;
    }
}


