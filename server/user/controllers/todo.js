const Todo = require("../mongo-models/todo");
const Bookmark = require("../mongo-models/bookmark");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

    static async createTodo(req, res, next) {
      try {

        const { BookmarkId } = req.params;
        const bookmark = await Bookmark.findByPk(BookmarkId);
        console.log(bookmark)

        const prompt = `
      berikan todo list dalam format array of objects tanpa di tambahkan apapun supaya dapat saya copy, tentang hal yang harus dilakukan sebelum melamar pekerjaan ${bookmark.job[0].jobTitle} sebanyak 10 to do list berdasarkan ${bookmark.job[0].minimumReq}, dengan properti
      [
        {
          task:
          completed:
        }
      ]
        `;

        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt,
          max_tokens: 3000,
        });

        const completion = response.data.choices[0].text;
        console.log(completion)
        const todosdata = toArray(completion);

        const { UserId } = req.user;
        const todos = await Todo.bulkInsert(todosdata);
        res.status(200).json(todos);
      } catch (error) {
        next(error);
      }
    }

    static async deleteTodo(req, res, next) {
      try {
        const { Id } = req.params;
        const todos = await Todo.destroyOne(Id);
        res.status(200).json(todos);
      } catch (error) {
        next(error);
      }
    }

    static async updateTodo(req, res, next) {
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
