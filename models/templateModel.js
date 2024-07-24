import mongoose from "mongoose";
const { Schema } = mongoose;

import myDB from "./dbConnection.js";

const TemplateSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["pack", "trip", "item"],
      required: true,
    },
    templateId: { type: Schema.Types.ObjectId, required: true },
    isGlobalTemplate: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Template = myDB.model("Template", TemplateSchema);

export default Template;
