"use client";

import { useState } from "react";
import GeneralForm from "@/components/creator/courses/create/general-form";
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.custom.background.tertiary}`,
  "& .MuiTab-root": {
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 500,
    minHeight: 48,
    marginRight: theme.spacing(3),
    color: theme.palette.custom.text.light,
    "&.Mui-selected": {
      color: theme.palette.custom.accent.teal,
    },
    "&.Mui-disabled": {
      color: theme.palette.custom.accent.gray,
    },
    "&:hover": {
      color: theme.palette.custom.accent.teal,
    },
  },
  "& .MuiTabs-indicator": {
    height: 3,
    backgroundColor: theme.palette.custom.accent.teal,
  },
}));

const StyledLink = styled("span")({
  textDecoration: "none",
  cursor: "pointer",
  color: "inherit",
  "&:hover": {
    textDecoration: "underline",
  },
});

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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const CreateCoursePage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <Box mb={4}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link href="/creator/courses" style={{ textDecoration: "none" }}>
              <StyledLink>My Courses</StyledLink>
            </Link>
            <Typography color="text.primary">Create Course</Typography>
          </Breadcrumbs>

          <Typography variant="h4" component="h1" gutterBottom>
            Create Course
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the course details and content
          </Typography>
        </Box>

        <Box sx={{ width: "100%" }}>
          <StyledTabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="course creation tabs"
          >
            <Tab label="General" />
            <Tooltip
              title="Will be enabled after creating the course"
              arrow
              placement="top"
            >
              <span>
                <Tab label="Resources" disabled style={{ width: "100%" }} />
              </span>
            </Tooltip>
            <Tooltip
              title="Will be enabled after creating the course"
              arrow
              placement="top"
            >
              <span>
                <Tab label="Quizzes" disabled style={{ width: "100%" }} />
              </span>
            </Tooltip>
            <Tooltip
              title="Will be enabled after creating the course"
              arrow
              placement="top"
            >
              <span>
                <Tab label="Tags" disabled style={{ width: "100%" }} />
              </span>
            </Tooltip>
          </StyledTabs>

          <TabPanel value={currentTab} index={0}>
            <GeneralForm />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            {/* Resources Component will go here */}
            <Typography>Resources Management</Typography>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            {/* Quizzes Component will go here */}
            <Typography>Quizzes Management</Typography>
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            {/* Tags Component will go here */}
            <Typography>Tags Management</Typography>
          </TabPanel>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default CreateCoursePage;
