const jwt = require('jsonwebtoken');

// Unlike requireAuth, this never blocks the request. If a valid token is
// present, req.user is set. If not (missing, malformed, expired), req.user
// stays undefined and the route continues as an anonymous request.
// Useful for public routes that behave slightly differently when the
// viewer happens to be logged in (e.g. "did I like this post?").
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme === 'Bearer' && token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // ignore invalid/expired token - just proceed as anonymous
    }
  }

  next();
}

module.exports = optionalAuth;

