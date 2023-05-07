import '@testing-library/jest-dom';

import { fireEvent, render } from '@testing-library/react';
import { createRef } from 'react';

import { Button, buttonVariants } from '../button/Button';

describe('Button component', () => {
  test('renders with default props', () => {
    const { getByRole } = render(<Button />);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(buttonVariants());
  });

  test.each([['destructive'], ['outline'], ['secondary'], ['ghost'], ['link']])(
    'renders with variant: %s',
    (variant) => {
      const { getByRole } = render(<Button variant={variant as never} />);
      const button = getByRole('button');
      expect(button).toHaveClass(buttonVariants({ variant: variant as never }));
    }
  );

  test.each([['sm'], ['lg']])('renders with size: %s', (size) => {
    const { getByRole } = render(<Button size={size as never} />);
    const button = getByRole('button');
    expect(button).toHaveClass(buttonVariants({ size: size as never }));
  });

  test('passes additional props', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button onClick={handleClick} />);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  test('accepts a custom class name', () => {
    const customClassName = 'custom-class';
    const { getByRole } = render(<Button className={customClassName} />);
    const button = getByRole('button');
    expect(button).toHaveClass(customClassName);
  });

  test('forwards the ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} />);
    expect(ref.current).not.toBeNull();
  });
});
