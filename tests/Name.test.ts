import { describe, expect, test, it } from '@jest/globals';
import { Name } from '../src/Name';

describe('FolderName unit test', () => {
    it ("should parse folder name", () => {
        const folderName = new Name("folder");
        expect(folderName.value).toBe("folder");
    });

    it ("should fail if folder name contains slash", () => {
        expect(() => new Name("folder/file")).toThrowError();
    });
});