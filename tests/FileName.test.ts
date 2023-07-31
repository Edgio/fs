import { describe, expect, test, it } from '@jest/globals';
import { FileName } from '../src/FileName';
import { Name } from '../src/Name';
import { FileExtension } from '../src/FileExtension';

describe('FileName unit test', () => {
    it('should parse simple file name', () => {
        const fileName = new FileName("file.txt")
        expect(fileName.value).toBe("file.txt")
        expect(fileName.name.value).toBe("file")
        expect(fileName.extension.value).toBe(".txt")
        expect(fileName.extension.valueWithoutDot).toBe("txt")
    })

    it('should parse file name without extension', () => {
        const fileName = new FileName("file")
        expect(fileName.value).toBe("file")
        expect(fileName.name.value).toBe("file")
        expect(fileName.extension.value).toBe("")
        expect(fileName.extension.valueWithoutDot).toBe("")
    })

    it ('should parse file name with multiple dots', () => {
        const fileName = new FileName("file.with.multiple.dots.txt")
        expect(fileName.value).toBe("file.with.multiple.dots.txt")
        expect(fileName.name.value).toBe("file.with.multiple.dots")
        expect(fileName.extension.value).toBe(".txt")
        expect(fileName.extension.valueWithoutDot).toBe("txt")
    })

    it ('should fail if file name contains slash', () => {
        expect(() => new FileName("folder/file.txt")).toThrowError()
    })

    it ('should construct file from file name without extension and extension', () => {
        const fileName = new FileName(new Name("file"), new FileExtension(".txt"))
        expect(fileName.value).toBe("file.txt")
        expect(fileName.name.value).toBe("file")
        expect(fileName.extension.value).toBe(".txt")
        expect(fileName.extension.valueWithoutDot).toBe("txt")
    })
});