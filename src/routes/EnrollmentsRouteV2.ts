import { Router, type Request, type Response } from "express";
import {
  zCourseId,
  zCoursePostBody,
  zCoursePutBody,
  zStudentId,
} from "../libs/zodValidators.js";

import type { Student, Enrollment } from "../libs/types.js";

// import database
// import database
import { students, courses,enrollments } from "../db/db.js";

const router = Router();

router.delete("/", (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parseResult1 = zStudentId.safeParse(body.studentId);
    const parseResult2 = zCourseId.safeParse(body.courseId);

    if (!parseResult1.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult1.error.issues[0]?.message,
      });
    }

    if (!parseResult2.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult2.error.issues[0]?.message,
      });
    }

    const studentId = parseResult1.data;
    const courseId = parseResult2.data;
    const enrollmentIndex = enrollments.findIndex(
      (enrollment) =>
        enrollment.studentId == studentId && enrollment.courseId == courseId
    );

    if (enrollmentIndex === -1) {
      return res.status(404).json({
        ok: false,
        message: "Enrollment does not exist",
      });
    }

    enrollments.splice(enrollmentIndex, 1);

    res.status(200).json({
      ok: true,
      message: "Enrollment has been deleted",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

// Do not forget to export the router
export default router;