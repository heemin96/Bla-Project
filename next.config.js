module.exports = {
  reactStrictMode: false,

  publicRuntimeConfig: {
    publicApiKey: process.env.publicApiKey || "",
    authDomain: process.env.FIREBASE_AUTH_HOST || "",
    projectId: process.env.projectId || "",
    mainDomain: process.env.MAIN_DOMAIN || "",
  },
};
