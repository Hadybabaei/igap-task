import * as fs from "fs";
import * as path from "path";
import { IRecord } from "src/interfaces/record.interface";

export class BinaryStorage {
    private filePath: string;

    constructor(fileName: string) {
        this.filePath = path.join(__dirname, "..", "..", `${fileName}.bin`);
    }

    readData(): Record<string, IRecord[]> {
        if (!fs.existsSync(this.filePath)) return {};
        const data = fs.readFileSync(this.filePath);
        return JSON.parse(data.toString());
    }

    writeData(data: Record<string, IRecord[]>): void {
        fs.writeFileSync(this.filePath, Buffer.from(JSON.stringify(data)), "binary");
    }
}
