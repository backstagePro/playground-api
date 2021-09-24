export interface IWrite<T> {
  /**
   * Create a new document and return its id
   * 
   * @param item 
   */
  create(item: T): Promise<string>;

  /**
   * Update a single item.
   * 
   * If the item is modified in result of this operation - true will be returned 
   * from this function
   * 
   * @param id 
   * @param item 
   */
  update(id: string, item: T): Promise<boolean>;

  /**
   * Delete a item by id.
   * 
   * If deletion was succesfull, 'true' will be returned
   * 
   * @param id 
   */
  delete(id: string): Promise<boolean>;
}