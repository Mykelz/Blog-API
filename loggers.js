const wiston = require('winston');
const { combine, timestamp, json, prettyPrint, errors } = wiston.format;

wiston.loggers.add('authLogger', {
    level: 'info',
    format: combine(
        errors({ stack: true}),
        timestamp(),
        json(),
        prettyPrint()
    ),
    transports: [
        new wiston.transports.Console(),
        new wiston.transports.File({ filename:'auth.log', level: 'error'})
    ],
    defaultMeta: { service: 'authService'}
})

wiston.loggers.add('blogLogger', {
    level: 'info',
    format: combine(
        errors({ stack: true}),
        timestamp(),
        json(),
        prettyPrint()
    ),
    transports: [
        new wiston.transports.Console(),
        new wiston.transports.File({ filename:'blog.log', level: 'error'})
    ], 
    defaultMeta: { service: 'blogService'}
})