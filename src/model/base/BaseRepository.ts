
import { Collection, Db, InsertOneResult, UpdateResult, ObjectId } from "mongodb";
import { IRead } from "./IRead";
import { IWrite } from "./IWrite";


export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  
  public readonly _collection: Collection;

  constructor(db: Db, collectionName: string) {
    
    this._collection = db.collection(collectionName);
  }

  async create(item: T): Promise<string> {
    const result: InsertOneResult = await this._collection.insertOne(item);

    // return the id of the inserted document
    return result.insertedId.toString();
  }

  async update(id: string, item: T): Promise<boolean> {

    let result = await this._collection.updateOne(
      {_id: new ObjectId(id)}, 
      {$set: item },
      {upsert: false}
    );

    return result.modifiedCount === 1;
  }

  async delete(id: string): Promise<boolean> {
    let result = await this._collection.deleteOne({
      _id: new ObjectId(id)
    });

    return result.deletedCount === 1
  }

  async find(item: T): Promise<T[]> {
    
    let result = await this._collection.find<T>(item).toArray();

    return result;
  }

  async findOne(id: string): Promise<T> {

    let item = await this._collection.findOne({
      _id: new ObjectId(id)
    });

    return item as T;
  }

  async listAll(): Promise<T[]> {

    let items = await this._collection.find({}).toArray();

    return items as T[];
  }
}