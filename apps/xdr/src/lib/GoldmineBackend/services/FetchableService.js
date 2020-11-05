import Config from '../../config';

export default class FetchableService {
  constructor(logger, platformFetch, targetFetch) {
    this.logger = logger;
    this.platformFetch = platformFetch;
    this.targetFetch = targetFetch;
    this.queueCheckTimer = null;
    this.processing = false;
  }

  /**
   * Fetch the next item from the queue, wait for the delay specified by the queue and then fetch the next item
   */
  async fetchNextQueueItem() {
    this.processing = true;
    this.logger.info('Checking queue for fetchables');
    try {
      const response = await this.platformFetch('/api/v3/plugin/minables/pop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status !== 200) {
        const errorText = await response.text();
        this.logger.error(
          `Error fetching queue item, aborting. Status ${response.status} - ${errorText}`
        );
        this.processing = false;
        return;
      }

      const queueData = await response.json();
      if (
        !queueData.minables ||
        !queueData.minables.length ||
        !queueData.minables[0]
      ) {
        this.logger.info('Queue empty, aborting');
        this.processing = false;
        return;
      }

      const fetchable = queueData.minables.shift();
      await this.fetchAndUpdateFetchable(fetchable);
      await this.sleep(queueData.delay);
      await this.fetchNextQueueItem();
    } catch (ex) {
      this.processing = false;
      this.logger.error(
        `Unhandled exception occurred when fetching next queue item\n${ex.message}\n${ex.stack}`
      );
    }
  }

  /**
   * Fetch the fetchables response
   * @param {*} fetchable
   */
  async fetchAndUpdateFetchable(fetchable) {
    this.logger.info(`Fetching response for fetchable ${fetchable._id}`);
    const response = await this.targetFetch(fetchable.url, {
      credentials: 'include',
    });
    if (response.status === 0) {
      const errorText = await response.text();
      this.logger.error(
        `Error fetching fetchable target, aborting - status ${response.status} - ${errorText}`
      );
      return;
    }

    this.logger.info(`Response fetched for ${fetchable._id}`);
    await this.updateFetchable(fetchable, response);
  }

  /**
   * Update the fetchable with the response body, response status etc
   * @param {*} fetchable
   * @param {*} response
   */
  async updateFetchable(fetchable, response) {
    const responseBody = await response.text();
    const updateResponse = await this.platformFetch(
      `/api/v3/plugin/minables/${fetchable._id}.json`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plugin_minable: {
            response_body: responseBody,
            response_status: response.status,
            response_url: response.url,
            response_redirected: response.redirected,
            response_content_type: response.headers.get('Content-Type'),
          },
        }),
      }
    );

    if (updateResponse.status !== 200) {
      const errorText = await updateResponse.text();
      this.logger.error(
        `Error updating fetchable - status ${response.status} - ${errorText}`
      );
      return;
    }

    this.logger.info(`Fetchable ${fetchable._id} processed`);
  }

  /**
   * Asynchronously wait for the specified period
   * @param {*} period
   */
  sleep(period) {
    this.logger.info(`Sleeping for ${period}ms`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(), period);
    });
  }

  /**
   * Fetch the next queue item if no queue processing is currently running
   */
  fetchNextQueueItemIfNotProcessing() {
    if (this.processing) return;
    this.fetchNextQueueItem();
  }

  /**
   * Start a recurring task that polls the queue
   */
  startQueuePolling() {
    if (this.queueCheckTimer) return;
    this.queueCheckTimer = setInterval(
      this.fetchNextQueueItemIfNotProcessing.bind(this),
      Config.queueCheckIntervalMinutes * 60 * 1000
    );
    this.fetchNextQueueItemIfNotProcessing();
  }

  /**
   * Stop the recurring poll check
   */
  stopQueuePolling() {
    if (!this.queueCheckTimer) return;
    clearInterval(this.queueCheckTimer);
    this.queueCheckTimer = null;
  }
}
