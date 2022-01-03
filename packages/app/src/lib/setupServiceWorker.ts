export interface SwMessage {
  data: any;
}

export interface SwRegistrationResult {
  state?: string;
  registerCallback: (cb: (p: SwMessage) => void) => void;
  postMessage: (p: any) => void;
}

type SetupServiceWorker = () => Promise<SwRegistrationResult>;

export const setupServiceWorker: SetupServiceWorker = async () => {
  console.assert('serviceWorker' in navigator, 'service worker not enabled');
  console.assert('controller' in navigator.serviceWorker, 'service worker controller not available');

  const swFile = '/service-worker.min.js';
  console.debug('[APP] registering service worker:', swFile);
  const registration = await navigator.serviceWorker.register(swFile);
  console.debug('[APP] service worker registered');

  // console.debug(registration);
  return {
    state: registration.active?.state,
    scope: registration.scope,
    registerCallback: function (cb) {
      navigator.serviceWorker.addEventListener('message', cb);
    },
    postMessage: function (p) {
      navigator.serviceWorker.controller?.postMessage(p);
    },
  };
};
