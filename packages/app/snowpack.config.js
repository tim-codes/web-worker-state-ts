/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: {
      url: '/',
    },
    public: {
      url: '/',
    },
    '../worker/dist': {
      url: '/',
      static: true,
    },
  },
  optimize: {
    bundle: true,
  }
};
