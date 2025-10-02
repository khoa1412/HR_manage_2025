import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class DbExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any;
}
