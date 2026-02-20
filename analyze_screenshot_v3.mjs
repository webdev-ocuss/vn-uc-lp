import { pathToFileURL } from "node:url";
import fs from "node:fs";

const { imageVisionQuery } = await import(
  pathToFileURL(`${process.env.HOME}/.config/opencode/skill/image-vision/runtime/index.mjs`)
);

try {
  const res = await imageVisionQuery({
    job_id: "job_20260219T210500Z_a1b2c3d4",
    image: { path: "/home/webdev/apps/vn-uc-lp/screenshots/Screenshot_9.png" },
    prompt: "Analyze the transition from the dark 'Reflection' section to the light 'What' section. 1. At the very top edge of the 'What' section (the seam), what are the hex colors at the left, center, and right? 2. Describe the 'C-shape' vignette in the 'What' section. Is it darker than the main background? What is its color? 3. How far down (in pixels or percentage) does the vignette/gradient extend from the top edge? 4. Is the vignette symmetric? 5. What is the main background color of the 'What' section below the vignette?"
  });

  console.log(JSON.stringify(res, null, 2));
} catch (err) {
  console.error(err);
  process.exit(1);
}
