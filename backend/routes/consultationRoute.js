const express = require("express");
const { SpecialistHandler } = require("../Controller/consultationController");
const auth = require("../middleware/auth");
const router = express.Router();


router.get("/specialist/:specialist",auth,SpecialistHandler);

module.exports=router