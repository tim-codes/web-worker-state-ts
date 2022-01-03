import { StoreProps } from '../../../worker-web/src/lib/store';

export class AppWorker extends Worker {
  cb?: (p: any) => void;
  stateLinks = new Map<string, (s: any) => any>();

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

  setupStateLink(key: keyof StoreProps, cb: (s: any) => void) {
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

type SetupWebWorker = (cb: (m: MessageEvent) => void) => AppWorker;

const setupWebWorker: SetupWebWorker = (cb) => {
  const ww = new AppWorker('/web-worker.min.js');
  console.info('[APP] web worker registered');

  return ww;
};

export default setupWebWorker;
