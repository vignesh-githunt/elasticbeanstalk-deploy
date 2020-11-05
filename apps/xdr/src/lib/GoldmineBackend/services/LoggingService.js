import LoggingSeverity from '../../LoggingSeverity'

export default class LoggingService {

  constructor(fetchGraphql) {
    this.fetchGraphql = fetchGraphql;
    this.recentLogs = []
  }

  getTimeStamp() {
    return new Date().toISOString()
  }

  log(message, consoleLog, serverSeverity) {
    const logMsg = `${this.getTimeStamp()} ${message}`
    consoleLog(logMsg);

    if (serverSeverity) {
      this.recordServerEventLog(logMsg, serverSeverity, {
        recentLogs: this.recentLogs.slice(0)
      })
    }

    this.recentLogs.push(logMsg)
    this.trimRecentLogs()
  }

  info(message) {
    this.log(message, console.info)
  }

  warn(message) {
    this.log(message, console.warn)
  }

  error(message) {
    this.log(message, console.error, LoggingSeverity.error)
  }

  fatal(message) {
    this.log(message, console.error, LoggingSeverity.fatal)
  }

  /**
   * Records an eventlog on for the specified message and priority level
   * @param {*} message
   * @param {*} level
   * @param {*} data
   */
  recordServerEventLog(message, level, data) {
    const userId = localStorage.getItem('userId')
    this.fetchGraphql(`
      mutation createEventLog($level: Int!, $message: String!, $userId: ID, $data: Hash){
        createEventLog(data: { level: $level, message: $message, event: "sdr_extension", userId: $userId, data: $data }) {
          id
        }
      }
    `, {
      message,
      level,
      userId,
      data
    })
  }

  /**
   * Trim the recent logs to 25 once the current event loop execution has finished
   */
  trimRecentLogs() {
    setTimeout(() => this.recentLogs = this.recentLogs.slice(-25))
  }

}
