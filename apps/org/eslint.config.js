import baseConfig, { restrictEnvAccess } from "@x7/eslint-config/base";
import nextjsConfig from "@x7/eslint-config/nextjs";
import reactConfig from "@x7/eslint-config/react";

export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
