const Todo = require("../mongo-models/todo");
const Bookmark = require("../mongo-models/bookmark");
const { ObjectId } = require("mongodb");
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
      // const job = {
      //   jobTitle: "Backend Dev",
      //   minimumReq:
      //     "1 tahun pengalaman, dapat menggunakan node js, rest api, express, mongodb, sequelize",
      //   location: "Jakarta",
      //   companyName: "PT. Putus Asa",
      // };

        const { BookmarkId } = req.params;
        console.log(BookmarkId)
        const data = await Bookmark.findByPk(BookmarkId);
        console.log(data)

        const prompt = `
      berikan todo list yang hanya mengembalikan array of objects tanpa tambahan text apapun selain array tersebut, tentang hal yang harus dilakukan sebelum melamar pekerjaan ${data[0].Job.jobTitle} sebanyak 10 to do list berdasarkan ${data[0].Job.jobDesc}, dengan properti

      [
        {
          "task":
        }
      ]

      jangan isi apapun di dalam array ataupun objects
        `;

        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt,
          max_tokens: 3000,
        });

      const completion = response.data.choices[0].text;
      console.log(completion);
      let todosdata = JSON.parse(completion);
      console.log(todosdata)

      todosdata = todosdata.map((el) => {
        el.completed = false
        el.bookmarkId = new ObjectId(BookmarkId)
        return el
      })

      const { UserId } = req.user;
      const todos = await Todo.bulkInsert(todosdata);
      res.status(201).json({msg:"Success"});
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
