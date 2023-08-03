const { getDb } = require("../config/mongo");
const { ObjectId } = require("mongodb");

class TodoList {
  static todoCollection() {
    return getDb().collection("todos");
  }
  static async findAll(bookmarkId) {
    const todoCollection = this.todoCollection();
    return await todoCollection.aggregate([
      {$match:{
        bookmarkId: new ObjectId(bookmarkId)
      }}
    ]).toArray();
  }

  static async bulkInsert(todos) {
      const todoCollection = this.todoCollection();
      console.log(todos);
      const list = await todoCollection.insertMany(todos);
      console.log(list)
      return list;
  }

  static async destroyOne(Id) {
      const todoCollection = this.todoCollection();
      return await todoCollection.deleteOne({
        _id: new ObjectId(Id),
      });
  }

  static async patch(Id, data) {
      const todoCollection = this.todoCollection();
      return await todoCollection.updateOne(
        {
          _id: new ObjectId(Id),
        },
        {
          $set: { status: data },
        }
      );
  }
}
module.exports = TodoList
