import { describe, expect, it, jest } from "@jest/globals";
import { AbsoluteFolderName } from "../src/AbsoluteFolderName";
import { fs } from "./utils/fs";

const sandbox = fs.sandbox.absoluteFolderNameTests;

describe('Absolute Folder Name unit test"', () => {
    describe("parse", () => {
        it("should parse absolute folder name", () => {
            const folder = new AbsoluteFolderName("/folder");
            expect(folder.value).toBe("/folder");
            expect(folder.name.value).toBe("folder");
            expect(folder.parent?.parent).toBe(undefined);
        });

        it("should parse absolute folder name with parent", () => {
            const folder = new AbsoluteFolderName("/parent/folder");
            expect(folder.value).toBe("/parent/folder");
            expect(folder.name.value).toBe("folder");
            expect(folder.parent?.value).toBe("/parent");
        });

        it("should parse absolute folder name with multiple parents", () => {
            const folder = new AbsoluteFolderName("/parent1/parent2/folder");
            expect(folder.value).toBe("/parent1/parent2/folder");
            expect(folder.name.value).toBe("folder");
            expect(folder.parent?.value).toBe("/parent1/parent2");
        });

        it("should parse absolute folder when there are multiple consecutive slashes at the end", () => {
            const folder = new AbsoluteFolderName("/folder///");
            expect(folder.value).toBe("/folder");
            expect(folder.name.value).toBe("folder");
            expect(folder.parent?.parent).toBe(undefined);
        });

        it("should not fail when it contains more than one consecutive slash", () => {
            const folder = new AbsoluteFolderName("///parent1/parent2///folder");
            expect(folder.value).toBe("/parent1/parent2/folder");
            expect(folder.name.value).toBe("folder");
            expect(folder.parent?.value).toBe("/parent1/parent2");
            expect(folder.parent!.parent!.name.value).toBe("parent1");
        });

        it("should throw if absolute folder name doesn't start with slash", () => {
            expect(() => new AbsoluteFolderName("folder")).toThrowError();
        });
    });

    describe("Bulding folder tree", () => {
        it ("should build folder tree", () => {
            const root = new AbsoluteFolderName("/root").with(root => ({
                folder1: root.folder("folder1").with(folder1 => ({
                    folder2: folder1.folder("folder2"),
                    file1: folder1.file("file1"),
                })),
                file2: root.file("file2"),
            }));
            
            expect(root.folder1.folder2.value).toBe("/root/folder1/folder2");
            expect(root.folder1.file1.value).toBe("/root/folder1/file1");
            expect(root.file2.value).toBe("/root/file2");
            expect(root.folder1.folder2.parent).toBe(root.folder1);
        });
    });

    describe("Testing helper functions", () => {
        it ("should clean sandbox if exists", () => {
            sandbox.delete(true)
        });

        it ("should create folder", () => {
            expect(sandbox.createFolderTest.exists()).toBe(false);
            sandbox.createFolderTest.create();
            expect(sandbox.createFolderTest.exists()).toBe(true);
        });

        it ("should recreate folder", () => {
            expect(sandbox.createFolderTest.exists()).toBe(true);
            sandbox.createFolderTest.recreate();
            expect(sandbox.createFolderTest.exists()).toBe(true);
        });

        it ("should delete folder", () => {
            expect(sandbox.createFolderTest.exists()).toBe(true);
            sandbox.createFolderTest.delete();
            expect(sandbox.createFolderTest.exists()).toBe(false);
        });
    });
});
