const express = require("express");
const router = express.Router();
const User = require("../models/users.js");

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user === null) {
      return res.status(404).json({ message: "User does not exist!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

// Getting all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one
router.get("/:id", getUser, (req, res) => {
  res.send(res.user);
});

// Login
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOneAndUpdate(
      { email, password },
      { lastLoginTime: new Date().getTime() },
      { returnOriginal: false }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating one
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/block/:id", async (req, res) => {
  const arrayOfIds = req.params.id.split("ID");
  try {
    for (let i = 0; i < arrayOfIds.length; i++) {
      await User.findOneAndUpdate(
        { _id: arrayOfIds[i] },
        {
          status: false,
        }
      );
    }
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/unblock/:id", async (req, res) => {
  const arrayOfIds = req.params.id.split("ID");
  try {
    for (let i = 0; i < arrayOfIds.length; i++) {
      await User.findOneAndUpdate(
        { _id: arrayOfIds[i] },
        {
          status: true,
        }
      );
    }
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const userIds = req.params.id.split("ID");
  let users;
  try {
    for (let i = 0; i < userIds.length; i++) {
      await User.findByIdAndDelete(userIds[i]);
    }
    users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ ...err });
  }
});

module.exports = router;
