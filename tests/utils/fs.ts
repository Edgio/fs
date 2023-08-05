import { AbsoluteFolderName } from "../../src/AbsoluteFolderName";

// go two folders up, as we want a sandbox on a root of this project
// and then ignore it in gitignore
export const fs = new AbsoluteFolderName(__dirname).parent!.parent!
    .with(fs => ({
    sandbox: fs.folder("sandbox").with(sandbox => ({
        absoluteFolderNameTests: sandbox.folder("absoluteFolderNameTests").with(absoluteFolderTests => ({
            createFolderTest: absoluteFolderTests.folder("createFolderTest"),
            tempFolder: absoluteFolderTests.folder("temp"),
        })),
        absoluteFileNameHelperTests: sandbox.folder("absoluteFileNameHelperTests").with(absoluteFolderTests => ({
            createFileTest: absoluteFolderTests.file("createFileTest.txt"),
            tempFolder: absoluteFolderTests.folder("temp"),
        })),
        absoluteFileNameContentTests: sandbox.folder("absoluteFileNameContentTests").with(absoluteFolderTests => ({
            file: absoluteFolderTests.file("file.txt"),
            tempFolder: absoluteFolderTests.folder("temp"),
            fileWithJsonContent: absoluteFolderTests.file<{ name: string, value: number }>("fileWithJsonContent.json", "json"),
        })),
    }))
}));