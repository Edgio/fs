import { describe, expect, it } from "@jest/globals";
import { AbsoluteFileName } from "../src/AbsoluteFileName";
import { fs } from "./utils/fs";

const sandbox = fs.sandbox.absoluteFileTests;

describe('Absolute File Name unit test"', () => {
    describe("Parsing test", () => {
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
            expect(file.parent).toBeUndefined();
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

    describe("Helper functions test", () => {
        it ("should clean sandbox if exists", () => {
            sandbox.recreate()
        });

        it ("should write file", () => {
            expect(sandbox.createFileTest.exists()).toBe(false);
            sandbox.createFileTest.write("test");
            expect(sandbox.createFileTest.exists()).toBe(true);
        });

        it ("should delete file", () => {
            expect(sandbox.createFileTest.exists()).toBe(true);
            sandbox.createFileTest.delete();
            expect(sandbox.createFileTest.exists()).toBe(false);
        });

        it ("should copy file", () => {
            expect(sandbox.createFileTest.exists()).toBe(false);
            expect(sandbox.createFolderTestCopy.exists()).toBe(false);
            sandbox.createFolderTestCopy.create();
            sandbox.createFileTest.write("test");
            sandbox.createFileTest.copyTo(sandbox.createFolderTestCopy);
            expect(sandbox.createFileTest.exists()).toBe(true);
            expect(sandbox.createFolderTestCopy.exists()).toBe(true);
        });
    });
});