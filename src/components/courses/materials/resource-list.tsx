import React from 'react';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import {
  ResourcesListContainer,
  ResourceListItem,
  ResourceIcon,
  ResourceTitle,
} from '@/components/styles/courses/materials.styles';

interface Resource {
  id: number;
  title: string;
  url: string;
}

interface ResourceListProps {
  resources: Resource[];
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => (
  <ResourcesListContainer>
    {resources.map((resource) => (
      <a key={resource.id} href={resource.url} download style={{ textDecoration: 'none' }}>
        <ResourceListItem>
          <ResourceIcon>
            <MenuBookRoundedIcon fontSize="inherit" />
          </ResourceIcon>
          <ResourceTitle>{resource.title}</ResourceTitle>
        </ResourceListItem>
      </a>
    ))}
  </ResourcesListContainer>
);

export default ResourceList; 