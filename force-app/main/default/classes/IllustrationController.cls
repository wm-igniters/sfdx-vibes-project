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
        dto.preparedByName = item.preparedBy?.displayName;
        dto.createdAt = item.createdAt;
        dto.illustratedAt = item.illustratedAt;
        dto.hasDocuments = item.txLife != null;
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
