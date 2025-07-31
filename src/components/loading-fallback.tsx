"use client";

import {
  EmptyStateContainer,
  EmptyStateIllustration,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateButton,
  EmptyStateIcon,
} from "@/components/styles/infrastructure/layout.styles";
import { School, TrendingUp, Bookmark } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { HashLoader } from "react-spinners";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonAction?: () => void;
  icon?: React.ReactNode;
  type?: "courses" | "bookmarks" | "general";
}

export const EmptyState = ({
  title,
  description,
  buttonText,
  buttonAction,
  icon,
  type = "general",
}: EmptyStateProps) => {
  const router = useRouter();

  const getDefaultIcon = () => {
    switch (type) {
      case "courses":
        return <School />;
      case "bookmarks":
        return <Bookmark />;
      default:
        return <TrendingUp />;
    }
  };

  const handleDefaultAction = () => {
    if (type === "courses") {
      router.push("/courses");
    } else if (type === "bookmarks") {
      router.push("/courses");
    } else {
      router.push("/courses");
    }
  };

  const handleButtonClick = () => {
    if (buttonAction) {
      buttonAction();
    } else {
      handleDefaultAction();
    }
  };

  return (
    <EmptyStateContainer>
      <EmptyStateIllustration>
        <EmptyStateIcon>{icon || getDefaultIcon()}</EmptyStateIcon>
      </EmptyStateIllustration>

      <EmptyStateTitle variant="h3">{title}</EmptyStateTitle>

      <EmptyStateDescription variant="body1">
        {description}
      </EmptyStateDescription>

      {buttonText && (
        <EmptyStateButton
          variant="contained"
          onClick={handleButtonClick}
          startIcon={type === "courses" ? <School /> : <Bookmark />}
        >
          {buttonText}
        </EmptyStateButton>
      )}
    </EmptyStateContainer>
  );
};

const LoadingFallback = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1a1b23",
      }}
    >
      <HashLoader color="#4ecdc4" size={50} />
    </div>
  );
};

export default LoadingFallback;
