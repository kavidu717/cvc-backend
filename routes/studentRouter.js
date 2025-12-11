import express from "express";

import { createStudent, getStudents } from "../controller/studentController.js";

// create the student router
const studentRouter=express.Router()

studentRouter.get("/",getStudents)

studentRouter.post("/",createStudent)

export default studentRouter;