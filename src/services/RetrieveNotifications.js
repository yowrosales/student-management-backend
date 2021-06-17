const Student = require("../models").Student;
const Tutor = require("../models").Tutor;
import _ from "lodash";

class RetrieveNotifications {
  constructor(request) {
    this.tutorData = {
      email: request.tutor,
      otherStudents: this.getEmails(request.notification),
    };
  }

  getEmails = (str) => {
    return str.match(/([^@][a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gm);
  };

  async call() {
    return Promise.all([
      Tutor.findOne({
        where: { email: this.tutorData.email },
        include: {
          where: { suspended: false },
          model: Student,
          as: "student",
          attributes: ["email"],
        },
      }).then(async (tutor) => {
        if (!tutor) {
          throw {
            name: "ValidationError",
            message: "Validation Failed",
            statusCode: 400,
            error: "Bad Request",
            details: [{ tutor: '"tutor" does not exist' }],
          };
        }
        return tutor.student;
      }),
      Student.findAll({
        where: { email: this.tutorData.otherStudents, suspended: false },
        attributes: ["email"],
      }),
    ]).then((result) => {
      return _.unionBy(...result, "email").map((val) => val.email);
    });
  }
}

module.exports = RetrieveNotifications;
