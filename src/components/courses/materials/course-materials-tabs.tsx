"use client";

import { FC, SyntheticEvent, useState } from "react";
import { Box, Tabs, useTheme } from "@mui/material";
import {
  VideoListSection,
  StyledTab,
} from "@/components/styles/courses/materials.styles";
import QuizList from "./quiz-list";
import ResourceList from "./resource-list";

interface CourseMaterialsTabsProps {
  courseId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TABS = [
  { label: "Resources", value: 0 },
  { label: "Quizzes", value: 1 },
];

export const TabPanel = ({
  children,
  value,
  index,
  ...other
}: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box pt={2}>{children}</Box>}
    </div>
  );
};

const CourseMaterialsTabs: FC<CourseMaterialsTabsProps> = ({ courseId }) => {
  // General hooks
  const theme = useTheme();

  const [tab, setTab] = useState(0);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <VideoListSection>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="Course Materials Tabs"
        variant="fullWidth"
        slotProps={{
          indicator: {
            style: {
              backgroundColor: theme.palette.custom.accent.blue,
            },
          },
        }}
        textColor="inherit"
      >
        {TABS.map((tabItem) => (
          <StyledTab
            key={tabItem.value}
            label={tabItem.label}
            id={`tab-${tabItem.value}`}
            aria-controls={`tabpanel-${tabItem.value}`}
            selected={tab === tabItem.value}
          />
        ))}
      </Tabs>
      <TabPanel value={tab} index={0}>
        <ResourceList courseId={courseId} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <QuizList courseId={courseId} />
      </TabPanel>
    </VideoListSection>
  );
};

export default CourseMaterialsTabs;
