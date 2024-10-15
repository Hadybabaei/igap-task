import { Command } from "commander";
import { DatabaseService } from "src/database/database.service";
import { BinaryStorage } from "src/database/storage/binary-storage";
import { JsonStorage } from "src/database/storage/json-storage";
import { IRecord } from "src/interfaces/Record.interface";

const program = new Command();

program
    .version("1.0.0")
    .description("CLI for Simple Dumb Database")
    .option("-s, --storage <type>", "Specify storage type (json, binary, yaml)", "json");

const storageType = program.opts().storage;
let storageService;

switch (storageType) {
    case "binary":
        storageService = new BinaryStorage("data");
        break;
    case "json":
    default:
        storageService = new JsonStorage("data");
        break;
}

const dbService = new DatabaseService(storageService);

program
    .command("create <tableName>")
    .description("Create a new table")
    .action((tableName) => {
        try {
            dbService.createTable(tableName);
            console.log(`Table '${tableName}' created.`);
        } catch (error) {
            console.error(`Error creating table '${tableName}':`, error.message);
        }
    });

program
    .command("insert <tableName>")
    .description("Insert a record into a table")
    .action((tableName) => {
        try {
            const record = {};
            dbService.insertRecord(tableName, record as IRecord);
            console.log(`Record inserted into '${tableName}'.`);
        } catch (error) {
            console.error(`Error inserting record into '${tableName}':`, error.message);
        }
    });

program
    .command("find <tableName> <id>")
    .description("Find a record by id")
    .action((tableName, id) => {
        try {
            const record = dbService.getRecordById(tableName, id);
            console.log("Record found:", record);
        } catch (error) {
            console.error(`Error finding record in '${tableName}' with id '${id}':`, error.message);
        }
    });

program
    .command("delete <tableName> <id>")
    .description("Delete a record by id")
    .action((tableName, id) => {
        try {
            dbService.deleteRecord(tableName, id);
            console.log(`Record with id '${id}' deleted from '${tableName}'.`);
        } catch (error) {
            console.error(`Error deleting record in '${tableName}' with id '${id}':`, error.message);
        }
    });

program
    .command("list <tableName>")
    .description("List all records in a table")
    .action((tableName) => {
        try {
            const data = dbService.getAllRecords(tableName);
            console.log("Records found:", data || []);
        } catch (error) {
            console.error(`Error listing records in '${tableName}':`, error.message);
        }
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
