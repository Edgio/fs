import { describe, expect, it } from "@jest/globals";
import { AbsoluteFileName } from "../src/AbsoluteFileName";
import { fs } from "./utils/fs";

const sandbox = fs.sandbox.absoluteFileNameHelperTests;

describe('Absolute File Name parsing tests"', () => {
    it("should parse absolute file name", () => {
        const file = new AbsoluteFileName("/folder/file.txt");
        expect(file.value).toBe("/folder/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent!.value).toBe("/folder");
    });

    it("should parse absolute file name at the root", () => {
        const file = new AbsoluteFileName("/file.txt");
        expect(file.value).toBe("/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent?.parent).toBeUndefined();
    });

    it("should fail when absolute file name ends with slash", () => {
        expect(() => new AbsoluteFileName("/folder/")).toThrowError();
    });

    it("should parse absolute path when there are multiple consecutive slashes", () => {
        const file = new AbsoluteFileName("///folder///file.txt");
        expect(file.value).toBe("/folder/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent!.value).toBe("/folder");
    });

    it("should parse absolute path when there is no extension in the file name", () => {
        const file = new AbsoluteFileName("/folder/file");
        expect(file.value).toBe("/folder/file");
        expect(file.name.value).toBe("file");
        expect(file.name.extension.value).toBe("");
        expect(file.name.extension.isEmpty).toBe(true);
        expect(file.parent!.value).toBe("/folder");
    });
});