const User = require("../models/user");
const Joi = require("joi");

exports.readAll = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).send({ users });
  } catch (error) {
    return res.status(400).send({ error: "Internal Server Error" });
  }
};

exports.readOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(400).send({
        error: "User not found",
        reason: `User with _id ${req.params.id} not exists`,
      });
    return res.status(200).send({ user });
  } catch (error) {
    return res.status(400).send({ error: "Internal Server Error" });
  }
};

exports.update = async (req, res) => {
  try {
    const schema = Joi.object({
      fullName: Joi.string().min(3),
      email: Joi.string().email().min(6),
      password: Joi.string().min(6),
      gender: Joi.string(),
      address: Joi.string().min(10),
    });
    const { id } = req.params;
    const updates = req.body;
    const options = { new: true };
    const { error } = schema.validate(updates);
    if (error) return res.status(400).send({ error: error.details[0].message });
    const user = await User.findOneAndUpdate(id, updates, options);
    if (!user)
      return res.status(400).send({
        error: "Update failed !",
        reason: `User with _id ${req.params.id} not exists`,
      });
    return res
      .status(200)
      .send({ message: `Update success !`, detail: { user } });
  } catch (error) {
    return res.status(400).send({ error: "Internal Server Error" });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const user = await User.findOneAndRemove({ _id: req.params.id });
    if (!user)
      return res.status(400).send({
        error: "Delete failed !",
        reason: `User with _id ${req.params.id} not exists`,
      });
    return res
      .status(200)
      .send({ message: `User with _id ${req.params.id} has been removed` });
  } catch (error) {
    return res.status(400).send({ error: "Internal Server Error" });
  }
};
