import { FC, useEffect, useRef } from "react";
import { Skeleton, ListItemAvatar, Avatar } from "@mui/material";
import {
  ResourceMaterialItem,
  ResourcesListContainer,
  StyledListItemText,
} from "@/components/styles/courses/materials.styles";
import { trpc } from "@/lib/trpc/client";
import ResourceCard from "./resource-card";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setResource,
  selectResource,
} from "@/lib/store/features/resourceSlice";

interface ResourceListProps {
  courseId: string;
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

const ResourceList: FC<ResourceListProps> = ({ courseId }) => {
  // General hooks
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const selectedResource = useAppSelector(selectResource);
  const resourceId = searchParams.get("resourceId");
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Handle initial load and URL sync
  useEffect(() => {
    if (resources) {
      // Only set from URL if no resource is selected (initial load/refresh)
      if (resourceId && !selectedResource) {
        const resource = resources.find((r) => r.id === resourceId);
        if (resource) {
          dispatch(setResource(resource));
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources]);

  // Scroll to selected resource
  useEffect(() => {
    if (selectedResource && containerRef.current) {
      const selectedElement = containerRef.current.querySelector(
        `[data-resource-id="${selectedResource.id}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedResource]);

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
    <ResourcesListContainer ref={containerRef}>
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </ResourcesListContainer>
  );
};

export default ResourceList;
