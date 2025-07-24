import { FC } from "react";
import { Box, Stack } from "@mui/material";
import {
  InstructorBox,
  HeaderContainer,
  CourseTitle,
  InstructorName,
  InstructorRole,
  InstructorAvatar,
} from "@/components/styles/courses/course-details.styles";
import BookmarkCard from "../courses-list/bookmark-card";
import { BasicCourse } from "@/services/interfaces/service.interfaces";

interface Instructor {
  name: string;
  role: string;
  avatar: string;
}

interface CourseHeaderProps {
  course: BasicCourse;
  instructor: Instructor;
}

const CourseHeader: FC<CourseHeaderProps> = ({ course, instructor }) => {
  return (
    <HeaderContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <CourseTitle
          variant="h3"
          fontWeight={700}
          gutterBottom
          tabIndex={0}
          aria-label="Course Title"
        >
          {course.name}
        </CourseTitle>
        <BookmarkCard
          courseId={course.id}
          initialIsBookmarked={course.isBookmarked}
        />
      </Stack>

      <InstructorBox>
        <InstructorAvatar src={instructor.avatar} alt={instructor.name} />
        <Box>
          <InstructorName
            variant="h6"
            fontWeight={600}
            tabIndex={0}
            aria-label="Instructor Name"
          >
            {instructor.name}
          </InstructorName>
          <InstructorRole
            variant="body2"
            tabIndex={0}
            aria-label="Instructor Role"
          >
            {instructor.role}
          </InstructorRole>
        </Box>
      </InstructorBox>
    </HeaderContainer>
  );
};

export default CourseHeader;
