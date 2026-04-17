import { pathToFileURL } from "node:url";
import fs from "node:fs";

const { imageVisionQuery } = await import(
  pathToFileURL(`${process.env.HOME}/.config/opencode/skill/image-vision/runtime/index.mjs`)
);

try {
  const res = await imageVisionQuery({
    job_id: "job_20260219T210500Z_a1b2c3d4",
    image: { path: "/home/webdev/apps/vn-uc-lp/screenshots/Screenshot_9.png" },
    prompt: "Analyze the intersection between the 'Reflection' section and the 'What' section. Focus on the upper 25% of this transition area. 1. Identify the hex or RGB colors at the seam (the horizontal line where they meet) at three points: the far left edge, the center, and the far right edge. 2. Describe the gradient geometry in the 'What' section (the section below 'Reflection'). Is there a heavier gradient on the sides? 3. Estimate the vertical depth of the gradient falloff in pixels or as a percentage of the section height. 4. Confirm if the effect is symmetric and primarily in the upper half of the section."
  });

  console.log(JSON.stringify(res, null, 2));
} catch (err) {
  console.error(err);
  process.exit(1);
}
