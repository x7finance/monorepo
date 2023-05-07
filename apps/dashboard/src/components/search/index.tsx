import { DocSearchModal, useDocSearchKeyboardEvents } from '@docsearch/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Router from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const docSearchConfig = {
  appId: process.env.NEXT_PUBLIC_DOCSEARCH_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_DOCSEARCH_API_KEY,
  indexName: process.env.NEXT_PUBLIC_DOCSEARCH_INDEX_NAME,
};

function Hit({ hit, children }: { hit: any; children: any }) {
  return <Link href={hit.url}>{children}</Link>;
}

export function Search() {
  let [isOpen, setIsOpen] = useState(false);
  let [modifierKey, setModifierKey] = useState();

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose });

  useEffect(() => {
    setModifierKey(
      // @ts-expect-error
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl '
    );
  }, []);

  return (
    <>
      <div className="flex flex-1 ">
        <div onClick={onOpen} className="flex w-full md:ml-0 ">
          <label htmlFor="desktop-search-field" className="sr-only">
            Search docs
          </label>
          <label htmlFor="mobile-search-field" className="sr-only">
            Search docs
          </label>
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <MagnifyingGlassIcon
                className="h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
            </div>
            <input
              name="mobile-search-field"
              id="mobile-search-field"
              className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 dark:bg-slate-900 dark:text-gray-100 dark:placeholder-gray-400 sm:hidden"
              placeholder="Search docs"
              type="search"
            />
            <input
              name="desktop-search-field"
              id="desktop-search-field"
              className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 dark:bg-slate-900 dark:text-gray-100 dark:placeholder-gray-400 sm:block"
              placeholder="Search docs"
              type="search"
            />
          </div>
        </div>
      </div>
      {isOpen &&
        createPortal(
          <DocSearchModal
            {...docSearchConfig}
            initialScrollY={window.scrollY}
            onClose={onClose}
            hitComponent={Hit}
            navigator={{
              navigate({ itemUrl }) {
                Router.push(itemUrl);
              },
            }}
          />,
          document.body
        )}
    </>
  );
}
