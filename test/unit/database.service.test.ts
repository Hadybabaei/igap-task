import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "../../src/database/database.service";
import { IRecord } from "../../src/interfaces/Record.interface";

const mockStorageService = {
    readData: jest.fn(),
    writeData: jest.fn(),
};

describe("DatabaseService", () => {
    let databaseService: DatabaseService;
    const tableName = "testTable";
    const mockRecord: IRecord = { _uuid: "1", name: "Test Record" };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DatabaseService, { provide: "StorageService", useValue: mockStorageService }],
        }).compile();

        databaseService = module.get<DatabaseService>(DatabaseService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createTable", () => {
        it("should create a new table", () => {
            mockStorageService.readData.mockReturnValueOnce({});
            databaseService.createTable(tableName);
            expect(mockStorageService.writeData).toHaveBeenCalledWith({ [tableName]: [] });
        });

        it("should throw an error if the table already exists", () => {
            mockStorageService.readData.mockReturnValueOnce({ [tableName]: [] });
            expect(() => databaseService.createTable(tableName)).toThrowError(`Table ${tableName} already exists.`);
        });
    });

    describe("getAllRecords", () => {
        it("should return all records from the table", () => {
            mockStorageService.readData.mockReturnValueOnce({ [tableName]: [mockRecord] });
            const records = databaseService.getAllRecords(tableName);
            expect(records).toEqual([mockRecord]);
        });

        it("should throw an error if the table is not found", () => {
            mockStorageService.readData.mockReturnValueOnce({});
            expect(() => databaseService.getAllRecords(tableName)).toThrowError(`Table ${tableName} not found.`);
        });

        it("should respect limit and skip parameters", () => {
            mockStorageService.readData.mockReturnValueOnce({
                [tableName]: [mockRecord, { _uuid: "2", name: "Another Record" }],
            });
            const records = databaseService.getAllRecords(tableName, 1, 1);
            expect(records).toEqual([{ _uuid: "2", name: "Another Record" }]);
        });
    });

    describe("getRecordById", () => {
        it("should return a record by ID", () => {
            mockStorageService.readData.mockReturnValueOnce({ [tableName]: [mockRecord] });
            const record = databaseService.getRecordById(tableName, "1");
            expect(record).toEqual(mockRecord);
        });
    });

    describe("insertRecord", () => {
        it("should insert a new record into the table", () => {
            mockStorageService.readData.mockReturnValueOnce({ [tableName]: [] });
            databaseService.insertRecord(tableName, mockRecord);
            expect(mockStorageService.writeData).toHaveBeenCalledWith({ [tableName]: [mockRecord] });
        });

        it("should throw an error if the table is not found", () => {
            mockStorageService.readData.mockReturnValueOnce({});
            expect(() => databaseService.insertRecord(tableName, mockRecord)).toThrowError(
                `Table ${tableName} not found.`
            );
        });
    });

    describe("updateRecord", () => {
        it("should update a record by ID", () => {
            mockStorageService.readData.mockReturnValueOnce({ [tableName]: [mockRecord] });
            const updatedData = { name: "Updated Record" };
            databaseService.updateRecord(tableName, "1", updatedData);
            expect(mockStorageService.writeData).toHaveBeenCalledWith({
                [tableName]: [{ _uuid: "1", name: "Updated Record" }],
            });
        });
    });

    describe("deleteRecord", () => {
        it("should delete a record by ID", () => {
            mockStorageService.readData.mockReturnValueOnce({ [tableName]: [mockRecord] });
            databaseService.deleteRecord(tableName, "1");
            expect(mockStorageService.writeData).toHaveBeenCalledWith({ [tableName]: [] });
        });

        it("should throw an error if the table is not found", () => {
            mockStorageService.readData.mockReturnValueOnce({});
            expect(() => databaseService.deleteRecord(tableName, "1")).toThrowError(`Table ${tableName} not found.`);
        });
    });

    describe("deleteTable", () => {
        it("should delete a table", () => {
            mockStorageService.readData.mockReturnValueOnce({ [tableName]: [] });
            databaseService.deleteTable(tableName);
            expect(mockStorageService.writeData).toHaveBeenCalledWith({});
        });

        it("should throw an error if the table is not found", () => {
            mockStorageService.readData.mockReturnValueOnce({});
            expect(() => databaseService.deleteTable(tableName)).toThrowError(`Table ${tableName} not found.`);
        });
    });
});
