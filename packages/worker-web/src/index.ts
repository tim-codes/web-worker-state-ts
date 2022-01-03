/// <reference lib="WebWorker" />

export type {};
declare const self: Worker;

self.addEventListener('message', (p: { data: any }) => {
  console.debug('WORKER: message received ->', p.data);
  self.postMessage({ test: 'hi' });
})
