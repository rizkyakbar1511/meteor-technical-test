const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/user");

exports.login = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) res.status(400).send({ error: error.details[0].message });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(422).send({ error: "Invalid Login" });
    const passSync = bcrypt.compareSync(password, user.password);
    if (!passSync) return res.status(422).send({ error: "Invalid Login" });

    const token = jwt.sign({ _id: user._id }, "secret", {
      expiresIn: "1h",
    });
    res.status(201).send({
      user: {
        _id: user._id,
        email,
        token,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.register = async (req, res) => {
  try {
    const schema = Joi.object({
      fullName: Joi.string().min(3).required(),
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(6).required(),
      gender: Joi.string().required(),
      address: Joi.string().min(10).required(),
    });
    const { error } = schema.validate(req.body);
    const { fullName, email, password, gender, address } = req.body;
    const userExists = await User.findOne({ email });

    if (error) return res.status(400).send({ error: error.details[0].message });
    if (userExists)
      return res.status(422).send({ error: "E-mail already exists" });

    const user = new User({
      fullName,
      email,
      password: bcrypt.hashSync(password, 8),
      gender,
      address,
    });
    await user.save();

    res.status(201).send({
      user: {
        _id: user._id,
        email,
      },
    });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
