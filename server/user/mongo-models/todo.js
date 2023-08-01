const { getDb } = require("../config/config");
const { ObjectId } = require("mongodb");

class TodoList {
  static todoCollection() {
    return getDb().collection("todos");
  }
  static async findAll() {
    const todoCollection = this.todoCollection();
    return await todoCollection.find().toArray();
  }

  static async findByPk(todoId) {
    const todoCollection = this.todoCollection();
    return await todoCollection.findOne({
      _id: new ObjectId(todoId),
    });
  }

  static async bulkInsert(todos) {
    try {
      const todoCollection = this.todoCollection();
      const list = await todoCollection.insertMany(todos);
      return list;
    } catch (error) {
      throw error;
    }
  }

  static async destroyOne(Id) {
    try {
      const todoCollection = this.todoCollection();
      return await todoCollection.deleteOne({
        _id: new ObjectId(Id),
      });
    } catch (error) {
      throw error;
    }
  }

  static async patch(Id, data) {
    try {
      const todoCollection = this.todoCollection();
      return await todoCollection.updateOne({
        _id: new ObjectId(Id),
        status: data
      });
    } catch (error) {
      throw error;
    }
  }

  static async destroy(bookmarkId) {
    try {
      const todoCollection = this.todoCollection();
      return await todoCollection.deleteMany({
        bookmarkId: new ObjectId(bookmarkId),
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TodoList
