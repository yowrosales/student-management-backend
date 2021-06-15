const Tutor = require("../models").Tutor;
const Student = require("../models").Student;
class RegisterStudents {
  constructor(request) {
    this.tutorData = {
      email: request.tutor,
      students: request.students,
    };
  }

  async call() {
    return Tutor.findOrCreate({
      where: { email: this.tutorData.email },
    }).then((tutor) => {
      const [tutorObj] = tutor;
      this.tutorData.students.forEach((student) => {
        Student.findOrCreate({ where: { email: student } }).then((student) => {
          const [studentObj, isNew] = student;
          tutorObj.addStudent(studentObj.id);
        });
      });
      return tutorObj;
    });
  }
}

module.exports = RegisterStudents;
