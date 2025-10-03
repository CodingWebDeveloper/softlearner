import { styled } from "@mui/material/styles";
import { Chip, TableContainer } from "@mui/material";

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
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

export const StatusChip = styled(Chip)(({ theme }) => ({
  color: theme.palette.custom.text.white,
}));
