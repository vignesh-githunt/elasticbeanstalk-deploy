import config from '../config';
import ContextRuntime from "../contextruntime";
import dispatcher from '../dispatcher';
class StatusCheckerNotifier {

  constructor(statusChecker, loggingService) {
    this.notifyTimer = null;
    this.statusChecker = statusChecker;
    this.loggingService = loggingService;
  }

  async notify() {

    const pluginToken = ContextRuntime.getPluginToken();
    if (!pluginToken) {
      this.loggingService.error('Tried to notify platform of status whilst unauthenticated');
      return;
    }

    this.loggingService.log('Sending extension status to platform');
    const statuses = await this.statusChecker.fetch();

    dispatcher.sendMessage("status:notify", statuses)
    await fetch(`${config.pluginUrl}/status`, {
      method: 'POST',
      body: JSON.stringify({
        linkedin: statuses.linkedIn.success,
        sales_navigator: statuses.salesNavigator.success,
        version: statuses.version,
        websocket: statuses.websocket.success,
        platform: statuses.platform.success,
      }),
      headers: {
        'Content-type': 'application/json',
        'X-Plugin-Token': pluginToken
      }
    });
  }

  startNotifyPolling() {

    if (this.notifyTimer) return;
    this.notify();
    this.loggingService.log('Starting status notification polling');
    this.notifyTimer = setInterval(() => this.notify(), config.statusNotificationIntervalMinutes * 60 * 1000);
  }

  stopNotifyPolling() {

    if (!this.notifyTimer) return;
    this.loggingService.log('Stopping status notification polling');
    clearInterval(this.notifyTimer);
    this.notifyTimer = null;
  }
}

export default StatusCheckerNotifier;
