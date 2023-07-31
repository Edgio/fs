import { describe, expect, test, it } from "@jest/globals";
import { RelativeFileName } from "../src/RelativeFileName";

describe('Relative File Name unit test"', () => {
    it ("should parse relative file name", () => {
        const file = new RelativeFileName("folder/file.txt");
        expect(file.value).toBe("folder/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent!.value).toBe("folder");
    });

    it ("should parse relative file name at the root", () => {
        const file = new RelativeFileName("file.txt");
        expect(file.value).toBe("file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent).toBeUndefined();
    });

    it ("should parse relative path when there are multiple consecutive slashes", () => {
        const file = new RelativeFileName("folder///file.txt");
        expect(file.value).toBe("folder/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent!.value).toBe("folder");
    });

    it ("should fail when relative file name ends with slash", () => {
        expect(() => new RelativeFileName("folder/")).toThrowError();
    });

    it ("should fail when relative file name starts with slash", () => {
        expect(() => new RelativeFileName("/folder")).toThrowError();
    });
});