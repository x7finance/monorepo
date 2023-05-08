import { useId } from 'react';
import { cn } from 'utils';

import { InstallationIcon } from './InstallationIcon';
import { LightbulbIcon } from './LightbulbIcon';
import { PluginsIcon } from './PluginsIcon';
import { PresetsIcon } from './PresetsIcon';
import { ThemingIcon } from './ThemingIcon';
import { WarningIcon } from './WarningIcon';

const icons = {
  installation: InstallationIcon,
  presets: PresetsIcon,
  plugins: PluginsIcon,
  theming: ThemingIcon,
  lightbulb: LightbulbIcon,
  warning: WarningIcon,
};

const iconStyles: any = {
  blue: '[--icon-foreground:theme(colors.slate.900)] [--icon-background:theme(colors.white)]',
  amber:
    '[--icon-foreground:theme(colors.amber.900)] [--icon-background:theme(colors.amber.100)]',
};

export function Icon({
  color = 'blue',
  icon,
  className,
  ...props
}: {
  color?: string;
  icon: string;
  className?: string;
}) {
  let id = useId();

  // @ts-expect-error
  let IconComponent: any = icons[icon];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={cn(className, iconStyles[color])}
      {...props}
    >
      <IconComponent id={id} color={color} />
    </svg>
  );
}

const gradients: any = {
  blue: [
    { stopColor: '#0EA5E9' },
    { stopColor: '#22D3EE', offset: '.527' },
    { stopColor: '#818CF8', offset: 1 },
  ],
  amber: [
    { stopColor: '#FDE68A', offset: '.08' },
    { stopColor: '#F59E0B', offset: '.837' },
  ],
};

export function Gradient({ color = 'blue', ...props }) {
  return (
    <radialGradient
      cx={0}
      cy={0}
      r={1}
      gradientUnits="userSpaceOnUse"
      {...props}
    >
      {gradients[color].map((stop: any, stopIndex: string) => (
        <stop key={stopIndex} {...stop} />
      ))}
    </radialGradient>
  );
}

export function LightMode({ className, ...props }: any) {
  return <g className={cn('dark:hidden', className)} {...props} />;
}

export function DarkMode({ className, ...props }: any) {
  return <g className={cn('hidden dark:inline', className)} {...props} />;
}
