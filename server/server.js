import mongoose from 'mongoose';
import config from './../config/config';
import app from "./express";

// Connection URL
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => {
    console.log("Successfully connect to MongoDB.");
})
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

app.listen(config.port, function(err) {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
})