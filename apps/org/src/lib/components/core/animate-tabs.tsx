/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { easings, useSpring, useTransition } from "@react-spring/web";

import { cn } from "@x7/css";
import { AnimatedDiv } from "@x7/ui";
import { LinkInternal } from "@x7/ui/link";

import type {
  CreateTabs,
  DeployerTabs,
  FundingTabs,
  GovernanceTabs,
  LendingTabs,
  LiquidityTabs,
} from "~/lib/types";

type ApprovedTabTypes =
  | LendingTabs
  | GovernanceTabs
  | FundingTabs
  | LiquidityTabs
  | DeployerTabs
  | CreateTabs;

interface TabItem {
  id: ApprovedTabTypes;
  label: string;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultTab: ApprovedTabTypes;
  baseLink: string;
}

export function AnimatedTabs({
  tabs,
  defaultTab,
  baseLink,
}: AnimatedTabsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selectedTabId, setSelectedTabId] = useState<ApprovedTabTypes>(() => {
    const tabFromUrl = searchParams.get("tab") as ApprovedTabTypes;
    return tabs.some((tab) => tab.id === tabFromUrl) ? tabFromUrl : defaultTab;
  });

  const [buttonRefs, setButtonRefs] = useState<(HTMLButtonElement | null)[]>(
    [],
  );

  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as ApprovedTabTypes;
    if (tabs.some((tab) => tab.id === tabFromUrl)) {
      setSelectedTabId(tabFromUrl);
    } else {
      setSelectedTabId(defaultTab);
    }
  }, [pathname, searchParams, tabs, defaultTab]);

  useEffect(() => {
    setButtonRefs((prev) => prev.slice(0, tabs.length));
  }, [tabs.length]);

  const navRef = useRef<HTMLDivElement>(null);
  const navRect = navRef.current?.getBoundingClientRect();

  const selectedTabIndex = tabs.findIndex((tab) => tab.id === selectedTabId);
  const selectedRect = buttonRefs[selectedTabIndex]?.getBoundingClientRect();

  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
  const hoveredRect =
    buttonRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect();

  const onLeaveTabs = () => {
    setHoveredTabIndex(null);
  };

  const onEnterTab = (i: number) => {
    setHoveredTabIndex(i);
  };

  const onSelectTab = (id: ApprovedTabTypes) => {
    setSelectedTabId(id);
  };

  const stylesChangingOnUpdate =
    hoveredRect && navRect
      ? {
          transform: `translate3d(${hoveredRect.left - navRect.left}px,${
            hoveredRect.top - navRect.top
          }px,0px)`,
          width: hoveredRect.width,
          height: hoveredRect.height,
        }
      : {};

  const bgTransition = useTransition(hoveredTabIndex !== null, {
    from: () => ({
      ...stylesChangingOnUpdate,
      opacity: 0,
    }),
    enter: {
      ...stylesChangingOnUpdate,
      opacity: 1,
    },
    update: stylesChangingOnUpdate,
    leave: { opacity: 0 },
    config: {
      duration: 150,
      easing: easings.easeOutCubic,
    },
  });

  const underlineStyles = useSpring({
    to:
      selectedRect && navRect
        ? {
            width: selectedRect.width * 0.8,
            transform: `translateX(calc(${
              selectedRect.left - navRect.left
            }px + 10%))`,
            opacity: 1,
          }
        : { opacity: 0 },
    config: {
      duration: 150,
      easing: easings.easeOutCubic,
    },
  });

  return (
    <nav
      ref={navRef}
      className={cn(
        "relative z-0 flex shrink-0 flex-wrap items-center justify-center py-2 sm:flex-row sm:flex-nowrap sm:justify-start",
      )}
      onPointerLeave={onLeaveTabs}
    >
      {tabs.map((item, i) => (
        <LinkInternal
          prefetch={true}
          key={item.id}
          shallow={true}
          scroll={false}
          href={`${baseLink}?tab=${item.id}`}
        >
          <button
            className={cn(
              "text-md relative z-20 flex h-8 cursor-pointer items-center rounded-lg bg-transparent px-4 text-sm whitespace-nowrap text-zinc-500 transition-colors select-none",
              isMobile && "w-full justify-center",
              {
                "text-black dark:text-white":
                  hoveredTabIndex === i || selectedTabId === item.id,
              },
              {
                "bg-zinc-100 dark:bg-zinc-900":
                  (hoveredTabIndex === i || selectedTabId === item.id) &&
                  isMobile,
              },
            )}
            // @ts-expect-error - Ref is not assignable to HTMLButtonElement
            ref={(el) => (buttonRefs[i] = el)}
            onPointerEnter={() => onEnterTab(i)}
            onFocus={() => onEnterTab(i)}
            onClick={() => onSelectTab(item.id)}
          >
            {item.label}
          </button>
        </LinkInternal>
      ))}
      {bgTransition(
        (styles, item) =>
          item && (
            <AnimatedDiv
              className="bg-muted absolute top-0 left-0 z-10 rounded-lg"
              style={styles}
            />
          ),
      )}

      <AnimatedDiv
        className="absolute bottom-0 left-0 z-10 hidden h-0.5 bg-black md:block dark:bg-white"
        style={underlineStyles as any}
      />
    </nav>
  );
}

// Custom hook for media queries
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}
