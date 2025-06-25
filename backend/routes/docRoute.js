const express=require("express")
const router=express.Router()
const { registerDoc, loginDoc } = require("../Controller/DocController");
const Doctor = require("../models/Doctor");
router.post("/register",registerDoc);
router.post("/login",loginDoc);
module.exports=router
  