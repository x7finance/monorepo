import { defineConfig } from "tsup"

export default defineConfig({
  minify: true,
  target: "es2018",
  external: ["react"],
  sourcemap: true,
  dts: true,
  format: ["esm", "cjs"],
  // esbuildOptions(options) {
  //   options.banner = {
  //     js: `
  //     "use client"
  //     `,
  //   }
  // },
})

// import { defineConfig, Options } from "tsup"

// export default defineConfig((options: Options) => ({
//   treeshake: true,
//   splitting: true,
//   entry: ["src/**/*.tsx"],
//   format: ["esm"],
//   dts: true,
//   minify: true,
//   clean: true,
//   external: ["react"],
//   ...options,
// }))
