import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { IRecord } from "src/interfaces/record.interface";

export class YamlStorage {
    private filePath: string;

    constructor(fileName: string) {
        this.filePath = path.join(__dirname, "..", "..", `${fileName}.yaml`);
    }

    readData(): Record<string, IRecord[]> {
        if (!fs.existsSync(this.filePath)) return {};
        const data = fs.readFileSync(this.filePath, "utf8");
        return yaml.load(data) as Record<string, IRecord[]>;
    }

    writeData(data: Record<string, IRecord[]>): void {
        fs.writeFileSync(this.filePath, yaml.dump(data), "utf8");
    }
}
