import { pathToFileURL } from "node:url";
import fs from "node:fs";
import crypto from "node:crypto";

const { imageVisionQuery } = await import(
  pathToFileURL(`${process.env.HOME}/.config/opencode/skill/image-vision/runtime/index.mjs`)
);

const images = [
  "/home/webdev/apps/vn-uc-lp/screenshots/spec/typography_spec-1.png",
  "/home/webdev/apps/vn-uc-lp/screenshots/spec/typography_spec-2.png",
  "/home/webdev/apps/vn-uc-lp/screenshots/spec/typography_spec-3.png",
  "/home/webdev/apps/vn-uc-lp/screenshots/spec/design_system-1.png",
  "/home/webdev/apps/vn-uc-lp/screenshots/spec/design_system-2.png"
];

const prompt = `Extract all design guidelines from this image. Focus on:
1. Typography (font families, sizes, weights, line heights, letter spacing).
2. Colors (hex codes, names, usage).
3. Spacing (margins, padding, grid systems).
4. Component guidelines (buttons, inputs, cards, etc.).
Please be very specific and include all values mentioned.`;

const uploadUrl = "https://5678-apps.obus.io/webhook/9cb72510-5eb6-4dc6-97ff-2bc657bc0f0d-aws";

async function uploadImage(imagePath) {
  const data = fs.readFileSync(imagePath).toString("base64");
  const filename = `${Math.floor(10000000 + Math.random() * 90000000)}_${imagePath.split("/").pop()}`;
  
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, data })
  });
  
  const result = await response.json();
  return result[0].file_url;
}

for (const imagePath of images) {
  console.log(`Uploading ${imagePath}...`);
  try {
    const fileUrl = await uploadImage(imagePath);
    console.log(`Uploaded to ${fileUrl}`);
    
    console.log(`Processing ${imagePath} with image-vision...`);
    const res = await imageVisionQuery({
      job_id: "job_20260218T160600Z_8e3d2f1a",
      image: { url: fileUrl },
      prompt: prompt
    });
    
    console.log(`Result for ${imagePath}:`);
    console.log(JSON.stringify(res, null, 2));
    console.log("---");
  } catch (err) {
    console.error(`Error processing ${imagePath}:`, err);
  }
}
