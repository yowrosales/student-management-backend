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
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
