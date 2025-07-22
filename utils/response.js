export function sendResponse(
  res,
  { statusCode = 200, success = true, message = "", data = null }
) {
  return res.status(statusCode).json({ statusCode, success, message, data });
}
