import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CourseMarkdownContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.custom.text.light,
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    color: theme.palette.custom.text.white,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
  "& p": {
    marginBottom: theme.spacing(2),
    lineHeight: 1.6,
  },
  "& a": {
    color: theme.palette.custom.accent.teal,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  "& ul, & ol": {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
  },
  "& li": {
    marginBottom: theme.spacing(1),
  },
  "& code": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
  },
  "& pre": {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: theme.spacing(2),
    borderRadius: "8px",
    overflowX: "auto",
    marginBottom: theme.spacing(2),
    "& code": {
      backgroundColor: "transparent",
      padding: 0,
    },
  },
  "& blockquote": {
    borderLeft: `4px solid ${theme.palette.custom.accent.teal}`,
    margin: 0,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1, 2),
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "0 4px 4px 0",
  },
  "& table": {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: theme.spacing(2),
  },
  "& th, & td": {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: theme.spacing(1),
    textAlign: "left",
  },
  "& th": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    fontWeight: 600,
    color: theme.palette.custom.text.white,
  },
}));
