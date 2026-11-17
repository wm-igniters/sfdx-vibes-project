
interface Config {
  name: string;
  type: string;
  params: any[];
  permission?: 'Role' | 'Authenticated' | 'PermitAll';
  allowedRoles?: string[];
}

const configs:Config[] = [{"name":"Illustration","type":"PAGE","params":[],"permission":"Authenticated"},{"name":"IndividualSavingsAccount","type":"PAGE","params":[],"permission":"Authenticated"},{"name":"blank","type":"PAGE","params":[],"permission":"Authenticated"},{"name":"printIllustration","type":"PAGE","params":[],"permission":"Authenticated"}];

export default configs;
