"use client";

import { trpc } from "@/lib/trpc/client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Skeleton,
  Alert,
} from "@mui/material";
import { format } from "date-fns";

interface CourseStudentsTableProps {
  courseId: string;
}

const CourseStudentsTableSkeleton = () => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Student</TableCell>
          <TableCell align="right">Progress</TableCell>
          <TableCell align="right">Enrolled At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton variant="text" width={150} />
            </TableCell>
            <TableCell align="right">
              <Skeleton variant="text" width={60} />
            </TableCell>
            <TableCell align="right">
              <Skeleton variant="text" width={120} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const CourseStudentsTable = ({ courseId }: CourseStudentsTableProps) => {
  const {
    data: students,
    isPending,
    error,
  } = trpc.courses.getCourseStudentsProgress.useQuery(courseId);

  if (isPending) {
    return <CourseStudentsTableSkeleton />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load student progress. Please try again later.
      </Alert>
    );
  }

  if (!students || students.length === 0) {
    return (
      <Alert severity="info">
        No students have enrolled in this course yet.
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell align="right">Progress</TableCell>
            <TableCell align="right">Enrolled At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.userId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Typography variant="body2">
                  {student.fullName || "Anonymous"}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {student.completedResources} / {student.totalResources}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(student.enrolledAt), "MMM dd, yyyy HH:mm")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CourseStudentsTable;
