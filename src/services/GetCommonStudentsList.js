const Tutor = require("../models").Tutor;
class GetCommonStudentsList {
  constructor(request) {
    this.tutorData = {
      email: request.tutor,
    };
  }

  async call() {
    return Tutor.findAll({
      where: { email: this.tutorData.email },
    }).then((tutors) => {
      if (tutors.length <= 0) {
        throw {
          name: "ValidationError",
          message: "Validation Failed",
          statusCode: 400,
          error: "Bad Request",
          details: [{ tutor: '"tutor" does not exist' }],
        };
      }

      return Promise.all(
        tutors.map((tutor) => {
          return tutor.getStudent({
            raw: true,
            attributes: ["email"],
            order: [["id", "asc"]],
          });
        })
      );
    });
  }
}

module.exports = GetCommonStudentsList;
