import type { Metadata } from "next";
import { ListingsManagement } from "@/components/marketplace/listings-management";
import { getListingsPageData } from "@/lib/marketplace/data";

export const metadata: Metadata = {
  title: "Listings | RainGrid",
};

export default async function ListingsPage() {
  const data = await getListingsPageData();

  return (
    <ListingsManagement
      listings={data.listings}
      incomingRequests={data.incomingRequests}
      summary={data.summary}
      error={data.error}
    />
  );
}
