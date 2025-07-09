
import { PaginationContainer, StyledPagination } from '@/components/styles/courses/courses.styles';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  
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