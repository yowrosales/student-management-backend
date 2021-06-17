require("mysql2/node_modules/iconv-lite").encodingExists("foo");
import RegisterStudents from "../services/RegisterStudents";
const request = require("supertest");
const app = require("../testEntry");
const faker = require("faker");

const { truncate } = require("../testHelper");
const tutorA = faker.internet.email();
const tutorB = faker.internet.email();

const studentA = faker.internet.email();
const studentB = faker.internet.email();
const studentC = faker.internet.email();

const tutorWithSuspendedStudent = faker.internet.email();
const suspendedStudentA = faker.internet.email();
const notSuspendedStudent = faker.internet.email();

const reqBodyWithSuspendStudent = {
  tutor: tutorWithSuspendedStudent,
  students: [suspendedStudentA, notSuspendedStudent],
};
let service = new RegisterStudents(reqBodyWithSuspendStudent);
service.call();

const reqBodyReceiveNotifications = {
  tutor: faker.internet.email(),
  students: [
    faker.internet.email(),
    faker.internet.email(),
    faker.internet.email(),
  ],
};
service = new RegisterStudents(reqBodyReceiveNotifications);
service.call();

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

        expect(students.sort()).toEqual([studentA, studentB, studentC].sort());
        expect(statusCode).toEqual(200);
        done();
      });

      it("should pass for multiple common tutor", async (done) => {
        const { statusCode, body } = await request(app)
          .get(`/api/commonstudents?tutor=${tutorA}&tutor=${tutorB}`)
          .send();
        const { students } = body;

        expect(students.sort()).toEqual([studentA, studentB].sort());
        expect(statusCode).toEqual(200);
        done();
      });
    });
  });

  describe("SuspendStudent API", () => {
    describe("Invalid body", () => {
      it("should fail if no student provided", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/suspend")
          .send();
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ student: '"student" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail for nonexistent student", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/suspend")
          .send({ student: "nonexistentstudent@tutor.com" });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ student: '"student" does not exist' }]);
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe("Valid body", () => {
      it("should pass for existing student", async (done) => {
        const { statusCode } = await request(app)
          .post("/api/suspend")
          .send({ student: suspendedStudentA });
        expect(statusCode).toEqual(204);
        done();
      });
    });
  });

  describe("ReceiveNotifications API", () => {
    describe("Invalid body", () => {
      it("should fail if tutor is empty", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/retrievenotifications")
          .send({ notifications: "Hello guys" });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if tutor is an empty string", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/retrievenotifications")
          .send({ tutor: "", notifications: "Hello guys" });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([
          { tutor: '"tutor" is not allowed to be empty' },
        ]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if notification is empty", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/retrievenotifications")
          .send({ tutor: "tutor@empty.com" });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([
          { notification: '"notification" is required' },
        ]);
        expect(statusCode).toEqual(400);
        done();
      });

      it("should fail if notification is an empty string", async (done) => {
        const { statusCode, body } = await request(app)
          .post("/api/retrievenotifications")
          .send({ tutor: "tutor@empty.com", notification: "" });
        const { message, details } = body;
        expect(message).toEqual("Validation Failed");
        expect(details).toEqual([
          { notification: '"notification" is not allowed to be empty' },
        ]);
        expect(statusCode).toEqual(400);
        done();
      });
    });
  });

  describe("Valid body", () => {
    it("should fail if tutor doesnt exist", async (done) => {
      const { statusCode, body } = await request(app)
        .post("/api/retrievenotifications")
        .send({
          tutor: "nonexistentstudent@tutor.com",
          notification: "Hello guys! welcome @existinguser@tutor.com",
        });
      const { message, details } = body;
      expect(message).toEqual("Validation Failed");
      expect(details).toEqual([{ tutor: '"tutor" does not exist' }]);
      expect(statusCode).toEqual(400);
      done();
    });

    it("should pass and retrieve students that belongs to the tutor", async (done) => {
      const { statusCode, body } = await request(app)
        .post("/api/retrievenotifications")
        .send({
          tutor: reqBodyReceiveNotifications.tutor,
          notification: "Hello guys! welcome",
        });
      const { students } = body;
      expect(students.sort()).toEqual(
        reqBodyReceiveNotifications.students.sort()
      );
      expect(statusCode).toEqual(200);
      done();
    });

    it("should pass and retrieve students that belongs to the tutor and mentioned students", async (done) => {
      const { statusCode, body } = await request(app)
        .post("/api/retrievenotifications")
        .send({
          tutor: reqBodyReceiveNotifications.tutor,
          notification: `Hello guys! welcome @${studentA} @${studentB}`,
        });
      const { students } = body;
      expect(students.sort()).toEqual(
        reqBodyReceiveNotifications.students.concat([studentA, studentB]).sort()
      );
      expect(statusCode).toEqual(200);
      done();
    });

    it("should pass and retrieve students that are not suspended only", async (done) => {
      const { statusCode, body } = await request(app)
        .post("/api/retrievenotifications")
        .send({
          tutor: reqBodyWithSuspendStudent.tutor,
          notification: `Hello guys! welcome @${studentA} @${studentB} except ${suspendedStudentA}`,
        });
      const { students } = body;
      expect(students.sort()).toEqual(
        [studentA, studentB, notSuspendedStudent].sort()
      );
      expect(statusCode).toEqual(200);
      done();
    });
  });
});
