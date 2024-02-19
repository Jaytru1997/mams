const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  status: {
    type: String,
    required: true,
    enum: ["approved", "suspended", "pending"],
    default: "pending",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  conpassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  //check if user is modified
  if (!this.isModified("password")) return next();

  //Hash the password using bcryptjs with a constant salt size of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete conpassword field since its only used for validation
  this.conpassword = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre("save", async function (next) {
//   const wallets = await Wallets.find();
//   if (wallets.length === 0) {
//     next();
//   }
//   if (this.isNew) {
//     wallets.forEach((wallet) => {
//       this.wallets.push({
//         coinWalletName: wallet.name,
//         coinWalletAddress: wallet.address,
//         coinWalletSymbol: wallet.symbol,
//         balance: this.isNew ? 0 : this.wallets.balance,
//       });
//     });
//   }
//   next();
// });

//instance method is used for all instances of the model
userSchema.methods.matchPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  //means password has not been changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; //send to user
};


userSchema.methods.filterArray = async function (array, object, key) {
  let newArray = array.filter((el) => el[key] !== object[key]);
  console.log(array, newArray);
  return newArray;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
