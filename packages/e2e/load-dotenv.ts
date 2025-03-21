import * as DotEnv from "dotenv";

const EnvPathList = [
  ".env.local",
  ".env.ci",
  process.env.NODE_ENV === "development" && ".env.development",
  ".env",
].filter(Boolean) as string[];

for (const path of EnvPathList) {
  DotEnv.config({ path });
}
