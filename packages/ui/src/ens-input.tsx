"use client";

import type { ForwardedRef } from "react";
import { forwardRef, useEffect } from "react";
import { useEnsAddress } from "wagmi";

import { ChainId } from "@x7/utils";

import { TextField } from "./text-field";
import type { TextFieldProps } from "./text-field";

function Component(
  props: Omit<TextFieldProps<"text">, "type">,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { data } = useEnsAddress({
    name: `${String(props.value)}`,
    chainId: ChainId.ETHEREUM,
    query: {
      enabled: Boolean(
        props.value &&
          typeof props.value === "string" &&
          props.value.length > 2,
      ),
    },
  });

  useEffect(() => {
    if (typeof data === "string" && props.onValueChange) {
      props.onValueChange(data);
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [data, props.onValueChange]);

  return <TextField {...props} type="text" ref={ref} />;
}

export const EnsInput = forwardRef(Component) as (
  props: TextFieldProps<"text">,
) => React.JSX.Element;
