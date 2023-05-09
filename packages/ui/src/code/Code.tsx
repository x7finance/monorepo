import {
  Children,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  RefObject,
  ReactElement,
} from 'react';
import { Tab } from '@headlessui/react';
import { cn } from 'utils';
import { create } from 'zustand';

import { Tag } from '../tag/Tag';

type LanguageNames = {
  [key: string]: string;
};

const languageNames: LanguageNames = {
  js: 'JavaScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  php: 'PHP',
  python: 'Python',
  ruby: 'Ruby',
  go: 'Go',
};

type PanelTitleProps = {
  title?: string;
  language?: keyof LanguageNames;
};

function getPanelTitle({ title, language }: PanelTitleProps) {
  return title ?? languageNames[language!] ?? 'Code';
}

type ClipboardIconProps = React.SVGProps<SVGSVGElement>;

function ClipboardIcon(props: ClipboardIconProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        strokeWidth="0"
        d="M5.5 13.5v-5a2 2 0 0 1 2-2l.447-.894A2 2 0 0 1 9.737 4.5h.527a2 2 0 0 1 1.789 1.106l.447.894a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2Z"
      />
      <path
        fill="none"
        strokeLinejoin="round"
        d="M12.5 6.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2m5 0-.447-.894a2 2 0 0 0-1.79-1.106h-.527a2 2 0 0 0-1.789 1.106L7.5 6.5m5 0-1 1h-3l-1-1"
      />
    </svg>
  );
}

type CopyButtonProps = {
  code: string;
};

function CopyButton({ code }: CopyButtonProps) {
  let [copyCount, setCopyCount] = useState(0);
  let copied = copyCount > 0;

  useEffect(() => {
    if (copyCount > 0) {
      let timeout = setTimeout(() => setCopyCount(0), 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copyCount]);

  return (
    <button
      type="button"
      className={cn(
        'group/button text-2xs absolute right-4 top-3.5 overflow-hidden rounded-full py-1 pl-2 pr-3 font-medium opacity-0 backdrop-blur transition focus:opacity-100 group-hover:opacity-100',
        copied
          ? 'bg-emerald-400/10 ring-1 ring-inset ring-emerald-400/20'
          : 'hover:bg-white/7.5 dark:bg-white/2.5 bg-white/5 dark:hover:bg-white/5'
      )}
      onClick={() => {
        // @ts-expect-error
        window.navigator.clipboard.writeText(code).then(() => {
          setCopyCount((count) => count + 1);
        });
      }}
    >
      <span
        aria-hidden={copied}
        className={cn(
          'pointer-events-none flex items-center gap-0.5 text-zinc-400 transition duration-300',
          copied && '-translate-y-1.5 opacity-0'
        )}
      >
        <ClipboardIcon className="h-5 w-5 fill-zinc-500/20 stroke-zinc-500 transition-colors group-hover/button:stroke-zinc-400" />
        Copy
      </span>
      <span
        aria-hidden={!copied}
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-emerald-400 transition duration-300',
          !copied && 'translate-y-1.5 opacity-0'
        )}
      >
        Copied!
      </span>
    </button>
  );
}

type CodePanelHeaderProps = {
  tag?: string;
  label?: string;
};

function CodePanelHeader({ tag, label }: CodePanelHeaderProps) {
  if (!tag && !label) {
    return null;
  }

  return (
    <div className="border-b-white/7.5 bg-white/2.5 dark:bg-white/1 flex h-9 items-center gap-2 border-y border-t-transparent bg-zinc-900 px-4 dark:border-b-white/5">
      {tag && (
        <div className="dark flex">
          <Tag variant="small">{tag}</Tag>
        </div>
      )}
      {tag && label && (
        <span className="h-0.5 w-0.5 rounded-full bg-zinc-500" />
      )}
      {label && (
        <span className="font-mono text-xs text-zinc-400">{label}</span>
      )}
    </div>
  );
}

type CodePanelProps = {
  tag?: string;
  label?: string;
  code?: string;
  children: React.ReactNode;
};

function CodePanel({ tag, label, code, children }: CodePanelProps) {
  let child = Children.only(children) as ReactElement;

  return (
    <div className="dark:bg-white/2.5 group">
      <CodePanelHeader
        tag={child.props.tag ?? tag}
        label={child.props.label ?? label}
      />
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-xs text-white">{children}</pre>
        <CopyButton code={child.props.code ?? code} />
      </div>
    </div>
  );
}

type CodeGroupHeaderProps = {
  title?: string;
  children: React.ReactNode;
  selectedIndex?: number;
};

function CodeGroupHeader({
  title,
  children,
  selectedIndex,
}: CodeGroupHeaderProps) {
  let hasTabs = Children.count(children) > 1;

  if (!title && !hasTabs) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(theme(spacing.12)+1px)] flex-wrap items-start gap-x-4 border-b border-zinc-700 bg-zinc-800 px-4 dark:border-zinc-800 dark:bg-transparent">
      {title && (
        <h3 className="mr-auto pt-3 text-xs font-semibold text-white">
          {title}
        </h3>
      )}
      {hasTabs && (
        <Tab.List className="-mb-px flex gap-4 text-xs font-medium">
          {Children.map(children, (child: any, childIndex) => (
            <Tab
              className={cn(
                'border-b py-3 transition focus:[&:not(:focus-visible)]:outline-none',
                childIndex === selectedIndex
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-300'
              )}
            >
              {getPanelTitle(child?.props)}
            </Tab>
          ))}
        </Tab.List>
      )}
    </div>
  );
}

type CodeGroupPanelsProps = {
  children: React.ReactNode;
} & Omit<CodePanelProps, 'children'>;

function CodeGroupPanels({ children, ...props }: CodeGroupPanelsProps) {
  let hasTabs = Children.count(children) > 1;

  if (hasTabs) {
    return (
      <Tab.Panels>
        {Children.map(children, (child) => (
          <Tab.Panel>
            <CodePanel {...props}>{child}</CodePanel>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    );
  }

  return <CodePanel {...props}>{children}</CodePanel>;
}

type PreventLayoutShift = {
  positionRef: RefObject<HTMLDivElement>;
  preventLayoutShift: (callback: () => void) => void;
};

function usePreventLayoutShift(): PreventLayoutShift {
  let positionRef: any = useRef();
  let rafRef = useRef();

  useEffect(() => {
    return () => {
      // @ts-expect-error
      window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    positionRef,
    preventLayoutShift(callback) {
      let initialTop = positionRef?.current.getBoundingClientRect().top;

      callback();

      // @ts-expect-error
      rafRef.current = window.requestAnimationFrame(() => {
        let newTop = positionRef?.current.getBoundingClientRect().top;
        // @ts-expect-error
        window.scrollBy(0, newTop - initialTop);
      });
    },
  };
}

type PreferredLanguageStore = {
  preferredLanguages: string[];
  addPreferredLanguage: (language: string) => void;
};

const usePreferredLanguageStore = create<PreferredLanguageStore>((set) => ({
  preferredLanguages: [],
  addPreferredLanguage: (language) =>
    set((state) => ({
      preferredLanguages: [
        ...state.preferredLanguages.filter(
          (preferredLanguage) => preferredLanguage !== language
        ),
        language,
      ],
    })),
}));

type TabGroupProps = {
  availableLanguages: string[];
};

function useTabGroupProps(availableLanguages: string[]) {
  let { preferredLanguages, addPreferredLanguage } =
    usePreferredLanguageStore();
  let [selectedIndex, setSelectedIndex] = useState(0);
  let activeLanguage = [...availableLanguages].sort(
    (a, z) => preferredLanguages.indexOf(z) - preferredLanguages.indexOf(a)
  )[0];
  let languageIndex = availableLanguages.indexOf(activeLanguage);
  let newSelectedIndex = languageIndex === -1 ? selectedIndex : languageIndex;
  if (newSelectedIndex !== selectedIndex) {
    setSelectedIndex(newSelectedIndex);
  }

  let { positionRef, preventLayoutShift } = usePreventLayoutShift();

  return {
    as: 'div',
    ref: positionRef,
    selectedIndex,
    onChange: (newSelectedIndex: any) => {
      preventLayoutShift(() =>
        addPreferredLanguage(availableLanguages[newSelectedIndex])
      );
    },
  };
}

const CodeGroupContext = createContext(false);

type CodeGroupProps = {
  children: React.ReactNode;
  title?: string;
} & Omit<CodePanelProps, 'children'>;

export function CodeGroup({ children, title, ...props }: CodeGroupProps) {
  let languages: any = Children.map(children, (child: any) =>
    getPanelTitle(child.props)
  );
  let tabGroupProps = useTabGroupProps(languages);
  let hasTabs = Children.count(children) > 1;
  let Container = hasTabs ? Tab.Group : 'div';
  let containerProps = hasTabs ? tabGroupProps : {};
  let headerProps = hasTabs
    ? { selectedIndex: tabGroupProps.selectedIndex }
    : {};

  return (
    <CodeGroupContext.Provider value={true}>
      <Container
        {...containerProps}
        // @ts-expect-error
        className="not-prose my-6 overflow-hidden rounded-2xl bg-zinc-900 shadow-md dark:ring-1 dark:ring-white/10"
      >
        <CodeGroupHeader title={title} {...headerProps}>
          {children}
        </CodeGroupHeader>
        <CodeGroupPanels {...props}>{children}</CodeGroupPanels>
      </Container>
    </CodeGroupContext.Provider>
  );
}

type CodeProps = {
  children: string;
} & React.HTMLAttributes<HTMLElement>;

export function Code({ children, ...props }: CodeProps) {
  let isGrouped = useContext(CodeGroupContext);

  if (isGrouped) {
    return <code {...props} dangerouslySetInnerHTML={{ __html: children }} />;
  }

  return <code {...props}>{children}</code>;
}

type PreProps = {
  children: React.ReactNode;
} & Omit<CodePanelProps, 'children'>;

export function Pre({ children, ...props }: PreProps) {
  let isGrouped = useContext(CodeGroupContext);

  if (isGrouped) {
    return children;
  }

  return <CodeGroup {...props}>{children}</CodeGroup>;
}
