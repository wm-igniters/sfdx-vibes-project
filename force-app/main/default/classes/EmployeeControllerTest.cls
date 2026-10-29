@IsTest
private class EmployeeControllerTest {

    @IsTest
    static void getEmployees_returnsNonEmptyList() {
        Test.startTest();
        List<EmployeeController.EmployeeDTO> result = EmployeeController.getEmployees();
        Test.stopTest();

        Assert.isNotNull(result, 'Result list should not be null');
        Assert.isTrue(result.size() > 0, 'Should return at least one employee');
    }

    @IsTest
    static void getEmployees_allFieldsPopulated() {
        List<EmployeeController.EmployeeDTO> result = EmployeeController.getEmployees();
        EmployeeController.EmployeeDTO first = result[0];

        Assert.isNotNull(first.id,             'id should be set');
        Assert.isNotNull(first.name,           'name should be set');
        Assert.isNotNull(first.department,     'department should be set');
        Assert.isNotNull(first.title,          'title should be set');
        Assert.isNotNull(first.email,          'email should be set');
        Assert.isNotNull(first.phone,          'phone should be set');
        Assert.isNotNull(first.salary,         'salary should be set');
        Assert.isNotNull(first.location,       'location should be set');
        Assert.isNotNull(first.hireDate,       'hireDate should be set');
        Assert.isNotNull(first.status,         'status should be set');
        Assert.isNotNull(first.avatarInitials, 'avatarInitials should be set');
    }

    @IsTest
    static void getEmployees_avatarInitialsAreTwoChars() {
        List<EmployeeController.EmployeeDTO> result = EmployeeController.getEmployees();
        for (EmployeeController.EmployeeDTO emp : result) {
            Assert.isTrue(
                emp.avatarInitials.length() <= 2,
                'avatarInitials should be at most 2 characters for: ' + emp.name
            );
        }
    }

    @IsTest
    static void getEmployees_statusIsValidValue() {
        Set<String> validStatuses = new Set<String>{ 'Active', 'On Leave' };
        List<EmployeeController.EmployeeDTO> result = EmployeeController.getEmployees();
        for (EmployeeController.EmployeeDTO emp : result) {
            Assert.isTrue(
                validStatuses.contains(emp.status),
                'Unexpected status value: ' + emp.status
            );
        }
    }

    @IsTest
    static void getEmployees_returnsExactlyTenRecords() {
        List<EmployeeController.EmployeeDTO> result = EmployeeController.getEmployees();
        Assert.areEqual(10, result.size(), 'Should return 10 sample employees');
    }

    @IsTest
    static void getEmployees_idsAreUnique() {
        List<EmployeeController.EmployeeDTO> result = EmployeeController.getEmployees();
        Set<String> seen = new Set<String>();
        for (EmployeeController.EmployeeDTO emp : result) {
            Assert.isFalse(seen.contains(emp.id), 'Duplicate employee id: ' + emp.id);
            seen.add(emp.id);
        }
    }
}
