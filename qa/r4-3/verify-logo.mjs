import sharp from 'sharp';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const src=await sharp('public/brand/logo-full.png').raw().toBuffer({resolveWithObject:true});
const dst=await sharp('public/brand/logo-full-transparent.png').raw().toBuffer({resolveWithObject:true});
assert.equal(dst.info.channels,4);assert.equal(dst.info.width,src.info.width);assert.equal(dst.info.height,src.info.height);
let rgbDifferences=0,borderAlpha=0;
for(let i=0;i<src.info.width*src.info.height;i++){
 for(let c=0;c<3;c++)if(src.data[i*3+c]!==dst.data[i*4+c])rgbDifferences++;
 const x=i%src.info.width,y=Math.floor(i/src.info.width);
 if(x===0||y===0||x===src.info.width-1||y===src.info.height-1)borderAlpha=Math.max(borderAlpha,dst.data[i*4+3]);
}
assert.equal(rgbDifferences,0);assert.equal(borderAlpha,0);
const result={genuineAlpha:true,originalDimensions:true,rgbDifferences,borderAlpha};
fs.writeFileSync('qa/r4-3/logo-verification.json',JSON.stringify(result,null,2));console.log(result);
