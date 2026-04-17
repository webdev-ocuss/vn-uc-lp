import { pathToFileURL } from "node:url";
import fs from "node:fs";

const { imageVisionDescribe } = await import(
  pathToFileURL(`${process.env.HOME}/.config/opencode/skill/image-vision/runtime/index.mjs`)
);

try {
  const res = await imageVisionDescribe({
    job_id: "job_20260219T210500Z_a1b2c3d4",
    image: { path: "/home/webdev/apps/vn-uc-lp/screenshots/Screenshot_9.png" },
    prompt: "Describe the colors and layout of the 'Reflection' and 'What' sections. Mention if the background is dark or light."
  });

  console.log(JSON.stringify(res, null, 2));
} catch (err) {
  console.error(err);
  process.exit(1);
}
