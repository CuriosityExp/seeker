const app = require("../app");
const request = require("supertest");
const { User } = require("../models");
const { sequelize } = require("../models");
const { SignToken } = require("../helpers/jwt");
const Scrap = require("../mongo-models/scrap");
const Job = require("../mongo-models/job");
const Bookmark = require("../mongo-models/bookmark");
const { queryInterface } = sequelize;
const { run, client, getDb } = require("../config/mongo");
const { ObjectId } = require("mongodb");
const Todo = require("../mongo-models/todo");

const mockJobs = [
  {
    url: "https://glints.com/id/opportunities/jobs/marketing/e1a5948a-8430-4e77-8cb6-dd62179eeb1b?utm_referrer=explore",
    logo: "https://images.glints.com/unsafe/glints-dashboard.s3.amazonaws.com/company-logo/14fb8b18b232b7133eb000b054ed52f9.jpg",
    jobTitle: "Marketing",
    companyName: "PT Jasa Boga Raya",
    companyLocation: "Babakan Madang, Kab. Bogor, Jawa Barat, Indonesia",
    salary: "IDR2.000.000 - 4.000.000",
  },
  {
    url: "https://glints.com/id/opportunities/jobs/marketing/e1a5948a-8430-4e77-8cb6-dd62179eeb1b?utm_referrer=explore",
    logo: "https://images.glints.com/unsafe/glints-dashboard.s3.amazonaws.com/company-logo/14fb8b18b232b7133eb000b054ed52f9.jpg",
    jobTitle: "Marketing",
    companyName: "PT Jasa Boga Raya",
    companyLocation: "Babakan Madang, Kab. Bogor, Jawa Barat, Indonesia",
    salary: "IDR2.000.000 - 4.000.000",
  },
];

const mockDetail = {
  jobDesc: [
    "-\tDesign and create enticing 2D assets and motion graphics for KRIYA video contents.",
    "Create and deliver 2D animation and motion graphics in various media including social media, web and mobile.",
    "High level knowledge of Adobe Creative applications (Premiere Pro, After Effect, Photoshop, Illustrator).",
    "Collaborate with art and creative teams to understand content, project scope and objectives.",
    "Research and analyze best design techniques and solutions to create motion graphics.",
    "Assists in designing and creating storyboards.",
    "Participate in brainstorming session to share new design perspectives and ideas.",
    "Ensure compliance with company guidelines, deadlines, and design standards. \n\n",
  ],
  minimumSkills: [
    "Skills",
    "Graphic Design",
    "Adobe Illustrator",
    "Adobe After Effects",
    "Adobe Premiere Pro",
    "2D Animation",
    "Adobe Photoshop",
  ],
};
const mockErrMsg = { message: `Internal server error` };

const mockKalibrrJob = {
  url: "https://www.kalibrr.com/c/finaccel/jobs/158920/sr-ios-engineer",
  logo: "https://rec-data.kalibrr.com/logos/GL5U7AHLWUVEDQ7DPLLK-59db02a3.png",
  jobTitle: "Sr. iOS Engineer",
  companyName: "FinAccel",
  companyLocation: "South Jakarta, Indonesia",
  salary: "",
};
const mockGlintsJob = {
  url: "https://glints.com/id/opportunities/jobs/2d-animator/998ebe62-e632-410e-9474-c27377c57553?utm_referrer=explore",
  logo: "https://images.glints.com/unsafe/glints-dashboard.s3.amazonaws.com/company-logo/67770578ad593d03c6bcc7c693666db9.png",
  jobTitle: "2D Animator",
  companyName: "Kriya People",
  companyLocation: "Tanah Abang, Jakarta Pusat, DKI Jakarta, Indonesia",
  salary: "IDR7.000.000",
};
const mockKarirJob = {
  url: "https://karir.com/opportunities/1385506",
  logo: "https://karir-production.nos.jkt-1.neo.id/logos/47/8790347/N5dc6590cd2575.jpg",
  jobTitle: "Web Developer - Full Stack | HIS, KiosK, Web Portal",
  companyName: "PT Terakorp Indonesia",
  companyLocation: "head office - Bandung",
  salary: "IDR 3.500.000 - 4.100.000",
};

let validToken;
const tester = {
  username: "tester",
  email: "tester@mail.com",
  password: "test123",
};

beforeAll(async () => {
  try {
    await run("testDB");
    await User.destroy({
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });
    const res = await User.create(tester);
    const job = await Job.create({ ...mockGlintsJob, ...mockDetail });
    const bookmark = await Bookmark.create({UserId: res.id, jobId: new ObjectId(job._id), customTitle: job.jobTitle })
    const todo = await Todo.create({  })
    validToken = SignToken({ id: res.id });
  } catch (error) {
    console.log(error);
  }
});

beforeEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  try {
    await getDb().dropDatabase("testDB")
    await client.close();
    await User.destroy({
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
    test("401 not found GET todos by UserId should return Invalid Token", (done) => {
      request(app)
        .put("/todos")
        .set("access_token", "validToken")
        .then((res) => {
          const { body, status } = res;
          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "todos not found");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe.only("TEST ENDPOINT /todos POST", () => {
    test("201 Success POST to database todos", (done) => {
      jest.spyOn(openai,"createCompletion").mockResolvedValue({data:{choices:[{text:`[
        {"task":"go to a boot camp"},
        {"task":"make a cv"}
      ]`}]}});
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

  describe.only("TEST ENDPOINT /todos PUT", () => {
    test("200 Success UPDATE status in todos", (done) => {
      request(app) // ambil dari aapp
        .put("/todos/1") // methood yang digunakan
        .set("access_token", validToken)
        .then((res) => {
          console.log(res)
          const { body, status } = res;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message", "todo has been updated");
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