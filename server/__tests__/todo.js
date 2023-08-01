const app = require("../user/app");
const request = require("supertest");
const { User } = require("../user/models");
const { sequelize } = require("../user/models");
const { SignToken } = require("../user/helpers/jwt");
const Scrap = require("../user/mongo-models/scrap");
const Job = require("../user/mongo-models/job");
const Bookmark = require("../user/mongo-models/bookmark");
const { queryInterface } = sequelize;
const { run, client, getDb } = require("../user/config/mongo");
const { ObjectId } = require("mongodb");

let validToken;
const tester = {
  username: "tester",
  email: "tester@mail.com",
  password: "test123",
};

beforeAll(async () => {
    try {
      await run("testDB");
      const res = await User.create(tester);
      const job = await Job.create({ ...mockGlintsJob, ...mockDetail });
      bookmark = await Bookmark.create({UserId: res.id, jobId: new ObjectId(job._id), customTitle: job.jobTitle })
      validToken = SignToken({ id: res.id });
    } catch (error) {
      console.log(error);
    }
  });

afterAll(async () => {
  try {
    await getDb.dropDatabase("testDB")
    await client.close();
    queryInterface.bulkDelete("Users", null, {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });
  } catch (error) {
    console.log(error);
  }
});
  

describe.only("TEST ENDPOINT /todos GET", () => {
    test("200 Success GET from database todos", (done) => {
      request(app) // ambil dari aapp
        .get("/todos") // methood yang digunakan
        .set("access_token", validToken)
        .then((res) => {
          console.log(res)
          const { body, status } = res;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message", "Success update bookmark title");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("401 Unauthorized GET todos by UserId should return Invalid Token", (done) => {
      request(app)
        .put("/bookmarks")
        .then((res) => {
          const { body, status } = res;
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid Token");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe.only("TEST ENDPOINT /todos POST", () => {
    test("201 Success POST to database todos", (done) => {
      request(app) // ambil dari aapp
        .post("/todos/64c7d7bac49d772fbe20943c") // methood yang digunakan
        .set("access_token", validToken)
        .then((res) => {
          console.log(res)
          const { body, status } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("message", "Success added data");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("404 Not Found bookmark to POST todos by UserId should return Invalid Token", (done) => {
      request(app)
        .post("todos/null")
        .set("access_token", validToken)
        .then((res) => {
          const { body, status } = res;
          expect(status).toBe(404);
          expect(body).toHaveProperty("message", "data not found");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("401 Not Found bookmark to POST todos by UserId should return Invalid Token", (done) => {
        request(app)
          .post("todos/64c7d7bac49d772fbe20943c")
          .then((res) => {
            const { body, status } = res;
            expect(status).toBe(401);
            expect(body).toHaveProperty("message", "Invalid Token");
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
  });