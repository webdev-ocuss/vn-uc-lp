import { pathToFileURL } from "node:url";
import fs from "node:fs";

const { imageVisionQuery } = await import(
  pathToFileURL(`${process.env.HOME}/.config/opencode/skill/image-vision/runtime/index.mjs`)
);

try {
  const res = await imageVisionQuery({
    job_id: "job_20260219T210500Z_a1b2c3d4",
    image: { path: "/home/webdev/apps/vn-uc-lp/screenshots/Screenshot_9.png" },
    prompt: "Analyze the 'What' section (below 'Reflection') in Screenshot_9.png. 1. Look for a 'C-shape' vignette effect in the upper half. Describe its geometry (how far it extends from the sides and top). 2. Sample the colors at the very top edge (the seam) of the 'What' section at the left, center, and right. 3. Is the background color of the 'What' section uniform below the gradient? If so, what is the hex color? 4. Confirm if the gradient is symmetric or if there's a clear bias to one side."
  });

  console.log(JSON.stringify(res, null, 2));
} catch (err) {
  console.error(err);
  process.exit(1);
}
