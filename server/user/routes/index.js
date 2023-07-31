const express = require("express");
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.use(authentication);

router.get("/users", UserController.allUser);
router.patch("/users", UserController.upgradeToken);
router.get("/users/:id", UserController.findUser);
router.delete("/users/:id", UserController.deleteUser);
router.post("/users/payment-midtrans", UserController.paymentWithMidtrans);

router.get("/people", UserController.getProfile);
router.get("/people/:id", UserController.getProfileById);
router.put("/people/:id", UserController.updateProfile);

router.get("/educations", UserController.allEducation);
router.post("/educations", UserController.createEducation);
router.get("/educations/:id", UserController.getEducationById);
router.put("/educations/:id", UserController.updateEducation);
router.delete("/educations/:id", UserController.deleteEducation);

router.get("/work-experience", UserController.allWorkExperience);
router.post("/work-experience", UserController.createWorkExperience);
router.get("/work-experience/:id", UserController.getWorkExperienceById);
router.put("/work-experience/:id", UserController.updateWorkExperience);
router.delete("/work-experience/:id", UserController.deleteWorkExperience);

module.exports = router;
