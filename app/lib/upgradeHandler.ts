// app/lib/upgradeHandler.ts
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UpgradeOptions {
  plan: "monthly" | "annual";
  source?: string; // Track where upgrade came from
  specialOffer?: boolean;
  discountCode?: string;
}

export function useUpgradeHandler() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleUpgrade = async (options: UpgradeOptions) => {
    if (!session?.user?.email) {
      router.push("/auth/signin");
      return;
    }

    try {
      console.log("🎯 Initiating upgrade:", options);

      // Create Stripe checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: options.plan,
          source: options.source || "upgrade_popup",
          specialOffer: options.specialOffer || false,
          discountCode: options.discountCode,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Upgrade error:", error);

      // Show user-friendly error
      alert(error instanceof Error ? `Upgrade failed: ${error.message}` : "Something went wrong. Please try again.");
    }
  };

  const redirectToPlans = (source?: string) => {
    const utmSource = source ? `?utm_source=${source}` : "";
    router.push(`/dashboard/plans${utmSource}`);
  };

  return {
    handleUpgrade,
    redirectToPlans,
  };
}
