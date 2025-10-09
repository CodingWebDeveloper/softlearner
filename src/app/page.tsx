"use client";

import { ContentContainer } from "@/components/styles/home-page/home-page.styles";
import {
  LightText,
  PageHeader,
  WhiteText,
} from "@/components/styles/infrastructure/layout.styles";
import { useSupabase } from "@/contexts/supabase-context";
import StudentDashboard from "@/components/student/student-dashboard";
import CreatorDashboard from "@/components/creator/courses/analytics/creator-dashboard";

const Home = () => {
  // Custom hooks
  const { userProfile } = useSupabase();

  return (
    <ContentContainer maxWidth="xl">
      {userProfile?.role === "student" ? (
        <StudentDashboard />
      ) : (
        <CreatorDashboard />
      )}
    </ContentContainer>
  );
};

export default Home;
