import express from "express";
import createUser from "./createUser";
// import addStation from "./addStation";
// import deleteStation from "./deleteStation";

let router = express.Router();

router.use("/create-user", createUser);
// router.use("/add-station", addStation);
// router.use("/delete-station", deleteStation);

export default router;