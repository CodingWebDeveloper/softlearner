import { FC, useState, KeyboardEvent } from 'react';
import { Skeleton, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { 
  DiscountedPrice, 
  OldPrice, 
  MetaItem, 
  CardStyled,
  AddToCartButton,
  MetaItemText,
  PreviewIcon,
  DialogContentStyled,
  VideoContainer,
  VideoIframe,
  CloseButtonContainer,
  CloseButtonStyled,
  PriceContainer,
  DividerStyled,
  ClickablePreviewBox
} from '@/components/styles/courses/course-details.styles';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { BasicCourse } from '@/services/interfaces/service.interfaces';
import { PreviewResource } from '@/lib/database/database.types';
import { trpc } from '@/lib/trpc/trpc';

interface CourseSidebarProps {
  course: BasicCourse
}

const CourseSidebar: FC<CourseSidebarProps> = ({ course }) => {
  // Hooks
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: resourcesData, isLoading: isResourcesLoading} = trpc.resources.getResourcesByCourseId.useQuery(
    { courseId: course?.id},
    {enabled: !!course?.id});

  // Variables/State
  const hasDiscount = course?.new_price !== null && course?.new_price !== undefined;
  const displayPrice = hasDiscount ? course?.new_price?.toFixed(2) : course?.price.toFixed(2);
  const resources = resourcesData || [];
  
  const totalMinutes = resourcesData?.reduce((total: number, resource: PreviewResource) => {
    if (resource.duration) {
      // Parse PostgreSQL interval format (HH:MM:SS)
      const parts = resource.duration.split(':');
      if (parts.length === 3) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        return total + (hours * 60) + minutes;
      }
    }
    return total;
  }, 0) || 0;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const durationDisplay = hours > 0 
    ? `${hours} hr${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`
    : `${minutes} min`;

  const totalVideos = resources.filter((r: PreviewResource) => r.type === 'video').length;
  const totalFiles = resources.filter((r: PreviewResource) => r.type === 'downloadable file').length;

  // Handlers
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handlePreviewBoxKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenDialog();
    }
  };

  if (isResourcesLoading) {
    return (
      <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 2 }} />
    )
  }
  return (
    <CardStyled>
      <ClickablePreviewBox
        tabIndex={0}
        aria-label="Course Preview Image"
        onClick={handleOpenDialog}
        onKeyDown={handlePreviewBoxKeyDown}
        role="button"
      >
        <PreviewIcon />
      </ClickablePreviewBox>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="course-preview-dialog-title"
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        {isMobile ? (
          <DialogContentStyled $isMobile>
            <CloseButtonContainer>
              <CloseButtonStyled
                aria-label="close"
                onClick={handleCloseDialog}
              >
                <CloseIcon />
              </CloseButtonStyled>
            </CloseButtonContainer>
            <VideoContainer>
              <VideoIframe
                src={`https://www.youtube.com/embed/${course.video_url}`}
                title="Course Preview Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>
          </DialogContentStyled>
        ) : (
          <DialogContentStyled $isMobile={false}>
            <CloseButtonContainer>
              <CloseButtonStyled
                aria-label="close"
                onClick={handleCloseDialog}
              >
                <CloseIcon />
              </CloseButtonStyled>
            </CloseButtonContainer>
            <VideoContainer>
              <VideoIframe
                src={`https://www.youtube.com/embed/${course.video_url}`}
                title="Course Preview Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>
          </DialogContentStyled>
        )}
      </Dialog>

      <PriceContainer>
        {hasDiscount ? (
          <>
            <DiscountedPrice component="span" tabIndex={0} aria-label={`Discounted Price: $${displayPrice} USD`}>
              ${displayPrice} USD
            </DiscountedPrice>
            <OldPrice component="span" tabIndex={0} aria-label={`Original Price: $${course.price.toFixed(2)} USD`}>
              ${course.price.toFixed(2)} USD
            </OldPrice>
          </>
        ) : (
          <DiscountedPrice component="span" tabIndex={0} aria-label={`Price: $${displayPrice} USD`}>
            ${displayPrice} USD
          </DiscountedPrice>
        )}
      </PriceContainer>

      <AddToCartButton
        variant="contained"
        color="primary"
        fullWidth
        aria-label="Add to Cart"
        tabIndex={0}
        onClick={() => {}}
        onKeyDown={(e: KeyboardEvent) => { if (e.key === 'Enter') {/* handle add to cart */} }}
      >
        ADD TO CART
      </AddToCartButton>

      <DividerStyled />
      <Stack spacing={1.5}>
        <MetaItem tabIndex={0} aria-label={`Duration: ${durationDisplay}`}>
          <AccessTimeOutlinedIcon color="primary" />
          <MetaItemText>
            <b>Duration:</b> {durationDisplay}
          </MetaItemText>
        </MetaItem>
        <MetaItem tabIndex={0} aria-label={`Videos: ${totalVideos}`}>
          <PlayCircleOutlineIcon color="primary" />
          <MetaItemText>
            <b>Videos:</b> {totalVideos}
          </MetaItemText>
        </MetaItem>
        <MetaItem tabIndex={0} aria-label={`Downloadable Files: ${totalFiles}`}>
          <CloudDownloadOutlinedIcon color="primary" />
          <MetaItemText>
            <b>Downloadable Files:</b> {totalFiles}
          </MetaItemText>
        </MetaItem>
      </Stack>
    </CardStyled>
  );
};

export default CourseSidebar; 