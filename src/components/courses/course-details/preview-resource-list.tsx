import { FC } from 'react';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import {ListItemStyled, ListItemIconStyled, ListItemTextStyled } from '@/components/styles/courses/course-details.styles';
import { trpc } from '@/lib/trpc/trpc';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface ResourceListProps {
  courseId?: string;
}

const PreviewResourceList: FC<ResourceListProps> = ({ courseId }) => {
  const { data: resources, isLoading, error } = trpc.resources.getResourcesByCourseId.useQuery(
    { courseId: courseId || '' },
    { enabled: !!courseId }
  );

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 3 }).map((_, idx) => (
          <ListItemStyled key={`skeleton-${idx}`}>
            <ListItemIconStyled>
              <Skeleton variant="circular" width={24} height={24} />
            </ListItemIconStyled>
            <ListItemTextStyled
              primary={<Skeleton variant="text" width={120} height={24} />}
            />
          </ListItemStyled>
        ))}
      </>
    );
  }

  if (error) {
    return <ListItemTextStyled primary="Failed to load resources." />;
  }

  if (!resources || resources.length === 0) {
    return <ListItemTextStyled primary="No resources found." />;
  }

  return (
    <List>
      {resources.map((resource) => (
        <ListItemStyled key={resource.id}>
          <ListItemIconStyled>
          <InsertDriveFileIcon />  {/* You can use an appropriate MUI icon here, e.g., InsertDriveFileIcon */}
          </ListItemIconStyled>
          <ListItemTextStyled
            primary={resource.name}
            secondary={resource.short_summary}
          />
        </ListItemStyled>
      ))}
    </List>
  );
};

export default PreviewResourceList; 