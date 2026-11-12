const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const file=path.join(__dirname, '..', 'js', 'empty_latent_selector.js');
let source=fs.readFileSync(file,'utf8').replace('import { app } from "../../scripts/app.js";', 'const app=mockApp;');
const mockApp={graph:{setDirtyCanvas:()=>{}},registerExtension(ext){global.extension=ext}};
vm.runInNewContext(source,{mockApp,setTimeout(fn){fn()}});
const oldNames=['Resolution','Mode','Ratio Lock','Width','Height','Batch Size','Latent Type','Filter'];
const defaults=['▯ 832×1216 (SDXL - 2:3)','Use Preset',true,832,1216,1,'SD 1.5 / SDXL (4ch)','All'];
function makeNode(){
 return {
    comfyClass:'EmptyLatentAdvancedSelector',
    widgets:oldNames.map((name,i)=>({name,value:defaults[i],type:'combo',options:{values:[]}})),
    size:[250,100],
    computeSize(){return [250,100 + this.widgets.filter(w=>w.type!=='HIDDEN').length * 20]},
    setSize(sz){this.size=sz},
 };
}
const index=(n)=>Object.fromEntries(n.widgets.map(w=>[w.name,w]));
const set=(w,name,value)=>{w[name].value=value;w[name].callback?.(value)};
(async()=>{
const n=makeNode();await global.extension.nodeCreated(n);let w=index(n);
assert.deepEqual(n.widgets.map(w=>w.name),['Filter', ...oldNames.slice(0,7)],'visual top filter');
assert.equal(w.Resolution.options.values.length,67);
set(w,'Mode','Override');
set(w,'Ratio Lock',false);
set(w,'Width',1160); set(w,'Height',888);
assert.equal(w.Width.value,1160); assert.equal(w.Height.value,888);
// Core bug: choosing a new preset must update both manual inputs in Override.
set(w,'Resolution','▯ 720×1680 (HD - 9:21)');
assert.equal(w.Width.value,720);assert.equal(w.Height.value,1680);
set(w,'Width',1160); set(w,'Height',888);
set(w,'Filter','FHD 1080p');
assert.equal(w.Resolution.options.values.length,11);
assert.equal(w.Resolution.value,'▯ 1080×2520 (FHD - 9:21)');
assert.equal(w.Width.value,1080);assert.equal(w.Height.value,2520);
set(w,'Resolution','▭ 1920×1080 (FHD - 16:9)');
assert.equal(w.Width.value,1920);assert.equal(w.Height.value,1080);
set(w,'Filter','All');
assert.equal(w.Resolution.value,'▭ 1920×1080 (FHD - 16:9)');
set(w,'Ratio Lock',true);
set(w,'Width',1280);
assert.equal(w.Height.value,720);
set(w,'Height',1440);
assert.equal(w.Width.value,2560);
// Backward compatible serialized order, independent of visual position.
const data={widgets_values:n.widgets.map(w=>w.value)};
n.onSerialize(data);
assert.equal(data.widgets_values[0],w.Resolution.value);
assert.equal(data.widgets_values[1],'Override');
assert.equal(data.widgets_values[3],2560);
assert.equal(data.widgets_values[7],'All');
// Simulate LiteGraph restoring stored values positionally into the visible order.
const restored = makeNode(); await global.extension.nodeCreated(restored);
restored.widgets.forEach((widget,i)=>{widget.value=data.widgets_values[i]});
restored.onConfigure(data);
let ww=index(restored);
assert.equal(ww.Filter.value,'All');
assert.equal(ww.Resolution.value,'▭ 1920×1080 (FHD - 16:9)');
assert.equal(ww.Mode.value,'Override');
assert.equal(ww.Width.value,2560);
assert.equal(ww.Height.value,1440);
// Confirm filter choice, manual dimensions and latent type survive saved workflow.
set(w,'Filter','4K');
set(w,'Mode','Override');set(w,'Ratio Lock',false);
set(w,'Width',1200);set(w,'Height',880);
set(w,'Latent Type','Flux 2 / Klein (128ch)');
const data4={widgets_values:n.widgets.map(x=>x.value)};
n.onSerialize(data4);
const restored4 = makeNode();await global.extension.nodeCreated(restored4);
restored4.widgets.forEach((widget,i)=>{widget.value=data4.widgets_values[i]});
restored4.onConfigure(data4);
const w4=index(restored4);
assert.equal(w4.Filter.value,'4K');
assert.equal(w4.Mode.value,'Override');
assert.equal(w4.Width.value,1200);
assert.equal(w4.Height.value,880);
assert.equal(w4['Latent Type'].value,'Flux 2 / Klein (128ch)');
// Old original six-widget workflow save.
const old6={widgets_values:['▭ 1280×720 (HD - 16:9)','Override',false,1040,824,1]};
const orig=makeNode();await global.extension.nodeCreated(orig);
orig.widgets.forEach((widget,i)=>{widget.value=old6.widgets_values[i]});
orig.onConfigure(old6);
const wo=index(orig);
assert.equal(wo.Resolution.value,'▭ 1280×720 (HD - 16:9)');
assert.equal(wo.Mode.value,'Override');
assert.equal(wo.Width.value,1040);
assert.equal(wo.Height.value,824);
assert.equal(wo.Filter.value,'All');
console.log('PASS: filter visually first; manual dimensions updated by preset/category; ratio lock; old/new serialization; override restoration; 6-widget legacy workflow');
})().catch(e=>{console.error(e);process.exit(1)});
