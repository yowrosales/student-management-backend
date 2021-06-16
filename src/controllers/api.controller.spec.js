require("mysql2/node_modules/iconv-lite").encodingExists("foo");

const request = require("supertest");
const app = require("../testEntry");
const faker = require("faker");

const { truncate } = require("../testHelper");

const student = require("../models/student");
const tutorA = faker.internet.email();
const tutorB = faker.internet.email();

const studentA = faker.internet.email();
const studentB = faker.internet.email();
const studentC = faker.internet.email();

describe("Api Controller", () => {
  describe("Register API", () => {
    describe("Invalid body", () => {
      it("should fail without tutor ", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/register")
          .send();
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail without students ", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/register")
          .send({ tutor: "testTutor@tutor.com" });
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ students: '"students" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if tutor is not an email", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/register")
          .send({
            tutor: "tutorinvalid@.com",
            students: ["student1@student.com"],
          });
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" must be a valid email' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if students[0] are not in email format", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/register")
          .send({
            tutor: "tutorinvalid@tutor.com",
            students: ["student1@.com", "student2@tutor.com"],
          });
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ 0: '"students[0]" must be a valid email' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if students[1] are not in email format", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/register")
          .send({
            tutor: "tutorinvalid@tutor.com",
            students: ["student1@tutor.com", "student2"],
          });
        const { message, details } = body;

        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ 1: '"students[1]" must be a valid email' }]);
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe("Valid body", () => {
      const emailTutor = faker.internet.email();
      const emailStudents = [faker.internet.email(), faker.internet.email()];

      it("should pass for new tutor and students", async (done) => {
        const { statusCode } = await request(app)
          .post("/api/register")
          .send({
            tutor: tutorA,
            students: [studentA, studentB],
          });

        expect(statusCode).toEqual(204);
        done();
      });

      it("should pass for existing tutor and new students", async (done) => {
        const { statusCode } = await request(app)
          .post("/api/register")
          .send({
            tutor: tutorA,
            students: [studentC],
          });

        expect(statusCode).toEqual(204);
        done();
      });

      it("should pass for new tutor and old students", async (done) => {
        const { statusCode } = await request(app)
          .post("/api/register")
          .send({
            tutor: tutorB,
            students: [studentA, studentB],
          });

        expect(statusCode).toEqual(204);
        done();
      });
    });
  });

  describe("GetCommonStudents API", () => {
    describe("Invalid query", () => {
      it("should fail without tutor ", async (done) => {
        const { statusCode, body } = await request(app)
          .get("/api/commonstudents")
          .send();
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if tutor is not an email ", async (done) => {
        const { statusCode, body } = await request(app)
          .get("/api/commonstudents?tutor=yow@.com")
          .send();
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" must be a valid email' }]);
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe("Valid query", () => {
      it("should pass for single common tutor ", async (done) => {
        const { statusCode, body } = await request(app)
          .get(`/api/commonstudents?tutor=${tutorA}`)
          .send();
        const { students } = body;

        expect(students).toEqual([studentA, studentB, studentC]);
        expect(statusCode).toEqual(200);
        done();
      });

      it("should pass for multiple common tutor", async (done) => {
        const { statusCode, body } = await request(app)
          .get(`/api/commonstudents?tutor=${tutorA}&tutor=${tutorB}`)
          .send();
        const { students } = body;

        expect(students).toEqual([studentA, studentB]);
        expect(statusCode).toEqual(200);
        done();
      });
    });
  });

  describe("SuspendStudent API", () => {
    describe("Invalid body", () => {
      it("should fail for nonexistent student", async (done) => {
        done();
      });
    });

    describe("Valid body", () => {
      it("should pass for existing student", async (done) => {
        done();
      });
    });
  });

  describe("ReceiveNotifications API", () => {
    describe("Invalid body", () => {
      it("should fail if tutor is empty", async (done) => {
        done();
      });

      it("should fail if notification is empty", async (done) => {
        done();
      });
    });
  });

  describe("Valid body", () => {
    it("should fail if tutor doesnt exist", async (done) => {
      done();
    });

    it("should pass and retrieve students that belongs to the tutor", async (done) => {
      done();
    });

    it("should pass and retrieve students that belongs to the tutor and mentioned students", async (done) => {
      done();
    });

    it("should pass and retrieve students that are not suspended only", async (done) => {
      done();
    });
  });
});
