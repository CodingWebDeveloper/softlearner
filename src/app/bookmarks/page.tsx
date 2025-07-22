"use client";
import BookmarkedCoursesList from "@/components/courses/courses-list/bookmarked-courses-list";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";

export default function BookmarksPage() {
  return (
    <PageContainer>
      <BookmarkedCoursesList />
    </PageContainer>
  );
}
