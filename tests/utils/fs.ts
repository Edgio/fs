import { AbsoluteFolderName } from "../../src/AbsoluteFolderName";

// go two folders up, as we want a sandbox on a root of this project
// and then ignore it in gitignore
export const fs = new AbsoluteFolderName(__dirname).parent!.parent!
    .with(fs => ({
    sandbox: fs.folder("sandbox").with(sandbox => ({
        absoluteFolderTests: sandbox.folder("absoluteFolderTests").with(absoluteFolderTests => ({
            createFileTest: absoluteFolderTests.file("createFileTest.txt"),
            createFolderTest: absoluteFolderTests.folder("createFolderTest"),
            createFolderTestCopy: absoluteFolderTests.folder("createFolderTestCopy"),
        })),
        absoluteFileTests: sandbox.folder("absoluteFileTests").with(absoluteFolderTests => ({
            createFileTest: absoluteFolderTests.file("createFileTest.txt"),
            createFolderTest: absoluteFolderTests.folder("createFolderTest"),
            createFolderTestCopy: absoluteFolderTests.folder("createFolderTestCopy"),
        })),
    }))
}));