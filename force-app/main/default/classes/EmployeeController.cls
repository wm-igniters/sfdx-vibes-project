public with sharing class EmployeeController {

    public class EmployeeDTO {
        @AuraEnabled public String id;
        @AuraEnabled public String name;
        @AuraEnabled public String department;
        @AuraEnabled public String title;
        @AuraEnabled public String email;
        @AuraEnabled public String phone;
        @AuraEnabled public Decimal salary;
        @AuraEnabled public String location;
        @AuraEnabled public String hireDate;
        @AuraEnabled public String status;
        @AuraEnabled public String avatarInitials;
    }

    @AuraEnabled(cacheable=true)
    public static List<EmployeeDTO> getEmployees() {
        return buildSampleEmployees();
    }

    private static List<EmployeeDTO> buildSampleEmployees() {
        return new List<EmployeeDTO>{
            build('EMP-001', 'Alice Johnson',   'Engineering', 'Senior Engineer',       'alice.johnson@company.com',   '555-0101', 95000,  'New York',      '2020-03-15', 'Active'),
            build('EMP-002', 'Bob Martinez',    'Product',     'Product Manager',        'bob.martinez@company.com',    '555-0102', 105000, 'San Francisco', '2019-07-01', 'Active'),
            build('EMP-003', 'Carol Williams',  'Design',      'UX Lead',                'carol.williams@company.com',  '555-0103', 88000,  'Austin',        '2021-01-20', 'Active'),
            build('EMP-004', 'David Chen',      'Engineering', 'Principal Engineer',     'david.chen@company.com',      '555-0104', 130000, 'Seattle',       '2017-11-05', 'Active'),
            build('EMP-005', 'Eva Rodriguez',   'Marketing',   'Marketing Director',     'eva.rodriguez@company.com',   '555-0105', 115000, 'Chicago',       '2018-04-12', 'Active'),
            build('EMP-006', 'Frank Kim',       'Sales',       'Account Executive',      'frank.kim@company.com',       '555-0106', 75000,  'Boston',        '2022-06-30', 'Active'),
            build('EMP-007', 'Grace Patel',     'HR',          'HR Manager',             'grace.patel@company.com',     '555-0107', 82000,  'Denver',        '2020-09-14', 'On Leave'),
            build('EMP-008', 'Henry Thompson',  'Finance',     'Finance Analyst',        'henry.thompson@company.com',  '555-0108', 79000,  'New York',      '2021-05-03', 'Active'),
            build('EMP-009', 'Iris Nakamura',   'Engineering', 'Staff Engineer',         'iris.nakamura@company.com',   '555-0109', 118000, 'Seattle',       '2016-08-22', 'Active'),
            build('EMP-010', 'James Wilson',    'Sales',       'Sales Director',         'james.wilson@company.com',    '555-0110', 140000, 'Chicago',       '2015-03-10', 'Active')
        };
    }

    private static EmployeeDTO build(String id, String name, String department, String title,
            String email, String phone, Decimal salary, String location, String hireDate, String status) {
        EmployeeDTO emp = new EmployeeDTO();
        emp.id         = id;
        emp.name       = name;
        emp.department = department;
        emp.title      = title;
        emp.email      = email;
        emp.phone      = phone;
        emp.salary     = salary;
        emp.location   = location;
        emp.hireDate   = hireDate;
        emp.status     = status;

        List<String> parts = name.split(' ');
        emp.avatarInitials = parts.size() >= 2
            ? parts[0].left(1) + parts[1].left(1)
            : parts[0].left(2);

        return emp;
    }
}
