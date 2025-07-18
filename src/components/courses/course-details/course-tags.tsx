"use client";

import { FC } from "react";
import { Skeleton } from "@mui/material";
import { trpc } from "@/lib/trpc/trpc";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  TagsContainer,
  CourseTagChip,
} from "@/components/styles/courses/course-tags.styles";

interface CourseTagsProps {
  courseId: string;
}

const CourseTags: FC<CourseTagsProps> = ({ courseId }) => {
  const {
    data: tags,
    isLoading,
    error,
  } = trpc.tags.getTagsByCourseId.useQuery({ courseId });

  if (isLoading) {
    return (
      <TagsContainer>
        {[...Array(3)].map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={80}
            height={32}
            sx={{ borderRadius: 4 }}
          />
        ))}
      </TagsContainer>
    );
  }

  if (error || !tags) {
    return null;
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <TagsContainer>
      {tags.map((tag) => (
        <CourseTagChip
          key={tag.id}
          label={tag.name}
          icon={<LocalOfferIcon />}
        />
      ))}
    </TagsContainer>
  );
};

export default CourseTags;
