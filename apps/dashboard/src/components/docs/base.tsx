import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Prose } from 'ui';
import { cn } from 'utils';

import { Navigation } from './navigation';

const onchainsNavigation = [
  {
    title: 'May 2023',
    links: [
      {
        title: 'May-02-2023-054111-AM',
        href: '/onchains/920-may-02-2023-054111-am-+utc',
      },
    ],
  },
  {
    title: 'April 2023',
    links: [
      {
        title: 'Apr-25-2023-042347-AM',
        href: '/onchains/921-apr-25-2023-042347-am-+utc',
      },
      {
        title: 'Apr-21-2023-073111-PM',
        href: '/onchains/922-apr-21-2023-073111-pm-+utc',
      },
    ],
  },
  {
    title: 'March 2023',
    links: [
      {
        title: 'Mar-29-2023-072323-PM',
        href: '/onchains/923-mar-29-2023-072323-pm-+utc',
      },
      {
        title: 'Mar-21-2023-052747-PM',
        href: '/onchains/924-mar-21-2023-052747-pm-+utc',
      },
      {
        title: 'Mar-02-2023-093223-PM',
        href: '/onchains/925-mar-02-2023-093223-pm-+utc',
      },
    ],
  },
  {
    title: 'February 2023',
    links: [
      {
        title: 'Feb-10-2023-094459-PM',
        href: '/onchains/926-feb-10-2023-094459-pm-+utc',
      },
      {
        title: 'Feb-10-2023-013535-AM',
        href: '/onchains/927-feb-10-2023-013535-am-+utc',
      },
      {
        title: 'Feb-09-2023-104147-PM',
        href: '/onchains/928-feb-09-2023-104147-pm-+utc',
      },

      {
        title: 'Feb-06-2023-100135-PM',
        href: '/onchains/929-feb-06-2023-052259-am-+utc',
      },
      {
        title: 'Feb-03-2023-064611-PM',
        href: '/onchains/930-feb-03-2023-064611-pm-+utc',
      },
      {
        title: 'Feb-02-2023-112347-PM',
        href: '/onchains/931-feb-02-2023-112347-pm-+utc',
      },
      {
        title: 'Feb-02-2023-100135-PM',
        href: '/onchains/932-feb-02-2023-100135-pm-+utc',
      },
      {
        title: 'Feb-01-2023-073047-AM',
        href: '/onchains/933-feb-01-2023-073047-am-+utc',
      },
      {
        title: 'Feb-01-2023-035835-PM',
        href: '/onchains/934-feb-01-2023-035835-pm-+utc',
      },
    ],
  },
  {
    title: 'January 2023',
    links: [
      {
        title: 'Jan-31-2023-063823-PM',
        href: '/onchains/935-jan-31-2023-063823-pm-+utc',
      },
      {
        title: 'Jan-29-2023-092159-PM',
        href: '/onchains/936-jan-29-2023-092159-pm-+utc',
      },
      {
        title: 'Jan-27-2023-073311-PM',
        href: '/onchains/937-jan-27-2023-073311-pm-+utc',
      },
      {
        title: 'Jan-26-2023-085811-PM',
        href: '/onchains/938-jan-26-2023-085811-pm-+utc',
      },
      {
        title: 'Jan-24-2023-112311-PM',
        href: '/onchains/939-jan-24-2023-112311-pm-+utc',
      },
      {
        title: 'Jan-19-2023-085835-PM',
        href: '/onchains/940-jan-19-2023-085835-pm-+utc',
      },
      {
        title: 'Jan-16-2023-012223-PM',
        href: '/onchains/941-jan-16-2023-012223-pm-+utc',
      },
      {
        title: 'Jan-10-2023-055123-AM',
        href: '/onchains/942-jan-10-2023-055123-am-+utc',
      },
      {
        title: 'Jan-03-2023-053423-AM',
        href: '/onchains/943-jan-03-2023-053423-am-+utc',
      },
      {
        title: 'Jan-02-2023-105811-PM',
        href: '/onchains/944-jan-02-2023-105811-pm-+utc',
      },
    ],
  },
  {
    title: 'December 2022',
    links: [
      {
        title: 'Dec-30-2022-115323-PM',
        href: '/onchains/945-dec-30-2022-115323-pm-+utc',
      },
      {
        title: 'Dec-16-2022-123223-AM',
        href: '/onchains/946-dec-16-2022-123223-am-+utc',
      },
      {
        title: 'Dec-14-2022-065059-PM',
        href: '/onchains/947-dec-14-2022-065059-pm-+utc',
      },
      {
        title: 'Dec-06-2022-081159-AM',
        href: '/onchains/948-dec-06-2022-081159-am-+utc',
      },
      {
        title: 'Dec-02-2022-034459-AM',
        href: '/onchains/949-dec-02-2022-034459-am-+utc',
      },
    ],
  },
  {
    title: 'November 2022',
    links: [
      {
        title: 'Nov-11-2022-011811-AM',
        href: '/onchains/950-nov-11-2022-011811-am-+utc',
      },
      {
        title: 'Nov-10-2022-033259-AM',
        href: '/onchains/951-nov-10-2022-033259-am-+utc',
      },
      {
        title: 'Nov-09-2022-071947-PM',
        href: '/onchains/952-nov-09-2022-071947-pm-+utc',
      },
      {
        title: 'Nov-08-2022-100935-PM',
        href: '/onchains/953-nov-08-2022-100935-pm-+utc',
      },
      {
        title: 'Nov-08-2022-012623-AM',
        href: '/onchains/954-nov-08-2022-012623-am-+utc',
      },
    ],
  },
  {
    title: 'October 2022',
    links: [
      {
        title: 'Oct-31-2022-064923-AM',
        href: '/onchains/955-oct-31-2022-064923-am-+utc',
      },
      {
        title: 'Oct-22-2022-061011-AM',
        href: '/onchains/956-oct-22-2022-061011-am-+utc',
      },
      {
        title: 'Oct-16-2022-055223-PM',
        href: '/onchains/957-oct-16-2022-055223-pm-+utc',
      },
      {
        title: 'Oct-14-2022-061747-PM',
        href: '/onchains/958-oct-14-2022-061747-pm-+utc',
      },
      {
        title: 'Oct-13-2022-075135-AM',
        href: '/onchains/959-oct-13-2022-075135-am-+utc',
      },
      {
        title: 'Oct-07-2022-100759-PM',
        href: '/onchains/960-oct-07-2022-100759-pm-+utc',
      },
      {
        title: 'Oct-06-2022-084123-AM',
        href: '/onchains/961-oct-06-2022-084123-am-+utc',
      },
      {
        title: 'Oct-03-2022-072111-AM',
        href: '/onchains/962-oct-03-2022-072111-am-+utc',
      },
      {
        title: 'Oct-01-2022-070111-AM',
        href: '/onchains/963-oct-01-2022-070111-am-+utc',
      },
    ],
  },
  {
    title: 'September 2022',
    links: [
      {
        title: 'Sep-29-2022-125135-PM',
        href: '/onchains/964-sep-29-2022-125135-pm-+utc',
      },
      {
        title: 'Sep-28-2022-090211-AM',
        href: '/onchains/965-sep-28-2022-090211-am-+utc',
      },
      {
        title: 'Sep-28-2022-050511-AM',
        href: '/onchains/966-sep-28-2022-050511-am-+utc',
      },
      {
        title: 'Sep-28-2022-020547-AM',
        href: '/onchains/967-sep-28-2022-020547-am-+utc',
      },
      {
        title: 'Sep-27-2022-021523-PM',
        href: '/onchains/968-sep-27-2022-021523-pm-+utc',
      },
      {
        title: 'Sep-27-2022-035535-AM',
        href: '/onchains/969-sep-27-2022-035535-am-+utc',
      },
      {
        title: 'Sep-26-2022-092347-PM',
        href: '/onchains/970-sep-26-2022-092347-pm-+utc',
      },
      {
        title: 'Sep-26-2022-044647-PM',
        href: '/onchains/971-sep-26-2022-044647-pm-+utc',
      },
      {
        title: 'Sep-26-2022-033035-AM',
        href: '/onchains/972-sep-26-2022-033035-am-+utc',
      },
      {
        title: 'Sep-26-2022-023011-AM',
        href: '/onchains/973-sep-26-2022-023011-am-+utc',
      },
      {
        title: 'Sep-25-2022-035347-AM',
        href: '/onchains/974-sep-25-2022-035347-am-+utc',
      },
      {
        title: 'Sep-24-2022-093123-PM',
        href: '/onchains/975-sep-24-2022-093123-pm-+utc',
      },
      {
        title: 'Sep-24-2022-103711-AM',
        href: '/onchains/976-sep-24-2022-103711-am-+utc',
      },
      {
        title: 'Sep-24-2022-023335-AM',
        href: '/onchains/977-sep-24-2022-023335-am-+utc',
      },
      {
        title: 'Sep-22-2022-090935-PM',
        href: '/onchains/978-sep-22-2022-090935-pm-+utc',
      },
      {
        title: 'Sep-19-2022-080259-AM',
        href: '/onchains/979-sep-19-2022-080259-am-+utc',
      },
      {
        title: 'Sep-13-2022-105207-AM',
        href: '/onchains/980-sep-13-2022-105207-am-+utc',
      },
      {
        title: 'Sep-12-2022-095341-AM',
        href: '/onchains/981-sep-12-2022-095341-am-+utc',
      },
      {
        title: 'Sep-07-2022-082157-AM',
        href: '/onchains/982-sep-07-2022-082157-am-+utc',
      },
      {
        title: 'Sep-04-2022-083900-AM',
        href: '/onchains/983-sep-04-2022-083900-am-+utc',
      },
      {
        title: 'Sep-01-2022-051839-AM',
        href: '/onchains/984-sep-01-2022-051839-am-+utc',
      },
    ],
  },
  {
    title: 'August 2022',
    links: [
      {
        title: 'Aug-31-2022-092227-PM',
        href: '/onchains/985-aug-31-2022-092227-pm-+utc',
      },
      {
        title: 'Aug-31-2022-055456-AM',
        href: '/onchains/986-aug-31-2022-055456-am-+utc',
      },
      {
        title: 'Aug-30-2022-032405-AM',
        href: '/onchains/987-aug-30-2022-032405-am-+utc',
      },
      {
        title: 'Aug-29-2022-044830-PM',
        href: '/onchains/988-aug-29-2022-044830-pm-+utc',
      },
      {
        title: 'Aug-29-2022-114635-AM',
        href: '/onchains/989-aug-29-2022-114635-am-+utc',
      },
      {
        title: 'Aug-28-2022-020448-AM',
        href: '/onchains/990-aug-28-2022-020448-am-+utc',
      },
      {
        title: 'Aug-26-2022-091751-PM',
        href: '/onchains/991-aug-26-2022-091751-pm-+utc',
      },
      {
        title: 'Aug-25-2022-104049-PM',
        href: '/onchains/992-aug-25-2022-104049-pm-+utc',
      },
      {
        title: 'Aug-25-2022-045900-AM',
        href: '/onchains/993-aug-25-2022-045900-am-+utc',
      },
      {
        title: 'Aug-24-2022-043226-AM',
        href: '/onchains/994-aug-24-2022-043226-am-+utc',
      },
      {
        title: 'Aug-24-2022-030749-AM',
        href: '/onchains/995-aug-24-2022-030749-am-+utc',
      },
      {
        title: 'Aug-23-2022-062730-PM',
        href: '/onchains/996-aug-23-2022-062730-pm-+utc',
      },
      {
        title: 'Aug-22-2022-092218-AM',
        href: '/onchains/997-aug-22-2022-092218-am-+utc',
      },
      {
        title: 'Aug-21-2022-072625-AM',
        href: '/onchains/998-aug-21-2022-072625-am-+utc',
      },
      {
        title: 'Aug-19-2022-073411-PM',
        href: '/onchains/999-aug-19-2022-073411-pm-+utc',
      },
    ],
  },
];

const docsNavigation = [
  {
    title: 'Introduction',
    links: [
      { title: 'Intro', href: '/docs' },
      { title: 'Integrating', href: '/docs/integrating' },
    ],
  },
];

const whitepaperNavigation = [
  {
    title: 'Whitepaper',
    links: [
      { title: 'Ethos', href: '/whitepaper/ethos' },
      { title: 'Executive Summary', href: '/whitepaper/executive-summary' },
      { title: 'Tokenholder Value', href: '/whitepaper/tokenholder-value' },
      { title: 'Problem Summary', href: '/whitepaper/problem-summary' },
      {
        title: 'Total Addressable Market',
        href: '/whitepaper/total-addressable-market',
      },
      { title: 'Multi-chain Rollout', href: '/whitepaper/multi-chain-rollout' },
      {
        title: 'Customers And Use Cases',
        href: '/whitepaper/customers-and-use-cases',
      },
      { title: 'Team', href: '/whitepaper/team' },
      {
        title: 'Community Stealth Launch',
        href: '/whitepaper/community-stealth-launch',
      },
      {
        title: 'X7 System Design Philosophy',
        href: '/whitepaper/x7-system-design-philosophy',
      },
      {
        title: 'X7 Functionality Summary',
        href: '/whitepaper/x7-functionality-summary',
      },
      {
        title: 'Xchange: A Leveraged Initial Liquidity Decentralized',
        href: '/whitepaper/xchange-a-leveraged-initial-liquidity-dex',
      },
      {
        title: 'Trading Functionality',
        href: '/whitepaper/trading-functionality',
      },
      {
        title: 'Understanding Swap Creation',
        href: '/whitepaper/understanding-swap-creation',
      },
      {
        title: 'Liquidity Functionality',
        href: '/whitepaper/liquidity-functionality',
      },
      { title: 'Lending Pool', href: '/whitepaper/lending-pool' },
      {
        title: 'Lending Functionality',
        href: '/whitepaper/lending-functionality',
      },
      { title: 'Borrowing', href: '/whitepaper/borrowing' },
      { title: 'Governance', href: '/whitepaper/governance' },
      {
        title: 'X7 ecosystem token Liquidity Provider Tokens (LP)',
        href: '/whitepaper/x7-ecosystem-token-liquidity-provider-tokens',
      },
      { title: 'Tokenomics', href: '/whitepaper/tokenomics' },
      { title: 'Ecosystem Overview', href: '/whitepaper/ecosystem-overview' },
      { title: 'X7R', href: '/whitepaper/x7r' },
      { title: 'X7DAO', href: '/whitepaper/x7dao' },
      { title: 'X7Deposit (X7D)', href: '/whitepaper/x7deposit' },
      { title: 'Non-Fungible Tokens', href: '/whitepaper/non-fungible-tokens' },
      { title: 'Roadmap', href: '/whitepaper/roadmap' },
      { title: 'DAO Handoff', href: '/whitepaper/dao-handoff' },
      { title: 'Future Developments', href: '/whitepaper/future-developments' },
    ],
  },
];

const faqNavigation = [
  {
    title: 'FAQ',
    links: [
      { title: 'Airdrop Questions', href: '/faq/airdrop' },
      { title: 'Constellation Questions', href: '/faq/constellations' },
      { title: 'Developer Questions', href: '/faq/devs' },
      { title: 'General Questions', href: '/faq/general' },
      { title: 'Governance Questions', href: '/faq/governance' },
      { title: 'Investor Questions', href: '/faq/investors' },
      {
        title: 'Liquidity Lending Questions',
        href: '/faq/liquiditylending',
      },
      { title: 'NFT Questions', href: '/faq/nfts' },
      { title: 'Snapshot.org Questions', href: '/faq/daosnapshot' },
      { title: 'Xchange Questions', href: '/faq/xchange' },
    ],
  },
];

function useTableOfContents(tableOfContents: any) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id);

  let getHeadings = useCallback((tableOfContents: any) => {
    return tableOfContents
      .flatMap((node: any) => [
        node.id,
        ...node.children.map((child: any) => child.id),
      ])
      .map((id: string) => {
        let el = document.getElementById(id);
        if (!el) return;

        let style = window.getComputedStyle(el);
        let scrollMt = parseFloat(style.scrollMarginTop);

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt;
        return { id, top };
      });
  }, []);

  useEffect(() => {
    if (tableOfContents.length === 0) return;
    let headings = getHeadings(tableOfContents);
    function onScroll() {
      let top = window.scrollY;
      let current = headings[0].id;
      for (let heading of headings) {
        if (top >= heading.top) {
          current = heading.id;
        } else {
          break;
        }
      }
      setCurrentSection(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      // @ts-expect-error
      window.removeEventListener('scroll', onScroll, { passive: true });
    };
  }, [getHeadings, tableOfContents]);

  return currentSection;
}

export function DocsBase({
  children,
  title,
  date,
  tags,
  tableOfContents,
  docsType,
}: any) {
  let router = useRouter();

  const navigation =
    docsType === 'onchains'
      ? onchainsNavigation
      : docsType === 'whitepaper'
      ? whitepaperNavigation
      : docsType === 'faq'
      ? faqNavigation
      : docsNavigation;

  let allLinks = navigation.flatMap((section) => section.links);
  let linkIndex = allLinks.findIndex((link) => link.href === router.pathname);
  let previousPage = allLinks[linkIndex - 1];
  let nextPage = allLinks[linkIndex + 1];
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === router.pathname)
  );
  let currentSection = useTableOfContents(tableOfContents);

  function isActive(section: any) {
    if (section.id === currentSection) {
      return true;
    }
    if (!section.children) {
      return false;
    }
    return section.children.findIndex(isActive) > -1;
  }

  return (
    <>
      <div className="relative flex justify-center mx-auto max-w-8xl sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="absolute bottom-0 right-0 hidden w-px h-12 top-16 bg-gradient-to-t from-slate-800 dark:block" />
          <div className="absolute bottom-0 right-0 hidden w-px top-28 bg-slate-800 dark:block" />
          <div className="scrollbar sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
            <Navigation
              navigation={navigation}
              className="w-64 pr-8 xl:w-72 xl:pr-16"
            />
          </div>
        </div>
        <div className="flex-auto max-w-2xl min-w-0 min-h-screen px-4 py-16 overflow-auto lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
          <article>
            {(title || section) && (
              <header className="space-y-1 mb-9">
                {section && (
                  <div className="text-sm font-medium font-display">
                    <span className="text-transparent bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text">
                      {section.title}
                    </span>
                  </div>
                )}
                {!!tags?.length &&
                  tags.map((tag: string, key: number) => {
                    return (
                      <span
                        key={`${tag}-${key}`}
                        className="mr-1 inline-flex justify-center gap-0.5 overflow-hidden rounded-full bg-sky-600/80 px-3 py-0.5 text-xs font-medium text-white ring-1 ring-inset ring-sky-700 transition hover:bg-sky-700 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/20 dark:hover:bg-sky-400/10 dark:hover:text-sky-300 dark:hover:ring-sky-300"
                      >
                        {tag}
                      </span>
                    );
                  })}
                {title && (
                  <h1 className="text-2xl tracking-tight font-display text-slate-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {date && (
                  <h2 className="text-xl tracking-tight font-display text-slate-900 dark:text-white">
                    {date}
                  </h2>
                )}
              </header>
            )}
            <Prose>{children}</Prose>
          </article>
          <dl className="flex pt-6 mt-12 border-t border-slate-200 dark:border-slate-800">
            {previousPage && (
              <div>
                <dt className="text-sm font-medium font-display text-slate-900 dark:text-white">
                  Previous
                </dt>
                <dd className="mt-1">
                  <Link
                    href={previousPage.href}
                    className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <span aria-hidden="true">&larr;</span> {previousPage.title}
                  </Link>
                </dd>
              </div>
            )}
            {nextPage && (
              <div className="ml-auto text-right">
                <dt className="text-sm font-medium font-display text-slate-900 dark:text-white">
                  Next
                </dt>
                <dd className="mt-1">
                  <Link
                    href={nextPage.href}
                    className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    {nextPage.title} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" className="w-56">
            {tableOfContents.length > 0 && (
              <>
                <h2
                  id="on-this-page-title"
                  className="text-sm font-medium font-display text-slate-900 dark:text-white"
                >
                  On this page
                </h2>
                <ol role="list" className="mt-4 space-y-3 text-sm">
                  {tableOfContents.map((section: any) => (
                    <li key={section.id}>
                      <h3>
                        <Link
                          href={`#${section.id}`}
                          className={cn(
                            isActive(section)
                              ? 'bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent'
                              : 'font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                          )}
                        >
                          {section.title}
                        </Link>
                      </h3>
                      {section.children.length > 0 && (
                        <ol
                          role="list"
                          className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400"
                        >
                          {section.children.map((subSection: any) => (
                            <li key={subSection.id}>
                              <Link
                                href={`#${subSection.id}`}
                                className={
                                  isActive(subSection)
                                    ? 'text-purple-500'
                                    : 'hover:text-slate-600 dark:hover:text-slate-300'
                                }
                              >
                                {subSection.title}
                              </Link>
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
