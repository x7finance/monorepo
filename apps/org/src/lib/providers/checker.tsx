/* oxlint-disable @typescript-eslint/require-await */
import { CheckerProvider } from "~/lib/systems/Checker/Provider";

export async function CheckerProviderComponent({
  children,
}: {
  children: React.JSX.Element;
}) {
  return <CheckerProvider>{children}</CheckerProvider>;
}
