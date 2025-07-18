import { Box } from "@mui/material";
import { CloseIconStyled } from "@/components/styles/courses/courses.styles";
import { selectTags, setTags } from "@/lib/store/features/filterSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CourseTagChip } from "@/components/styles/courses/course-tags.styles";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const TagsList = () => {
  // General hooks
  const dispatch = useAppDispatch();

  // Selectors
  const tags = useAppSelector(selectTags);

  // Handlers
  const handleRemove = (tagId: string) => {
    const updatedList = tags.filter((tag) => tag.id !== tagId);
    dispatch(setTags(updatedList));
  };

  if (!tags.length) return null;

  return (
    <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
      {tags.map((tag) => (
        <CourseTagChip
          key={tag.id}
          label={tag.name}
          icon={<LocalOfferIcon />}
          deleteIcon={<CloseIconStyled color="inherit" />}
          onDelete={() => handleRemove(tag.id)}
        />
      ))}
    </Box>
  );
};

export default TagsList;
