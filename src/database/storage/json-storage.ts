import * as fs from "fs";
import * as path from "path";
import { IRecord } from "src/interfaces/record.interface";

export class JsonStorage {
    private filePath: string;

    constructor(fileName: string) {
        this.filePath = path.join(process.cwd(), "storage", `${fileName}.json`);
    }

    readData(): Record<string, IRecord[]> {
        if (!fs.existsSync(this.filePath)) return {};
        const data = fs.readFileSync(this.filePath, "utf8");
        return JSON.parse(data);
    }

    writeData(data: Record<string, IRecord[]>): void {
        const directoryPath = path.dirname(this.filePath);
        fs.mkdirSync(directoryPath, { recursive: true });

        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
    }
}
