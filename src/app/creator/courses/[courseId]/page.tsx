"use client";

import { useState } from "react";
import { Container, Box, Tab } from "@mui/material";
import Link from "next/link";
import {
  LightText,
  PageContainer,
  WhiteText,
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
} from "@/components/styles/creator/create-course.styles";
import UpdateGeneralForm from "@/components/creator/courses/create/update-general-form";
import { useParams } from "next/navigation";
import CourseSettings from "@/components/creator/courses/course-settings";

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
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <HeaderContainer>
          <StyledBreadcrumbs aria-label="breadcrumb">
            <Link href="/creator/courses" style={{ textDecoration: "none" }}>
              <StyledLink>My Courses</StyledLink>
            </Link>
            <LightText>Edit Course</LightText>
          </StyledBreadcrumbs>

          <WhiteText variant="h4" gutterBottom>
            Edit Course
          </WhiteText>
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
            <Tab label="Settings" {...a11yProps(4)} />
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

          <TabPanel value={currentTab} index={4}>
            <CourseSettings courseId={courseId} />
          </TabPanel>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default EditCoursePage;
