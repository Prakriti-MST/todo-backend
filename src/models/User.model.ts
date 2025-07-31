import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import { validate as isEmail } from "email-validator";


import { Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; 
  name: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}



const UserSchema: Schema<IUser> = new mongoose.Schema(
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
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters"],
      maxLength: [16, "Password must be at most 16 characters"],
      validate: [
        {
          validator: (pwd: string) => /[A-Z]/.test(pwd),
          message: "Password must contain at least one uppercase letter",
        },
        {
          validator: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
          message: "Password must contain at least one special character",
        },
      ],
    },
  },
  { timestamps: true }
);

// 3. Pre-save hook to hash password
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// 4. Instance method to compare password
UserSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 5. Export model safely
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
