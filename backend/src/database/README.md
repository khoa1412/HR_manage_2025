# Employee Database Structure

This directory contains the database structure and seed data for the HR Management System's Employee module.

## Files Structure

```
database/
├── migrations/
│   └── 001_create_employee_database.sql    # Main database schema
├── seeders/
│   └── 001_employee_seed_data.sql          # Initial sample data
├── entities/                               # Database entities (if using ORM)
├── factories/                              # Data factories for testing
└── README.md                               # This file
```

## Database Schema Overview

### Core Tables

1. **departments** - Department information with hierarchical structure
2. **employees** - Main employee records
3. **employee_positions** - Position history with date ranges
4. **employee_salaries** - Salary history with effective dates
5. **employee_payroll_components** - Salary components (allowances, bonuses, etc.)
6. **benefit_types** - Master data for benefit types
7. **employee_benefits** - Employee benefit assignments
8. **employee_contacts** - Emergency contact information
9. **employee_documents** - Document management
10. **auth_users** - Authentication and user management

### Key Features

- **Date Range Constraints**: Uses PostgreSQL's `EXCLUDE` constraints with `daterange` to prevent overlapping periods for positions, salaries, and benefits
- **Hierarchical Departments**: Self-referencing department structure with manager assignments
- **API-Ready Views**: Pre-built views that match API response formats
- **Comprehensive Indexing**: Optimized indexes for common query patterns
- **Audit Trail**: Created/updated timestamps with automatic triggers

### Data Integrity

- **Foreign Key Constraints**: Proper referential integrity
- **Check Constraints**: Data validation at database level
- **Unique Constraints**: Prevents duplicate data
- **Exclusion Constraints**: Prevents overlapping date ranges
- **Triggers**: Automatic timestamp updates

## Installation

1. **Run Migration**:
   ```sql
   \i migrations/001_create_employee_database.sql
   ```

2. **Load Seed Data**:
   ```sql
   \i seeders/001_employee_seed_data.sql
   ```

## API Views

### v_employees_api
Returns employee data in API format:
```sql
SELECT * FROM v_employees_api;
```

### v_current_positions
Returns current position for each employee:
```sql
SELECT * FROM v_current_positions;
```

## Sample Data

The seed data includes:
- 8 departments with managers
- 10 sample employees with various roles
- Position history for all employees
- Salary records with effective dates
- Benefit assignments (transportation, meal, phone allowances)
- Emergency contacts
- Sample documents
- Authentication users with different roles

## Extensions Required

- `btree_gist` - For exclusion constraints on date ranges

## Performance Considerations

- Indexes are created for common query patterns
- Partial indexes for active employees
- Composite indexes for date range queries
- Views are optimized for API responses

## Maintenance

- Regular backup of employee data
- Monitor index usage and performance
- Update seed data as needed for testing
- Review and update benefit types as business requirements change
