"use client";

import { Box, Grid, Typography } from "@mui/material";
import {
  AdminActionCard,
  AdminActionCardContent,
  AdminActionIcon,
  AdminActionButton,
} from "@/components/styles/admin/admin-dashboard.styles";
import { People as PeopleIcon } from "@mui/icons-material";
import { useRouter as useNextRouter } from "next/navigation";

const AdminDashboard = () => {
  const nextRouter = useNextRouter();

  const adminActions = [
    {
      title: "Creator Applications",
      description: "Review and manage creator applications",
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: "/admin/creator-applications",
      color: "primary.main",
    },
    // {
    //   title: "User Management",
    //   description: "Manage platform users and roles",
    //   icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    //   path: "/admin/users",
    //   color: "secondary.main",
    // },
    // {
    //   title: "Categories",
    //   description: "Manage course categories",
    //   icon: <CategoryIcon sx={{ fontSize: 40 }} />,
    //   path: "/admin/categories",
    //   color: "success.main",
    // },
    // {
    //   title: "Tags",
    //   description: "Manage course tags",
    //   icon: <TagIcon sx={{ fontSize: 40 }} />,
    //   path: "/admin/tags",
    //   color: "info.main",
    // },
    // {
    //   title: "Analytics",
    //   description: "View platform statistics and reports",
    //   icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
    //   path: "/admin/analytics",
    //   color: "warning.main",
    // },
    // {
    //   title: "Security",
    //   description: "Monitor security and system logs",
    //   icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    //   path: "/admin/security",
    //   color: "error.main",
    // },
  ];

  return (
    <>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage creator applications and platform content
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {adminActions.map((action) => (
          <Grid key={action.path} size={{ xs: 12, sm: 6, md: 4 }}>
            <AdminActionCard onClick={() => nextRouter.push(action.path)}>
              <AdminActionCardContent>
                <AdminActionIcon sx={{ color: action.color }}>
                  {action.icon}
                </AdminActionIcon>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {action.description}
                </Typography>
                <AdminActionButton
                  variant="outlined"
                  size="small"
                  sx={{ color: action.color, borderColor: action.color }}
                >
                  Access
                </AdminActionButton>
              </AdminActionCardContent>
            </AdminActionCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default AdminDashboard;
