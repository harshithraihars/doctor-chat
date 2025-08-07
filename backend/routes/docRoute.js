const express=require("express")
const router=express.Router()
const { registerDoc, loginDoc } = require("../Controller/DocController");

router.post("/register",registerDoc);
router.post("/login",loginDoc);

module.exports=router
  