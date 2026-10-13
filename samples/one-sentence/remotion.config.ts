import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
// Use a locally installed Chromium if REMOTION_BROWSER is set (e.g. in sandboxes without downloads).
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
