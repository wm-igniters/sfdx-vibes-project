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

    /** Answers by endpoint: the list, then one detail per illustration. */
    private class RoutingMock implements HttpCalloutMock {
        private Map<String, String> bodies;
        public Integer calls = 0;
        RoutingMock(Map<String, String> bodies) {
            this.bodies = bodies;
        }
        public HttpResponse respond(HttpRequest req) {
            calls++;
            String path = req.getEndpoint().removeStart('callout:WM_Illustration_API');
            HttpResponse res = new HttpResponse();
            if (bodies.containsKey(path)) {
                res.setStatusCode(200);
                res.setBody(bodies.get(path));
            } else {
                res.setStatusCode(404);
                res.setBody('{}');
            }
            return res;
        }
    }

    private static final String CLIENT_LIST =
        '[{"illustrationId":1,"illustrationRef":"ILL-1","status":"ILLUSTRATED","client":{"clientId":5,"forename":"Sarah","surname":"Brown"},' +
        '"product":{"code":"PISA","category":"Investment"},"illustratedAt":"2026-10-01T10:00:00Z","txLife":{"versionNo":1}},' +
        '{"illustrationId":2,"illustrationRef":"ILL-2","status":"ILLUSTRATED","client":{"clientId":5,"forename":"Sarah","surname":"Brown"},' +
        '"product":{"code":"RA"},"illustratedAt":"2026-11-01T10:00:00Z","txLife":null},' +
        '{"illustrationId":3,"illustrationRef":"ILL-3","client":{"clientId":9}}]';

    @IsTest
    static void getClientIllustrations_filtersSortsAndAddsAmounts() {
        RoutingMock mock = new RoutingMock(new Map<String, String>{
            '/api/v1/illustrations' => CLIENT_LIST,
            '/api/v1/illustrations/1' => '{"illustration":{"contributions":[' +
                '{"contributionType":"SINGLE","grossAmount":15000.00},' +
                '{"contributionType":"SINGLE","grossAmount":500.50},' +
                '{"contributionType":"REGULAR","grossAmount":250,"frequency":"MONTHLY"},' +
                '{"contributionType":"TRANSFER","grossAmount":null,"transferValue":40000}]}}'
            // illustration 2 has no detail → amounts stay blank
        });
        Test.setMock(HttpCalloutMock.class, mock);

        Test.startTest();
        List<IllustrationController.IllustrationDTO> rows = IllustrationController.getClientIllustrations(5);
        Test.stopTest();

        Assert.areEqual(2, rows.size(), 'only client 5');
        Assert.areEqual(2, rows[0].illustrationId, 'newest first');
        Assert.areEqual('RA', rows[0].productCode);
        Assert.isNull(rows[0].singleAmount);
        Assert.isFalse(rows[0].hasDocuments);

        IllustrationController.IllustrationDTO first = rows[1];
        Assert.areEqual('PISA', first.productCode);
        Assert.areEqual('Investment', first.productCategory);
        Assert.isTrue(first.singleAmount == 15500.50, String.valueOf(first.singleAmount));
        Assert.isTrue(first.regularAmount == 250, String.valueOf(first.regularAmount));
        Assert.areEqual('MONTHLY', first.regularFrequency);
        Assert.isTrue(first.transferAmount == 40000, String.valueOf(first.transferAmount));
        Assert.areEqual(3, mock.calls, 'list + one detail per illustration');
    }

    @IsTest
    static void getClientIllustrations_requiresClientId() {
        try {
            IllustrationController.getClientIllustrations(null);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('client id is required'), e.getMessage());
        }
    }

    @IsTest
    static void getClientIllustrations_listErrorSurfaces() {
        Test.setMock(HttpCalloutMock.class, new RoutingMock(new Map<String, String>()));
        try {
            IllustrationController.getClientIllustrations(5);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('404'), e.getMessage());
        }
    }

    private static final String DETAIL =
        '{"illustration":{"illustrationId":69,"illustrationRef":"ILL-94A090EFA4","status":"ILLUSTRATED","clientId":6,' +
        '"product":{"code":"PISA","description":"Bluedoor Individual Savings Account","category":"Investment"},' +
        '"preparedBy":{"adviserId":1,"displayName":"Kumar, Raj"},"taxYear":"2026/27",' +
        '"parties":[{"role":"FIRST_PARTY","clientId":6,"title":"Mr","forename":"William","surname":"Miller","dateOfBirth":"1985-07-12"}],' +
        '"contributions":[{"contributionId":67,"contributionType":"SINGLE","grossAmount":15000.00,"frequency":null,' +
        '"contributors":[{"contributorType":"ACCOUNT_OWNER","contributorName":"William Miller","amount":15000.00,"systemCalculated":false}],' +
        '"charges":[{"chargeTypeCode":"INITIAL_ADVICE_CHARGE","displayName":"Initial Advice Charge","kind":"CHARGE","standardRatePct":3,"appliedRatePct":3.000}],' +
        '"allocations":[{"fundId":4,"fundCode":"BALPORT","fundName":"Balanced Portfolio","shareClass":"ACCUMULATION","allocationPct":100}],' +
        '"allocationTotalPct":100}],' +
        '"createdAt":"2026-11-06T11:06:24.002143Z","illustratedAt":"2026-11-06T11:06:24.058015Z","txLife":{"versionNo":1}},' +
        '"latestRun":{"runNo":1,"projections":[{"scenario":"LOWER","year":0}]}}';

    @IsTest
    static void getIllustrationSummary_mapsDetail() {
        RoutingMock mock = new RoutingMock(new Map<String, String>{ '/api/v1/illustrations/69' => DETAIL });
        Test.setMock(HttpCalloutMock.class, mock);

        Test.startTest();
        IllustrationController.SummaryDTO s = IllustrationController.getIllustrationSummary(69);
        Test.stopTest();

        Assert.areEqual(69, s.illustrationId);
        Assert.areEqual('ILL-94A090EFA4', s.illustrationRef);
        Assert.areEqual('Bluedoor Individual Savings Account', s.productDescription);
        Assert.areEqual('William Miller', s.clientName);
        Assert.areEqual('2026-11-06T11:06:24.058015Z', s.illustrationDate);
        Assert.isTrue(s.hasDocuments);
        Assert.areEqual(1, s.contributions.size());
        IllustrationController.SummaryContribution c = s.contributions[0];
        Assert.areEqual('SINGLE', c.contributionType);
        Assert.isTrue(c.grossAmount == 15000);
        Assert.areEqual('ACCOUNT_OWNER', c.contributors[0].contributorType);
        Assert.areEqual('INITIAL_ADVICE_CHARGE', c.charges[0].chargeTypeCode);
        Assert.isTrue(c.charges[0].appliedRatePct == 3);
        Assert.areEqual('Balanced Portfolio', c.allocations[0].fundName);
        Assert.areEqual('ACCUMULATION', c.allocations[0].shareClass);
    }

    @IsTest
    static void getIllustrationSummary_notFound() {
        Test.setMock(HttpCalloutMock.class, new RoutingMock(new Map<String, String>()));
        try {
            IllustrationController.getIllustrationSummary(5);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.areEqual('Illustration 5 was not found.', e.getMessage());
        }
    }

    // ─── EBS: createSubmission ──────────────────────────────────────────────

    private class SubmissionMock implements HttpCalloutMock {
        private Integer status;
        private String body;
        public HttpRequest lastRequest;
        SubmissionMock(Integer status, String body) {
            this.status = status;
            this.body = body;
        }
        public HttpResponse respond(HttpRequest req) {
            lastRequest = req;
            HttpResponse res = new HttpResponse();
            res.setStatusCode(status);
            res.setStatus(status < 300 ? 'Created' : 'Error');
            res.setBody(body);
            return res;
        }
    }

    private static final String SUBMISSION =
        '{"submissionId":3,"submissionRef":"SUB-1234567890","illustrationId":76,"productCode":"PISA",' +
        '"status":"DRAFT","currentScreen":"account-owner","createdAt":"2026-11-13T05:06:10Z","submittedAt":null}';

    @IsTest
    static void createSubmission_postsAndReturnsTheWholeResponse() {
        SubmissionMock mock = new SubmissionMock(201, SUBMISSION);
        Test.setMock(HttpCalloutMock.class, mock);

        Test.startTest();
        String result = IllustrationController.createSubmission(76);
        Test.stopTest();

        Assert.areEqual('POST', mock.lastRequest.getMethod());
        Assert.areEqual('callout:WM_Illustration_API/api/v1/illustrations/76/submissions', mock.lastRequest.getEndpoint());
        Assert.areEqual('application/json', mock.lastRequest.getHeader('Content-Type'));
        Assert.areEqual(SUBMISSION, result, 'response is passed through unchanged');
    }

    @IsTest
    static void createSubmission_surfacesTheApiProblemDetail() {
        Test.setMock(HttpCalloutMock.class, new SubmissionMock(409,
            '{"title":"Conflict","status":409,"detail":"A draft submission already exists."}'));
        try {
            IllustrationController.createSubmission(76);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.areEqual('Could not create the EBS: A draft submission already exists.', e.getMessage());
        }
    }

    @IsTest
    static void createSubmission_rejectsBadResponsesAndMissingId() {
        Test.setMock(HttpCalloutMock.class, new SubmissionMock(500, 'oops'));
        try {
            IllustrationController.createSubmission(76);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('500'), e.getMessage());
        }

        Test.setMock(HttpCalloutMock.class, new SubmissionMock(200, '<html/>'));
        try {
            IllustrationController.createSubmission(76);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.isTrue(e.getMessage().contains('unexpected'), e.getMessage());
        }

        try {
            IllustrationController.createSubmission(null);
            Assert.fail('Expected an AuraHandledException');
        } catch (AuraHandledException e) {
            Assert.areEqual('An illustration id is required.', e.getMessage());
        }
    }
}
