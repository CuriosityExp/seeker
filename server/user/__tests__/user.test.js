const { User, Profile } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { describe, test, expect } = require("@jest/globals");
const request = require("supertest");
const models = require("../models");
const app = require("../app");


async function bulkInsertUsers() {
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await Profile.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await User.bulkCreate([
    {
      username: "users",
      email: "users@gmail.com",
      password: hashPassword("123"),
    },
    {
      username: "users1",
      email: "users1@gmail.com",
      password: hashPassword("123"),
    },
  ]);
  await Profile.bulkCreate([
    {
      fullName: "none",
      aboutMe: "none",
      sayName: "none",
      birthDate: "none",
      gender: "none",
      phoneNumber: "none",
      domisili: "none",
      photoUrl: "none",
      CV: "none",
      UserId: 1,
    },
  ]);
}
let access_token = "";

beforeAll(async function () {
  await bulkInsertUsers();
  access_token = response.body.access_token;
});
afterAll(async function () {
  await models.sequelize.close();
});

describe("Users", function () {
  describe("Register Test", function () {
    test("Status (201)", async function () {
      const response = await request(app).post("/register").send({ username: "test", email: "test@gmail.com", password: "123" });
      expect(response.status).toEqual(201);
    });
    test("Status (400) ", async function () {
      const response = await request(app).post("/register").send({ email: "test1@gmail.com", password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Username is required");
    });
    test("Status (400) ", async function () {
      const response = await request(app).post("/register").send({ username: "test1", password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Email is required");
    });
    test("Status (400) ", async function () {
      const response = await request(app).post("/register").send({ username: "test1", email: "test1@gmail.com" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Password is required");
    });
    test("Status (400) ", async function () {
      const response = await request(app).post("/register").send({ username: "", email: "test1@gmail.com", password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Username is required");
    });
    test("Status (400)", async function () {
      const response = await request(app).post("/register").send({ username: "test1", email: "", password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Email is required");
    });
    test("Status (400)", async function () {
      const response = await request(app).post("/register").send({ username: "test1", email: "test1@gmail.com", password: "" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Password is required");
    });
    test("Status (401) ", async function () {
      const response = await request(app).post("/register").send({ username: "test", email: "test1@gmail.com", password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Username must be unique");
    });
    test("Status (401) ", async function () {
      const response = await request(app).post("/register").send({ username: "test1", email: "test@gmail.com", password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Email must be unique");
    });
    test("Status (400)", async function () {
      const response = await request(app).post("/register").send({ username: "test1", email: "test", password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Format is wrong");
    });
  });

  describe("Login Test", function () {
    test("Status (200)", async function () {
      const response = await request(app).post("/login").send({ username: "users1", email: "users1@gmail.com", password: "123" });
      expect(response.status).toEqual(200);
      access_token = response.body.access_token;
    });
    test("Status (200)", async function () {
      const response = await request(app).post("/login").send({ username: "users1", password: "123" });
      expect(response.status).toEqual(200);
      access_token = response.body.access_token;
    });
    test("Status (200)", async function () {
      const response = await request(app).post("/login").send({ email: "users1@gmail.com", password: "123" });
      expect(response.status).toEqual(200);
      access_token = response.body.access_token;
    });
    test("Status (400)", async function () {
      const response = await request(app).post("/login").send({ username: "users10", password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Invalid User");
    });
    test("Status (400)", async function () {
      const response = await request(app).post("/login").send({ username: "users1", password: "1234" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Invalid Password");
    });
    test("Status (400)", async function () {
      const response = await request(app).post("/login").send({ email: "users1@mail.com", password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Invalid User");
    });
    test("Status (400)", async function () {
      const response = await request(app).post("/login").send({ email: "users1@gmail.com", password: "1234" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("Invalid Password");
    });

    test("Status (400)", async function () {
      const response = await request(app).post("/login").send({ password: "123" });
      expect(response.status).toEqual(400);
      expect(response.body.message).toEqual("username/email is required");
    });
  });

  describe("Main Entity test", function () {
    test.only("GET /people success with access token", async function () {
      // console.log(access_token, "<<");
      const response = await request(app)
      .get("/people")
      .set('Authorization', `Bearer ${access_token}`);
      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual("object");
      expect(response.body[0]).toHaveProperty("fullName");
      expect(response.body[0]).toHaveProperty("aboutMe");
      expect(response.body[0]).toHaveProperty("sayName");
      expect(response.body[0]).toHaveProperty("birthDate");
      expect(response.body[0]).toHaveProperty("gender");
      expect(response.body[0]).toHaveProperty("phoneNumber");
      expect(response.body[0]).toHaveProperty("domisili");
      expect(response.body[0]).toHaveProperty("photoUrl");
      expect(response.body[0]).toHaveProperty("CV");
      expect(response.body[0]).toHaveProperty("UserId");
    });
    test("GET /people success by id params", async function () {
      const response = await request(app).get("/people/1");
      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual("object");
      expect(response.body).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("fullName");
      expect(response.body[0]).toHaveProperty("aboutMe");
      expect(response.body[0]).toHaveProperty("sayName");
      expect(response.body[0]).toHaveProperty("birthDate");
      expect(response.body[0]).toHaveProperty("gender");
      expect(response.body[0]).toHaveProperty("phoneNumber");
      expect(response.body[0]).toHaveProperty("domisili");
      expect(response.body[0]).toHaveProperty("photoUrl");
      expect(response.body[0]).toHaveProperty("UserId");
    });
    test("GET /profile/ fail id params invalid ", async function () {
      const response = await request(app).get("/people/1000");
      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Not found");
    });
  });

  describe("profile test", function () {
    test("GET /educations showlist", async function () {
      const response = await request(app).get("/educations").set("access_token", token);

      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual("object");
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("ProfileId");
    });
    test("POST /educations show transaction with req user id", async function () {
      const response = await request(app).post("/educations").set("access_token", token);

      expect(response.status).toEqual(201);
      expect(typeof response.body).toEqual("object");
    });
    test("post /educations fail add by params", async function () {
      const response = await request(app).post("/transactions/1000").set("access_token", token);

      console.log(response.body, "pppp");
      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Not found");
    });
    test("POST /educations fail show because no access token", async function () {
      const response = await request(app).post("/educations");

      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual("invalid token");
    });
    test("GET /educations fail show because invalid token", async function () {
      const response = await request(app)
        .get("/educations")
        .set("access_token", access_token + "xxx");
      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual("invalid token");
    });
  });

  describe("profile test", function () {
    test("GET /work-experiences showlist", async function () {
      const response = await request(app).get("/work-experiences").set("access_token", token);

      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual("object");
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("ProfileId");
    });
    test("POST /work-experiences show transaction with req user id", async function () {
      const response = await request(app).post("/work-experiences").set("access_token", token);

      expect(response.status).toEqual(201);
      expect(typeof response.body).toEqual("object");
    });
    test("post /work-experiences fail add by params", async function () {
      const response = await request(app).post("/transactions/1000").set("access_token", token);

      console.log(response.body, "pppp");
      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Not found");
    });
    test("POST /work-experiences fail show because no access token", async function () {
      const response = await request(app).post("/work-experiences");

      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual("invalid token");
    });
    test("GET /work-experiences fail show because invalid token", async function () {
      const response = await request(app)
        .get("/work-experiences")
        .set("access_token", access_token + "xxx");
      expect(response.status).toEqual(401);
      expect(response.body.message).toEqual("invalid token");
    });
  });
});
