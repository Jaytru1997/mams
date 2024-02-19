const { promisify } = require("util"); //built in node module
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const User = require("../models/userModel");
const {sendEmail} = require("../services/email");
const {asyncWrapper} = require("../utilities/async");
const AppError = require("../utilities/appError");
// const Settings = require("../models/admin/settingsModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode);
};

exports.register = asyncWrapper(async (req, res, next) => {
  // console.log(req.body);
  const message = "Your account has been successfully registered. You can login to the user dashboard by clicking the button below";

  const options = {
    title: "User Registration",
    email: req.body.email,
    subject: "New User SignUp",
    message,
    cta: "Log In",
    ctaLink: "https://keynigeria.org/login"
  };

  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
      conpassword: req.body.conpassword,
    });
    await sendEmail(options);

    createSendToken(user, 201, res);
    res.render("components/success", {success:{...options}});
    // return next(options);
  } catch (err) {
    console.log(err);
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password, user.password))) {
    return next(new AppError("Invalid email or password!", 401));
  }

  // const token = signToken(user._id);

  createSendToken(user, 200, res);

  // res.redirect(`${user.role}/index`)

  res.redirect('/auth/dashboard');

});

exports.protect = asyncWrapper(async (req, res, next) => {
  //get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // console.log(`token is ${token}`);

  if (!token) {
    // return next(new AppError("You are not logged in!", 401));
    res.render("components/error", {
      error: {
        code: 401,
        message: "Sorry, you are not logged in",
        cta: "Go to log in page",
        link: "/login",
      }
    })
  }

  //verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User no longer exists!", 401));
  }

  //check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  //grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action!", 403)
      );
    }
    next();
  };
};

exports.restrictUser = (req, res, next) => {
  if (req.user.role === "user" && req.user._id.toString() !== req.params.id) {
    return next(
      new AppError("You do not have permission to perform this action!", 403)
    );
  }
  // console.log(req.user.role);
  next();
};

exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  //get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address!", 404));
  }

  //generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email
  const resetURL = `https://${req.get("host")}/resetpassword/${resetToken}`;

  // const message = `<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
  //                                <!--100% body table-->
  //                                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
  //                                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
  //                                    <tr>
  //                                        <td>
  //                                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
  //                                                align="center" cellpadding="0" cellspacing="0">
  //                                                <tr>
  //                                                    <td style="height:80px;">&nbsp;</td>
  //                                                </tr>
  //                                                <tr>
  //                                                    <td style="text-align:center;">
  //                                                      <a href="https://keynigeria.org" title="logo" target="_blank">
  //                                                        <img width="250" src="https://keynigeria.org/images/logo.png" title="logo" alt="logo">
  //                                                      </a>
  //                                                    </td>
  //                                                </tr>
  //                                                <tr>
  //                                                    <td style="height:20px;">&nbsp;</td>
  //                                                </tr>
  //                                                <tr>
  //                                                    <td>
  //                                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
  //                                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
  //                                                            <tr>
  //                                                                <td style="height:40px;">&nbsp;</td>
  //                                                            </tr>
  //                                                            <tr>
  //                                                                <td style="padding:0 35px;">
  //                                                                    <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Verification Request</h1>
  //                                                                    <span
  //                                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
  //                                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0; font-weight: bold; text-align: left;">
  //                                                                        Hello User,<br>
  //                                                                        We're happy you are signed up to coinma, the best exchange platform in the world. Log in to our platform to explore all of our offers.
  //                                                                    </p>
  //                                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin-top: 35px; font-weight: bold; text-align: left;">
  //                                                                        Forgot your password? Submit a PATCH request with your new password and conpassword to: \n\n ${resetURL}.
  //                                                                    </p>
  //                                                                    <p style="font-weight: bold; text-align: left; color:#455056; font-size:15px;line-height:24px; margin:40px 0 0 0;">Welcome to coinma!</p>
  //                                                                    <p style="font-weight: bold; text-align: left; color:#455056; font-size:15px;line-height:24px; margin:0 0 25px 0;">The coinma Team</p>
  //                                                                    <p style="font-weight: bold; color:#455056; font-size:12px;line-height:24px; margin:0;">This Verification link will expire in 10 minutes</p>
  //                                                                    <p style="color:#455056; font-size:12px;line-height:24px; margin:0;">Please ignore this email if you received it without requesting a password reset.</p>
  //                                                                    </td>
  //                                                            </tr>
  //                                                            <tr>
  //                                                                <td style="height:40px;">&nbsp;</td>
  //                                                            </tr>
  //                                                        </table>
  //                                                    </td>
  //                                                <tr>
  //                                                    <td style="height:20px;">&nbsp;</td>
  //                                                </tr>
  //                                                <tr>
  //                                                    <td style="text-align:center;">
  //                                                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.keynigeria.org</strong></p>
  //                                                    </td>
  //                                                </tr>
  //                                                <tr>
  //                                                    <td style="height:80px;">&nbsp;</td>
  //                                                </tr>
  //                                            </table>
  //                                        </td>
  //                                    </tr>
  //                                </table>
  //                                <!--/100% body table-->
  //                            </body>`;
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: "Your password reset token (valid for 10 minutes)",
    //   message,
    // });

    res.status(200).json({
      status: "success",
      data: { resetURL },
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = asyncWrapper(async (req, res, next) => {
  //get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //make sure the token is not expired and there is a user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired!", 400));
  }

  //update changedPasswordAt property for the user
  user.password = req.body.password;
  user.conpassword = req.body.conpassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //Log the user in, send JWT
  createSendToken(user, 200, res);
  next();
});

exports.updatePassword = asyncWrapper(async (req, res, next) => {
  //get user from collection
  const user = await User.findById(req.user.id).select("+password");

  //check if posted current password is correct
  if (!(await user.matchPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong!", 401));
  }

  //update password
  user.password = req.body.password;
  user.conpassword = req.body.conpassword;
  await user.save();

  //Log user in, send JWT
  createSendToken(user, 200, res);
  next();
});
