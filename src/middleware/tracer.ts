import { trace } from '@opentelemetry/api'
import { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';

const NAMESPACE = 'Trace'

const provider = new BasicTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
trace.setGlobalTracerProvider(provider);

const getTracer = () => {
    return trace.getTracer('NotesApp', '0.1.0');
}

const startSpan = (name : string) => {
    return getTracer().startSpan(name);
}

const addSpanMiddleware = async ( req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Starting trace");
    res.locals.span = startSpan("Test");
    next();
}

export default addSpanMiddleware;