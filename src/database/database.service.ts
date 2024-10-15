import { Inject, Injectable } from "@nestjs/common";
import { IRecord } from "../interfaces/Record.interface";
import { BinaryStorage } from "./storage/binary-storage";
import { JsonStorage } from "./storage/json-storage";

@Injectable()
export class DatabaseService {
    constructor(@Inject("StorageService") private storageService: JsonStorage | BinaryStorage) {}

    public createTable(tableName: string): void {
        const data = this.storageService.readData();
        if (!data[tableName]) {
            data[tableName] = [];
            this.storageService.writeData(data);
        } else {
            throw new Error(`Table ${tableName} already exists.`);
        }
    }

    public getAllRecords(tableName: string, limit?: number, skip?: number): IRecord[] {
        const data = this.storageService.readData();
        const table = data[tableName];
        if (!table) throw new Error(`Table ${tableName} not found.`);
        return table.slice(skip || 0, limit ? (skip || 0) + limit : undefined);
    }

    public getRecordById(tableName: string, id: string): IRecord {
        const data = this.storageService.readData();
        const table = data[tableName];
        if (!table) throw new Error(`Table not found.`);
        return table.find((IRecord) => IRecord._uuid === id);
    }

    public insertRecord(tableName: string, IRecord: IRecord): void {
        const data = this.storageService.readData();
        const table = data[tableName];
        if (!table) throw new Error(`Table ${tableName} not found.`);
        table.push(IRecord);
        this.storageService.writeData(data);
    }

    public updateRecord(tableName: string, id: string, updatedIRecord: Partial<IRecord>): void {
        const data = this.storageService.readData();
        const table = data[tableName];
        if (!table) throw new Error(`Table ${tableName} not found.`);

        const index = table.findIndex((IRecord) => IRecord._uuid === id);
        if (index === -1) throw new Error(`IRecord with id ${id} not found.`);

        table[index] = { ...table[index], ...updatedIRecord };
        this.storageService.writeData(data);
    }

    public deleteRecord(tableName: string, id: string): void {
        const data = this.storageService.readData();
        const table = data[tableName];
        if (!table) throw new Error(`Table ${tableName} not found.`);

        data[tableName] = table.filter((IRecord) => IRecord._uuid !== id);
        this.storageService.writeData(data);
    }

    public deleteTable(tableName: string): void {
        const data = this.storageService.readData();
        if (!data[tableName]) throw new Error(`Table ${tableName} not found.`);
        delete data[tableName];
        this.storageService.writeData(data);
    }
}
