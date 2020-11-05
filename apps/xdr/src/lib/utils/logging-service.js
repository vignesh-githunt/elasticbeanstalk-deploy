class LoggingService {

  log(message) {
    console.log(`${new Date().toISOString()} ${message}`);
  }

  warn(message) {
    console.warn(`${new Date().toISOString()} ${message}`);
  }

  error(message) {
    console.error(`${new Date().toISOString()} ${message}`);
  }
}

export default new LoggingService();
