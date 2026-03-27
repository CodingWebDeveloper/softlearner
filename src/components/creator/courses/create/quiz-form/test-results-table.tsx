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
  Avatar,
  Box,
  Typography,
  Skeleton,
  Alert,
  Chip,
} from "@mui/material";
import { format } from "date-fns";

interface TestResultsTableProps {
  testId: string;
}

const TestResultsTableSkeleton = () => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Student</TableCell>
          <TableCell align="right">Score</TableCell>
          <TableCell align="right">Percentage</TableCell>
          <TableCell align="right">Completed At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Box display="flex" alignItems="center" gap={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={150} />
              </Box>
            </TableCell>
            <TableCell align="right">
              <Skeleton variant="text" width={60} />
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

const TestResultsTable = ({ testId }: TestResultsTableProps) => {
  const {
    data: results,
    isPending,
    error,
  } = trpc.tests.getStudentTestResults.useQuery(testId);

  if (isPending) {
    return <TestResultsTableSkeleton />;
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load test results. Please try again later.
      </Alert>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Alert severity="info">
        No students have completed this test yet.
      </Alert>
    );
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    return "error";
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Percentage</TableCell>
            <TableCell align="right">Completed At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow
              key={result.userId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={result.avatarUrl || undefined}
                    alt={result.fullName || "Student"}
                    sx={{ width: 40, height: 40 }}
                  >
                    {result.fullName?.charAt(0).toUpperCase() || "S"}
                  </Avatar>
                  <Typography variant="body2">
                    {result.fullName || "Anonymous"}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {result.score} / {result.maxScore}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={`${result.percentage}%`}
                  color={getPercentageColor(result.percentage)}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(result.completedAt), "MMM dd, yyyy HH:mm")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TestResultsTable;
