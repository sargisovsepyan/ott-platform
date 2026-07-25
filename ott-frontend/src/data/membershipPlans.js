export const MEMBERSHIP_PLANS = [
  {
    slug: "essential",
    name: "Essential",
    price: "$5.99",
    cadence: "/ month",
    features: [
      "HD quality",
      "Watch on 1 device",
      "Limited ads",
      "Access to the core catalogue",
    ],
  },
  {
    slug: "standard",
    name: "Standard",
    price: "$10.99",
    cadence: "/ month",
    badge: "Most popular",
    features: [
      "Full HD quality",
      "Watch on 2 devices",
      "No ads",
      "Offline downloads",
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    price: "$15.99",
    cadence: "/ month",
    features: [
      "4K Ultra HD and HDR",
      "Watch on 4 devices",
      "No ads",
      "Offline downloads",
      "Spatial audio where supported",
    ],
  },
];

export function getMembershipPlan(slug) {
  if (typeof slug !== "string") {
    return null;
  }

  return (
    MEMBERSHIP_PLANS.find(
      (plan) => plan.slug === slug.trim().toLocaleLowerCase(),
    ) ?? null
  );
}
