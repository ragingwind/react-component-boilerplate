import tailwind from "tailwindcss";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import bundleSize from "rollup-plugin-bundle-size";
import { terser } from "rollup-plugin-terser";
import purgecss from "@fullhuman/postcss-purgecss";
import pkg from "./package.json";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true
    }
  ],
  external: ["react", "react-dom"],
  plugins: [
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true
    }),
    postcss({
      extensions: [".css"],
      modules: true,
      minimize: isProduction,
      plugins: [
        tailwind(),
        ...(isProduction
          ? [
              purgecss({
                content: ["./src/**/*.tsx"],
                defaultExtractor: content =>
                  content.match(/[\w-/:]+(?<!:)/g) || []
              })
            ]
          : [])
      ]
    }),
    commonjs({
      include: ["node_modules/**"],
      namedExports: {
        "node_modules/react/react.js": [
          "Children",
          "Component",
          "PropTypes",
          "createElement"
        ],
        "node_modules/react-dom/index.js": ["render"]
      }
    }),
    terser(),
    bundleSize()
  ]
};
