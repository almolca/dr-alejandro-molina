import { chromium } from '/Users/alejandro/.npm/_npx/420ff84f11983ee5/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome'});
const page=await browser.newPage();const results=[];
for(const width of [375,390,430,768,1024,1280,1440,1728]){
 await page.setViewportSize({width,height:1000});await page.goto('http://localhost:3502');
 await page.locator('footer').scrollIntoViewIfNeeded();
 const logos=await page.locator('header img,footer img').evaluateAll(async imgs=>Promise.all(imgs.map(async img=>{
  await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
  const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
  return {source:img.currentSrc,cornerAlpha:ctx.getImageData(0,0,1,1).data[3],width:img.width,height:img.height,filter:getComputedStyle(img).filter,blendMode:getComputedStyle(img).mixBlendMode};
 })));
 for(const logo of logos){assert.equal(logo.cornerAlpha,0);assert.equal(logo.filter,'none');assert.equal(logo.blendMode,'normal');}
 results.push({width,logos});
}
fs.writeFileSync('qa/r4-3/browser-logo.json',JSON.stringify(results,null,2));console.log('Optimized logo alpha verified at all eight widths');await browser.close();
