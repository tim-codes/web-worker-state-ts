import { createState, Store, withProps } from '@ngneat/elf';
import { StoreProps } from '../../../worker-web/src/lib/store';

interface StoreProps {
  count: number;
}

function setupViewStore() {
  const {
    state: viewState,
    config: viewConfig,
  } = createState(
    withProps<StoreProps>({ count: 0 }),
  );

  return new Store({
    name: 'view',
    state: viewState,
    config: viewConfig,
  });
}

export default class AppWorker extends Worker {
  cb?: (p: any) => void;
  stateLinks = new Map<string, (s: any) => any>();
  view = setupViewStore();

  constructor(url: string) {
    super(url);
    console.info('[APP] web worker registered');
  }

  private handleMessage({ data }: MessageEvent) {
    console.debug('[APP] handle message ->', data);

    // emit state messages to link if it exists
    if ('state' in data) {
      for (const key in data.state) {
        const link = this.stateLinks.get(key);
        if (!link) {
          continue;
        }
        link(data.state[key]);
      }
      return;
    }

    // else emit other messages to main handler
    console.debug(data);
    if (this.cb) {
      this.cb(data);
    }
  }

  subscribe(cb: (m: MessageEvent) => void) {
    this.cb = cb;
    this.addEventListener('message', (m) => {
      this.handleMessage({
        ...m,
        data: JSON.parse(m.data),
      });
    })
  }

  private getDefaultLink = (key: keyof StoreProps) => (value: any) => {
    this.view.update((state) => ({
      ...state,
      [key]: value,
    }));
  }

  setupStateLink(
    key: keyof StoreProps,
    cb: (s: any) => void = this.getDefaultLink(key),
  ) {
    console.info('[APP] registering state link ->', key);
    this.stateLinks.set(key, cb);
    this.send({
      action: {
        type: 'SETUP_SUBSCRIPTION',
        key,
      },
    });
  }

  send(data: any) {
    this.postMessage(JSON.stringify(data));
  }

  dispatch(key: string, value: any) {
    this.send({
      action: {
        type: 'DISPATCH',
        key,
        value,
      },
    });
  }
}
