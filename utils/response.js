export function sendResponse(res, { statusCode, success, message, data }) {
  return res
    .status(200)                           
    .json({ statusCode, success, message, data });
}
