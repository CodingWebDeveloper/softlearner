"use client";

import { MouseEvent } from "react";
import { ContinueButton } from "@/components/styles/home-page/home-page.styles";
import { useRouter } from "next/navigation";
import { PurchasedCourse } from "@/services/interfaces/service.interfaces";
import { trpc } from "@/lib/trpc/client";

interface ContinueCardProps {
  course: PurchasedCourse;
}

const ContinueCard = ({ course }: ContinueCardProps) => {
  const router = useRouter();

  const { data: nextResourceId } =
    trpc.resources.getNextResourceToComplete.useQuery(
      { courseId: course.id },
      {
        enabled: !!course.id,
      }
    );

  const handleContinue = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (nextResourceId) {
      // Navigate to the course materials with the resource selected
      router.push(
        `/courses/${course.id}/materials?resourceId=${nextResourceId}`
      );
    } else {
      // If no next resource, just navigate to the course
      router.push(`/courses/${course.id}/materials`);
    }
  };

  return (
    <ContinueButton
      variant="contained"
      onClick={handleContinue}
      aria-label={`Continue course: ${course.name}`}
    >
      Continue
    </ContinueButton>
  );
};

export default ContinueCard;
