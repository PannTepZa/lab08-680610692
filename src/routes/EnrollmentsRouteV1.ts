import { Router, type Request, type Response } from "express";
import {
  zCourseId,
  zCoursePostBody,
  zCoursePutBody,
} from "../libs/zodValidators.js";

import type { Student, Enrollment } from "../libs/types.js";

// import database
import { courses, enrollments, students } from "../db/db.js";
import { string } from "zod";

const router = Router();

// GET /enrollments

router.get("/", (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId as string;
    const studentId = req.query.studentId; 
    
    if (courseId && studentId){
      return res.status(400).json({
        ok : false,
        "message" : "Please provide either studentId or CourseId and not both!"
      })
    }
    if (courseId || studentId) {

      if (courseId){
        const filtered_enrollments: Enrollment[] = enrollments.filter(
        (e) => e.courseId == courseId);
        if (filtered_enrollments.length == 0){
          return res.status(200).json({
          ok: false,
          message: "Enrollment not found"
        });
      }
        const filtered_students = students.filter((std) =>
        filtered_enrollments.some((e) => e.studentId == std.studentId)
        );

        return res.status(200).json({
          ok: true,
          students: filtered_students.map((student) => ({
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            program: student.program,
          })),
        });
      }

      if (studentId){
        const filtered_enrollments = enrollments.filter((e) => e.studentId == studentId);
        if (filtered_enrollments.length == 0){
          return res.status(200).json({
          ok: false,
          message: "Enrollment not found"
        });
      }
        const filtered_Courses = courses.filter((course) =>
              filtered_enrollments.some((e) => e.courseId == course.courseId)
        );

        return res.status(200).json({
          ok: true,
          courses: filtered_Courses.map((courses) => ({
            courseId : courses.courseId,
            title : courses.courseTitle
          })),
        });
      }
    }

    return res.status(400).json({
        ok : false,
        "message" : "Please provide either studentId or CourseId and not both!"
    })
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});
    

// Do not forget to export the router
export default router
