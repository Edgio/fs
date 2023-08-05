import fs from "fs";
import { Serializer } from "./Serializer";

function jsonDeserializer<T>(absoluteFileName: string): T {
    const raw = fs.readFileSync(absoluteFileName, "utf-8")
    return JSON.parse(raw)
}

function jsonSerializer<T>(absoluteFileName: string, content: T): void {
    const raw = JSON.stringify(content)
    fs.writeFileSync(absoluteFileName, raw);
}

export const createJsonSerializer = <T>(): Serializer<T> => ({
    deserialize: jsonDeserializer,
    serialize: jsonSerializer
})