import winston from "winston";

const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.prettyPrint(),
    transports: [
        new winston.transports.File({ filename: __dirname + '/../../logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: __dirname + '/../../logs/server.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console());
}

export default logger;