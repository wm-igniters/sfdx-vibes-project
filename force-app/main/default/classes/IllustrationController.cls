/**
 * Illustrations created in the WaveMaker illustration app, loaded from the
 * illustration API through the WM_Illustration_API Named Credential (same
 * credential as ClientController):
 *
 *   GET callout:WM_Illustration_API/api/v1/illustrations
 *   GET callout:WM_Illustration_API/api/v1/illustrations/{illustrationId}/generate-pdf
 *       → JSON { success, fileName, contentType, pdfBase64 }
 *   GET callout:WM_Illustration_API/api/v1/illustrations/{illustrationId}/txlife/download
 *       → TXLife XML (Content-Disposition carries the file name)
 *
 * The PDF and XML are only available once a TXLife document has been stored for
 * the illustration (the API answers 404 otherwise); `hasDocuments` tells the LWC.
 * Files are returned base64-encoded so the LWC can save them in the browser.
 */
public with sharing class IllustrationController {

    @TestVisible
    private static final String NAMED_CREDENTIAL = 'WM_Illustration_API';
    private static final String BASE_PATH = '/api/v1/illustrations';

    public class IllustrationDTO {
        @AuraEnabled public Integer illustrationId;
        @AuraEnabled public String illustrationRef;
        @AuraEnabled public String status;
        @AuraEnabled public Integer clientId;
        @AuraEnabled public String clientTitle;
        @AuraEnabled public String clientForename;
        @AuraEnabled public String clientSurname;
        @AuraEnabled public String clientName;          // "Bmd Sthds" (forename surname)
        @AuraEnabled public String productDescription;
        @AuraEnabled public String preparedByName;
        @AuraEnabled public String createdAt;           // ISO-8601
        @AuraEnabled public String illustratedAt;       // ISO-8601
        @AuraEnabled public Boolean hasDocuments;       // a TXLife is stored → PDF/XML available
        @AuraEnabled public String productCode;         // "PISA"
        @AuraEnabled public String productCategory;     // "Investment"
        // Contribution totals (getClientIllustrations only; from the illustration detail)
        @AuraEnabled public Decimal singleAmount;
        @AuraEnabled public Decimal regularAmount;
        @AuraEnabled public String regularFrequency;    // e.g. MONTHLY
        @AuraEnabled public Decimal transferAmount;
    }

    public class FileDTO {
        @AuraEnabled public String fileName;
        @AuraEnabled public String contentType;
        @AuraEnabled public String base64;
    }

    // Shape of the API response
    public class ApiClient {
        public Integer clientId;
        public String title;
        public String forename;
        public String surname;
    }

    public class ApiProduct {
        public String code;
        public String description;
        public String category;
    }

    public class ApiAdviser {
        public Integer adviserId;
        public String displayName;
    }

    public class ApiTxLife {
        public Integer versionNo;
        public String generatedAt;
    }

    public class ApiIllustration {
        public Integer illustrationId;
        public String illustrationRef;
        public String status;
        public String currentStep;
        public ApiClient client;
        public ApiProduct product;
        public ApiAdviser preparedBy;
        public String taxYear;
        public String createdAt;
        public String updatedAt;
        public String illustratedAt;
        public ApiTxLife txLife;
    }

    // ─── List ───────────────────────────────────────────────────────────────

    @AuraEnabled(cacheable=true)
    public static List<IllustrationDTO> getIllustrations() {
        try {
            return fetchIllustrations();
        } catch (IllustrationApiException e) {
            throw newAuraException(e.getMessage());
        } catch (Exception e) {
            throw newAuraException('Could not load illustrations: ' + e.getMessage());
        }
    }

    public static List<IllustrationDTO> fetchIllustrations() {
        HttpResponse res = send(BASE_PATH, 'application/json', 20000);
        if (res.getStatusCode() != 200) {
            throw new IllustrationApiException(
                'Illustration service returned ' + res.getStatusCode() + ' ' + res.getStatus()
            );
        }

        List<ApiIllustration> items;
        try {
            items = (List<ApiIllustration>) JSON.deserialize(res.getBody(), List<ApiIllustration>.class);
        } catch (JSONException e) {
            throw new IllustrationApiException('Illustration service returned an unexpected response.');
        }

        List<IllustrationDTO> result = new List<IllustrationDTO>();
        if (items == null) {
            return result;
        }
        for (ApiIllustration item : items) {
            if (item != null && item.illustrationId != null) {
                result.add(toDto(item));
            }
        }
        return result;
    }

    @TestVisible
    private static IllustrationDTO toDto(ApiIllustration item) {
        IllustrationDTO dto = new IllustrationDTO();
        dto.illustrationId = item.illustrationId;
        dto.illustrationRef = item.illustrationRef;
        dto.status = item.status;
        dto.clientId = item.client?.clientId;
        dto.clientTitle = item.client?.title;
        dto.clientForename = item.client?.forename;
        dto.clientSurname = item.client?.surname;
        dto.clientName = joinNonBlank(new List<String>{ item.client?.forename, item.client?.surname });
        dto.productDescription = item.product?.description;
        dto.productCode = item.product?.code;
        dto.productCategory = item.product?.category;
        dto.preparedByName = item.preparedBy?.displayName;
        dto.createdAt = item.createdAt;
        dto.illustratedAt = item.illustratedAt;
        dto.hasDocuments = item.txLife != null;
        return dto;
    }

    // ─── One client's illustrations (Business manager) ──────────────────────

    // Each illustration's amounts need its own detail callout; stay well inside the
    // 100-callouts-per-transaction limit (the list itself is one more).
    @TestVisible
    private static final Integer MAX_DETAIL_CALLOUTS = 50;

    /**
     * Illustrations of one client, newest first, with single / regular / transfer
     * totals read from GET /api/v1/illustrations/{id}. Not cacheable: Business
     * manager reloads it on every visit and on Refresh.
     */
    @AuraEnabled
    public static List<IllustrationDTO> getClientIllustrations(Integer clientId) {
        try {
            if (clientId == null) {
                throw new IllustrationApiException('A client id is required.');
            }
            List<IllustrationDTO> rows = new List<IllustrationDTO>();
            for (IllustrationDTO dto : fetchIllustrations()) {
                if (dto.clientId == clientId) {
                    rows.add(dto);
                }
            }
            rows.sort(new NewestFirst());
            Integer detailed = 0;
            for (IllustrationDTO dto : rows) {
                if (detailed >= MAX_DETAIL_CALLOUTS) {
                    break;
                }
                detailed++;
                addAmounts(dto);
            }
            return rows;
        } catch (IllustrationApiException e) {
            throw newAuraException(e.getMessage());
        } catch (Exception e) {
            throw newAuraException('Could not load illustrations: ' + e.getMessage());
        }
    }

    /** Sum the contributions of one illustration by type. A failed detail call leaves the amounts blank. */
    @TestVisible
    private static void addAmounts(IllustrationDTO dto) {
        HttpResponse res = send(BASE_PATH + '/' + dto.illustrationId, 'application/json', 20000);
        if (res.getStatusCode() != 200) {
            return;
        }
        Map<String, Object> body;
        try {
            body = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
        } catch (Exception e) {
            return;
        }
        Object wrapped = body.get('illustration');
        Map<String, Object> ill = wrapped instanceof Map<String, Object> ? (Map<String, Object>) wrapped : body;
        Object contributions = ill.get('contributions');
        if (!(contributions instanceof List<Object>)) {
            return;
        }
        for (Object o : (List<Object>) contributions) {
            if (!(o instanceof Map<String, Object>)) {
                continue;
            }
            Map<String, Object> c = (Map<String, Object>) o;
            String contributionType = String.valueOf(c.get('contributionType')).toUpperCase();
            Decimal gross = toDecimal(c.get('grossAmount'));
            if (contributionType.contains('TRANSFER')) {
                Decimal value = toDecimal(c.get('transferValue'));
                dto.transferAmount = plus(dto.transferAmount, value != null ? value : gross);
            } else if (contributionType.contains('REGULAR')) {
                dto.regularAmount = plus(dto.regularAmount, gross);
                if (c.get('frequency') != null) {
                    dto.regularFrequency = String.valueOf(c.get('frequency'));
                }
            } else {
                dto.singleAmount = plus(dto.singleAmount, gross);
            }
        }
    }

    private static Decimal toDecimal(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return Decimal.valueOf(String.valueOf(value));
        } catch (Exception e) {
            return null;
        }
    }

    private static Decimal plus(Decimal total, Decimal value) {
        if (value == null) {
            return total;
        }
        return total == null ? value : total + value;
    }

    /** illustratedAt (else createdAt), newest first; ISO-8601 strings sort chronologically. */
    private class NewestFirst implements Comparator<IllustrationDTO> {
        public Integer compare(IllustrationDTO a, IllustrationDTO b) {
            String x = a.illustratedAt != null ? a.illustratedAt : (a.createdAt != null ? a.createdAt : '');
            String y = b.illustratedAt != null ? b.illustratedAt : (b.createdAt != null ? b.createdAt : '');
            return y.compareTo(x);
        }
    }

    // ─── Illustration summary (Business manager → EBS Create / View summary) ─

    public class SummaryContributor {
        @AuraEnabled public String contributorType;   // ACCOUNT_OWNER
        @AuraEnabled public String contributorName;
        @AuraEnabled public Decimal amount;
    }

    public class SummaryCharge {
        @AuraEnabled public String chargeTypeCode;    // INITIAL_ADVICE_CHARGE …
        @AuraEnabled public String displayName;       // "Initial Advice Charge"
        @AuraEnabled public String kind;              // CHARGE | FEE
        @AuraEnabled public Decimal standardRatePct;
        @AuraEnabled public Decimal appliedRatePct;
    }

    public class SummaryAllocation {
        @AuraEnabled public Integer fundId;
        @AuraEnabled public String fundCode;
        @AuraEnabled public String fundName;
        @AuraEnabled public String shareClass;        // INCOME | ACCUMULATION
        @AuraEnabled public Decimal allocationPct;
    }

    public class SummaryContribution {
        @AuraEnabled public Integer contributionId;
        @AuraEnabled public String contributionType;  // SINGLE | REGULAR | TRANSFER
        @AuraEnabled public Decimal grossAmount;
        @AuraEnabled public String frequency;
        @AuraEnabled public Decimal transferValue;
        @AuraEnabled public List<SummaryContributor> contributors;
        @AuraEnabled public List<SummaryCharge> charges;
        @AuraEnabled public List<SummaryAllocation> allocations;
        @AuraEnabled public Decimal allocationTotalPct;
    }

    public class SummaryParty {
        public String role;
        public Integer clientId;
        public String title;
        public String forename;
        public String surname;
    }

    public class SummaryDTO {
        @AuraEnabled public Integer illustrationId;
        @AuraEnabled public String illustrationRef;
        @AuraEnabled public String status;
        @AuraEnabled public String productCode;
        @AuraEnabled public String productDescription;
        @AuraEnabled public String productCategory;
        @AuraEnabled public String clientName;        // first party (and second, "A & B")
        @AuraEnabled public String preparedByName;
        @AuraEnabled public String taxYear;
        @AuraEnabled public String illustrationDate;  // illustratedAt, else createdAt (ISO-8601)
        @AuraEnabled public Boolean hasDocuments;
        @AuraEnabled public List<SummaryContribution> contributions;
    }

    // GET /api/v1/illustrations/{id} → { illustration: {...}, latestRun: {...} }
    public class ApiIllustrationDetail {
        public Integer illustrationId;
        public String illustrationRef;
        public String status;
        public ApiProduct product;
        public ApiAdviser preparedBy;
        public String taxYear;
        public List<SummaryParty> parties;
        public List<SummaryContribution> contributions;
        public String createdAt;
        public String illustratedAt;
        public ApiTxLife txLife;
    }

    public class ApiDetailResponse {
        public ApiIllustrationDetail illustration;
    }

    /** Contributions, charges and fund allocations of one illustration, for the summary dialog. */
    @AuraEnabled
    public static SummaryDTO getIllustrationSummary(Integer illustrationId) {
        try {
            requireId(illustrationId);
            HttpResponse res = send(BASE_PATH + '/' + illustrationId, 'application/json', 20000);
            if (res.getStatusCode() == 404) {
                throw new IllustrationApiException('Illustration ' + illustrationId + ' was not found.');
            }
            if (res.getStatusCode() != 200) {
                throw new IllustrationApiException(
                    'Illustration service returned ' + res.getStatusCode() + ' ' + res.getStatus()
                );
            }
            ApiIllustrationDetail detail;
            try {
                ApiDetailResponse wrapper = (ApiDetailResponse) JSON.deserialize(res.getBody(), ApiDetailResponse.class);
                detail = wrapper?.illustration;
                if (detail == null) {
                    detail = (ApiIllustrationDetail) JSON.deserialize(res.getBody(), ApiIllustrationDetail.class);
                }
            } catch (JSONException e) {
                throw new IllustrationApiException('Illustration service returned an unexpected response.');
            }
            return toSummary(detail, illustrationId);
        } catch (IllustrationApiException e) {
            throw newAuraException(e.getMessage());
        } catch (Exception e) {
            throw newAuraException('Could not load the illustration summary: ' + e.getMessage());
        }
    }

    @TestVisible
    private static SummaryDTO toSummary(ApiIllustrationDetail d, Integer illustrationId) {
        SummaryDTO dto = new SummaryDTO();
        dto.illustrationId = d.illustrationId != null ? d.illustrationId : illustrationId;
        dto.illustrationRef = d.illustrationRef;
        dto.status = d.status;
        dto.productCode = d.product?.code;
        dto.productDescription = d.product?.description;
        dto.productCategory = d.product?.category;
        dto.preparedByName = d.preparedBy?.displayName;
        dto.taxYear = d.taxYear;
        dto.illustrationDate = d.illustratedAt != null ? d.illustratedAt : d.createdAt;
        dto.hasDocuments = d.txLife != null;
        List<String> names = new List<String>();
        if (d.parties != null) {
            for (SummaryParty p : d.parties) {
                String partyName = joinNonBlank(new List<String>{ p?.forename, p?.surname });
                if (String.isNotBlank(partyName)) {
                    names.add(partyName);
                }
            }
        }
        dto.clientName = String.join(names, ' & ');
        dto.contributions = d.contributions != null ? d.contributions : new List<SummaryContribution>();
        return dto;
    }

    // ─── Downloads ──────────────────────────────────────────────────────────

    /** PDF of the illustration (the API answers JSON with the PDF base64-encoded). */
    @AuraEnabled
    public static FileDTO getIllustrationPdf(Integer illustrationId) {
        try {
            return fetchPdf(illustrationId);
        } catch (IllustrationApiException e) {
            throw newAuraException(e.getMessage());
        } catch (Exception e) {
            throw newAuraException('Could not download the PDF: ' + e.getMessage());
        }
    }

    /** TXLife XML of the illustration. */
    @AuraEnabled
    public static FileDTO getIllustrationXml(Integer illustrationId) {
        try {
            return fetchXml(illustrationId);
        } catch (IllustrationApiException e) {
            throw newAuraException(e.getMessage());
        } catch (Exception e) {
            throw newAuraException('Could not download the XML: ' + e.getMessage());
        }
    }

    public static FileDTO fetchPdf(Integer illustrationId) {
        requireId(illustrationId);
        // PDF generation can take a while.
        HttpResponse res = send(BASE_PATH + '/' + illustrationId + '/generate-pdf', 'application/json', 120000);
        checkFileResponse(res, 'PDF', illustrationId);

        // Stream the JSON so the (large) base64 string is copied only once on the heap.
        FileDTO file = new FileDTO();
        Boolean success = true;
        JSONParser parser = JSON.createParser(res.getBody());
        while (parser.nextToken() != null) {
            if (parser.getCurrentToken() != JSONToken.FIELD_NAME || parser.getCurrentName() == null) {
                continue;
            }
            String field = parser.getText();
            parser.nextToken();
            JSONToken value = parser.getCurrentToken();
            if (value == JSONToken.START_OBJECT || value == JSONToken.START_ARRAY) {
                parser.skipChildren();
            } else if (value == JSONToken.VALUE_NULL) {
                continue;
            } else if (field == 'fileName') {
                file.fileName = parser.getText();
            } else if (field == 'contentType') {
                file.contentType = parser.getText();
            } else if (field == 'pdfBase64') {
                file.base64 = parser.getText();
            } else if (field == 'success' && (value == JSONToken.VALUE_TRUE || value == JSONToken.VALUE_FALSE)) {
                success = parser.getBooleanValue();
            }
        }
        if (!success || String.isBlank(file.base64)) {
            throw new IllustrationApiException('The PDF for illustration ' + illustrationId + ' could not be generated.');
        }
        if (String.isBlank(file.fileName)) {
            file.fileName = 'illustration-' + illustrationId + '.pdf';
        }
        if (String.isBlank(file.contentType)) {
            file.contentType = 'application/pdf';
        }
        return file;
    }

    public static FileDTO fetchXml(Integer illustrationId) {
        requireId(illustrationId);
        HttpResponse res = send(
            BASE_PATH + '/' + illustrationId + '/txlife/download',
            'application/xml',
            60000
        );
        checkFileResponse(res, 'XML', illustrationId);

        FileDTO file = new FileDTO();
        file.fileName = fileNameFrom(headerValue(res, 'Content-Disposition'));
        if (String.isBlank(file.fileName)) {
            file.fileName = 'illustration-' + illustrationId + '-TXLife.xml';
        }
        String contentType = headerValue(res, 'Content-Type');
        file.contentType = String.isBlank(contentType) ? 'application/xml' : contentType.substringBefore(';').trim();
        file.base64 = EncodingUtil.base64Encode(res.getBodyAsBlob());
        return file;
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private static HttpResponse send(String path, String accept, Integer timeoutMs) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:' + NAMED_CREDENTIAL + path);
        req.setMethod('GET');
        req.setHeader('Accept', accept);
        req.setTimeout(timeoutMs);
        return new Http().send(req);
    }

    private static void requireId(Integer illustrationId) {
        if (illustrationId == null) {
            throw new IllustrationApiException('An illustration id is required.');
        }
    }

    private static void checkFileResponse(HttpResponse res, String kind, Integer illustrationId) {
        Integer status = res.getStatusCode();
        if (status == 200) {
            return;
        }
        if (status == 404) {
            throw new IllustrationApiException(
                'No ' + kind + ' is available for illustration ' + illustrationId + ' yet.'
            );
        }
        throw new IllustrationApiException(
            'Illustration service returned ' + status + ' ' + res.getStatus() + ' for the ' + kind + '.'
        );
    }

    /** Response header lookup that ignores the header name's case. */
    private static String headerValue(HttpResponse res, String name) {
        String value = res.getHeader(name);
        if (value != null) {
            return value;
        }
        for (String key : res.getHeaderKeys()) {
            if (key != null && key.equalsIgnoreCase(name)) {
                return res.getHeader(key);
            }
        }
        return null;
    }

    /** attachment; filename="ILL-50D0B93437-TXLife-v1.xml" → ILL-50D0B93437-TXLife-v1.xml */
    @TestVisible
    private static String fileNameFrom(String contentDisposition) {
        if (String.isBlank(contentDisposition)) {
            return null;
        }
        for (String part : contentDisposition.split(';')) {
            String p = part.trim();
            if (p.toLowerCase().startsWith('filename=')) {
                String name = p.substringAfter('=').trim().removeStart('"').removeEnd('"');
                return String.isBlank(name) ? null : name;
            }
        }
        return null;
    }

    private static String joinNonBlank(List<String> parts) {
        List<String> kept = new List<String>();
        for (String p : parts) {
            if (String.isNotBlank(p)) {
                kept.add(p.trim());
            }
        }
        return String.join(kept, ' ');
    }

    private static AuraHandledException newAuraException(String message) {
        AuraHandledException e = new AuraHandledException(message);
        e.setMessage(message);
        return e;
    }

    public class IllustrationApiException extends Exception {}
}
