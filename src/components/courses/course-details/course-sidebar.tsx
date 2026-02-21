import { FC, useState, KeyboardEvent } from "react";
import { Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import {
  DiscountedPrice,
  OldPrice,
  MetaItem,
  CardStyled,
  MetaItemText,
  PreviewIcon,
  DialogContentStyled,
  VideoContainer,
  VideoIframe,
  CloseButtonContainer,
  CloseButtonStyled,
  PriceContainer,
  DividerStyled,
  ClickablePreviewBox,
} from "@/components/styles/courses/course-details.styles";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { BasicCourse } from "@/services/interfaces/service.interfaces";
import { trpc } from "@/lib/trpc/client";
import { BuyNowButton } from "./buy-now-button";
import BookmarkCard from "@/components/courses/courses-list/bookmark-card";
import {
  countResourcesByType,
  formatDurationFromMinutes,
  getDiscountPercentage,
  getDisplayPrice,
  getTotalMinutesFromResources,
  hasDiscountPrice,
} from "@/utils/utils";

interface CourseSidebarProps {
  course: BasicCourse;
}

const CourseSidebar: FC<CourseSidebarProps> = ({ course }) => {
  // Hooks
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: resourcesData, isLoading: isResourcesLoading } =
    trpc.resources.getResourcesByCourseId.useQuery(
      { courseId: course?.id },
      { enabled: !!course?.id },
    );

  const { data: isEnrolled, isLoading: isEnrollmentLoading } =
    trpc.courses.isEnrolled.useQuery(course.id, { enabled: !!course?.id });

  // Variables/State
  const hasDiscount = hasDiscountPrice(course.price, course?.new_price);
  const displayPrice = getDisplayPrice(course.price, course?.new_price);
  const discountPercentage = getDiscountPercentage(
    course.price,
    course?.new_price,
  );
  const resources = resourcesData || [];
  const durationDisplay = formatDurationFromMinutes(
    getTotalMinutesFromResources(resourcesData),
  );

  const totalVideos = countResourcesByType(resources, "video");
  const totalFiles = countResourcesByType(resources, "downloadable file");

  // Handlers
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handlePreviewBoxKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenDialog();
    }
  };

  if (isResourcesLoading || isEnrollmentLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={320}
        sx={{ borderRadius: 2 }}
      />
    );
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
              <CloseButtonStyled aria-label="close" onClick={handleCloseDialog}>
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
              <CloseButtonStyled aria-label="close" onClick={handleCloseDialog}>
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="baseline"
            flexWrap="wrap"
          >
            <DiscountedPrice
              component="span"
              tabIndex={0}
              aria-label={`Price: $${displayPrice} USD`}
            >
              ${displayPrice}
            </DiscountedPrice>
            <Typography
              component="span"
              variant="h6"
              fontWeight={700}
              sx={{ color: (theme) => theme.palette.custom.accent.teal }}
              tabIndex={0}
              aria-label="Currency: USD"
            >
              USD
            </Typography>
            {hasDiscount && (
              <OldPrice
                component="span"
                tabIndex={0}
                aria-label={`Original Price: $${course.price.toFixed(2)} USD`}
              >
                ${course.price.toFixed(2)}
              </OldPrice>
            )}
          </Stack>
          {hasDiscount && discountPercentage !== null && (
            <Typography
              variant="body2"
              color="error.main"
              tabIndex={0}
              aria-label={`${discountPercentage}% off`}
              sx={{ textAlign: "right", lineHeight: 1.1 }}
            >
              {discountPercentage}% off
            </Typography>
          )}
        </Stack>
      </PriceContainer>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <BuyNowButton courseId={course.id} isEnrolled={isEnrolled} />
        <BookmarkCard
          courseId={course.id}
          initialIsBookmarked={course.isBookmarked}
        />
      </Stack>

      <DividerStyled />
      <Stack spacing={1.5}>
        <Typography variant="subtitle2" fontWeight={600}>
          This course includes
        </Typography>
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
