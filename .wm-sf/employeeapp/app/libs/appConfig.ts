export default function getAppConfig() {
  return {
    appConfig: {
      url: process.env.NEXT_PUBLIC_SERVER_PATH || null,
      basePath: process.env.NEXT_PUBLIC_BASE_PATH
        ? process.env.NEXT_PUBLIC_BASE_PATH.endsWith('/')
          ? process.env.NEXT_PUBLIC_BASE_PATH
          : process.env.NEXT_PUBLIC_BASE_PATH + '/'
        : '/',
      appProperties: {},
    },
    appVariables: {},
  };
}
