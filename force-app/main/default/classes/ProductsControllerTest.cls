@IsTest
private class ProductsControllerTest {

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
        '[{"code":"PISA","description":"Bluedoor Individual Savings Account","category":"Investment",' +
        '"allowsSecondParty":true,"defaultTermYears":null},' +
        '{"code":"PENSION","description":"Miscellaneous Pension","category":"Pension","allowsSecondParty":false,"defaultTermYears":10},' +
        '{"code":"RA","description":"Retirement Account","category":"Pension","illustrationSource":"External"},' +
        '{"description":"no code"}]';

    @IsTest
    static void getProducts_mapsApiRows() {
        ApiMock mock = new ApiMock(200, SAMPLE);
        Test.setMock(HttpCalloutMock.class, mock);

        Test.startTest();
        List<ProductsController.ProductDTO> products = ProductsController.getProducts();
        Test.stopTest();

        Assert.areEqual('callout:WM_Illustration_API/api/v1/products', mock.lastEndpoint);
        Assert.areEqual(3, products.size(), 'rows without a code are skipped');

        ProductsController.ProductDTO isa = products[0];
        Assert.areEqual('PISA', isa.code);
        Assert.areEqual('Bluedoor Individual Savings Account', isa.description);
        Assert.areEqual('Investment', isa.category);
        Assert.areEqual(true, isa.allowsSecondParty);
        Assert.isNull(isa.defaultTermYears);
        Assert.areEqual(ProductsController.DEFAULT_SOURCE, isa.illustrationSource);

        Assert.areEqual('Miscellaneous', products[1].illustrationSource);
        Assert.areEqual(false, products[1].allowsSecondParty);
        Assert.areEqual(10, products[1].defaultTermYears);

        Assert.areEqual('External', products[2].illustrationSource, 'API value wins');
    }

    @IsTest
    static void getProducts_emptyList() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '[]'));
        Assert.areEqual(0, ProductsController.getProducts().size());
    }

    @IsTest
    static void getProducts_httpErrorSurfacesAsAuraException() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(500, 'boom'));
        try {
            ProductsController.getProducts();
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('500'), e.getMessage());
        }
    }

    @IsTest
    static void getProducts_badJsonSurfacesAsAuraException() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '{not json'));
        try {
            ProductsController.getProducts();
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('unexpected'), e.getMessage());
        }
    }
}
