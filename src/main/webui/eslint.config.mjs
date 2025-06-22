import stylistic from "@stylistic/eslint-plugin";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import vue from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [".git/", "dist/*", ".nuxt/*", ".output/*", ".gitlab/*", "node_modules/*"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended"
  ),
  {
    plugins: {
      "@stylistic": stylistic,
      "@typescript-eslint": typescriptEslint,
      prettier,
      vue,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        // ...vue.environments["setup-compiler-macros"]["setup-compiler-macros"],
      },

      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        parser: "@typescript-eslint/parser",
        globalReturn: false,
        impliedStrict: false,
      },
    },

    rules: {
      "no-undef": "off",
      "vue/multi-word-component-names": "off",
      "vue/valid-v-for": "off",
      "vue/prefer-true-attribute-shorthand": ["error", "always"],
      "vue/no-reserved-component-names": "off",
      "vue/no-v-html": "off",
      "vue/no-v-text-v-html-on-component": "off",
      "vue/no-prop-default": "off",
      "vue/no-mutating-props": "off",
      "vue/no-template-shadow": "off",

      "vue/first-attribute-linebreak": [
        "error",
        {
          singleline: "ignore",
          multiline: "below",
        },
      ],

      "vue/require-default-prop": "off",
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["parameter", "variable"],
          leadingUnderscore: "forbid",

          filter: {
            regex: "_*",
            match: false,
          },

          format: null,
        },
        {
          selector: "parameter",
          leadingUnderscore: "require",
          format: null,
          modifiers: ["unused"],
        },
      ],
    },
  },
];
