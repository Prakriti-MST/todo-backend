import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description?: string;
  status: "completed" | "pending";
  priority: "high" | "mid" | "low";
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema: Schema<ITodo> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      required: true,
      enum: ["completed", "pending"],
      default: "pending",
    },
    priority: {
      type: String,
      required: true,
      enum: ["high", "mid", "low"],
      default: "mid",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Todo: Model<ITodo> =
  mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
