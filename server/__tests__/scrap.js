const app = require("../user/app");
const request = require("supertest");
const { User } = require("../user/models");
const { SignToken } = require("../user/helpers/jwt");
const { sequelize } = require("../user/models");
const Scrap = require("../user/mongo-models/scrap");
const Job = require("../user/mongo-models/job");
const Bookmark = require("../user/mongo-models/bookmark");
const { queryInterface } = sequelize;
const { run, client } = require("../user/config/mongo");

let validToken;
const tester = {
  username: "tester",
  email: "tester@mail.com",
  password: "test123",
};

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

beforeAll(async (done) => {
  try {
    run("testDB");
    const res = await User.create(tester);
    validToken = SignToken({ id: res.id });
    done();
  } catch (error) {
    done(error);
  }
});

beforeEach(() => {
  jest.restoreAllMocks();
});
afterAll(async (done) => {
  try {
    await client.close();
    queryInterface.bulkDelete("Users", null, {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });
    done()
  } catch (error) {
    done(error)
  }

});

describe("/fetchjobs manual with query and 3 job portal", () => {
  test("200 Success Fetch kalibrr should return array of object", (done) => {
    Scrap.kalibrrUrl = jest.fn().mockResolvedValue(mockJobs);
    request(app)
      .post("/fetchjobskalibrr")
      .send({ query: "frontend" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        // console.log(body);
        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Array));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  test("200 Success Fetch karir should return array of object", (done) => {
    Scrap.karirUrl = jest.fn().mockResolvedValue(mockJobs);
    request(app)
      .post("/fetchjobskarir")
      .send({ query: "frontend" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        // console.log(body);
        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Array));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  test("200 Success Fetch glints should return array of object", (done) => {
    Scrap.glintsUrl = jest.fn().mockResolvedValue(mockJobs);
    request(app)
      .post("/fetchjobsglints")
      .send({ query: "frontend" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        // console.log(body);
        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Array));
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  test("401 Error Fetch glints should return message Invalid Token", (done) => {
    Scrap.glintsUrl = jest.fn().mockRejectedValue(mockErrMsg);
    request(app)
      .post("/fetchjobsglints")
      .send({ query: "frontend" })
      .then((res) => {
        const { body, status } = res;
        // console.log(body);
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid Token");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  test("401 Error Fetch kalibrr should return message Invalid Token", (done) => {
    Scrap.glintsUrl = jest.fn().mockRejectedValue(mockErrMsg);
    request(app)
      .post("/fetchjobskalibrr")
      .send({ query: "frontend" })
      .then((res) => {
        const { body, status } = res;
        // console.log(body);
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid Token");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  test("401 Error Fetch karir should return message Invalid Token", (done) => {
    Scrap.kalibrrUrl = jest.fn().mockRejectedValue(mockErrMsg);
    request(app)
      .post("/fetchjobskarir")
      .send({ query: "frontend" })
      .then((res) => {
        const { body, status } = res;
        // console.log(body);
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid Token");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  test("500 Error Fetch glints should return array of object", (done) => {
    Scrap.glintsUrl = jest.fn().mockRejectedValue(mockErrMsg);
    request(app)
      .post("/fetchjobsglints")
      .send({ query: "frontend" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        // console.log(body);
        expect(status).toBe(500);
        expect(body).toHaveProperty("message", "Internal server error");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  test("500 Error Fetch kalibrr should return array of object", (done) => {
    Scrap.kalibrrUrl = jest.fn().mockRejectedValue(mockErrMsg);
    request(app)
      .post("/fetchjobskalibrr")
      .send({ query: "frontend" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        // console.log(body);
        expect(status).toBe(500);
        expect(body).toHaveProperty("message", "Internal server error");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  test("500 Error Fetch karir should return array of object", (done) => {
    Scrap.karirUrl = jest.fn().mockRejectedValue(mockErrMsg);
    request(app)
      .post("/fetchjobskarir")
      .send({ query: "frontend" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        // console.log(body);
        expect(status).toBe(500);
        expect(body).toHaveProperty("message", "Internal server error");
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});

describe("TEST ENDPOINT /bookmarks POST", () => {
  test("200 Success POST Glints Job Bookmarks by UserId", (done) => {
    Scrap.glintsDetail = jest.fn().mockResolvedValue(mockDetail);
    Job.create = jest
      .fn()
      .mockResolvedValue({ _id: "testJobId", ...mockGlintsJob, ...mockDetail });
    Job.findByPk = jest.fn().mockResolvedValue(Job.create);
    Bookmark.create = jest.fn().mockResolvedValue({
      UserId: 1,
      jobId: "jobid_test",
      customTitle: "job name",
    });
    request(app)
      .post("/bookmarks")
      .send(mockGlintsJob)
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(201);
        expect(body).toHaveProperty("UserId", 1);
        expect(body).toHaveProperty("jobId", expect.any(String));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("200 Success POST Kalibrr Job Bookmarks by UserId", (done) => {
    Scrap.kalibrrDetail = jest.fn().mockResolvedValue(mockDetail);
    Job.create = jest.fn().mockResolvedValue({
      _id: "testJobId",
      ...mockKalibrrJob,
      ...mockDetail,
    });
    Job.findByPk = jest.fn().mockResolvedValue(Job.create);
    Bookmark.create = jest.fn().mockResolvedValue({
      UserId: 1,
      jobId: "jobid_test",
      customTitle: "job name",
    });
    request(app)
      .post("/bookmarks")
      .send(mockKalibrrJob)
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(201);
        expect(body).toHaveProperty("UserId", 1);
        expect(body).toHaveProperty("jobId", expect.any(String));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("200 Success POST Karir Job Bookmarks by UserId", (done) => {
    Scrap.karirDetail = jest.fn().mockResolvedValue(mockDetail);
    Job.create = jest
      .fn()
      .mockResolvedValue({ _id: "testJobId", ...mockKarirJob, ...mockDetail });
    Job.findByPk = jest.fn().mockResolvedValue(Job.create);
    Bookmark.create = jest.fn().mockResolvedValue({
      UserId: 1,
      jobId: "jobid_test",
      customTitle: "job name",
    });
    request(app)
      .post("/bookmarks")
      .send(mockKarirJob)
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(201);
        expect(body).toHaveProperty("UserId", 1);
        expect(body).toHaveProperty("jobId", expect.any(String));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("401 Invalid Token Detail POST Karir Job Bookmarks by UserId", (done) => {
    Scrap.karirDetail = jest.fn().mockResolvedValue(mockDetail);
    Job.create = jest
      .fn()
      .mockResolvedValue({ _id: "testJobId", ...mockKarirJob, ...mockDetail });
    Job.findByPk = jest.fn().mockResolvedValue(Job.create);
    Bookmark.create = jest.fn().mockResolvedValue({
      UserId: 1,
      jobId: "jobid_test",
      customTitle: "job name",
    });
    request(app)
      .post("/bookmarks")
      .send(mockKarirJob)
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
  test("401 Invalid Token Detail POST Kalibrr Job Bookmarks by UserId", (done) => {
    Scrap.kalibrrDetail = jest.fn().mockResolvedValue(mockDetail);
    Job.create = jest.fn().mockResolvedValue({
      _id: "testJobId",
      ...mockKalibrrJob,
      ...mockDetail,
    });
    Job.findByPk = jest.fn().mockResolvedValue(Job.create);
    Bookmark.create = jest.fn().mockResolvedValue({
      UserId: 1,
      jobId: "jobid_test",
      customTitle: "job name",
    });
    request(app)
      .post("/bookmarks")
      .send(mockKalibrrJob)
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
  test("401 Invalid Token Detail POST Glints Job Bookmarks by UserId", (done) => {
    Scrap.glintsDetail = jest.fn().mockResolvedValue(mockDetail);
    Job.create = jest
      .fn()
      .mockResolvedValue({ _id: "testJobId", ...mockGlintsJob, ...mockDetail });
    Job.findByPk = jest.fn().mockResolvedValue(Job.create);
    Bookmark.create = jest.fn().mockResolvedValue({
      UserId: 1,
      jobId: "jobid_test",
      customTitle: "job name",
    });
    request(app)
      .post("/bookmarks")
      .send(mockKarirJob)
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

describe("TEST ENDPOINT /bookmarks UPDATE", () => {
  test("200 Success UPDATE Bookmarks by UserId", (done) => {
    Bookmark.findByPk = jest.fn().mockResolvedValue({
      _id: "Test Bookmark Id",
      UserId: 1,
      jobId: "Test Job Id",
      customTitle: "Test Title lama",
    });
    Bookmark.update = jest.fn().mockResolvedValue({
      bookmarkId: Bookmark.findByPk._id,
      customTitle: "Test Custom Baru",
    });
    request(app)
      .put("/bookmarks")
      .send({ bookmarkId: "Test Bookmark Id", customTitle: "Test Custom Baru" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "Success update bookmark title");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("400 Bad Request UPDATE Bookmarks by UserId should return BookmarkId required", (done) => {
    request(app)
      .put("/bookmarks")
      .send({ customTitle: "Test Custom Baru" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "BookmarkId required");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("400 Bad Request UPDATE Bookmarks by UserId should return CustomTitle required", (done) => {
    request(app)
      .put("/bookmarks")
      .send({ bookmarkId: "Test Bookmark Id" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(400);
        expect(body).toHaveProperty(
          "message",
          "Custom Bookmark Title required"
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("401 Unauthorized UPDATE Bookmarks by UserId should return Invalid Token", (done) => {
    request(app)
      .put("/bookmarks")
      .send({ bookmarkId: "Test Bookmark Id" })
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
  test("404 Not Found UPDATE Bookmarks by UserId should return Bookmark Not Found", (done) => {
    Bookmark.findByPk = jest.fn().mockResolvedValue(undefined);
    request(app)
      .put("/bookmarks")
      .send({ bookmarkId: "Test Bookmark Id", customTitle: "Test Custom Baru" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Bookmark not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("405 Forbidden UPDATE Bookmarks by UserId should return Bookmark Not Found", (done) => {
    Bookmark.findByPk = jest.fn().mockResolvedValue({
      _id: "Test Bookmark Id",
      UserId: 1,
      jobId: "Test Job Id",
      customTitle: "Test Title lama",
    });
    Bookmark.update = jest.fn().mockResolvedValue(undefined);
    request(app)
      .put("/bookmarks")
      .send({ bookmarkId: "Test Bookmark Id", customTitle: "Test Custom Baru" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(405);
        expect(body).toHaveProperty("message", "Failed update Bookmark Title");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("TEST ENDPOINT /bookmarks DELETE", () => {
  test("200 Success DELETE Bookmarks by BookmarkId", (done) => {
    Bookmark.findByPk = jest.fn().mockResolvedValue({
      _id: "Test Bookmark Id",
      UserId: 1,
      jobId: "Test Job Id",
      customTitle: "Test Title lama",
    });
    Bookmark.destroy = jest.fn().mockResolvedValue("OK");
    request(app)
      .delete("/bookmarks")
      .send({ bookmarkId: "Test Bookmark Id" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "Success delete bookmark");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("400 Bad Request DELETE Bookmarks by BookmarkId", (done) => {
    request(app)
      .delete("/bookmarks")
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Bookmark Id is required");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  test("401 Bad Request DELETE Bookmarks by BookmarkId", (done) => {
    request(app)
      .delete("/bookmarks")
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
  test("404 Not Found DELETE Bookmarks by BookmarkId", (done) => {
    Bookmark.findByPk = jest.fn().mockResolvedValue(undefined);
    request(app)
      .delete("/bookmarks")
      .send({ bookmarkId: "Test Bookmark Id" })
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Bookmark not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe("TEST ENDPOINT /bookmarks GET", () => {
  test("200 Success GET Bookmarks by UserId", (done) => {
    Bookmark.findAll = jest
      .fn()
      .mockResolvedValue([
        { _id: "Bookmark Id", jobId: "Job Id", UserId: "User id" },
      ]);
    request(app)
      .get("/bookmarks")
      .set("access_token", validToken)
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(200);
        expect(body).toEqual(expect.any(Array));
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  test("401 Success GET Bookmarks by UserId", (done) => {
    request(app)
      .get("/bookmarks")
      .then((res) => {
        const { body, status } = res;
        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid Token");
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
