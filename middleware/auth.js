const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const header = req.header("Authorization");

  if (!header)
    return res.status(401).send({ error: { message: "Invalid Token" } });
  const token = header.replace("Bearer ", "");
  if (!token)
    return res.status(401).send({ error: { message: "Invalid Token" } });

  try {
    const verified = jwt.verify(token, "secret");
    req.user = verified;
    //pengecekan data user dimana user yang melakukan CRUD sesuai dengan login JWT dan tidak bisa merubah data user lain
    if (req.user._id !== req.params.id)
      return res.status(402).send({ message: "Unauthorized" });
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: { message: "Invalid Token" } });
  }
};
