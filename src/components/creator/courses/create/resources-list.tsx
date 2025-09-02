"use client";

import { useCallback } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateResourceOrder } from "@/lib/store/features/resourcesSlice";
import { Skeleton, Stack } from "@mui/material";
import { ResourceItem } from "@/components/styles/creator/resources-form.styles";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  ResourceList,
  DraggableWrapper,
  DragHandleWrapper,
  ResourceWrapper,
  ResourceItemContainer,
} from "@/components/styles/creator/resources-form.styles";
import {
  ResourcesContainer,
  ResourcesHeader,
} from "@/components/styles/creator/resources-list.styles";
import { SimpleResource } from "@/services/interfaces/service.interfaces";
import ResourceCard from "./resource-card";
// Removed unused imports

const ResourceSkeleton = () => {
  return (
    <ResourceItem>
      <Stack spacing={1} width="100%" sx={{ p: 1 }}>
        {/* Title */}
        <Skeleton variant="text" width="40%" height={24} />

        {/* Description */}
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />

        {/* Type label */}
        <Skeleton variant="text" width="20%" height={16} />
      </Stack>
    </ResourceItem>
  );
};

interface ResourcesListProps {
  resources: SimpleResource[];
  isLoading: boolean;
  courseId: string;
}

interface SortableItemProps {
  resource: SimpleResource;
  onDelete: (id: string) => void;
}

const SortableItem = ({ resource, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: resource.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <DraggableWrapper ref={setNodeRef} style={style} isDragging={isDragging}>
      <ResourceItemContainer>
        <DragHandleWrapper {...attributes} {...listeners}>
          <DragIndicatorIcon color="action" />
        </DragHandleWrapper>
        <ResourceWrapper>
          <ResourceCard resource={resource} onDelete={onDelete} />
        </ResourceWrapper>
      </ResourceItemContainer>
    </DraggableWrapper>
  );
};

const ResourcesList = ({ isLoading, resources }: ResourcesListProps) => {
  const dispatch = useAppDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDelete = (id: string) => {
    console.log("delete", id);
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = resources.findIndex((item) => item.id === active.id);
      const newIndex = resources.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(
          updateResourceOrder({
            resourceId: active.id as string,
            newIndex,
          })
        );
      }
    },
    [dispatch, resources]
  );

  if (isLoading) {
    return (
      <ResourcesContainer>
        <ResourcesHeader variant="h6" gutterBottom>
          <InsertDriveFileIcon /> Added Resources
        </ResourcesHeader>
        <ResourceList>
          {[1, 2, 3].map((i) => (
            <ResourceSkeleton key={i} />
          ))}
        </ResourceList>
      </ResourcesContainer>
    );
  }

  return (
    <ResourcesContainer>
      <ResourcesHeader variant="h6" gutterBottom>
        <InsertDriveFileIcon /> Added Resources
      </ResourcesHeader>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={resources.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          <ResourceList>
            {resources?.map((resource) => (
              <SortableItem
                key={resource.id}
                resource={resource}
                onDelete={handleDelete}
              />
            ))}
          </ResourceList>
        </SortableContext>
      </DndContext>
    </ResourcesContainer>
  );
};

export default ResourcesList;
