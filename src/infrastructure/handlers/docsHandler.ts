import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

//const swaggerDocument = fs.readFileSync(path.join(__dirname, '../../../../../docs/swagger.json'), 'utf8');
const swaggerPath = path.join(__dirname, '..', '..', '..', 'docs', 'swagger.json'); 
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));


const app = express();

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swagger));

const main = async (event: any, context: any) => {
  return serverless(app)(event, context);
};

export { main };
