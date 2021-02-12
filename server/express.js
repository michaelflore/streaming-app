import express from 'express';
import path from 'path';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

//comment out before building for production
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

//comment out before building for production
devBundle.compile(app)

// parse body params and attach them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
// secure apps by setting various HTTP headers
app.use(helmet())
// enable CORS - Cross Origin Resource Sharing
app.use(cors())


app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

//Mount routes
app.use('/', authRoutes)
app.use('/', userRoutes)

app.get('/*',function (req,res) {
    res.sendFile(process.cwd() + '/public/index.html');
});

export default app;
