const express = require("express");
const router = express.Router();
const Templates = require("../services/templates");
const {
  register,
  login,
  protect,
  restrictTo,
  restrictUser,
  forgotPassword,
  resetPassword,
  updatePassword
} = require("../controllers/authController");

const templates = new Templates();
// STATIC ROUTES

router.route("/").get(templates.home);

router.route("/index").get((req, res) => {
  res.redirect(302, "/");
});

router.route("/about").get(templates.about);

router.route("/contact").get(templates.contact);

router.route("/login").get(templates.login).post(login);

router.route("/register").get(templates.register).post(register);


//AUTH ROUTES

router
  .route("/auth/dashboard")
  .get(protect, restrictTo("admin", "user"), (req, res) => {
    res.render("auth/index", {
      user: req.user,
    });
  });


//ADMIN ROUTES

module.exports = router;
