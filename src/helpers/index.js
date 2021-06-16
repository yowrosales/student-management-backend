export const successResponse = (req, res, data = {}, code = 200) =>
  res.status(code).json({
    ...data,
  });

export const errorResponse = (
  req,
  res,
  name = "System Error",
  message = "Something went wrong",
  code = 500,
  error = {},
  details = []
) =>
  res.status(code).json({
    name,
    message,
    statusCode: code,
    error,
    details,
  });
