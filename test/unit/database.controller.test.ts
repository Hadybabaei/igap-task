import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseController } from '../../src/database/database.controller';
import { DatabaseService } from '../../src/database/database.service';
import { IRecord } from '../../src/interfaces/record.interface';
import { randomUUID } from 'crypto';

const mockDatabaseService = {
    createTable: jest.fn(),
    getAllRecords: jest.fn(),
    getRecordById: jest.fn(),
    insertRecord: jest.fn(),
    updateRecord: jest.fn(),
    deleteRecord: jest.fn(),
    deleteTable: jest.fn(),
};

describe('DatabaseController', () => {
    let databaseController: DatabaseController;
    const tableName = 'testTable';
    const mockRecord: IRecord = { _uuid: '1', name: 'Test Record' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DatabaseController],
            providers: [
                {
                    provide: DatabaseService,
                    useValue: mockDatabaseService,
                },
            ],
        }).compile();

        databaseController = module.get<DatabaseController>(DatabaseController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTable', () => {
        it('should create a new table', () => {
            const response = databaseController.createTable(tableName);
            expect(mockDatabaseService.createTable).toHaveBeenCalledWith(tableName);
            expect(response).toEqual({ Message: "table created" });
        });
    });

    describe('getAllRecords', () => {
        it('should return all records from the table', () => {
            const limit = 10;
            const skip = 0;
            const records = [mockRecord];
            mockDatabaseService.getAllRecords.mockReturnValueOnce(records);

            const result = databaseController.getAllRecords(tableName, limit, skip);

            expect(mockDatabaseService.getAllRecords).toHaveBeenCalledWith(tableName, limit, skip);
            expect(result).toEqual(records);
        });
    });

    describe('getRecordById', () => {
        it('should return a record by ID', () => {
            mockDatabaseService.getRecordById.mockReturnValueOnce(mockRecord);

            const result = databaseController.getRecordById(tableName, '1');

            expect(mockDatabaseService.getRecordById).toHaveBeenCalledWith(tableName, '1');
            expect(result).toEqual(mockRecord);
        });
    });

    describe('insertRecord', () => {
        it('should insert a new record into the table', () => {
            const payload = {
                _uuid: randomUUID(),
                ...mockRecord,
            };

            databaseController.insertRecord(tableName, mockRecord);
            expect(mockDatabaseService.insertRecord).toHaveBeenCalledWith(tableName, payload);
        });
    });

    describe('updateRecord', () => {
        it('should update a record by ID', () => {
            const updatedData = { name: 'Updated Record' };
            databaseController.updateRecord(tableName, '1', updatedData);

            expect(mockDatabaseService.updateRecord).toHaveBeenCalledWith(tableName, '1', updatedData);
        });
    });

    describe('deleteRecord', () => {
        it('should delete a record by ID', () => {
            databaseController.deleteRecord(tableName, '1');

            expect(mockDatabaseService.deleteRecord).toHaveBeenCalledWith(tableName, '1');
        });
    });

    describe('deleteTable', () => {
        it('should delete a table', () => {
            databaseController.deleteTable(tableName);

            expect(mockDatabaseService.deleteTable).toHaveBeenCalledWith(tableName);
        });
    });
});
