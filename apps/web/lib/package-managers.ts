/** Package-manager commands for `components/code-block-command.tsx` (server-safe helpers). */

export const PACKAGE_MANAGERS = ["pnpm", "yarn", "npm", "bun"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];
export type PackageManagerCommands = Record<PackageManager, string>;

/** A single-line npm / npx command, shown with the package-manager switcher. */
export function isPackageManagerCommand(code: string) {
  return !code.trim().includes("\n") && /^(?:npm|npx)\s/.test(code.trim());
}

export function convertNpmCommand(npmCommand: string): PackageManagerCommands {
  const npm = npmCommand.trim();

  if (/^npm (?:install|i)\b/.test(npm)) {
    const rest = npm.replace(/^npm (?:install|i)\b/, "");
    return { pnpm: `pnpm add${rest}`, yarn: `yarn add${rest}`, npm, bun: `bun add${rest}` };
  }
  if (npm.startsWith("npx create-")) {
    return {
      pnpm: npm.replace("npx create-", "pnpm create "),
      yarn: npm.replace("npx create-", "yarn create "),
      npm,
      bun: npm.replace("npx", "bunx --bun"),
    };
  }
  if (npm.startsWith("npm create")) {
    return {
      pnpm: npm.replace("npm create", "pnpm create"),
      yarn: npm.replace("npm create", "yarn create"),
      npm,
      bun: npm.replace("npm create", "bun create"),
    };
  }
  if (npm.startsWith("npx ")) {
    return {
      pnpm: npm.replace("npx", "pnpm dlx"),
      yarn: npm.replace("npx", "yarn dlx"),
      npm,
      bun: npm.replace("npx", "bunx --bun"),
    };
  }
  if (npm.startsWith("npm run ")) {
    return {
      pnpm: npm.replace("npm run", "pnpm"),
      yarn: npm.replace("npm run", "yarn"),
      npm,
      bun: npm.replace("npm run", "bun"),
    };
  }
  return { pnpm: npm, yarn: npm, npm, bun: npm };
}
