// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_test_db";
import UserModel from "../models/Test_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.test_db.host +
        ":" +
        properties.test_db.port +
        "//" +
        properties.test_db.user +
        "@" +
        properties.test_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.test_db.name,
      properties.test_db.user,
      properties.test_db.password,
      {
        host: properties.test_db.host,
        dialect: properties.test_db.dialect,
        port: properties.test_db.port,
        logging: false
      }
    );
    this.dbConnection_test_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_test_db;
  }
}

export default new Database();
