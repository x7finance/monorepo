import { Meta, Story } from '@storybook/react';

import { Button, ButtonProps } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: [
          'default',
          'destructive',
          'outline',
          'secondary',
          'ghost',
          'link',
        ],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['default', 'sm', 'lg'],
      },
    },
    onClick: { action: 'clicked' },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => (
  <Button {...args}>Click me</Button>
);

export const Default = Template.bind({});
Default.args = {
  variant: 'default',
  size: 'default',
};

export const Destructive = Template.bind({});
Destructive.args = {
  variant: 'destructive',
};

export const Outline = Template.bind({});
Outline.args = {
  variant: 'outline',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
};

export const Ghost = Template.bind({});
Ghost.args = {
  variant: 'ghost',
};

export const Link = Template.bind({});
Link.args = {
  variant: 'link',
};
