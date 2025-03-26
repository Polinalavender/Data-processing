"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_config_1 = require("./config/database/database.config");
const initialize_database_config_1 = require("./config/database/initialize-database.config");
(0, initialize_database_config_1.initializeDatabase)().then(() => {
    console.log(`Connected to postgres database ${database_config_1.databaseConfig.database.database}`);
    const PORT = database_config_1.databaseConfig.port || 4000;
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
//# sourceMappingURL=server.js.map