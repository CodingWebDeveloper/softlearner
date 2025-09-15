import { Box, TextField, Chip, styled } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export const TagsFormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "100%",
}));

export const TagsTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.custom.background.secondary,
    color: theme.palette.custom.text.white,
    "& fieldset": {
      borderColor: theme.palette.custom.background.secondary,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.custom.background.secondary,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.custom.accent.teal,
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.custom.text.light,
    "&.Mui-focused": {
      color: theme.palette.custom.accent.teal,
    },
  },
}));

export const TagsAutocompleteContainer = styled(Box)({
  width: "100%",
});

export const SelectedTagsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.custom.background.secondary,
  borderRadius: theme.shape.borderRadius,
  minHeight: "50px",
}));

export const TagChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
  "& .MuiChip-deleteIcon": {
    color: theme.palette.custom.text.white,
    "&:hover": {
      color: theme.palette.custom.text.light,
    },
  },
}));

export const ArrowDropDownIconStyled = styled(ArrowDropDownIcon)(
  ({ theme }) => ({
    color: theme.palette.custom.text.light,
  })
);

export const SaveButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(2),
}));
