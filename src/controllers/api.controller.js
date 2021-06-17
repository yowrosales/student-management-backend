import { successResponse, errorResponse } from "../helpers";
import RegisterStudents from "../services/RegisterStudents";
import GetCommonStudentsList from "../services/GetCommonStudentsList";
import SuspendStudent from "../services/SuspendStudent";
import RetrieveNotifications from "../services/RetrieveNotifications";
import _ from "lodash";

export const register = async (req, res) => {
  try {
    const service = new RegisterStudents(req.body);

    return successResponse(req, res, await service.call(), 204);
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

export const suspendStudent = async (req, res) => {
  try {
    const service = new SuspendStudent(req.body, errorResponse);

    return successResponse(req, res, await service.call(), 204);
  } catch (error) {
    return errorResponse(
      req,
      res,
      error.name,
      error.message,
      error.statusCode,
      error.error,
      error.details
    );
  }
};

export const retrieveNotifications = async (req, res) => {
  try {
    const service = new RetrieveNotifications(req.body, errorResponse);
    const filterEdList = await service.call();

    return successResponse(req, res, { students: filterEdList }, 200);
  } catch (error) {
    return errorResponse(
      req,
      res,
      error.name,
      error.message,
      error.statusCode,
      error.error,
      error.details
    );
  }
};
