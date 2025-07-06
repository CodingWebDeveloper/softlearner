import React from 'react';
import { Button, Divider, Stack, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import { 
  DiscountedPrice, 
  OldPrice, 
  MetaItem, 
  SidebarPreviewBox, 
  CardStyled,
  AddToCartButton,
  MetaItemText,
  PreviewIcon
} from './courseDetails.styled';

interface Meta {
  level: string;
  duration: string;
  videos: number;
  files: number;
  lifetime: boolean;
  deviceAccess: boolean;
}

interface CourseSidebarProps {
  price: number;
  discount: number;
  meta: Meta;
  image: string;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ price, discount, meta, image }) => {
  const theme = useTheme();
  const discountedPrice = (price * (1 - discount)).toFixed(2);
  
  return (
    <CardStyled>
      <SidebarPreviewBox tabIndex={0} aria-label="Course Preview Image">
        <PreviewIcon />
      </SidebarPreviewBox>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <DiscountedPrice component="span" tabIndex={0} aria-label="Discounted Price">
          ${discountedPrice} USD
        </DiscountedPrice>
        <OldPrice component="span" tabIndex={0} aria-label="Original Price">
          ${price.toFixed(2)} USD
        </OldPrice>
      </Box>
      <AddToCartButton
        variant="contained"
        color="primary"
        fullWidth
        aria-label="Add to Cart"
        tabIndex={0}
        onClick={() => {}}
        onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') {/* handle add to cart */} }}
      >
        ADD TO CART
      </AddToCartButton>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={1.5}>
        <MetaItem tabIndex={0} aria-label={`Level: ${meta.level}`}>
          <MenuBookOutlinedIcon color="primary" />
          <MetaItemText>
            <b>Level:</b> {meta.level}
          </MetaItemText>
        </MetaItem>
        <MetaItem tabIndex={0} aria-label={`Duration: ${meta.duration}`}>
          <AccessTimeOutlinedIcon color="primary" />
          <MetaItemText>
            <b>Duration:</b> {meta.duration}
          </MetaItemText>
        </MetaItem>
        <MetaItem tabIndex={0} aria-label={`Videos: ${meta.videos}`}>
          <PlayCircleOutlineIcon color="primary" />
          <MetaItemText>
            <b>Videos:</b> {meta.videos}
          </MetaItemText>
        </MetaItem>
        <MetaItem tabIndex={0} aria-label={`Downloadable Files: ${meta.files}`}>
          <CloudDownloadOutlinedIcon color="primary" />
          <MetaItemText>
            <b>Downloadable Files:</b> {meta.files}
          </MetaItemText>
        </MetaItem>
        {meta.lifetime && (
          <MetaItem tabIndex={0} aria-label="Lifetime Access">
            <CheckCircleOutlineOutlinedIcon color="primary" />
            <MetaItemText>Lifetime Access</MetaItemText>
          </MetaItem>
        )}
        {meta.deviceAccess && (
          <MetaItem tabIndex={0} aria-label="Device Access">
            <DevicesOutlinedIcon color="primary" />
            <MetaItemText>Access from any Computer, Tablet or Mobile</MetaItemText>
          </MetaItem>
        )}
      </Stack>
    </CardStyled>
  );
};

export default CourseSidebar; 