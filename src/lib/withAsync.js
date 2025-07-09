export function withAsync(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next); // ✅ next 추가!
    } catch (e) {
      next(e);
    }
  };
}
