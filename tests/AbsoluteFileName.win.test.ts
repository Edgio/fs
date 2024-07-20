
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { AbsoluteFolderName } from "../src/AbsoluteFolderName";
import { fs } from "./utils/fs";
import { context } from "../src/Envirovment";
import { AbsoluteFileName } from "../src/AbsoluteFileName";

const sandbox = fs.sandbox.absoluteFileNameHelperTests;

describe('Absolute File Name parsing tests"', () => {
    beforeAll(() => {
        context.isWindows = true;
    })

    afterAll(() => {
        context.isWindows = false;
    })

    it("should parse absolute file name", () => {
        const file = new AbsoluteFileName("c:/folder/file.txt");
        expect(file.value).toBe("c:/folder/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent!.value).toBe("c:/folder");
        expect(file.parent!.parent?.value).toBe("c:");
        expect(file.parent!.parent?.parent).toBe(undefined);
    });

    it("should parse absolute file name with backslashes", () => {
        const file = new AbsoluteFileName(`c:\\folder\\file.txt`);
        expect(file.value).toBe("c:/folder/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent!.value).toBe("c:/folder");
        expect(file.parent!.parent?.value).toBe("c:");
        expect(file.parent!.parent?.parent).toBe(undefined);
    });

    it("should parse absolute file name with multiple consecutive backslashes", () => {
        const file = new AbsoluteFileName(`c:\\\\folder\\\\file.txt`);
        expect(file.value).toBe("c:/folder/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent!.value).toBe("c:/folder");
        expect(file.parent!.parent?.value).toBe("c:");
        expect(file.parent!.parent?.parent).toBe(undefined);
    });

    it("should parse absolute file name at the root", () => {
        const file = new AbsoluteFileName("c:/file.txt");
        expect(file.value).toBe("c:/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
    });

    it("should fail when absolute file name ends with slash", () => {
        expect(() => new AbsoluteFileName("c://folder/")).toThrowError();
    });

    it("should parse absolute path when there are multiple consecutive slashes", () => {
        const file = new AbsoluteFileName("c:///folder///file.txt");
        expect(file.value).toBe("c:/folder/file.txt");
        expect(file.name.value).toBe("file.txt");
        expect(file.name.extension.value).toBe(".txt");
        expect(file.parent!.value).toBe("c:/folder");
    });

    it("should parse absolute path when there is no extension in the file name", () => {
        const file = new AbsoluteFileName("c:/folder/file");
        expect(file.value).toBe("c:/folder/file");
        expect(file.name.value).toBe("file");
        expect(file.name.extension.value).toBe("");
        expect(file.name.extension.isEmpty).toBe(true);
        expect(file.parent!.value).toBe("c:/folder");
    });
});

