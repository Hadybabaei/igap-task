import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { IRecord } from "src/interfaces/record.interface";
import {randomUUID} from "crypto"

@Controller()
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) {}

    @Post("/create")
    public createTable(@Body("tableName") tableName: string) {
         this.databaseService.createTable(tableName);
         return {Message:"table created"}
    }

    @Get("/:tableName")
    public getAllRecords(
        @Param("tableName") tableName: string,
        @Query("limit") limit?: number,
        @Query("skip") skip?: number
    ) {
        return this.databaseService.getAllRecords(tableName, limit, skip);
    }

    @Get("/:tableName/:id")
    public getRecordById(@Param("tableName") tableName: string, @Param("id") id: string) {
        return this.databaseService.getRecordById(tableName, id);
    }

    @Post("/:tableName")
    public insertRecord(@Param("tableName") tableName: string, @Body() record: IRecord) {
        const paylad = {
            _uuid : randomUUID(),
            ...record
        }
         this.databaseService.insertRecord(tableName, paylad);
    }

    @Put("/:tableName/:id")
    public updateRecord(
        @Param("tableName") tableName: string,
        @Param("id") id: string,
        @Body() updatedRecord: Partial<IRecord>
    ) {
         this.databaseService.updateRecord(tableName, id, updatedRecord);
    }

    @Delete("/:tableName/:id")
    public deleteRecord(@Param("tableName") tableName: string, @Param("id") id: string) {
         this.databaseService.deleteRecord(tableName, id);
    }

    @Delete("/:tableName")
    public deleteTable(@Param("tableName") tableName: string) {
         this.databaseService.deleteTable(tableName);
    }
}
