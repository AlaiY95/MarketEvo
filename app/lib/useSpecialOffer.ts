// app/lib/useSpecialOffer.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface SpecialOfferState {
  upgradeAttempts: number;
  lastAttemptTime: number;
  hasSeenSpecialOffer: boolean;
  hasAcceptedOffer: boolean;
}

export function useSpecialOffer() {
  const { data: session } = useSession();
  const [showSpecialOffer, setShowSpecialOffer] = useState(false);
  const [offerState, setOfferState] = useState<SpecialOfferState>({
    upgradeAttempts: 0,
    lastAttemptTime: 0,
    hasSeenSpecialOffer: false,
    hasAcceptedOffer: false,
  });

  // Load state from localStorage on mount
  useEffect(() => {
    if (!session?.user?.email) return;

    const storageKey = `special-offer-${session.user.email}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOfferState(parsed);
      } catch (error) {
        console.error("Error parsing special offer state:", error);
      }
    }
  }, [session?.user?.email]);

  // Save state to localStorage whenever it changes
  const saveState = (newState: SpecialOfferState) => {
    if (!session?.user?.email) return;

    const storageKey = `special-offer-${session.user.email}`;
    localStorage.setItem(storageKey, JSON.stringify(newState));
    setOfferState(newState);
  };

  // Track when user attempts to upgrade
  const trackUpgradeAttempt = () => {
    const now = Date.now();
    const newState = {
      ...offerState,
      upgradeAttempts: offerState.upgradeAttempts + 1,
      lastAttemptTime: now,
    };

    saveState(newState);

    // Show special offer if:
    // 1. User has attempted 2+ times
    // 2. Haven't seen the special offer yet
    // 3. Haven't already accepted an offer
    // 4. Last attempt was within 24 hours
    const timeSinceLastAttempt = now - offerState.lastAttemptTime;
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (newState.upgradeAttempts >= 2 && !newState.hasSeenSpecialOffer && !newState.hasAcceptedOffer && timeSinceLastAttempt < oneDayMs) {
      // Small delay to make it feel more natural
      setTimeout(() => {
        setShowSpecialOffer(true);
        saveState({
          ...newState,
          hasSeenSpecialOffer: true,
        });
      }, 2000);
    }
  };

  // Handle when user accepts the special offer
  const acceptSpecialOffer = (planType: "monthly" | "annual") => {
    saveState({
      ...offerState,
      hasAcceptedOffer: true,
    });
    setShowSpecialOffer(false);

    // Here you would integrate with your payment system
    // For now, redirect to plans page with discount code
    window.location.href = `/dashboard/plans?discount=SPECIAL50&plan=${planType}`;
  };

  // Handle when user closes the offer
  const closeSpecialOffer = () => {
    setShowSpecialOffer(false);
    // Don't mark as accepted, but user has seen it
  };

  // Reset for testing (development only)
  const resetOfferState = () => {
    if (process.env.NODE_ENV === "development" && session?.user?.email) {
      const storageKey = `special-offer-${session.user.email}`;
      localStorage.removeItem(storageKey);
      setOfferState({
        upgradeAttempts: 0,
        lastAttemptTime: 0,
        hasSeenSpecialOffer: false,
        hasAcceptedOffer: false,
      });
    }
  };

  return {
    showSpecialOffer,
    offerState,
    trackUpgradeAttempt,
    acceptSpecialOffer,
    closeSpecialOffer,
    resetOfferState, // For dev testing
  };
}
