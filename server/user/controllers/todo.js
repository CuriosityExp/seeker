const Todo = require("../mongo-models/todo");

class TodoController {
    static async createTodo(req, res, next) {
        try {

        } catch (error) {
          next(error);
        }
      }
}

module.exports = TodoController;
