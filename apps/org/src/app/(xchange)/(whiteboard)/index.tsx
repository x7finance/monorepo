"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

// import { cn } from "@x7/css";
// import { buttonVariants } from "@x7/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@x7/ui/card";
// import { Input } from "@x7/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@x7/ui/select";
import { SkeletonBox } from "@x7/ui/skeleton";

import { useCreatedXchangeTokens } from "~/lib/hooks/tokens/useCreatedXchangeTokens";
import { TokenCard } from "./token-card";

export function XChangeBoard() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const { data: tokens, isLoading } = useCreatedXchangeTokens();

  const [_filter, _setFilter] = useState(
    searchParams.get("filter") ?? "featured",
  );
  const [_sortedProjects, _setSortedProjects] = useState();
  // const [searchTerm, setSearchTerm] = useState("");

  // useEffect(() => {
  //   const sortProjects = () => {
  //     const sorted = [...projects].sort((a, b) => {
  //       switch (filter) {
  //         case "lastTrade":
  //           return (
  //             new Date(b.lastTrade).getTime() - new Date(a.lastTrade).getTime()
  //           );
  //         case "creationDate":
  //           return (
  //             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //           );
  //         case "marketCap":
  //           return b.marketCap - a.marketCap;
  //         case "featured":
  //         default:
  //           return b.featured ? 1 : -1;
  //       }
  //     });
  //     setSortedProjects(sorted);
  //   };

  //   sortProjects();
  // }, [filter]);

  // const handleFilterChange = (value: string) => {
  //   setFilter(value);
  //   router.push(`?filter=${value}`, { scroll: false });
  // };

  // const filteredTokens = sortedProjects.filter(
  //   (project) =>
  //     project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     project.ticker.toLowerCase().includes(searchTerm.toLowerCase()),
  // );

  return (
    <div className="container mx-auto px-0 py-10">
      {/* <div className="mb-8">
        <LinkInternal prefetch={true}
          href="/create"
          className={cn(buttonVariants({ variant: "outline" }), "mb-4")}
        >
          Start a New Coin
        </LinkInternal>

        <Input
          type="search"
          placeholder="Search for a token..."
          className="mb-6 max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> */}
      <div className="">
        <div className="">
          {/* <div className="mb-4">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="lastTrade">Last Trade</SelectItem>
                <SelectItem value="creationDate">Creation Date</SelectItem>
                <SelectItem value="marketCap">Market Cap</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <Card key={`skeleton-${i}`} className="flex h-full w-full flex-col">
                    <CardHeader className="relative p-0">
                      <div className="relative mb-2 h-24 w-full">
                        <SkeletonBox className="h-full w-full rounded-t-lg" />
                      </div>
                      <div className="absolute right-2 bottom-8 h-16 w-16 overflow-hidden rounded-lg shadow-xs">
                        <SkeletonBox className="h-full w-full" />
                      </div>
                      <CardTitle className="p-3 pt-1 text-sm font-bold">
                        <SkeletonBox className="mb-1 h-5 w-32" />
                        <SkeletonBox className="h-4 w-24" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xs grow space-y-2 px-3 py-1">
                      <SkeletonBox className="h-12 w-full" />
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-3 text-[10px] text-zinc-500">
                      <SkeletonBox className="mb-2 h-3 w-32" />
                      <div className="flex w-full items-center justify-between">
                        <SkeletonBox className="h-3 w-40" />
                        <SkeletonBox className="h-4 w-16" />
                      </div>
                    </CardFooter>
                  </Card>
                ))
              : tokens?.map((token) => (
                  <TokenCard
                    key={`token-card-${token.pairAddress}`}
                    token={token}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
