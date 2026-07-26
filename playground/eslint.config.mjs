import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: ["playground/.next/**", "**/.next/**", "**/node_modules/**"]
  },
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      next: {
        rootDir: "playground"
      }
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];

export default eslintConfig;
