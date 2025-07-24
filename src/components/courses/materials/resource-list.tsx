import { FC } from "react";
import { Skeleton, ListItemAvatar, Avatar } from "@mui/material";
import {
  ResourceMaterialItem,
  ResourcesListContainer,
  StyledListItemText,
} from "@/components/styles/courses/materials.styles";
import { trpc } from "@/lib/trpc/client";
import ResourceCard from "./resource-card";

interface ResourceListProps {
  courseId: string;
  currentResourceId?: string;
  onResourceSelect?: (resourceId: string) => void;
}

const ResourceSkeleton = () => (
  <>
    {[...Array(5)].map((_, index) => (
      <ResourceMaterialItem key={index}>
        <ListItemAvatar>
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        </ListItemAvatar>
        <StyledListItemText
          primary={<Skeleton width="60%" />}
          secondary={<Skeleton width="30%" />}
        />
      </ResourceMaterialItem>
    ))}
  </>
);

const ResourceList: FC<ResourceListProps> = ({
  courseId,
  currentResourceId,
  onResourceSelect,
}) => {
  const {
    data: resources,
    isLoading,
    error,
  } = trpc.resources.getResourceMaterialsByCourseId.useQuery(
    { courseId },
    {
      enabled: !!courseId,
    }
  );

  if (isLoading) {
    return (
      <ResourcesListContainer>
        <ResourceSkeleton />
      </ResourcesListContainer>
    );
  }

  if (error) {
    return <div>Error loading resources: {error.message}</div>;
  }

  if (!resources?.length) {
    return <div>No resources available</div>;
  }

  return (
    <ResourcesListContainer>
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          isSelected={currentResourceId === resource.id}
          onSelect={onResourceSelect}
        />
      ))}
    </ResourcesListContainer>
  );
};

export default ResourceList;
