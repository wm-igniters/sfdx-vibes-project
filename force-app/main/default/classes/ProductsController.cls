/**
 * Products for the "New illustration" page, loaded from the WaveMaker
 * illustration API through the WM_Illustration_API Named Credential:
 *
 *   GET callout:WM_Illustration_API/api/v1/products
 */
public with sharing class ProductsController {

    @TestVisible
    private static final String NAMED_CREDENTIAL = 'WM_Illustration_API';
    @TestVisible
    private static final String DEFAULT_SOURCE = 'Platform';
    @TestVisible
    private static final String MISC_SOURCE = 'Miscellaneous';

    public class ProductDTO {
        @AuraEnabled public String code;
        @AuraEnabled public String description;
        @AuraEnabled public String category;
        @AuraEnabled public String illustrationSource;
        @AuraEnabled public Boolean allowsSecondParty;
        @AuraEnabled public Integer defaultTermYears;
    }

    // Shape of the API response (unknown fields are ignored)
    public class ApiProduct {
        public String code;
        public String description;
        public String category;
        public String illustrationSource;
        public Boolean allowsSecondParty;
        public Integer defaultTermYears;
    }

    @AuraEnabled(cacheable=true)
    public static List<ProductDTO> getProducts() {
        try {
            return fetchProducts();
        } catch (ProductApiException e) {
            throw newAuraException(e.getMessage());
        } catch (Exception e) {
            throw newAuraException('Could not load products: ' + e.getMessage());
        }
    }

    public static List<ProductDTO> fetchProducts() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:' + NAMED_CREDENTIAL + '/api/v1/products');
        req.setMethod('GET');
        req.setHeader('Accept', 'application/json');
        req.setTimeout(20000);

        HttpResponse res = new Http().send(req);
        if (res.getStatusCode() != 200) {
            throw new ProductApiException(
                'Product service returned ' + res.getStatusCode() + ' ' + res.getStatus()
            );
        }

        List<ApiProduct> apiProducts;
        try {
            apiProducts = (List<ApiProduct>) JSON.deserialize(res.getBody(), List<ApiProduct>.class);
        } catch (JSONException e) {
            throw new ProductApiException('Product service returned an unexpected response.');
        }

        List<ProductDTO> result = new List<ProductDTO>();
        if (apiProducts == null) {
            return result;
        }
        for (ApiProduct p : apiProducts) {
            if (p != null && String.isNotBlank(p.code)) {
                result.add(toDto(p));
            }
        }
        return result;
    }

    @TestVisible
    private static ProductDTO toDto(ApiProduct p) {
        ProductDTO dto = new ProductDTO();
        dto.code = p.code.trim();
        dto.description = String.isBlank(p.description) ? dto.code : p.description.trim();
        dto.category = p.category;
        dto.allowsSecondParty = p.allowsSecondParty == true;
        dto.defaultTermYears = p.defaultTermYears;
        dto.illustrationSource = sourceFor(p);
        return dto;
    }

    /** API value when sent; otherwise "Miscellaneous" for the catch-all products. */
    @TestVisible
    private static String sourceFor(ApiProduct p) {
        if (String.isNotBlank(p.illustrationSource)) {
            return p.illustrationSource.trim();
        }
        if (String.isNotBlank(p.description) && p.description.trim().startsWithIgnoreCase(MISC_SOURCE)) {
            return MISC_SOURCE;
        }
        return DEFAULT_SOURCE;
    }

    private static AuraHandledException newAuraException(String message) {
        AuraHandledException e = new AuraHandledException(message);
        e.setMessage(message);
        return e;
    }

    public class ProductApiException extends Exception {}
}
