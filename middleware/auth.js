import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, SERVICE_ACCOUNT_KEY } from "../config.js";
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT_KEY),
});

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = admin.auth().verifyIdToken(token);
    // const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      token: token,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: "Please authenticate" });
  }
};
export default auth;
