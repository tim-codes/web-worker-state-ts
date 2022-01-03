export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', async (e) => {
  console.log('WORKER: install event in progress.');
  await self.skipWaiting();
  const clients = await self.clients.claim();
  console.debug(clients);
});

self.addEventListener('activate', (e) => {
  console.log('WORKER: activate event in progress.');
});

self.addEventListener('message', (p: { data: any }) => {
  console.debug('WORKER: message received ->', p.data);
})
