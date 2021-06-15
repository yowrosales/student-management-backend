import { successResponse, errorResponse } from "../helpers";
import RegisterStudents from "../services/RegisterStudents";

export const register = async (req, res) => {
  try {
    const service = new RegisterStudents(req.body);
    const tutor = await service.call();

    return successResponse(
      req,
      res,
      { data: tutor.dataValues, message: "tutor created succesfully" },
      204
    );
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
