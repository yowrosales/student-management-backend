const Student = require("../models").Student;
class SuspendStudent {
  constructor(request) {
    this.tutorData = {
      student: request.student,
    };
  }

  async call() {
    return Student.findOne({ where: { email: this.tutorData.student } }).then(
      (student) => {
        if (!student) {
          throw {
            name: "ValidationError",
            message: "Validation Failed",
            statusCode: 400,
            error: "Bad Request",
            details: [{ student: '"student" does not exist' }],
          };
        }
        student.update({ suspended: true });
      }
    );
  }
}

module.exports = SuspendStudent;
