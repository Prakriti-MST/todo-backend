import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { validate as isEmail } from "email-validator";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [50, "Name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: isEmail,
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
  type: String,
  required: true,
  minlength: [8, "Password must be at least 8 characters"],
  maxlength: [16, "Password must be at most 16 characters"],
  validate: [
    {
      validator: pwd => /[A-Z]/.test(pwd),
      message: "Password must contain at least one uppercase letter"
    },
    {
      validator: pwd => /[^A-Za-z0-9]/.test(pwd),
      message: "Password must contain at least one special character"
    }
  ]
},

  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema); //overwrite model error

export default User;
