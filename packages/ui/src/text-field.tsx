/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/unbound-method */

import * as React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@x7/css";

import type { IconComponent } from "./types";

const inputRegex = /^\d*(?:\\[.])?\d*$/; // match escaped "." characters via in a non-capturing group
const escapeRegExp = (string: string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string

const numericInputProps: Partial<React.InputHTMLAttributes<HTMLInputElement>> =
  {
    placeholder: "0.0",
  };

const percentInputProps: Partial<React.InputHTMLAttributes<HTMLInputElement>> =
  {
    placeholder: "0",
    pattern: "^[0-9]*$",
    inputMode: "decimal",
    maxLength: 3,
  };

const textFieldVariants = cva(
  "truncate appearance-none dark:text-zinc-50 text-zinc-900 w-full ring-0! outline-hidden! sm:text-sm sm:leading-6",
  {
    variants: {
      size: {
        sm: "min-h-[36px] h-[36px] py-1",
        default: "min-h-[40px] h-[40px] py-2",
      },
      variant: {
        default:
          "border-0 flex items-center px-3 rounded-lg font-medium block bg-secondary group-hover:bg-muted group-focus:bg-accent",
        naked: "border-0 bg-transparent",
        outline:
          "bg-secondary flex items-center px-3 rounded-lg font-medium block border border-accent group-hover:border-black/20 group-focus:border-black/30 hover:border-black/30 focus-within:border-black/30 dark:group-hover:border-white/20 dark:group-focus:border-white/30 dark:hover:border-white/30 dark:focus-within:border-white/30",
      },
      isError: {
        yes: "bg-red/10 text-red",
        no: "",
      },
      hasIcon: {
        yes: "pl-10",
        no: "",
      },
      hasUnit: {
        yes: "rounded-r-none border-r-0!",
        no: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hasIcon: "no",
      hasUnit: "no",
      size: "default",
      isError: "no",
    },
  },
);

type InputType = "text" | "number" | "percent";

interface TextFieldBaseProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    Omit<VariantProps<typeof textFieldVariants>, "isError"> {
  isError?: boolean;
  id?: string;
  icon?: IconComponent;
  iconProps?: Omit<React.ComponentProps<"svg">, "width" | "height">;
  unit?: string;
}

interface TextFieldDynamicProps<T extends InputType> {
  type: T;
  maxDecimals?: T extends "number" ? number : never;
  onValueChange?(val: string): void;
}

export type TextFieldProps<T extends InputType> = TextFieldBaseProps &
  TextFieldDynamicProps<T>;

const isTypeText = (type: InputType): type is "text" => type === "text";
const isTypeNumber = (type: InputType): type is "number" => type === "number";
const isTypePercent = (type: InputType): type is "percent" =>
  type === "percent";

const Component = <T extends InputType>(
  {
    icon: Icon,
    iconProps,
    unit,
    variant,
    className,
    type,
    onChange,
    maxDecimals,
    size,
    onValueChange,
    isError,
    ...props
  }: TextFieldProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>,
) => {
  const _onChange: React.InputHTMLAttributes<HTMLInputElement>["onChange"] = (
    e,
  ) => {
    const nextUserInput = e.target.value;
    if (typeof nextUserInput === "undefined") {
      return;
    }

    if (isTypeNumber(type)) {
      const val = `${nextUserInput}`.replace(/,/g, ".");
      if (onValueChange && val === "") onValueChange("");

      if (inputRegex.test(escapeRegExp(val))) {
        if (maxDecimals && val.includes(".")) {
          const [, decimals] = val.split(".");
          if (onValueChange && decimals!.length <= maxDecimals) {
            onValueChange(val);
          }
        } else {
          if (onValueChange) onValueChange(val);
        }
      }
    } else if (isTypeText(type) && onValueChange) {
      onValueChange(nextUserInput);
    } else if (isTypePercent(type)) {
      const _nextUserInput = nextUserInput.replace(/,/g, ".").replace(/%/g, "");
      if (
        _nextUserInput === "" ||
        inputRegex.test(escapeRegExp(_nextUserInput))
      ) {
        if (onValueChange) onValueChange(_nextUserInput);
      }
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="group relative flex w-full items-center justify-between">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
          <Icon
            {...iconProps}
            width={18}
            height={18}
            aria-hidden="true"
            className={cn("text-zinc-500", iconProps?.className)}
          />
        </div>
      )}
      <input
        onChange={_onChange}
        className={textFieldVariants({
          isError: isError ? "yes" : "no",
          variant,
          hasIcon: Icon ? "yes" : "no",
          hasUnit: unit ? "yes" : "no",
          className: cn(className, "flex-1 grow ring-0! outline-hidden!"),
        })}
        ref={ref}
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
        autoComplete="off"
        {...(isTypeNumber(type) && numericInputProps)}
        {...(isTypePercent(type) && percentInputProps)}
        {...props}
      />
      {unit ? (
        <div
          className={textFieldVariants({
            isError: isError ? "yes" : "no",
            variant,
            size,
            className: "text-muted-foreground w-[unset]! rounded-l-none",
          })}
        >
          {unit}
        </div>
      ) : null}
    </div>
  );
};

const TextField = React.forwardRef(Component);
TextField.displayName = "TextField";

const TextFieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
});
TextFieldDescription.displayName = "TextFieldDescription";

export {
  TextField,
  type TextFieldBaseProps,
  TextFieldDescription,
  textFieldVariants,
};
