import { successResponse, errorResponse } from "../helpers";
import RegisterStudents from "../services/RegisterStudents";
import GetCommonStudentsList from "../services/GetCommonStudentsList";
import _ from "lodash";

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

export const commonstudentslist = async (req, res) => {
  try {
    const service = new GetCommonStudentsList(req.query);
    const list = await service.call();
    const filterEdList = _.intersectionBy(...list, "email").map(
      (val) => val.email
    );

    return successResponse(req, res, { students: filterEdList }, 200);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
