/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: {
      url: '/',
    },
    public: {
      url: '/',
    },
    '../worker-service/dist': {
      url: '/',
      static: true,
    },
    '../worker-web/dist': {
      url: '/',
      static: true,
    },
  },
  optimize: {
    // todo: fix bundling
    bundle: false,
  }
};
