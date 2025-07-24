"use client";
import CourseVideoSection from "@/components/courses/materials/course-video-section";
import CourseMaterialsTabs from "@/components/courses/materials/course-materials-tabs";
import { CourseMaterialsContainer } from "@/components/styles/courses/materials.styles";
import LoadingFallback from "@/components/loading-fallback";
import { trpc } from "@/lib/trpc/client";
import { useParams } from "next/navigation";

const CourseMaterialsPage = () => {
  // General hooks
  const { courseId } = useParams();

  // TRPC hooks
  const { data: course, isLoading } =
    trpc.courses.getCourseMaterialsById.useQuery(courseId as string);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <CourseMaterialsContainer>
      <CourseVideoSection course={course} />
      <CourseMaterialsTabs courseId={courseId as string} />
    </CourseMaterialsContainer>
  );
};

export default CourseMaterialsPage;
