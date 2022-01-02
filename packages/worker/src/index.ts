/// <reference lib="WebWorker" />

export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (e) => {
  console.log('WORKER: install event in progress.');
});

self.addEventListener('activate', (e) => {
  console.log('WORKER: activate event in progress.');
  console.log('hi4');
});

self.addEventListener('install', async (e) => {
  await self.skipWaiting();
  const clients = await self.clients.claim();
  clients
});

self.addEventListener('message', (p: { data: any }) => {
  console.debug('WORKER: message received ->', p.data);
})
