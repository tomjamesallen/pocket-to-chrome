!function(e){var t={};function n(o){if(t[o])return t[o].exports;var c=t[o]={i:o,l:!1,exports:{}};return e[o].call(c.exports,c,c.exports,n),c.l=!0,c.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var c in e)n.d(o,c,function(t){return e[t]}.bind(null,c));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";const o="63325-942e4030a60f61d0fe170393",c=e=>new Promise(t=>{chrome.storage.sync.set({accessToken:e},t)}),s=()=>new Promise(e=>{chrome.storage.sync.get(t=>e(t.accessToken))}),r=async()=>fetch("https://getpocket.com/v3/oauth/request",{method:"POST",headers:{"Content-Type":"application/json","X-Accept":"application/json"},body:JSON.stringify({consumer_key:o,redirect_uri:"https://localhost:3000"})}).then(e=>e.json()).then(e=>e.code).catch(()=>null),a=e=>{window.open(`https://getpocket.com/auth/authorize?request_token=${e}&redirect_uri=https://getpocket.com/`)},i=()=>new Promise(e=>{chrome.tabs.onUpdated.addListener((t,n,o)=>{"complete"==n.status&&"https://getpocket.com/a/queue/"===o.url&&e()})}),l=async e=>fetch("https://getpocket.com/v3/oauth/authorize",{method:"POST",headers:{"Content-Type":"application/json","X-Accept":"application/json"},body:JSON.stringify({consumer_key:o,access_token:e})}).then(e=>e.json()).then(e=>e.access_token).catch(()=>null),u=async e=>fetch("https://getpocket.com/v3/get",{method:"POST",headers:{"Content-Type":"application/json","X-Accept":"application/json"},body:JSON.stringify({consumer_key:o,access_token:e,state:"all",detailType:"simple"})}).then(e=>e.json()).catch(()=>null),p=async()=>{return await s()||await(async()=>{const e=await r();if(!e)return null;await a(e),await i();const t=await l(e);return t?(await c(t),t):null})()};chrome.runtime.onInstalled.addListener(async()=>{console.log("running");const e=await p();console.log("accessToken: ",e)}),window.getAccessToken=(()=>{p().then(e=>{console.log("res: ",e)})});const d=async()=>{const e=await p();console.log("accessToken: ",e);const t=await u(e);return console.log("list: ",t),t};chrome.runtime.onStartup.addListener(function(){console.log("start!"),d().then(e=>{console.log("list: ",e)})}),window.getList=(()=>{d().then(e=>{console.log("res: ",e)})})}]);