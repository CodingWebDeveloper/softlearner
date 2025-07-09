import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  ConfirmDialog,
  TopLevelDialog,
  StyledDialogText,
  ConfirmDialogButton,
  CloseDialogButton,
  StyledDivider,
  MaxContentButton,
  StyledDialog,
  StyledDialogContent,
  StyledDialogTitle,
  StyledDividerWithSpace,
  CancelButton,
  CancelConfirmAlertButton,
} from './styles/confirm-alert/confirm-alert.styles';

interface ConfirmAlertProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  showConfirm?: boolean;
  label?: string;
}

const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  content = 'You will lose your progress.',
  confirmText = 'Yes, Close',
  cancelText = 'Cancel',
  showConfirm = true,
  label = 'confirm-alert',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <StyledDialog
        id="mobile-confirm-alert"
        fullWidth
        open={open}
        onClose={onClose}
        keepMounted
      >
        <StyledDialogContent>
          {title && (
            <>
              <StyledDialogTitle id="alert-dialog-title">{title}</StyledDialogTitle>
              <StyledDivider />
            </>
          )}
          {content && (
            <StyledDialogText id="alert-dialog-description">{content}</StyledDialogText>
          )}
          <StyledDividerWithSpace />
          {showConfirm && (
            <ConfirmDialogButton
              id={`confirm-${label}`}
              data-testid="confirm"
              color="error"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              autoFocus
            >
              {confirmText}
            </ConfirmDialogButton>
          )}
        </StyledDialogContent>
        <CancelButton id={`cancel-${label}`} onClick={onClose}>
          {cancelText}
        </CancelButton>
      </StyledDialog>
    );
  }

  return (
    <TopLevelDialog
      id="desktop-confirm-alert"
      fullWidth
      open={open}
      onClose={onClose}
      keepMounted
    >
      <DialogTitle id="alert-dialog-title" fontWeight="bolder">
        {title}
      </DialogTitle>
      <DialogContent id="alert-dialog-description">{content}</DialogContent>
      <DialogActions>
        <CancelConfirmAlertButton
          variant="outlined"
          id={`cancel-${label}`}
          onClick={onClose}
        >
          {cancelText}
        </CancelConfirmAlertButton>
        {showConfirm && (
          <MaxContentButton
            id={`confirm-${label}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </MaxContentButton>
        )}
      </DialogActions>
    </TopLevelDialog>
  );
};

export default ConfirmAlert; 