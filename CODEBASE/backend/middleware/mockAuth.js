const mockAuth = (req, res, next) => {
  req.user = { id: 7, role: "user" };
  next();
};

module.exports = mockAuth;
