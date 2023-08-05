import { describe, expect, it } from "@jest/globals";
import { fs } from "./utils/fs";

const sandbox = fs.sandbox.absoluteFileNameHelperTests;

describe('Absolute File Name helper methods test"', () => {
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
        expect(sandbox.tempFolder.exists()).toBe(false);
        sandbox.tempFolder.create();
        sandbox.createFileTest.write("test");
        sandbox.createFileTest.copyTo(sandbox.tempFolder);
        expect(sandbox.createFileTest.exists()).toBe(true);
        expect(sandbox.tempFolder.exists()).toBe(true);
    });
});