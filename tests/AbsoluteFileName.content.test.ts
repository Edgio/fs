import { describe, expect, it } from "@jest/globals";
import { fs } from "./utils/fs";

const sandbox = fs.sandbox.absoluteFileNameContentTests;

describe('Absolute File Name content tests"', () => {
    it ("should clean sandbox if exists", () => {
        sandbox.recreate()
    });

    it ("should write file", () => {
        expect(sandbox.file.exists()).toBe(false);
        sandbox.file.write("test");
        expect(sandbox.file.exists()).toBe(true);
        expect(sandbox.file.content).toBe("test");
    });

    it ("should write json file", () => {
        expect(sandbox.fileWithJsonContent.exists()).toBe(false);
        sandbox.fileWithJsonContent.write({ name: "test", value: 1 });
        expect(sandbox.fileWithJsonContent.exists()).toBe(true);
        expect(sandbox.fileWithJsonContent.content.name).toEqual("test");
        expect(sandbox.fileWithJsonContent.content.value).toEqual(1);
        expect(sandbox.fileWithJsonContent.content).toEqual({ name: "test", value: 1 });
    });
});