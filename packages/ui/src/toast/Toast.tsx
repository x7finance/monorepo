import { toast } from "sonner";

import type { PromiseNotification } from "@x7/dexie";
import { createNotification } from "@x7/dexie";
import { Chain } from "@x7/utils";

import { Dots } from "../dots";
import { ToastContent, ToastTypes } from "./ToastContent";

export const createToast = (props: PromiseNotification) => {
  const { txHash, chainId, href, summary, promise } = props;

  const txUrl = href ?? (txHash ? Chain.from(chainId)?.getTxUrl(txHash) : "");

  toast.promise(promise, {
    loading: (
      <ToastContent
        type={ToastTypes.LOADING}
        href={txUrl}
        summary={<Dots>{summary.pending}</Dots>}
      />
    ),
    success: (
      <ToastContent
        type={ToastTypes.SUCCESS}
        href={txUrl}
        summary={summary.completed}
      />
    ),
    error: (
      <ToastContent
        type={ToastTypes.ERROR}
        href={txUrl}
        summary={summary.failed}
      />
    ),
    id: txHash,
    duration: Infinity,
  });

  return createNotification(props);
};
