// this is a manual version of what passport already does!

// function isAuthenticated(req, res, next) {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     res.status(401);
//     throw new Error("Not authorized to view this content");
//   }
//   console.log(authorization);

//   try {
//     const token = authorization.split(" ")[1];
//     const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//     req.payload = payload;
//   } catch (err) {
//     res.status(401);
//     if (err.name === "TokenExpiredError") {
//       throw new Error(err.name);
//     }
//     throw new Error("Not authorized to view this content");
//   }

//   return next();
// }

// module.exports = {
//   isAuthenticated,
// };
