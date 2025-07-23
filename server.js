const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("api/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);

// Định nghĩa endpoint login
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = router.db.get("users").find({ email, password }).value();

  if (user) {
    res.json({
      success: true,
      role: user.role || "admin",
      message: "Login successful",
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }
});

server.use(router);
server.listen(5000, () => {
  console.log("JSON Server is running on port 5000");
});
