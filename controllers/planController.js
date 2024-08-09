import Plan from "../models/planModel.js";

export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    console.log(plans)
    return res.status(200).json({data: plans, success: true});
  } catch (error) {
    res.status(404).json({ msg: "Items cannot be found" });
  }
};

export const createPlans = async (req, res) => {
  try {
    const plans = await Plan.create({
      name: "Weekly Subscription Plan",
      type: "weekly",
      pricePerMeal: 80,
      image:
        "https://img.freepik.com/free-photo/vertical-shot-traditional-indian-paneer-butter-masala-cheese-cottage-curry-black-surface_181624-32001.jpg?w=360&t=st=1722862171~exp=1722862771~hmac=7d6a093d75aa675c4dbd04318942a7aba2bcc919e203109e31cd3b9e84602a49",
    });
    return res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(404).json({ msg: "Unable to add plan" });
  }
};
