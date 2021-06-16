const Tutor = require("../models").Tutor;
const Student = require("../models").Student;
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
