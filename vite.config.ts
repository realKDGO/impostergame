import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "./package.json";
// @ts-expect-error Node built-ins are available to Vite's config runtime.
import { readFileSync, writeFileSync } from "node:fs";
// @ts-expect-error Node built-ins are available to Vite's config runtime.
import { resolve } from "node:path";

const appVersion=packageJson.version;
const versionServiceWorker=()=>({name:"blendin-version-service-worker",closeBundle(){const path=resolve("dist/sw.js"),source=readFileSync(path,"utf8");writeFileSync(path,source.replaceAll("__APP_VERSION__",appVersion));writeFileSync(resolve("dist/version.json"),JSON.stringify({version:appVersion}))}});

export default defineConfig({define:{__APP_VERSION__:JSON.stringify(appVersion)},plugins:[react(),versionServiceWorker()]});
