"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import {
  LightText,
  WhiteText,
} from "@/components/styles/infrastructure/layout.styles";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h6" sx={{ color: "custom.text.white", mb: 1 }}>
    {children}
  </Typography>
);

const SubtleText = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" sx={{ color: "custom.text.light" }}>
    {children}
  </Typography>
);

const PAGE_SIZE = 5;

const RecentTestResultsWidget: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = trpc.tests.getRecentTestResults.useQuery(
    { page, pageSize: PAGE_SIZE }
  );

  const items = data?.data ?? [];
  const total = data?.totalRecords ?? 0;
  const hasMore = page * PAGE_SIZE < total;

  return (
    <Card sx={{ backgroundColor: "custom.background.secondary" }}>
      <CardContent>
        <SectionTitle>Recent Test Results</SectionTitle>
        {isPending ? (
          <Stack spacing={1}>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={40} />
            ))}
          </Stack>
        ) : isError ? (
          <SubtleText>Failed to load recent test results.</SubtleText>
        ) : items.length === 0 ? (
          <SubtleText>No tests taken yet.</SubtleText>
        ) : (
          <Stack spacing={1}>
            {items.map((t) => {
              const pct =
                t.maxScore > 0 ? Math.round((t.score / t.maxScore) * 100) : 0;
              return (
                <Box key={t.id}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    gap={1}
                  >
                    <WhiteText variant="subtitle2">{t.title}</WhiteText>
                    <LightText variant="body2">
                      {new Date(
                        t.updated_at || t.created_at
                      ).toLocaleDateString()}{" "}
                      • {pct}%
                    </LightText>
                  </Stack>
                  <Divider sx={{ my: 1, opacity: 0.1 }} />
                </Box>
              );
            })}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                variant="outlined"
                size="small"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <SubtleText>
                Page {page} • {items.length} of {total}
              </SubtleText>
              <Button
                variant="outlined"
                size="small"
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTestResultsWidget;
