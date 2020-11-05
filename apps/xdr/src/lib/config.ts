export const Config = {
  // mixpanelId: 'xxx',
  // endpoint: 'xxx',
  pluginUrl: `${process.env.REACT_APP_STORIES_HOST}/api/v3/plugin`,
  serviceUrl: `${process.env.REACT_APP_STORIES_HOST}`,
  clientType: 'sdr_flow',
  pusherCluster: 'mt1',
  pusherAppKey: process.env.REACT_APP_PUSHER_KEY,
  debug: process.env.REACT_APP_DEBUG,
  statusNotificationIntervalMinutes: 15,
  queueCheckIntervalMinutes: 5,
};

export default Config;
