const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { login, register } = require("../controllers/auth");
const { readAll, readOne, deleteOne, update } = require("../controllers/user");

//Authentication routes
router.post("/register", register);
router.post("/login", login);

//User routes
router.get("/users", readAll);
router.get("/user/:id", readOne);
router.patch("/user/:id", auth, update);
router.delete("/user/:id", auth, deleteOne);

//Other routes
router.get("*", (req, res) => {
  res.status(404).send({ error: "404 Not Found" });
});

module.exports = router;
