const mongoose = require("mongoose");
const validator = require("validator");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please Enter Valid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 20,
      validate(value) {
        if (!validator.isStrongPassword(value, { minLength: 20 })) {
          throw new Error("Enter Strong Password");
        }
      },
    },
    role: {
      type: String,
      enum: ["user", "isAdmin"],
      default: "user",
    },
    //address
    addresses: [
      {
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        pincode: {
          type: Number,
          min: 100000,
        },
        country: {
          type: String,
          default: "india",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await JWT.sign(
    { _id: user._id, role: this.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token; //red zone
};
userSchema.methods.validatepassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  const ispassword = await bcrypt.compare(password, passwordHash);
  return ispassword;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
