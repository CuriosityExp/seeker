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
      if(!UserId){
        res.status(401).json({message: "Invalid Token"})
      }
      const todos = await Todo.findAll(UserId);
      if(!todos){
        res.status(401).json({message: "todos not found"})
      }
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
      
      if(!data){
        res.status(404).json({message: "data not found"})
      }
      
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

      console.log(todosdata)
      const todos = await Todo.bulkInsert(todosdata);
      res.status(201).json({message:"Success added data"});
    } catch (error) {
      next(error);
    }
  }
  
  static async deleteTodo(req, res, next) {
    try {
      const { Id } = req.params;
      const todos = await Todo.destroyOne(Id);
      res.status(200).json({message : "todo has been deleted"});
    } catch (error) {
      next(error);
    }
  }

    static async updateTodo(req, res, next) {
      try {
        const { Id } = req.params;
        const { status } = req.body;
        const todos = await Todo.patch(Id, status);
        res.status(200).json({message : "todo has been updated"});
      } catch (error) {
        next(error);
      }
    }  
}

module.exports = TodoController;
