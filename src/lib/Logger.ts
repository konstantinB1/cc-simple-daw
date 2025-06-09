export default class Logger {
    private static instance: Logger;

    private constructor() {
        // Private constructor to prevent instantiation
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public log(message: string, ...optionalParams: any[]): void {
        console.log(
            `[${new Date().toISOString()}] ${message}`,
            ...optionalParams,
        );
    }

    public error(message: string, ...optionalParams: any[]): void {
        console.error(
            `[${new Date().toISOString()}] ${message}`,
            ...optionalParams,
        );
    }

    public warn(message: string, ...optionalParams: any[]): void {
        console.warn(
            `[${new Date().toISOString()}] ${message}`,
            ...optionalParams,
        );
    }
}
