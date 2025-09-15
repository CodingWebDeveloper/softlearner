"use client";

import { useSupabase } from "@/contexts/supabase-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import { PageContainer } from "@/components/styles/infrastructure/layout.styles";
import { ROLES } from "@/utils/constants";
import CreatorCoursesTable from "@/components/creator/courses/creator-courses-table";
import { trpc } from "@/lib/trpc/client";
import { LightText } from "@/components/styles/infrastructure/layout.styles";

const CreatorCoursesPage = () => {
  // General hooks
  const { user, userProfile, loading } = useSupabase();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting state
  const [sortBy, setSortBy] = useState<
    "name" | "category" | "price" | "created_at" | "updated_at"
  >("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Queries
  const { data: coursesData, isPending: isLoadingCourses } =
    trpc.courses.getCreatorCourses.useQuery({
      page,
      pageSize,
      sortBy,
      sortDir,
    });

  // Effects
  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== ROLES.CREATOR)) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userProfile, loading]);

  const handleChangeSort = (columnId: string) => {
    // Map UI column ids to backend sort keys
    const map: Record<string, typeof sortBy> = {
      name: "name",
      category: "category",
      price: "price",
      createdAt: "created_at",
      updatedAt: "updated_at",
    };
    const nextSortBy = map[columnId] ?? "created_at";

    if (nextSortBy === sortBy) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
      return;
    }

    setSortBy(nextSortBy);
    setSortDir("asc");
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <Box mb={4}>
          <LightText variant="h4" gutterBottom>
            My Courses
          </LightText>
          <LightText variant="body1" color="text.secondary">
            Manage your created courses
          </LightText>
        </Box>
        <CreatorCoursesTable
          courses={coursesData?.data || []}
          total={coursesData?.totalRecords || 0}
          isLoading={isLoadingCourses}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          sortBy={sortBy}
          sortDir={sortDir}
          onChangeSort={handleChangeSort}
        />
      </Container>
    </PageContainer>
  );
};

export default CreatorCoursesPage;
