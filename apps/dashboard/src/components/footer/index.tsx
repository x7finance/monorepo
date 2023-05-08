import { SocialsEnum } from 'common';
import Link from 'next/link';

const navigation = [
  {
    name: 'Telegram',
    href: SocialsEnum.telegram,
  },
  {
    name: 'Main Site',
    href: SocialsEnum.website,
  },
  {
    name: 'Twitter',
    href: SocialsEnum.twitter,
  },
  {
    name: 'Discord',
    href: SocialsEnum.discord,
  },
  {
    name: 'Medium',
    href: SocialsEnum.medium,
  },
  {
    name: 'GitHub',
    href: SocialsEnum.github,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto py-2 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 md:order-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap text-xs text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-500"
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        <div className="mt-2 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-400 dark:text-gray-500">
            built & maintained by X7DAO
          </p>
        </div>
      </div>
    </footer>
  );
}
