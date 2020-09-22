const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  getPlaceById,
  getPlacesByUserId,
  createNewPlace,
  updateExistingPlace,
  deleteExistingPlace,
} = require("../controllers/places-controllers");

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlacesByUserId);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updateExistingPlace
);

router.delete("/:pid", deleteExistingPlace);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("address").not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  createNewPlace
);

module.exports = router;
