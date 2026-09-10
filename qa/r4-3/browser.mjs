/* Run with R4_PLAYWRIGHT_MODULE pointing to an installed Playwright package.
 * Optional R4_AXE_PATH enables WCAG 2.2 AA checks without changing app dependencies.
 */
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.R4_PLAYWRIGHT_MODULE ? pathToFileURL(`${process.env.R4_PLAYWRIGHT_MODULE}/index.mjs`).href : 'playwright');
const base = process.env.R4_BASE_URL || 'http://localhost:3502';
const flagship = '/male-aesthetics/penile-girth-enhancement';
const routes = ['/', '/about', '/male-aesthetics', flagship, '/mens-health'];
const widths = [375,390,430,768,1024,1280,1440,1728];
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const context = await browser.newContext();
  const page = await context.newPage();
  let issues = [];
  page.on('pageerror', e => issues.push(e.message));
  page.on('console', m => {if(m.type()==='error') issues.push(m.text());});
  const results = [];
  for(const route of routes) for(const width of widths) {
    issues=[];
    await page.setViewportSize({width,height:1000});
    const response=await page.goto(base+route);
    await page.waitForTimeout(350);
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.locator('footer img').evaluate(i => i.decode());
    await page.evaluate(() => scrollTo(0,0));
    const metrics=await page.evaluate(() => ({
      overflow:document.documentElement.scrollWidth>innerWidth,
      h1:document.querySelectorAll('h1').length,
      logo:[...document.querySelectorAll('header img,footer img')].map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0,width:i.width,height:i.height})),
      gated:/EXACT OFFICIAL|PRP|P-Shot|placeholder|photography pending|Surgical grounding|Precision begins/.test(document.body.innerText),
      photoFrames:[...document.querySelectorAll('[data-photo-slot]')].map(e=>({slot:e.dataset.photoSlot,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,emptyText:e.textContent.trim()==='',insideViewport:e.getBoundingClientRect().left>=0&&e.getBoundingClientRect().right<=innerWidth})),
      navSingleLine:[...document.querySelectorAll('nav[aria-label="Primary"] a')].every(a=>a.getBoundingClientRect().height<30),
      approvedRecognition:['Top Doctors Spain 2020','Doctoralia Awards Spain 2022'].every(text=>document.body.innerText.includes(text)),
      links:[...document.querySelectorAll('a')].filter(a=>a.href.includes('booking.nmc.ae')).every(a=>a.target==='_blank'&&a.rel.includes('noopener')&&a.rel.includes('noreferrer')),
    }));
    results.push({route,width,status:response.status(),...metrics,errors:[...issues]});
  }
  const interactions=[];
  for(const width of [390,768,1024,1440]) {
    await page.setViewportSize({width,height:1000});await page.goto(base+'/');
    if(width<1280) {
      await page.getByRole('button',{name:'Open menu',exact:true}).click();
      await page.getByRole('dialog').getByRole('link',{name:'Penile Girth Enhancement',exact:true}).click();
      await page.waitForURL(base+flagship);
      interactions.push({width,navigation:page.url().endsWith(flagship),drawerClosed:await page.getByRole('dialog').count()===0});
      await page.getByRole('button',{name:'Open menu',exact:true}).click();
      await page.keyboard.press('Escape');
      interactions.push({width,escapeCloses:await page.getByRole('dialog').count()===0,focusReturns:await page.getByRole('button',{name:'Open menu',exact:true}).evaluate(e=>e===document.activeElement)});
    } else {
      await page.getByRole('navigation',{name:'Primary',exact:true}).getByRole('link',{name:'Penile Girth Enhancement',exact:true}).click();await page.waitForURL(base+flagship);
      interactions.push({width,navigation:page.url().endsWith(flagship)});
    }
  }
  await page.goto(base+flagship);
  const question=page.getByRole('button',{name:'Is penile girth enhancement safe?',exact:true});await question.click();
  interactions.push({faqExpanded:await question.getAttribute('aria-expanded')==='true'});
  // Intercept the external navigation: verifies actual click/target without submitting or contacting a clinic.
  let bookingUrl='';await context.route('https://booking.nmc.ae/**',route=>{bookingUrl=route.request().url();return route.fulfill({status:200,body:'Booking handoff checked'});});
  const popupPromise=context.waitForEvent('page');await page.locator('main a[href*="booking.nmc.ae"]').first().click();const popup=await popupPromise;await popup.waitForLoadState();
  interactions.push({bookingHandoff:bookingUrl==='https://booking.nmc.ae/en-ae/doctor/urology-urinary-system/abu-dhabi/alejandro-molina'});await popup.close();
  const accessibility=[];
  if(process.env.R4_AXE_PATH) for(const route of routes) for(const width of [390,1440]) {
    await page.setViewportSize({width,height:1000});await page.goto(base+route);await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,170))}scrollTo(0,0)});await page.waitForTimeout(600);
    await page.addScriptTag({path:process.env.R4_AXE_PATH});
    const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
    accessibility.push({route,width,violations});
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+flagship);await page.waitForTimeout(800);
  const reducedMotion=await page.evaluate(()=>({matches:matchMedia('(prefers-reduced-motion: reduce)').matches,h1Visible:getComputedStyle(document.querySelector('h1').parentElement).opacity==='1',horizontalOverflow:document.documentElement.scrollWidth>innerWidth}));
  await page.goto(base+'/about');
  const disclosure=page.locator('details').first();await disclosure.locator('summary').click();
  interactions.push({biographyOpens:await disclosure.getAttribute('open')!==null,biographyPreserved:(await disclosure.innerText()).includes('Hospital Clínic Barcelona')});
  const report={results,interactions,accessibility,reducedMotion};
  fs.writeFileSync('qa/r4-3/results.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({pages:results.length,failures:results.filter(r=>r.status!==200||!r.navSingleLine||r.overflow||r.h1!==1||r.gated||r.errors.length||!r.links||r.logo.some(l=>!l.loaded)||r.photoFrames.some(f=>!f.insideViewport||f.width<=0||f.height<=0||!f.emptyText)||(['/', '/about'].includes(r.route)&&!r.approvedRecognition)),interactions,accessibility,reducedMotion},null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
