import { createFileRoute } from "@tanstack/react-router";
import { ReviewBox } from "@/components/review-box";
import { ShopReferral } from "@/components/referral";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
  head: () => ({ meta: [{ title: "Review · Research Library" }] }),
});

function ReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ReviewBox />
      <ShopReferral />
    </div>
  );
}
