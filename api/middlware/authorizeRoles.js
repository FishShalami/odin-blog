// Middleware to authorize users based on their roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by authenticateWithRefresh middleware)
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error:
          "Insufficient permissions. Required role(s): " +
          allowedRoles.join(", "),
      });
    }

    // User has required role, proceed to next middleware
    next();
  };
};

// Helper function to check if user is an author
const requireAuthor = authorizeRoles("AUTHOR");

// Helper function to check if user is either USER or AUTHOR (any authenticated user)
const requireUser = authorizeRoles("USER", "AUTHOR");

module.exports = {
  authorizeRoles,
  requireAuthor,
  requireUser,
};
