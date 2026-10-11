import sharedConfig from "../../shared-config.json";

export const SITE_NAME = sharedConfig.appName;
export const SITE_TITLE = `${sharedConfig.appName} — A clearer view of your money.`;
export const SITE_DESCRIPTION =
  "An Android expense tracker with manual entry and optional on-device SMS import.";
export const APP_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL ??
  "https://play.google.com/store/apps/details?id=com.holdmint";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "everyspendapp@gmail.com";
export const CONTACT_FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ??
  `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? sharedConfig.siteUrl
).replace(/\/$/, "");

export const DEFAULT_OG_IMAGE = "/opengraph-image";

export function assetUrl(file: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${file}`;
}
