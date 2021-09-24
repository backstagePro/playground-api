import { MongoClient, Db } from 'mongodb';


export default class MongoDbAdapter {

  private client?: MongoClient;

  private database?: Db;

  /**
   * Connect to MongoDb and return DataBase Mongo Instance
   */
  async connect(): Promise<Db> {

    if(this.database){
      console.log('returned connections');
      return this.database;
    }

    const uri =
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.DB_URL}:27017`;
    
    this.client = new MongoClient(uri);

    await this.client.connect();

    console.log('connect')

    this.database = this.client.db('playground');

    return this.database;
  }

  public getDataBase(): Db | undefined {

    return this.database;
  }

  public getClient(): MongoClient | undefined {

    return this.client;
  }
}