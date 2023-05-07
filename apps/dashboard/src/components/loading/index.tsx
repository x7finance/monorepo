import { cn } from 'utils';

import Icon from '../icons';

export function Loading({
  size = 6,
  fill = 'currentColor',
  containerClass = '',
}: {
  size?: number;
  fill?: string;
  containerClass?: string;
}): JSX.Element {
  return (
    <div
      className={cn(
        containerClass
          ? containerClass
          : 'relative z-50 flex flex-auto items-center justify-center self-stretch'
      )}
    >
      <Icon glyph={Icon.glyph.loading} fill={fill} size={size} />
    </div>
  );
}
