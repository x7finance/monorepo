/* oxlint-disable @typescript-eslint/require-await */
import { CheckerProvider } from "~/lib/systems/Checker/Provider";

export async function Providers({ children }: { children: React.ReactNode }) {
  return <CheckerProvider>{children}</CheckerProvider>;
}
