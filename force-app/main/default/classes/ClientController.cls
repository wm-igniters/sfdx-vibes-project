/**
 * Clients for the Employee Directory / Create Illustration flow, loaded from the
 * WaveMaker illustration API through the WM_Illustration_API Named Credential:
 *
 *   GET callout:WM_Illustration_API/api/v1/clients?adviserId={adviserId}
 *
 * Rows are returned in the shape the LWCs already use (id, name, ...) so the
 * dialog, the Illustration tab and the WaveMaker app keep working unchanged.
 */
public with sharing class ClientController {

    @TestVisible
    private static final String NAMED_CREDENTIAL = 'WM_Illustration_API';
    @TestVisible
    private static final Integer DEFAULT_ADVISER_ID = 1;

    public class ClientDTO {
        @AuraEnabled public String id;
        @AuraEnabled public Integer clientId;
        @AuraEnabled public String name;          // "Bmd Sthds"
        @AuraEnabled public String displayName;   // "Mr Bmd Sthds"
        @AuraEnabled public String title;
        @AuraEnabled public String forename;
        @AuraEnabled public String surname;
        @AuraEnabled public String externalRef;
        @AuraEnabled public String dateOfBirth;   // ISO yyyy-mm-dd
        @AuraEnabled public Integer adviserId;
        @AuraEnabled public String adviserName;
        @AuraEnabled public List<String> editableFields;
        @AuraEnabled public String avatarInitials;
    }

    // Shape of the API response
    public class ApiAdviser {
        public Integer adviserId;
        public String displayName;
    }

    public class ApiClient {
        public Integer clientId;
        public String externalRef;
        public String title;
        public String forename;
        public String surname;
        public String dateOfBirth;
        public ApiAdviser adviser;
        public List<String> editableFields;
    }

    @AuraEnabled(cacheable=true)
    public static List<ClientDTO> getClients() {
        try {
            return fetchClients(DEFAULT_ADVISER_ID);
        } catch (ClientApiException e) {
            throw newAuraException(e.getMessage());
        } catch (Exception e) {
            throw newAuraException('Could not load clients: ' + e.getMessage());
        }
    }

    public static List<ClientDTO> fetchClients(Integer adviserId) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:' + NAMED_CREDENTIAL + '/api/v1/clients?adviserId=' + adviserId);
        req.setMethod('GET');
        req.setHeader('Accept', 'application/json');
        req.setTimeout(20000);

        HttpResponse res = new Http().send(req);
        if (res.getStatusCode() != 200) {
            throw new ClientApiException(
                'Client service returned ' + res.getStatusCode() + ' ' + res.getStatus()
            );
        }

        List<ApiClient> apiClients;
        try {
            apiClients = (List<ApiClient>) JSON.deserialize(res.getBody(), List<ApiClient>.class);
        } catch (JSONException e) {
            throw new ClientApiException('Client service returned an unexpected response.');
        }

        List<ClientDTO> result = new List<ClientDTO>();
        if (apiClients == null) {
            return result;
        }
        for (ApiClient c : apiClients) {
            if (c != null && c.clientId != null) {
                result.add(toDto(c));
            }
        }
        return result;
    }

    @TestVisible
    private static ClientDTO toDto(ApiClient c) {
        ClientDTO dto = new ClientDTO();
        dto.clientId = c.clientId;
        dto.id = String.valueOf(c.clientId);
        dto.title = c.title;
        dto.forename = c.forename;
        dto.surname = c.surname;
        dto.name = joinNonBlank(new List<String>{ c.forename, c.surname });
        dto.displayName = joinNonBlank(new List<String>{ c.title, c.forename, c.surname });
        dto.externalRef = c.externalRef;
        dto.dateOfBirth = c.dateOfBirth;
        dto.adviserId = c.adviser?.adviserId;
        dto.adviserName = c.adviser?.displayName;
        dto.editableFields = c.editableFields == null ? new List<String>() : c.editableFields;
        dto.avatarInitials =
            (String.isBlank(c.forename) ? '' : c.forename.left(1)) +
            (String.isBlank(c.surname) ? '' : c.surname.left(1));
        return dto;
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

    public class ClientApiException extends Exception {}
}
