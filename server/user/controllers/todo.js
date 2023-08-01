const Todo = require("../mongo-models/todo");
const Bookmark = require("../mongo-models/bookmark");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: "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",
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
      // const { BookmarkId } = req.params;
      // const bookmark = await Bookmark.findByPk(BookmarkId);
      // console.log(bookmark);
      const job = {
        jobTitle: "Backend Dev",
        minimumReq:
          "1 tahun pengalaman, dapat menggunakan node js, rest api, express, mongodb, sequelize",
        location: "Jakarta",
        companyName: "PT. Putus Asa",
      };

      const prompt = `
      berikan todo list dalam format array of objects tanpa di tambahkan apapun supaya dapat saya copy, tentang hal yang harus dilakukan sebelum melamar pekerjaan ${job.jobTitle} sebanyak 10 to do list berdasarkan ${job.minimumReq}, dengan properti
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
        max_tokens: 1000,
      });

      console.log(response);

      const completion = response.data.choices[0].text;
      console.log(completion);
      // const todosdata = toArray(completion);

      // const { UserId } = req.user;
      // const todos = await Todo.bulkInsert(todosdata);
      res.status(200).json({ msg: "success" });
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
