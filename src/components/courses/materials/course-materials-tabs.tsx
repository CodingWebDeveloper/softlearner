"use client";

import { FC, SyntheticEvent } from "react";
import { Box, Tabs, useTheme } from "@mui/material";
import {
  VideoListSection,
  StyledTab,
} from "@/components/styles/courses/materials.styles";
import QuizList from "./quiz-list";
import ResourceList from "./resource-list";
import { useSearchParams, useRouter } from "next/navigation";

interface CourseMaterialsTabsProps {
  courseId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TABS = [
  { label: "Resources", value: 0, param: "resources" },
  { label: "Quizzes", value: 1, param: "quizzes" },
] as const;

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current tab from URL or default to resources
  const currentTab =
    TABS.find((tab) => tab.param === searchParams.get("tab")) || TABS[0];

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    const newTab = TABS[newValue];
    // Create new URLSearchParams with only the tab parameter
    const params = new URLSearchParams();
    params.set("tab", newTab.param);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <VideoListSection>
      <Tabs
        value={currentTab.value}
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
            selected={currentTab.value === tabItem.value}
          />
        ))}
      </Tabs>
      <TabPanel value={currentTab.value} index={0}>
        <ResourceList courseId={courseId} />
      </TabPanel>
      <TabPanel value={currentTab.value} index={1}>
        <QuizList courseId={courseId} />
      </TabPanel>
    </VideoListSection>
  );
};

export default CourseMaterialsTabs;
