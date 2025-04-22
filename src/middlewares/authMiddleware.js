const cookie = require("cookie");

const authMiddleware = (req, res, next) => {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    req.user = null;
    return next();
  }

  // Parse the cookies
  const cookies = cookie.parse(cookieHeader);

  // Extract values from the cookies
  const authorization = cookies.Authorization || null;
  const spotifyAuthorization = cookies.SpotifyAuthorization || null;
  const userId = cookies.UserID || null;

  // Attach the extracted values to the request object
  req.user = {
    authorization,
    spotifyAuthorization,
    userId,
  };

  next();
};

module.exports = authMiddleware;
