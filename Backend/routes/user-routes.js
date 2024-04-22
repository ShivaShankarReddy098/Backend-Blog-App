// import express from "express";
// import controllers from "../controllers/user-controllers";
const express = require("express");
const controllers = require("../controllers/user-controllers");
const router = express.Router();
router.get("/", controllers.getAllUser);
router.post("/signUp", controllers.signUp);
router.post('/login',controllers.login);
module.exports = router;
