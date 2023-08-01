const Todo = require("../mongo-models/todo");

class TodoController {
    static async getTodo(req, res, next) {
      try {
        const { UserId } = req.user;
        const todos = await Todo.findAll(UserId);
        res.status(200).json(todos);
      } catch (error) {
        next(error);
      }
    }
}

module.exports = TodoController;
