import * as fs from "fs";
import * as path from "path";
import { IRecord } from "src/interfaces/record.interface";

export class BinaryStorage {
    private filePath: string;

    constructor(fileName: string) {
        this.filePath = path.join(process.cwd(), "storage", `${fileName}.bin`);
    }

    readData(): Record<string, IRecord[]> {
        if (!fs.existsSync(this.filePath)) return {};

        const data = fs.readFileSync(this.filePath);
        return JSON.parse(data.toString("utf8"));
    }

    writeData(data: Record<string, IRecord[]>): void {
        const directoryPath = path.dirname(this.filePath);
        fs.mkdirSync(directoryPath, { recursive: true });

        const binaryData = Buffer.from(JSON.stringify(data), "utf8");

        fs.writeFileSync(this.filePath, binaryData);
    }
}
