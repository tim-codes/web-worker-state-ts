class AppWorker extends Worker {
  constructor(
    url: string,
    cb: (m: MessageEvent) => void,
  ) {
    super(url);
    this.addEventListener('message', cb);
  };
};

type SetupWebWorker = (cb: (m: MessageEvent) => void) => AppWorker;

const setupWebWorker: SetupWebWorker = (cb) => {
  const ww: Worker = new AppWorker('/web-worker.min.js', cb);

  return ww;
};

export default setupWebWorker;
