import mongoose from "mongoose";
import Pack from "./packModel.js";
import myDB from "./dbConnection.js";

const { Schema } = mongoose;

const PlanSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    pricePerMeal: { type: Number, required: true },
    image: { type: String, required: true},
    // unit: { type: String, required: true },
    // category: {
    //   type: Schema.Types.ObjectId,
    //   ref: "ItemCategory",
    // },
    // owners: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    // packs: [{ type: Schema.Types.ObjectId, ref: "Pack", default: [] }],
    global: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Plan = myDB.model("Plan", PlanSchema);
export default Plan;
