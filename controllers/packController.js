import Pack from "../models/packModel.js";
import mongoose from "mongoose";
import { calculatePackScore } from "../utils/scorePack.js";

export const getPublicPacks = async (req, res) => {
  try {
    const { queryBy } = req.query;

    let publicPacksPipeline = [
      {
        $match: { is_public: true },
      },
      {
        $lookup: {
          from: "items", // name of the foreign collection
          localField: "_id",
          foreignField: "packs",
          as: "items",
        },
      },
      {
        $addFields: {
          total_weight: {
            $sum: {
              $map: {
                input: "$items",
                as: "item",
                in: { $multiply: ["$$item.weight", "$$item.quantity"] },
              },
            },
          },
        },
      },
    ];

    if (queryBy === "Favorite") {
      publicPacksPipeline.push({ $sort: { favorites_count: -1 } });
    } else {
      publicPacksPipeline.push({ $sort: { _id: -1 } });
    }

    const publicPacks = await Pack.aggregate(publicPacksPipeline);

    res.status(200).json(publicPacks);
  } catch (error) {
    res.status(404).json({ msg: "Packs cannot be found" });
  }
};

export const getPacks = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const packs = await Pack.aggregate([
      // matches the pack owners array with the given ownerId
      {
        $match: { owners: new mongoose.Types.ObjectId(ownerId) },
      },
      {
        // looks up into the items collection for those docs that have _id in packs column in items collection and returns them as items
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "packs",
          as: "items",
        },
      },
      // looks up into the itemscategories collection for those docs that have items.category in itemcategories column as id and returns them as items.category. basically its left joining the document
      {
        $lookup: {
          from: "itemcategories",
          localField: "items.category",
          foreignField: "_id",
          as: "items.category",
        },
      },
      {
        // then it picks the category name to be added in docs
        $addFields: {
          category: { $arrayElemAt: ["$items.category.name", 0] },
        },
      },
      {
        // then it groups the item based on individual items
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          owner_id: { $first: "$owner_id" },
          is_public: { $first: "$is_public" },
          favorited_by: { $first: "$favorited_by" },
          favorites_count: { $first: "$favorites_count" },
          createdAt: { $first: "$createdAt" },
          owners: { $first: "$owners" },
          grades: { $first: "$grades" },
          scores: { $first: "$scores" },
          type: { $first: "$type" },
          items: { $push: "$items" },
          total_weight: {
            $sum: {
              $multiply: ["$items.weight", "$items.quantity"],
            },
          },
        },
      },
    ]);

    res.status(200).json(packs);
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ msg: "Packs cannot be found " + error.message });
  }
};

export const getPackById = async (req, res) => {
  try {
    const { packId } = req.params;

    const objectId = new mongoose.Types.ObjectId(packId);
    const pack = await Pack.findById(objectId).populate({
      path: "items",
      populate: {
        path: "category",
        select: "name",
      },
    });

    res.status(200).json(pack);
  } catch (error) {
    console.error("getPackById error", error); // Add this line
    res.status(404).json({ msg: "Pack cannot be found" });
  }
};

export const addPack = async (req, res) => {
  try {
    const { name, owner_id } = req.body;

    const newPack = {
      // ...packBody,
      name: name,
      owner_id: owner_id,
      items: [],
      is_public: false,
      favorited_by: [],
      favorites_count: 0,
      createdAt: new Date(),
      owners: [owner_id],
    };

    console.log("newPack", newPack);

    const exists = await Pack.find({ name: name });

    // if (exists[0]?.name?.toLowerCase() === name.toLowerCase()) {
    //   throw new Error("Pack already exists");
    // }

    const createdPack = await Pack.create(newPack);
    res.status(200).json({ msg: "success", createdPack });
  } catch (error) {
    res.status(404).json({ msg: error.msg });
  }
};

export const editPack = async (req, res) => {
  try {
    const { _id } = req.body;

    const newPack = await Pack.findOneAndUpdate({ _id }, req.body, {
      returnOriginal: false,
    });

    console.log("newPack", newPack);

    res.status(200).json(newPack);
  } catch (error) {
    res.status(404).json({ msg: "Unable to edit pack" });
  }
};

export const deletePack = async (req, res) => {
  try {
    const { packId } = req.body;

    await Pack.findOneAndDelete({ _id: packId });
    res.status(200).json({ msg: "pack was deleted successfully" });
  } catch (error) {
    res.status(404).json({ msg: "Unable to delete pack" });
  }
};

export const duplicatePublicPack = async (req, res) => {
  try {
    const { packId, ownerId, items } = req.body;

    let pack = await Pack.findById(packId);
    if (!pack) {
      // Pack with specified ID not found
      return res.status(404).json({ error: "Pack not found" });
    }

    pack = await Pack.create({
      name: pack.name,
      items: items,
      owner_id: pack.owner_id,
      is_public: false,
      favorited_by: pack.favorited_by,
      favorites_count: pack.favorites_count,
      createdAt: new Date().toISOString(),
      owners: [pack.owners, ownerId],
      grades: { ...pack.grades },
      scores: { ...pack.scores },
      type: pack.type,
    });
    res
      .status(200)
      .json({ msg: "pack was duplicated successfully", data: pack });
  } catch (error) {
    res.status(404).json({ msg: "Unable to duplicate pack" + error });
  }
};

export const scorePack = async (req, res) => {
  try {
    const { packId } = req.params;

    const objectId = new mongoose.Types.ObjectId(packId);
    const packData = await Pack.findById(objectId).populate("items");

    // console.log("packData", packData)

    // Call the scoring function to calculate the pack score

    const packScore = calculatePackScore(packData);

    console.log("packScore", packScore);

    const { scores, grades } = packScore;

    const updatedPack = await Pack.findByIdAndUpdate(
      { _id: packId },
      { scores: scores, grades: grades },
      { returnOriginal: false }
    );

    console.log("updatedPack", updatedPack);

    res.status(200).json({ msg: "Pack was scored successfully", updatedPack });
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ msg: "Unable to score pack", error });
  }
};
