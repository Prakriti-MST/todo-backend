import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'pending'],
    default: 'pending'
  },
  priority: {
    type: String,
    required: true,
    enum: ['high', 'mid', 'low'],
    default: 'mid'
  },
  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Todo = mongoose.model("Todo", TodoSchema);
export default Todo;
