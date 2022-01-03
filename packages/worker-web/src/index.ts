/// <reference lib="WebWorker" />

import { select } from '@ngneat/elf';
import setupStore, { StoreProps } from './lib/store';

export type {};
declare const self: Worker;

type WwPingPayload = (
  {
    ping: string;
  }
)

type WwAction = (
  | {
    type: 'SETUP_SUBSCRIPTION',
    key: keyof StoreProps;
  }
  | {
    type: 'DISPATCH',
    key: keyof StoreProps,
    value: any,
  }
);

type WwActionPayload = {
  action: WwAction;
};

const isPingPayload = (p: any): p is WwPingPayload => 'ping' in p;
const isActionPayload = (p: any): p is WwActionPayload => 'action' in p;

const store = setupStore();

function send(data: any) {
  self.postMessage(JSON.stringify(data));
}

function setupSubscription(key: keyof StoreProps) {
  console.debug('[WW] setting up subscription for key ->', key);
  store.pipe(select((state) => state[key])).subscribe((v) => {
    console.debug('[WW] emitting state ->', key);
    send({ state: { [key]: v } });
  });
}

function dispatch(key: keyof StoreProps, value: any) {
  console.debug('[WW] dispatching ->', key, value);
  store.update((state) => ({
    ...state,
    [key]: value,
  }));
}

function handleAction(a: WwAction) {
  switch (a.type) {
    case 'SETUP_SUBSCRIPTION':
      return setupSubscription(a.key);
    case 'DISPATCH':
      return dispatch(a.key, a.value);
  }
}

function handleMessage(p: MessageEvent) {
  const m = {
    ...p,
    data: JSON.parse(p.data),
  };
  console.debug('[WW] message received ->', m.data);

  const payload = m.data;
  if (isPingPayload(payload)) {
    return send({ ping: `received ${new Date().toLocaleTimeString()}` });
  }
  if (isActionPayload(payload)) {
    return handleAction(payload.action);
  }
}

self.onmessage = handleMessage;
self.onerror = console.error;
