"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
  TableSortLabel,
  Box,
  Skeleton,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { SimpleCourse } from "@/services/interfaces/service.interfaces";
import { StyledButton } from "@/components/styles/infrastructure/layout.styles";
import { trpc } from "@/lib/trpc/client";
import { useSnackbar } from "notistack";
import ConfirmAlert from "@/components/confirm-alert";
import {
  StatusChip,
  StyledTableContainer,
} from "@/components/styles/creator/creator-courses-table.styles";

export interface CreatorCourse {
  id: string;
  name: string;
  category: string;
  price: number;
  new_price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

interface HeadCell {
  id: string;
  label: string;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: "name", label: "Name", sortable: true },
  { id: "category", label: "Category", sortable: true },
  { id: "price", label: "Price", sortable: true },
  { id: "status", label: "Status", sortable: false },
  { id: "createdAt", label: "Created At", sortable: true },
  { id: "updatedAt", label: "Last Updated", sortable: true },
  { id: "actions", label: "Actions", sortable: false },
];

interface CreatorCoursesTableProps {
  // Data
  courses: SimpleCourse[];
  total: number;
  isLoading: boolean;
  canCreateCourse: boolean;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  sortBy: "name" | "category" | "price" | "created_at" | "updated_at";
  sortDir: "asc" | "desc";
  onChangeSort: (columnId: string) => void;
}

const CreatorCoursesTable = ({
  courses,
  total,
  isLoading,
  canCreateCourse,
  page,
  pageSize,
  setPage,
  setPageSize,
  sortBy,
  sortDir,
  onChangeSort,
}: CreatorCoursesTableProps) => {
  const router = useRouter();

  // Snackbar
  const { enqueueSnackbar } = useSnackbar();

  // tRPC
  const utils = trpc.useUtils();
  const { mutateAsync: deleteCourse, isPending: isDeleting } =
    trpc.courses.deleteCourse.useMutation({
      onSuccess: async () => {
        await utils.courses.getCreatorCourses.invalidate();
      },
    });

  // Local state for confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleCreateCourse = () => {
    router.push("/creator/courses/create");
  };

  const handleEdit = (courseId: string) => {
    router.push(`/creator/courses/${courseId}`);
  };

  const handleDelete = (courseId: string) => {
    setSelectedCourseId(courseId);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setSelectedCourseId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCourseId) {
      return;
    }

    try {
      await deleteCourse({ id: selectedCourseId });
      enqueueSnackbar("Course deleted successfully", {
        variant: "success",
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
      });
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Failed to delete course",
        {
          variant: "error",
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
        },
      );
    } finally {
      handleConfirmClose();
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  // Sync internal UI state from parent props for visual sort indicator
  const currentOrderBy = (() => {
    switch (sortBy) {
      case "created_at":
        return "createdAt";
      case "updated_at":
        return "updatedAt";
      default:
        return sortBy;
    }
  })();

  const handleRequestSort = (property: string) => {
    onChangeSort(property);
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: Math.max(pageSize, 5) }).map((_, idx) => (
      <TableRow key={`sk-${idx}`}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === "actions" ? "center" : "left"}
          >
            <Skeleton variant="text" width={160} />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
      {!canCreateCourse && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must finish Stripe onboarding before creating courses. Complete it
          from{" "}
          <strong>
            <Link color="" href="/creator/earnings">
              Earnings &amp; Payouts
            </Link>
          </strong>{" "}
          .
        </Alert>
      )}

      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCourse}
          disabled={!canCreateCourse}
        >
          Create Course
        </StyledButton>
      </Box>
      <StyledTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.id === "actions" ? "center" : "left"}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={currentOrderBy === headCell.id}
                      direction={
                        currentOrderBy === headCell.id ? sortDir : "asc"
                      }
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? renderSkeletonRows()
              : courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.category.name}</TableCell>
                    <TableCell>
                      {formatPrice(
                        course.new_price || course.price,
                        course.currency,
                      )}
                    </TableCell>
                    <TableCell>
                      {course.is_published ? (
                        <StatusChip color="success" label="Published" />
                      ) : (
                        <StatusChip color="error" label="Draft" />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(course.created_at)}</TableCell>
                    <TableCell>{formatDate(course.updated_at)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit course">
                        <IconButton
                          onClick={() => handleEdit(course.id)}
                          size="small"
                          sx={{
                            mr: 1,
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                          aria-label="Edit course"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete course">
                        <span>
                          <IconButton
                            onClick={() => handleDelete(course.id)}
                            size="small"
                            sx={{
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                            disabled={
                              isDeleting && selectedCourseId === course.id
                            }
                            aria-label="Delete course"
                          >
                            {isDeleting && selectedCourseId === course.id ? (
                              <CircularProgress size={18} />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        disabled={isLoading}
      />

      <ConfirmAlert
        open={confirmOpen}
        onClose={handleConfirmClose}
        onConfirm={handleConfirmDelete}
        title="Delete course?"
        content="This action cannot be undone. All related content may be affected."
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
        cancelText="Cancel"
        label="delete-course"
      />
    </Paper>
  );
};

export default CreatorCoursesTable;
