"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
  TableSortLabel,
  Button,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(2),
  "& .MuiTable-root": {
    borderCollapse: "separate",
    borderSpacing: "0 4px",
  },
  "& .MuiTableCell-head": {
    backgroundColor: "transparent",
    fontWeight: 600,
    fontSize: "0.875rem",
    border: "none",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  "& .MuiTableBody-root .MuiTableRow-root": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    borderRadius: theme.spacing(1),
    "& .MuiTableCell-body": {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      "&:first-of-type": {
        borderLeft: `1px solid ${theme.palette.divider}`,
        borderTopLeftRadius: theme.spacing(1),
        borderBottomLeftRadius: theme.spacing(1),
      },
      "&:last-of-type": {
        borderRight: `1px solid ${theme.palette.divider}`,
        borderTopRightRadius: theme.spacing(1),
        borderBottomRightRadius: theme.spacing(1),
      },
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      transform: "translateY(-1px)",
      transition: "all 0.2s ease-in-out",
    },
  },
}));

// Mock data based on database schema
const mockCourses: CreatorCourse[] = [
  {
    id: "1",
    name: "Introduction to React",
    category: "Web Development",
    price: 49.99,
    new_price: 39.99,
    currency: "USD",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-16T15:30:00Z",
  },
  {
    id: "2",
    name: "Advanced TypeScript",
    category: "Programming",
    price: 79.99,
    new_price: 69.99,
    currency: "USD",
    createdAt: "2024-03-14T09:00:00Z",
    updatedAt: "2024-03-15T11:20:00Z",
  },
  {
    id: "3",
    name: "Node.js Fundamentals",
    category: "Backend Development",
    price: 59.99,
    new_price: 49.99,
    currency: "USD",
    createdAt: "2024-03-13T14:00:00Z",
    updatedAt: "2024-03-14T16:45:00Z",
  },
];

type Order = "asc" | "desc";

interface HeadCell {
  id: keyof CreatorCourse | "actions";
  label: string;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: "name", label: "Name", sortable: true },
  { id: "category", label: "Category", sortable: true },
  { id: "price", label: "Price", sortable: true },
  { id: "createdAt", label: "Created At", sortable: true },
  { id: "updatedAt", label: "Last Updated", sortable: true },
  { id: "actions", label: "Actions", sortable: false },
];

const CreatorCoursesTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof CreatorCourse>("createdAt");

  const router = useRouter();

  const handleCreateCourse = () => {
    router.push("/creator/courses/create");
  };

  const handleEdit = (courseId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit course:", courseId);
  };

  const handleDelete = (courseId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete course:", courseId);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleRequestSort = (property: keyof CreatorCourse) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data: CreatorCourse[]) => {
    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (!aValue || !bValue) return 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  };

  return (
    <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCourse}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          Create Course
        </Button>
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
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() =>
                        handleRequestSort(headCell.id as keyof CreatorCourse)
                      }
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
            {sortData(mockCourses)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    {formatPrice(
                      course.new_price || course.price,
                      course.currency
                    )}
                  </TableCell>
                  <TableCell>{formatDate(course.createdAt)}</TableCell>
                  <TableCell>{formatDate(course.updatedAt)}</TableCell>
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
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete course">
                      <IconButton
                        onClick={() => handleDelete(course.id)}
                        size="small"
                        sx={{
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <TablePagination
        component="div"
        count={mockCourses.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default CreatorCoursesTable;
