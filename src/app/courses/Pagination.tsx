import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={onChange}
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#fff',
            borderColor: '#4ecdc4',
          },
          '& .Mui-selected': {
            backgroundColor: '#4ecdc4',
            color: '#23242a',
          },
        }}
      />
    </Box>
  );
};

export default Pagination; 