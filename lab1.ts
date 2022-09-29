type LoggerError = {
  time: Date;
  code: number | string;
  message: string;
};

interface ILogger {
  saveError: (error: LoggerError) => void;
  clearErrorHistory: () => void;
  writeErrorsToFile: () => void;
  logErrors: () => void;
  formatError: (error: LoggerError) => string;
}

class Logger implements ILogger {
  private static instance: Logger;
  private errorHistory: LoggerError[] = [];
  public fs = require("fs");
  private filename: string;

  private constructor(fileName: string) {
    this.filename = fileName;
  }

  public static getInstance(fileName: string = "log.txt"): Logger {
    if (!Logger.instance) {
      this.instance = new Logger(fileName);
    }

    return Logger.instance;
  }

  formatError({ time, code, message }: LoggerError) {
    return `${time.toLocaleString()}: ${code} (${message})\n`;
  }

  saveError(error: LoggerError) {
    this.errorHistory.push(error);
  }

  clearErrorHistory() {
    this.errorHistory = [];
  }

  writeErrorsToFile() {
    const file = this.fs.createWriteStream(this.filename);
    try {
      this.errorHistory.forEach((error) => {
        file.write(this.formatError(error));
      });
    } catch (error) {
      console.log(error);
    }
  }

  logErrors() {
    if (!this.errorHistory.length) {
      console.log("No errors");
      return;
    }
    this.errorHistory.forEach((error) => {
      console.log(this.formatError(error));
    });
  }
}

const logger = Logger.getInstance();
logger.saveError({ code: 401, message: "Not Authorised", time: new Date() });
logger.clearErrorHistory();
logger.logErrors();
logger.saveError({ code: 401, message: "Not Authorised", time: new Date() });
logger.saveError({ code: 404, message: "Not found", time: new Date() });
logger.saveError({ code: 400, message: "Bad request", time: new Date() });
logger.logErrors();
logger.writeErrorsToFile();
