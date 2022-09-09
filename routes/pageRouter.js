import express from "express";
import * as pageController from "../controller/pageController.js";
import * as autMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(autMiddleware.authenticateToken, pageController.getIndexPage);
router.route("/about").get(pageController.getAboutPage);
router.route("/register").get(pageController.userRegister);
router.route("/login").get(pageController.userLogin);
router.route("/logout").get(pageController.getLogout);

export default router;