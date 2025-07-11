import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { removeTag } from '@/lib/store/features/selectedTagsSlice';
import { Box } from '@mui/material';
import { TagChipStyled, CloseIconStyled } from '@/components/styles/courses/courses.styles';

const TagsList = () => {
  const tags = useSelector((state: RootState) => state.selectedTags.tags);
  const dispatch = useDispatch();

  if (!tags.length) return null;

  return (
    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {tags.map((tag) => (
        <TagChipStyled
          key={tag.id}
          label={tag.name}
          deleteIcon={<CloseIconStyled color="inherit" />}
          onDelete={() => dispatch(removeTag(tag.id))}
        />
      ))}
    </Box>
  );
};

export default TagsList; 