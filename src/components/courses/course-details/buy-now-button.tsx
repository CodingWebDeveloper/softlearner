import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { StyledButton } from "@/components/styles/infrastructure/layout.styles";

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
        mod.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!),
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
        fullWidth
        variant="contained"
        onClick={() => router.push(`/courses/${courseId}/materials`)}
      >
        Go to Course
      </StyledButton>
    );
  }

  return (
    <StyledButton
      fullWidth
      variant="contained"
      onClick={handlePurchase}
      disabled={isLoading}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : "Buy Now"}
    </StyledButton>
  );
};
