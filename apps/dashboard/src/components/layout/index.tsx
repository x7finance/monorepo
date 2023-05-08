import { Dialog, Transition } from '@headlessui/react';
import {
  BanknotesIcon,
  Bars3BottomLeftIcon,
  CodeBracketIcon,
  CubeTransparentIcon,
  CursorArrowRippleIcon,
  FolderIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
  RectangleStackIcon,
  UserGroupIcon,
  XMarkIcon,
} from 'icons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { cn } from 'utils';

import { DocsBase } from '../docs/base';
import { Footer } from '../footer';
import { Search } from '../search';
import { ThemeSelector } from '../themeSelector';

const navigation = [
  {
    name: 'Live',
    href: '/',
    icon: CursorArrowRippleIcon,
  },
  { name: 'Docs', href: '/docs', icon: FolderIcon },
  {
    name: 'On-chains',
    href: '/onchains',
    icon: RectangleStackIcon,
    current: false,
  },
  { name: 'Contracts', href: '/contracts', icon: CodeBracketIcon },
  { name: 'Loans', href: '/loans', icon: BanknotesIcon },
  {
    name: 'Community',
    href: '/community',
    icon: UserGroupIcon,
    current: false,
  },
  { name: 'NFTs', href: '/nfts', icon: CubeTransparentIcon },
  { name: 'Whitepaper', href: '/whitepaper', icon: NewspaperIcon },
  { name: 'FAQs', href: '/faq', icon: QuestionMarkCircleIcon },
];

// @ts-ignore
const ConnectionComponent = dynamic(
  () => import('../connection').then((mod) => mod.ConnectionComponent),
  {
    ssr: false,
  }
);

export function Layout({ children, title, tableOfContents, tags, date }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  const docsMatch = new RegExp('^/(docs)(/.*)?$');
  const onchainsMatch = new RegExp('^/(onchains)(/.*)?$');
  const whitepaperMatch = new RegExp('^/(whitepaper)(/.*)?$');
  const faqMatch = new RegExp('^/(faq)(/.*)?$');

  const isDocs = docsMatch.test(router.pathname);
  const isOnChains = onchainsMatch.test(router.pathname);
  const isWhitepaper = whitepaperMatch.test(router.pathname);
  const isFaq = faqMatch.test(router.pathname);

  const showDocs = isDocs || isOnChains || isWhitepaper || isFaq;
  const docsType = router?.pathname?.split('/')[1];

  return (
    <>
      <div className="flex h-full">
        {/* Narrow sidebar */}
        <div className="hidden w-28 overflow-y-auto bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 md:block">
          <div className="flex w-full flex-col items-center py-6">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/images/svgs/x7.svg`}
                alt="X7 Finance"
              />
            </div>
            <div className="mt-6 w-full flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    item.href === `/${docsType}`
                      ? 'bg-slate-500 bg-opacity-20 text-white'
                      : 'text-indigo-100 hover:bg-slate-500 hover:bg-opacity-20 hover:text-white',
                    'group flex w-full flex-col items-center rounded-md p-3 text-xs font-medium'
                  )}
                  aria-current={
                    item.href === `/${docsType}` ? 'page' : undefined
                  }
                >
                  <item.icon
                    className={cn(
                      item.href === `/${docsType}`
                        ? 'text-white'
                        : 'text-indigo-300 group-hover:text-white',
                      'h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  <span className="mt-2">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 pb-4 pt-5">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-1 -mr-14 p-1">
                      <button
                        type="button"
                        className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Close sidebar</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/images/svgs/x7.svg`}
                      alt="X7 Finance"
                    />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                    <nav className="flex h-full flex-col">
                      <div className="space-y-1">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={cn(
                              item.current
                                ? 'bg-indigo-800 text-white'
                                : 'text-indigo-100 hover:bg-sky-700 hover:text-white',
                              'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            <item.icon
                              className={cn(
                                item.current
                                  ? 'text-white'
                                  : 'text-indigo-300 group-hover:text-white',
                                'mr-3 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-slate-900">
              <button
                type="button"
                className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:border-gray-800 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex flex-1 justify-between px-4 sm:px-6">
                <Search />
                <div className="ml-2 flex items-center space-x-4 sm:ml-6">
                  <ConnectionComponent id="desktop" />
                  <ThemeSelector className="relative z-10" />
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex flex-1 items-stretch overflow-hidden text-black dark:text-white">
            <main className="scrollbar flex-1 overflow-y-auto">
              {showDocs ? (
                <DocsBase
                  docsType={docsType}
                  title={title}
                  date={date}
                  tags={tags}
                  tableOfContents={tableOfContents}
                >
                  {children}
                </DocsBase>
              ) : (
                <div className="relative px-4 sm:px-6 lg:px-12">{children}</div>
              )}
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
