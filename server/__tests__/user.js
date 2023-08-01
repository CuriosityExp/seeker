//test
const app = require("../user/app");
const request = require("supertest");
const { sequelize } = require("../user/models");
const { queryInterface } = sequelize;

const user1 = {
  email: "usertest@mail.com",
  username: "User Test",
  password: "usertest",
};

afterAll((done) => {
  queryInterface
    .bulkDelete("Users", null, { restartIdentity: true, truncate: true, cascade:true })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe("User Routes Test", () => {
  describe("POST /register - create new user", () => {
    test.only("201 Success register - should create new User", (done) => {
      request(app)
        .post("/register")
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body).toHaveProperty("message", "Register Success");
          return done();
        });
    });

    test("400 Failed register - should return error if email is null", (done) => {
      request(app)
        .post("/register")
        .send({
          password: "qweqwe",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email is required");
          return done();
        });
    });

    test("400 Failed register - should return error if email is already exists", (done) => {
      request(app)
        .post("/register")
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email must be unique");
          return done();
        });
    });

    test("400 Failed register - should return error if wrong email format", (done) => {
      request(app)
        .post("/register")
        .send({
          email: "random",
          username: "Sample User",
          password: "qweqwe",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Invalid email format");
          return done();
        });
    });
  });

  describe("POST /login - user login", () => {
    test("200 Success login - should return access_token", (done) => {
      request(app)
        .post("/login")
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toHaveProperty("access_token", expect.any(String));
          return done();
        });
    });

    test("401 Failed login - should return error", (done) => {
      request(app)
        .post("/login")
        .send({
          email: "hello@mail.com",
          password: "salahpassword",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid email/password");
          return done();
        });
    });
  });
});
