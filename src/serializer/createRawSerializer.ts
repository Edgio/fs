import fs from "fs";
import { Serializer } from "./Serializer";

function rawSerializer(absoluteFileName: string, content: string): void {
    fs.writeFileSync(absoluteFileName, content);
}

function rawDeserializer(absoluteFileName: string): string {
    return fs.readFileSync(absoluteFileName, "utf-8");
}

export const createRawSerializer = (): Serializer<string> => ({
    deserialize: rawDeserializer,
    serialize: rawSerializer
})