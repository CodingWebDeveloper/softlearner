import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const FormContainer = styled("div")(({ theme }) => ({
  maxWidth: "800px",
  "& .MuiTextField-root, & .MuiFormControl-root": {
    marginBottom: theme.spacing(3),
  },
}));

export const ThumbnailContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ButtonContainer = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  gap: 16,
});
