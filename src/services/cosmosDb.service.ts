import { CosmosClient, Database, Container } from "@azure/cosmos";

class CosmosDbService {
  public cosmosClient: CosmosClient;
  public database: Database;
  public container: Container;

  constructor() {
    this.cosmosClient = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING);
    this.database = this.cosmosClient.database(process.env.COSMOSDB_DATABASE_NAME);
    this.container = this.database.container(process.env.COSMOSDB_CONTAINER_NAME);
  }
}

const cosmosDbService = new CosmosDbService();

export { cosmosDbService };