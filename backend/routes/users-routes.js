const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

const {
  getUsers,
  userSignUp,
  userSignIn,
} = require("../controllers/users-controllers");

router.get("/", getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userSignUp
);

router.post("/login", userSignIn);

module.exports = router;
