import mongoose from "mongoose";

const myDB = mongoose.connection.useDb("mealigodb");

export default myDB;
