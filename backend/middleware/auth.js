/**
 * Authentication middleware for protecting routes
 */

// Ensure user is authenticated
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: 'Unauthorized. Please login to access this resource.' });
  };
  
  // Check for specific roles
  exports.hasRole = (roles) => {
    return (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized. Please login to access this resource.' });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden. You do not have permission to access this resource.' });
      }
      
      next();
    };
  };