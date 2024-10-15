import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseService } from "./database.service";
import { DatabaseController } from "./database.controller";
import { JsonStorage } from "./storage/json-storage";
import { BinaryStorage } from "./storage/binary-storage";

@Module({
    imports: [ConfigModule],
    controllers: [DatabaseController],
    providers: [
        DatabaseService,
        {
            provide: "StorageService",
            useFactory: (configService: ConfigService) => {
                const storeType = configService.get<string>("SDD_STORE_TYPE") || "json";
                switch (storeType) {
                    case "binary":
                        return new BinaryStorage("data");
                    default:
                        return new JsonStorage("data");
                }
            },
            inject: [ConfigService],
        },
    ],
})
export class DatabaseModule {}
