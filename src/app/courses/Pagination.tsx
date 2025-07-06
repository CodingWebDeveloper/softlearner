import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { PaginationContainer, StyledPagination } from './courses.styled';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  const theme = useTheme();
  
  if (totalPages <= 1) return null;
  return (
    <PaginationContainer>
      <StyledPagination
        count={totalPages}
        page={currentPage}
        onChange={onChange}
        color="primary"
      />
    </PaginationContainer>
  );
};

export default Pagination; 