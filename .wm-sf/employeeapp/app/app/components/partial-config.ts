import { lazy} from 'react';


interface Config {
  name: string;
  type: string;
  params: any[];
  component?: any;
  componentName?: string;
  permission?: 'Role' | 'Authenticated' | 'PermitAll';
  allowedRoles?:string[];
}

interface Partial {
  type: any;
  name: string;
}
interface Components {
  [key: string]: Partial;
}


 const components:Components = {
    'Common': {
        type: lazy(() => import("../components/Common/Common")),
        name: 'CommonComponent'
    },
    'footer': {
        type: lazy(() => import("../components/footer/footer")),
        name: 'footerComponent'
    },
    'header': {
        type: lazy(() => import("../components/header/header")),
        name: 'headerComponent'
    },
    'leftnav': {
        type: lazy(() => import("../components/leftnav/leftnav")),
        name: 'leftnavComponent'
    },
    'rightnav': {
        type: lazy(() => import("../components/rightnav/rightnav")),
        name: 'rightnavComponent'
    },
    'topnav': {
        type: lazy(() => import("../components/topnav/topnav")),
        name: 'topnavComponent'
    },
};


// Configuration objects
export const baseConfigs: Config[] = [{"name":"Common","type":"PARTIAL","params":[],"allowedRoles":[],"permission":"PermitAll"},{"name":"footer","type":"FOOTER","params":[],"permission":"Authenticated"},{"name":"header","type":"HEADER","params":[],"permission":"Authenticated"},{"name":"leftnav","type":"LEFTNAV","params":[],"permission":"Authenticated"},{"name":"rightnav","type":"RIGHTNAV","params":[],"permission":"Authenticated"},{"name":"topnav","type":"TOPNAV","params":[],"permission":"Authenticated"}]

// Enhance configs with component information
const configs = ()=> baseConfigs.map(config => {
  const component = components[config.name];
  return {
    ...config,
    component: component.type,
    componentName: component.name,
  };
});


export default configs();

