import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Link from 'next/link';

import { SocialsEnum } from '../../lib/types';
import { GridPattern } from '../gridPattern';
import { Heading } from '../heading';
import { Discord } from '../svgs/discord';
import { MediaIcon } from '../svgs/media';
import { MediumLogo } from '../svgs/medium';
import { Megaphone } from '../svgs/megaphone';
import { SnapshotLogo } from '../svgs/snapshot';
import { Telegram } from '../svgs/telegram';
import { Twitter } from '../svgs/twitter';
import { X7Logo } from '../svgs/x7';
import { YouTube } from '../svgs/youtube';

const socials = [
  {
    href: SocialsEnum.telegram,
    name: 'Telegram',
    description:
      'The main X7 Finance Telegram channel. Join our active, bold and fearless DeFi community!',
    icon: Telegram,
    pattern: {
      y: 16,
      squares: [
        [0, 1],
        [1, 3],
      ],
    },
  },
  {
    href: SocialsEnum.website,
    name: 'Main Website',
    description:
      'Main project website - engineered and maintained by the X7 Finance Founding Team.',
    icon: X7Logo,
    pattern: {
      y: -6,
      squares: [
        [-1, 2],
        [1, 3],
      ],
    },
  },
  {
    href: SocialsEnum.discord,
    name: 'Discord',
    description:
      'Join us on Discord for a more focused experience by topic. We have a dedicated channel for each topic of discussion.',
    icon: Discord,
    pattern: {
      y: 32,
      squares: [
        [0, 2],
        [1, 4],
      ],
    },
  },
  {
    href: SocialsEnum.twitter,
    name: 'Twitter',
    description:
      'Follow us on Twitter and stay up to date with tweets about X7 Finance ecosystem including the latest updates, giveaways, and more.',
    icon: Twitter,
    pattern: {
      y: 22,
      squares: [[0, 1]],
    },
  },
  {
    href: SocialsEnum.youtube,
    name: 'YouTube',
    description:
      'Check out our videos and some of our longer-form talks and content on YouTube. Subscribe to our channel to get notified when new videos are available.',
    icon: YouTube,
    pattern: {
      y: 16,
      squares: [
        [0, 1],
        [1, 3],
      ],
    },
  },
  {
    href: SocialsEnum.announcements,
    name: 'X7 Telegram Announcements',
    description:
      'A channel for official announcements from the X7 DAO team. Subscribe to get notified when new updates are available.',
    icon: Megaphone,
    pattern: {
      y: -6,
      squares: [
        [-1, 2],
        [1, 3],
      ],
    },
  },
  {
    href: SocialsEnum.media,
    name: 'Media Channel',
    description:
      'Join us on Discord for a more focused experience by topic. We have a dedicated channel for each topic of discussion.',
    icon: MediaIcon,
    pattern: {
      y: 32,
      squares: [
        [0, 2],
        [1, 4],
      ],
    },
  },
  {
    href: SocialsEnum.medium,
    name: 'Medium',
    description:
      'On Medium you can find many articles detailing, educating and speculating about the past and future of the X7 Ecosystem.',
    icon: MediumLogo,
    pattern: {
      y: 22,
      squares: [[0, 1]],
    },
  },
  {
    href: SocialsEnum.snapshot,
    name: 'Snapshot.org',
    description:
      'Have your say on changes to the X7 Ecosystem, hold $X7DAO tokens to vote, or cast advisory proposals if you hold 500k $X7DAO tokens.',
    icon: SnapshotLogo,
    pattern: {
      y: 22,
      squares: [[0, 1]],
    },
  },

  // Dune Analytics
  // dune.com/0xawesomedata/x7m105
];

export function SocialIcon({ icon: Icon }: any) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/5 ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:bg-white/7.5 dark:ring-white/15 dark:group-hover:bg-sky-300/10 dark:group-hover:ring-sky-400">
      <Icon className="transition-colors duration-300 h-7 w-7 fill-zinc-700/10 stroke-zinc-700 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-sky-300/10 dark:group-hover:stroke-sky-400" />
    </div>
  );
}

function SocialPattern({ mouseX, mouseY, ...gridProps }: any) {
  let maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl opacity-50 transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-20">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
          {...gridProps}
        />
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#bae6fd] to-[#f0f9ff] opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#202D2E] dark:to-[#0c4a6e]"
        style={style}
      />
      <motion.div
        className="absolute inset-0 transition duration-300 opacity-0 rounded-2xl mix-blend-overlay group-hover:opacity-100"
        style={style}
      >
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10"
          {...gridProps}
        />
      </motion.div>
    </div>
  );
}

function Social({ social }: any) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      key={social.href}
      onMouseMove={onMouseMove}
      className="group relative flex rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
    >
      <SocialPattern {...social.pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5  group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative px-4 pt-12 pb-4 rounded-2xl">
        <SocialIcon icon={social.icon} />
        <h3 className="mt-4 text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
          <Link
            target={'_blank'}
            referrerPolicy={'no-referrer'}
            href={social.href}
          >
            <span className="absolute inset-0 rounded-2xl" />
            {social.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {social.description}
        </p>
      </div>
    </div>
  );
}

export function Socials() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading
        className="text-xl font-semibold text-slate-900 dark:text-slate-100"
        level={1}
        id="community"
        subHeader="One of the best communities in all of DeFi, come say hello"
      >
        Community Links
      </Heading>
      <div className="grid grid-cols-1 gap-8 pt-10 mt-4 border-t not-prose border-zinc-900/5 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {socials.map((social) => (
          <Social key={social.href} social={social} />
        ))}
      </div>
    </div>
  );
}
