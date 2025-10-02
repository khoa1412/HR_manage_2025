import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class DbExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return res.status(status).json({ message: exception.message });
    }

    if (exception?.constraint === 'ex_positions_no_overlap') {
      return res.status(409).json({ message: 'Position period overlaps existing records' });
    }
    if (exception?.constraint === 'ex_salaries_no_overlap') {
      return res.status(409).json({ message: 'Salary period overlaps existing records' });
    }
    if (exception?.constraint === 'ex_benefits_no_overlap') {
      return res.status(409).json({ message: 'Benefit period overlaps existing records' });
    }
    if (exception?.code === '23505') {
      const detail: string = String(exception?.detail ?? '');
      if (detail.includes('employee_code')) return res.status(409).json({ message: 'employeeCode already exists' });
      if (detail.includes('email')) return res.status(409).json({ message: 'email already exists' });
    }

    if (exception instanceof QueryFailedError) {
      const err: any = exception as any;
      const code: string | undefined = err?.code;
      const c: string | undefined = err?.constraint;
      if (code === '23P01') {
        if (c === 'ex_positions_no_overlap') return res.status(409).json({ message: 'Position period overlaps existing records' });
        if (c === 'ex_salaries_no_overlap') return res.status(409).json({ message: 'Salary period overlaps existing records' });
        if (c === 'ex_benefits_no_overlap') return res.status(409).json({ message: 'Benefit period overlaps existing records' });
        return res.status(409).json({ message: 'date range overlaps existing records' });
      }
      if (code === '23514') return res.status(422).json({ message: 'check constraint violation' });
      if (code === '23503') return res.status(409).json({ message: 'foreign key violation' });
      if (code === '23505') return res.status(409).json({ message: 'unique constraint violation' });
      return res.status(400).json({ message: 'database error' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}


