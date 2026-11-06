@IsTest
private class ClientControllerTest {

    private class ApiMock implements HttpCalloutMock {
        private Integer status;
        private String body;
        public String lastEndpoint;

        ApiMock(Integer status, String body) {
            this.status = status;
            this.body = body;
        }

        public HttpResponse respond(HttpRequest req) {
            lastEndpoint = req.getEndpoint();
            HttpResponse res = new HttpResponse();
            res.setStatusCode(status);
            res.setStatus(status == 200 ? 'OK' : 'Error');
            res.setHeader('Content-Type', 'application/json');
            res.setBody(body);
            return res;
        }
    }

    private static final String SAMPLE =
        '[{"clientId":1,"externalRef":"4984048","title":"Mr","forename":"Bmd","surname":"Sthds",' +
        '"dateOfBirth":"1965-08-05","adviser":{"adviserId":1,"displayName":"Kumar, Raj"},' +
        '"editableFields":["title","forename"]}]';

    @IsTest
    static void getClients_mapsApiRows() {
        ApiMock mock = new ApiMock(200, SAMPLE);
        Test.setMock(HttpCalloutMock.class, mock);

        Test.startTest();
        List<ClientController.ClientDTO> clients = ClientController.getClients();
        Test.stopTest();

        Assert.areEqual('callout:WM_Illustration_API/api/v1/clients?adviserId=1', mock.lastEndpoint);
        Assert.areEqual(1, clients.size());
        ClientController.ClientDTO c = clients[0];
        Assert.areEqual('1', c.id);
        Assert.areEqual(1, c.clientId);
        Assert.areEqual('Bmd Sthds', c.name);
        Assert.areEqual('Mr Bmd Sthds', c.displayName);
        Assert.areEqual('4984048', c.externalRef);
        Assert.areEqual('1965-08-05', c.dateOfBirth);
        Assert.areEqual(1, c.adviserId);
        Assert.areEqual('Kumar, Raj', c.adviserName);
        Assert.areEqual(new List<String>{ 'title', 'forename' }, c.editableFields);
        Assert.areEqual('BS', c.avatarInitials);
    }

    @IsTest
    static void getClients_handlesMissingOptionalFields() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '[{"clientId":7,"forename":"Ann"},{"title":"Ms"}]'));
        List<ClientController.ClientDTO> clients = ClientController.getClients();
        Assert.areEqual(1, clients.size(), 'rows without clientId are skipped');
        Assert.areEqual('Ann', clients[0].name);
        Assert.isNull(clients[0].adviserName);
        Assert.areEqual(0, clients[0].editableFields.size());
    }

    @IsTest
    static void getClients_emptyList() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '[]'));
        Assert.areEqual(0, ClientController.getClients().size());
    }

    @IsTest
    static void getClients_httpErrorSurfacesAsAuraException() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(503, 'unavailable'));
        try {
            ClientController.getClients();
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('503'), e.getMessage());
        }
    }

    @IsTest
    static void getClients_badJsonSurfacesAsAuraException() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '{"not":"a list"'));
        try {
            ClientController.getClients();
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('unexpected response'), e.getMessage());
        }
    }
}
