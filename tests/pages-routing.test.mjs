import test,{afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import React,{act} from 'react';
import {HashRouter,Routes,Route,Outlet,Link} from 'react-router-dom';
import {SectionLink} from '../src/components/learning/SectionLink.tsx';
import {ScrollAwareTOC} from '../src/components/learning/ScrollAwareTOC.tsx';
import {useSectionNavigation} from '../src/hooks/useSectionNavigation.ts';
const h=React.createElement;
let dom,root,scrolls;
const tick=()=>new Promise(resolve=>setTimeout(resolve,15));
function Layout(){useSectionNavigation();return h('main',{id:'main-content',tabIndex:-1},h(SectionLink,{sectionId:'main-content'},'Skip to content'),h(Outlet));}
function Lesson({target=true}){return h('article',null,h('h1',null,'Lesson remains open'),h(SectionLink,{sectionId:'lab'},'Operation lab'),h(SectionLink,{sectionId:'space & memory'},'Encoded section'),h(ScrollAwareTOC,{sections:[{id:'prereqs',title:'Prerequisites'}]}),h(Link,{to:'/stage/1/lesson/first-python-program'},'Another lesson'),target&&h('section',{id:'lab'},'Interactive lab'),h('section',{id:'prereqs'},'Required foundations'),h('section',{id:'space & memory'},'Encoded target'));}
function tree(target=true){return h(HashRouter,null,h(Routes,null,h(Route,{element:h(Layout)},h(Route,{path:'/stage/:stage/lesson/:lesson',element:h(Lesson,{target})}),h(Route,{path:'*',element:h('p',null,'PAGE NOT FOUND')}))));}
async function mount(url='https://example.test/ai-learning-academy/#/stage/2/lesson/complexity-foundations',target=true){
 dom=new JSDOM('<!doctype html><div id="root"></div>',{url,pretendToBeVisual:true});
 for(const name of ['window','document','HTMLElement','Node','MutationObserver'])globalThis[name]=dom.window[name];
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 dom.window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
 dom.window.requestAnimationFrame=callback=>dom.window.setTimeout(()=>callback(0),0);
 dom.window.cancelAnimationFrame=id=>dom.window.clearTimeout(id);
 scrolls=[];dom.window.scrollTo=(...args)=>scrolls.push(args);
 const{createRoot}=await import('react-dom/client');root=createRoot(dom.window.document.getElementById('root'));
 await act(async()=>{root.render(tree(target));await tick();});
 await act(async()=>{await tick();});
}
async function click(text){const link=[...document.querySelectorAll('a')].find(item=>item.textContent===text);assert.ok(link,`Missing ${text}`);await act(async()=>{link.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true,cancelable:true,button:0}));await tick();});await act(async()=>{await tick();});}
afterEach(async()=>{if(root)await act(async()=>root.unmount());dom?.window.close();root=null;dom=null;for(const name of ['window','document','HTMLElement','Node','MutationObserver'])delete globalThis[name];delete globalThis.IS_REACT_ACT_ENVIRONMENT;});

test('section click keeps the hash lesson route and scrolls to its target',async()=>{
 await mount();await click('Operation lab');assert.equal(window.location.hash,'#/stage/2/lesson/complexity-foundations#lab');assert.equal(document.querySelector('h1').textContent,'Lesson remains open');assert.ok(scrolls.some(args=>typeof args[0]==='object'&&args[0].behavior==='auto'));
});
test('old table-of-contents uses the same preserved route instead of replaceState(#id)',async()=>{
 await mount();await click('Prerequisites');assert.equal(window.location.hash,'#/stage/2/lesson/complexity-foundations#prereqs');assert.ok(document.getElementById('prereqs'));
});
test('copied section URL loads and finds the same target on a fresh render',async()=>{
 await mount('https://example.test/ai-learning-academy/#/stage/2/lesson/complexity-foundations#lab');assert.equal(document.querySelector('h1').textContent,'Lesson remains open');assert.ok(scrolls.some(args=>typeof args[0]==='object'));
});
test('section link preserves the lesson search query and encodes special characters',async()=>{
 await mount('https://example.test/ai-learning-academy/#/stage/2/lesson/complexity-foundations?mode=practice');await click('Encoded section');assert.equal(window.location.hash,'#/stage/2/lesson/complexity-foundations?mode=practice#space%20%26%20memory');assert.ok(document.getElementById('space & memory'));
});
test('skip-to-content preserves the route and moves keyboard focus into main',async()=>{
 await mount();await click('Skip to content');assert.equal(window.location.hash,'#/stage/2/lesson/complexity-foundations#main-content');assert.equal(document.activeElement.id,'main-content');
});
test('deep linking waits for a lazy target to appear',async()=>{
 await mount('https://example.test/ai-learning-academy/#/stage/2/lesson/complexity-foundations#lab',false);assert.equal(scrolls.length,0);await act(async()=>{root.render(tree(true));await tick();});await act(async()=>{await tick();});assert.ok(scrolls.some(args=>typeof args[0]==='object'));assert.ok(document.getElementById('lab'));
});
test('repeated section clicks and navigation to a different lesson remain valid',async()=>{
 await mount();await click('Operation lab');const count=scrolls.length;await click('Operation lab');assert.ok(scrolls.length>count);await click('Another lesson');assert.equal(window.location.hash,'#/stage/1/lesson/first-python-program');assert.equal(document.querySelector('h1').textContent,'Lesson remains open');await click('Prerequisites');assert.equal(window.location.hash,'#/stage/1/lesson/first-python-program#prereqs');
});
test('lesson navigation source contains no raw fragment links that discard a HashRouter route',()=>{
 const folder=new URL('../src/pages/lessons/',import.meta.url);for(const file of readdirSync(folder).filter(name=>name.endsWith('.tsx'))){const source=readFileSync(new URL(file,folder),'utf8');assert.doesNotMatch(source,/href=\{`#\$\{/ ,file);}
 assert.doesNotMatch(readFileSync(new URL('../src/components/learning/ScrollAwareTOC.tsx',import.meta.url),'utf8'),/window\.history\.replaceState/);
 assert.doesNotMatch(readFileSync(new URL('../index.html',import.meta.url),'utf8'),/fonts\.googleapis|fonts\.gstatic/);
});
