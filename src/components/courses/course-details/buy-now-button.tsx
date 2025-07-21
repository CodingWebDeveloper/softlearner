import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  fontSize: "1.1rem",
  fontWeight: 600,
}));

interface BuyNowButtonProps {
  courseId: string;
  isEnrolled?: boolean;
}

export const BuyNowButton = ({ courseId, isEnrolled }: BuyNowButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const createCheckoutSession =
    trpc.payments.createCheckoutSession.useMutation();

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      const { sessionId } = await createCheckoutSession.mutateAsync({
        courseId,
        successUrl: `${window.location.origin}/courses/${courseId}?purchase=success`,
        cancelUrl: `${window.location.origin}/courses/${courseId}`,
      });

      // Redirect to Stripe Checkout
      const stripe = await import("@stripe/stripe-js").then((mod) =>
        mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      );

      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Purchase error:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <StyledButton
        variant="contained"
        color="primary"
        onClick={() => router.push(`/courses/${courseId}/materials`)}
      >
        Go to Course
      </StyledButton>
    );
  }

  return (
    <StyledButton
      variant="contained"
      color="primary"
      onClick={handlePurchase}
      disabled={isLoading}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : "Buy Now"}
    </StyledButton>
  );
};
