import { FC, useState, KeyboardEvent } from 'react';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
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
  PreviewIcon,
  DialogContentStyled,
  VideoContainer,
  VideoIframe,
  CloseButtonContainer,
  CloseButtonStyled,
  PriceContainer,
  DividerStyled,
  ClickablePreviewBox
} from '@/components/styles/courses/course-details.styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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

const YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ'; // Replace with actual video id or pass as prop if needed

const CourseSidebar: FC<CourseSidebarProps> = ({ price, discount, meta, image }) => {
  // Hooks
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Variables/State
  const discountedPrice = (price * (1 - discount)).toFixed(2);

  // Handlers
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handlePreviewBoxKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenDialog();
    }
  };

  return (
    <CardStyled>
      <ClickablePreviewBox
        tabIndex={0}
        aria-label="Course Preview Image"
        onClick={handleOpenDialog}
        onKeyDown={handlePreviewBoxKeyDown}
        role="button"
      >
        <PreviewIcon />
      </ClickablePreviewBox>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="course-preview-dialog-title"
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        {isMobile ? (
          <DialogContentStyled $isMobile>
            <CloseButtonContainer>
              <CloseButtonStyled
                aria-label="close"
                onClick={handleCloseDialog}
              >
                <CloseIcon />
              </CloseButtonStyled>
            </CloseButtonContainer>
            <VideoContainer>
              <VideoIframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                title="Course Preview Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>
          </DialogContentStyled>
        ) : (
          <DialogContentStyled $isMobile={false}>
            <CloseButtonContainer>
              <CloseButtonStyled
                aria-label="close"
                onClick={handleCloseDialog}
              >
                <CloseIcon />
              </CloseButtonStyled>
            </CloseButtonContainer>
            <VideoContainer>
              <VideoIframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                title="Course Preview Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </VideoContainer>
          </DialogContentStyled>
        )}
      </Dialog>

      <PriceContainer>
        <DiscountedPrice component="span" tabIndex={0} aria-label="Discounted Price">
          ${discountedPrice} USD
        </DiscountedPrice>
        <OldPrice component="span" tabIndex={0} aria-label="Original Price">
          ${price.toFixed(2)} USD
        </OldPrice>
      </PriceContainer>

      <AddToCartButton
        variant="contained"
        color="primary"
        fullWidth
        aria-label="Add to Cart"
        tabIndex={0}
        onClick={() => {}}
        onKeyDown={(e: KeyboardEvent) => { if (e.key === 'Enter') {/* handle add to cart */} }}
      >
        ADD TO CART
      </AddToCartButton>

      <DividerStyled />
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