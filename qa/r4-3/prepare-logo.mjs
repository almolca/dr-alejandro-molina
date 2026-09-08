// Remove only the near-white matte from the approved RGB original.
// Preserve canvas, proportions and every RGB channel; only add alpha.
import sharp from 'sharp';
import fs from 'node:fs';
(async () => {
 const {data,info}=await sharp('public/brand/logo-full.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
 const out=Buffer.alloc(info.width*info.height*4);let transparent=0,opaque=0,partial=0;
 for(let i=0,j=0;i<data.length;i+=3,j+=4){
  out[j]=data[i];out[j+1]=data[i+1];out[j+2]=data[i+2];
  // All foreground navy/bronze pixels are well below this near-white range.
  const distance=255-Math.min(data[i],data[i+1],data[i+2]);
  const a=distance<=18?0:distance>=55?255:Math.round((distance-18)/37*255);
  out[j+3]=a;if(a===0)transparent++;else if(a===255)opaque++;else partial++;
 }
 await sharp(out,{raw:{width:info.width,height:info.height,channels:4}}).png().toFile('public/brand/logo-full-transparent.png');
 fs.writeFileSync('qa/r4-3/logo-alpha.json',JSON.stringify({source:'public/brand/logo-full.png',output:'public/brand/logo-full-transparent.png',width:info.width,height:info.height,unchangedRGB:true,transparent,opaque,partial},null,2));
})();
