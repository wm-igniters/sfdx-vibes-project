@IsTest
private class IllustrationControllerTest {

    private class ApiMock implements HttpCalloutMock {
        private Integer status;
        private String body;
        private Map<String, String> headers;
        public String lastEndpoint;
        public String lastMethod;

        ApiMock(Integer status, String body, Map<String, String> headers) {
            this.status = status;
            this.body = body;
            this.headers = headers == null ? new Map<String, String>() : headers;
        }

        public HttpResponse respond(HttpRequest req) {
            lastEndpoint = req.getEndpoint();
            lastMethod = req.getMethod();
            HttpResponse res = new HttpResponse();
            res.setStatusCode(status);
            res.setStatus(status == 200 ? 'OK' : (status == 404 ? 'Not Found' : 'Error'));
            for (String key : headers.keySet()) {
                res.setHeader(key, headers.get(key));
            }
            res.setBody(body);
            return res;
        }
    }

    private static final String SAMPLE =
        '[{"illustrationId":53,"illustrationRef":"ILL-50D0B93437","status":"ILLUSTRATED","currentStep":"RESULT",' +
        '"client":{"clientId":1,"title":"Mr","forename":"Bmd","surname":"Sthds"},' +
        '"product":{"code":"PISA","description":"Bluedoor Individual Savings Account","category":"Investment"},' +
        '"preparedBy":{"adviserId":1,"displayName":"Kumar, Raj"},"taxYear":"2026/27",' +
        '"createdAt":"2026-11-05T09:37:19.997911Z","updatedAt":"2026-11-05T09:37:19.538082Z",' +
        '"illustratedAt":"2026-11-05T09:37:20.507258Z","txLife":{"versionNo":1,"generatedAt":"2026-11-05T09:37:20.976225Z"}},' +
        '{"illustrationId":47,"illustrationRef":"ILL-47","status":"ILLUSTRATED",' +
        '"client":{"clientId":2,"forename":"Ann"},"txLife":null},' +
        '{"illustrationRef":"NO-ID"}]';

    @IsTest
    static void getIllustrations_mapsApiRows() {
        ApiMock mock = new ApiMock(200, SAMPLE, null);
        Test.setMock(HttpCalloutMock.class, mock);

        Test.startTest();
        List<IllustrationController.IllustrationDTO> rows = IllustrationController.getIllustrations();
        Test.stopTest();

        Assert.areEqual('callout:WM_Illustration_API/api/v1/illustrations', mock.lastEndpoint);
        Assert.areEqual('GET', mock.lastMethod);
        Assert.areEqual(2, rows.size(), 'rows without illustrationId are skipped');

        IllustrationController.IllustrationDTO first = rows[0];
        Assert.areEqual(53, first.illustrationId);
        Assert.areEqual('ILL-50D0B93437', first.illustrationRef);
        Assert.areEqual('Bmd Sthds', first.clientName);
        Assert.areEqual('Mr', first.clientTitle);
        Assert.areEqual(1, first.clientId);
        Assert.areEqual('Bluedoor Individual Savings Account', first.productDescription);
        Assert.areEqual('Kumar, Raj', first.preparedByName);
        Assert.areEqual('2026-11-05T09:37:19.997911Z', first.createdAt);
        Assert.isTrue(first.hasDocuments);

        IllustrationController.IllustrationDTO second = rows[1];
        Assert.areEqual('Ann', second.clientName);
        Assert.isFalse(second.hasDocuments, 'no TXLife stored → no PDF/XML yet');
        Assert.isNull(second.productDescription);
    }

    @IsTest
    static void getIllustrations_emptyList() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '[]', null));
        Assert.areEqual(0, IllustrationController.getIllustrations().size());
    }

    @IsTest
    static void getIllustrations_httpErrorSurfacesAsAuraException() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(503, 'unavailable', null));
        try {
            IllustrationController.getIllustrations();
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('503'), e.getMessage());
        }
    }

    @IsTest
    static void getIllustrations_badJsonSurfacesAsAuraException() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '{not json', null));
        try {
            IllustrationController.getIllustrations();
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('unexpected response'), e.getMessage());
        }
    }

    @IsTest
    static void getIllustrationPdf_returnsBase64File() {
        ApiMock mock = new ApiMock(
            200,
            '{"success":true,"fileName":"investment-illustration.pdf","contentType":"application/pdf",' +
            '"meta":{"pages":3,"tags":["a"]},"pdfBase64":"JVBERi0xLjYK"}',
            new Map<String, String>{ 'Content-Type' => 'application/json' }
        );
        Test.setMock(HttpCalloutMock.class, mock);

        Test.startTest();
        IllustrationController.FileDTO file = IllustrationController.getIllustrationPdf(53);
        Test.stopTest();

        Assert.areEqual('callout:WM_Illustration_API/api/v1/illustrations/53/generate-pdf', mock.lastEndpoint);
        Assert.areEqual('investment-illustration.pdf', file.fileName);
        Assert.areEqual('application/pdf', file.contentType);
        Assert.areEqual('JVBERi0xLjYK', file.base64);
    }

    @IsTest
    static void getIllustrationPdf_defaultsNameAndType() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '{"pdfBase64":"JVBERi0="}', null));
        IllustrationController.FileDTO file = IllustrationController.getIllustrationPdf(9);
        Assert.areEqual('illustration-9.pdf', file.fileName);
        Assert.areEqual('application/pdf', file.contentType);
    }

    @IsTest
    static void getIllustrationPdf_unsuccessfulGeneration() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '{"success":false,"pdfBase64":null}', null));
        try {
            IllustrationController.getIllustrationPdf(53);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('could not be generated'), e.getMessage());
        }
    }

    @IsTest
    static void getIllustrationPdf_notFound() {
        Test.setMock(
            HttpCalloutMock.class,
            new ApiMock(404, '{"detail":"Stored TXLife for illustration 47 not found","status":404}', null)
        );
        try {
            IllustrationController.getIllustrationPdf(47);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.areEqual('No PDF is available for illustration 47 yet.', e.getMessage());
        }
    }

    @IsTest
    static void getIllustrationPdf_requiresId() {
        try {
            IllustrationController.getIllustrationPdf(null);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('id is required'), e.getMessage());
        }
    }

    @IsTest
    static void getIllustrationXml_returnsFileFromHeaders() {
        String xml = '<?xml version="1.0" encoding="UTF-8"?><TXLife/>';
        ApiMock mock = new ApiMock(
            200,
            xml,
            new Map<String, String>{
                'Content-Type' => 'application/xml;charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="ILL-50D0B93437-TXLife-v1.xml"'
            }
        );
        Test.setMock(HttpCalloutMock.class, mock);

        Test.startTest();
        IllustrationController.FileDTO file = IllustrationController.getIllustrationXml(53);
        Test.stopTest();

        Assert.areEqual('callout:WM_Illustration_API/api/v1/illustrations/53/txlife/download', mock.lastEndpoint);
        Assert.areEqual('ILL-50D0B93437-TXLife-v1.xml', file.fileName);
        Assert.areEqual('application/xml', file.contentType);
        Assert.areEqual(xml, EncodingUtil.base64Decode(file.base64).toString());
    }

    @IsTest
    static void getIllustrationXml_defaultsNameWithoutHeader() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(200, '<TXLife/>', null));
        IllustrationController.FileDTO file = IllustrationController.getIllustrationXml(12);
        Assert.areEqual('illustration-12-TXLife.xml', file.fileName);
        Assert.areEqual('application/xml', file.contentType);
    }

    @IsTest
    static void getIllustrationXml_serverError() {
        Test.setMock(HttpCalloutMock.class, new ApiMock(500, 'boom', null));
        try {
            IllustrationController.getIllustrationXml(53);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('500'), e.getMessage());
        }
    }

    @IsTest
    static void fileNameFrom_parsesContentDisposition() {
        Assert.areEqual('a.xml', IllustrationController.fileNameFrom('attachment; filename="a.xml"'));
        Assert.areEqual('b.xml', IllustrationController.fileNameFrom('attachment;filename=b.xml'));
        Assert.isNull(IllustrationController.fileNameFrom('inline'));
        Assert.isNull(IllustrationController.fileNameFrom(null));
    }
}
