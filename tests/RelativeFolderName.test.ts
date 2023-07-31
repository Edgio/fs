import { describe, expect, test, it } from '@jest/globals';
import { RelativeFolderName } from '../src/RelativeFolderName';

describe('RelativeFolderName unit test', () => {
    it ("should parse relative folder name", () => {
        const folderName = new RelativeFolderName("some/folder");
        expect(folderName.value).toBe("some/folder");
        expect(folderName.folder.value).toBe("folder");
        expect(folderName.parent!.value).toBe("some");
        expect(folderName.parent!.parent).toBeUndefined();
        expect(folderName.fullPath).toBe("some/folder");
    });

    it ("should parse relative folder name without parent", () => {
        const folderName = new RelativeFolderName("folder");
        expect(folderName.value).toBe("folder");
        expect(folderName.parent).toBeUndefined();
    });

    it ("should fail if relative folder name contains slash at the begining", () => {
        expect(() => new RelativeFolderName("/folder")).toThrowError();
    });
});