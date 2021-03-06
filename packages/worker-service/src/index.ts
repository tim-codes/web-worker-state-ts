export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', async (e) => {
  console.info('[SW] install event in progress.');
  await self.skipWaiting();
  const clients = await self.clients.claim();
  // console.debug(clients);
});

self.addEventListener('activate', (e) => {
  console.info('[SW] activate event in progress.');
});

self.addEventListener('message', (p: { data: any }) => {
  console.debug('[SW] message received ->', p.data);
})
