import type { Metadata } from "next";
import { CommunityMarketplace } from "@/components/marketplace/community-marketplace";
import { getMarketplacePageData } from "@/lib/marketplace/data";

export const metadata: Metadata = {
  title: "Marketplace | RainGrid",
};

export default async function MarketplacePage() {
  const data = await getMarketplacePageData();

  return (
    <CommunityMarketplace
      listings={data.listings}
      requestHistory={data.requestHistory}
      summary={data.summary}
      error={data.error}
    />
  );
}
