import { FC } from 'react';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import { ListItemStyled, ListItemIconStyled, ListItemTextStyled, SectionTitle, DurationText, ResourcesDivider } from '@/components/styles/courses/course-details.styles';
import { trpc } from '@/lib/trpc/trpc';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { formatDuration } from '@/utils/dateUtils';

interface ResourceListProps {
  courseId?: string;
}

const PreviewResourceList: FC<ResourceListProps> = ({ courseId }) => {
  console.log(courseId);
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

  const videos = resources.filter(r => r.type === 'video');
  const downloads = resources.filter(r => r.type === 'downloadable file');

  console.log(resources);
  return (
    <>

      {downloads.length > 0 && (
        <>
          <SectionTitle variant="subtitle2">Downloadable Resources</SectionTitle>
          <List>
            {downloads.map((resource) => (
              <ListItemStyled key={resource.id}

              >
                <ListItemIconStyled>
                  <InsertDriveFileIcon />
                </ListItemIconStyled>
                <ListItemTextStyled
                  primary={resource.name}
                />
              </ListItemStyled>
            ))}
          </List>
        </>
      )}
      <ResourcesDivider />
      {videos.length > 0 && (
        <>
          <SectionTitle variant="subtitle2">Lectures</SectionTitle>
          <List>
            {videos.map((resource, idx) => (
              <ListItemStyled key={resource.id}
                secondaryAction={resource.duration ? (
                  <DurationText>{formatDuration(resource.duration)}</DurationText>
                ) : undefined}>
                <ListItemIconStyled>
                  <PlayArrowRoundedIcon />
                </ListItemIconStyled>
                <ListItemTextStyled
                  primary={`Module ${idx + 1}: ${resource.name}`}
                />
              </ListItemStyled>
            ))}
          </List>
        </>
      )}
    </>
  );
};

export default PreviewResourceList; 