module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("TutorsStudents", {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      tutorId: {
        type: Sequelize.UUID,
        primaryKey: false,
      },
      studentId: {
        type: Sequelize.UUID,
        primaryKey: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("TutorsStudents");
  },
};
