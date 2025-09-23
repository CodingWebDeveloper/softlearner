"use client";

import { ContentContainer } from "@/components/styles/home-page/home-page.styles";
import {
  LightText,
  PageHeader,
  WhiteText,
} from "@/components/styles/infrastructure/layout.styles";
import { useSupabase } from "@/contexts/supabase-context";

const Home = () => {
  // Custom hooks
  const { userProfile } = useSupabase();

  return (
    <ContentContainer maxWidth="xl">
      <PageHeader>
        <WhiteText variant="h3">
          Welcome{" "}
          <LightText variant="h3" component="span">
            {userProfile?.full_name}
          </LightText>
        </WhiteText>
      </PageHeader>
    </ContentContainer>
  );
};

export default Home;
