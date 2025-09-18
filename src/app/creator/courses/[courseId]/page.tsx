"use client";

import { useState } from "react";
import {
  Container,
  Box,
  Tab,
  Grid,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import {
  LightText,
  PageContainer,
  StyledButton,
  PageTitle,
} from "@/components/styles/infrastructure/layout.styles";
import ResourcesForm from "@/components/creator/courses/create/resources-form/resources-form";
import CourseTagsForm from "@/components/creator/courses/course-tags-form";
import QuizManagement from "@/components/creator/courses/create/quiz-form/quiz-management";
import {
  StyledTabs,
  StyledLink,
  StyledBreadcrumbs,
  HeaderContainer,
  TabPanelContent,
  CourseChecklistContainer,
} from "@/components/styles/creator/create-course.styles";
import UpdateGeneralForm from "@/components/creator/courses/create/update-general-form";
import { useParams } from "next/navigation";
import CourseChecklist from "@/components/creator/courses/course-checklist";
import { VIEWPORT_MEDIA_QUERIES } from "@/utils/constants";
import { trpc } from "@/lib/trpc/client";
import { useSnackbar } from "notistack";
import ConfirmAlert from "@/components/confirm-alert";

function a11yProps(index: number) {
  return {
    id: `course-tab-${index}`,
    "aria-controls": `course-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
    >
      {value === index && <TabPanelContent>{children}</TabPanelContent>}
    </div>
  );
};

const EditCoursePage = () => {
  // General hooks
  const desktopMatches = useMediaQuery(VIEWPORT_MEDIA_QUERIES.DESKTOP);
  const params = useParams<{ courseId: string }>();
  const utils = trpc.useUtils();
  const { enqueueSnackbar } = useSnackbar();

  // States
  const [currentTab, setCurrentTab] = useState(0);
  const [isPublished, setIsPublished] = useState<boolean | null>(null);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  // Other variables
  const courseId = params?.courseId;

  // Mutations
  const { mutateAsync: togglePublishStatus, isPending: isPendingPublish } =
    trpc.courses.togglePublishStatus.useMutation({
      onSuccess: async (data) => {
        await utils.courses.getCourseDataById.invalidate(courseId!);
        await utils.courses.getCreatorCourses.invalidate();
        await utils.courses.getCourseProgressStatus.invalidate(courseId!);
        enqueueSnackbar(data.message, { variant: "success" });
      },
      onError: (error) => {
        enqueueSnackbar(`Failed to publish course: ${error.message}`, {
          variant: "error",
        });
      },
    });

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handlePublishCourse = () => {
    setShowPublishConfirm(true);
  };

  const confirmPublishCourse = async () => {
    await togglePublishStatus({
      courseId: courseId!,
      isPublished: true,
    });
  };
  console.log(desktopMatches);
  return (
    <PageContainer>
      <Container maxWidth="lg">
        {desktopMatches && courseId && (
          <CourseChecklistContainer>
            <CourseChecklist
              setIsPublished={setIsPublished}
              courseId={courseId}
            />
          </CourseChecklistContainer>
        )}
        <Grid container spacing={2}>
          {!desktopMatches && courseId && (
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ width: "100%", maxWidth: "320px" }}>
                <CourseChecklist
                  setIsPublished={setIsPublished}
                  courseId={courseId}
                />
              </Box>
            </Grid>
          )}

          <Grid size={{ xs: 12, lg: 8 }}>
            <HeaderContainer>
              <StyledBreadcrumbs aria-label="breadcrumb">
                <Link
                  href="/creator/courses"
                  style={{ textDecoration: "none" }}
                >
                  <StyledLink>My Courses</StyledLink>
                </Link>
                <LightText>Edit Course</LightText>
              </StyledBreadcrumbs>

              <Box
                sx={{
                  display: "flex",
                  direction: "row",
                  alignItems: "start",
                }}
              >
                <PageTitle variant="h4" gutterBottom>
                  Edit Course
                </PageTitle>
                {courseId && isPublished === false && (
                  <StyledButton
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handlePublishCourse}
                    disabled={isPendingPublish}
                    sx={{ ml: 2, textTransform: "none" }}
                  >
                    {isPendingPublish ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Publish Course"
                    )}
                  </StyledButton>
                )}
              </Box>

              <LightText variant="body1">
                Update your course details and content
              </LightText>
            </HeaderContainer>

            <Box sx={{ width: "100%" }}>
              <StyledTabs
                value={currentTab}
                onChange={handleTabChange}
                aria-label="course edit tabs"
              >
                <Tab label="General" {...a11yProps(0)} />
                <Tab label="Resources" {...a11yProps(1)} />
                <Tab label="Tags" {...a11yProps(2)} />
                <Tab label="Quizzes" {...a11yProps(3)} />
              </StyledTabs>

              <TabPanel value={currentTab} index={0}>
                <UpdateGeneralForm courseId={courseId} />
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                <ResourcesForm courseId={courseId} />
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                <CourseTagsForm courseId={courseId || ""} />
              </TabPanel>

              <TabPanel value={currentTab} index={3}>
                <QuizManagement courseId={courseId} />
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <ConfirmAlert
        open={showPublishConfirm}
        onClose={() => setShowPublishConfirm(false)}
        onConfirm={confirmPublishCourse}
        title="Publish Course"
        content="Your course is ready to go live! Are you sure you want to publish it?"
        confirmText="Yes, Publish"
        cancelText="Cancel"
        label="publish-course"
      />
    </PageContainer>
  );
};

export default EditCoursePage;
