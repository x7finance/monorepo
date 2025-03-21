import type { FC } from "react";
import React from "react";

import type { ButtonProps } from "@x7/ui/button";
import { Button } from "@x7/ui/button";

interface CustomProps extends ButtonProps {
  showChildren?: boolean;
  onClick(): void;
  buttonText: string;
}

const Custom: FC<CustomProps> = ({
  showChildren,
  buttonText,
  children,
  fullWidth = true,
  size = "lg",
  ...props
}) => {
  if (!showChildren) {
    return (
      <Button size={size} fullWidth={fullWidth} {...props}>
        {buttonText}
      </Button>
    );
  }

  return <>{children}</>;
};

export { Custom, type CustomProps };
