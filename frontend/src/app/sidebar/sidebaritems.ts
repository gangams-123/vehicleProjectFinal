import { title } from "process";

export const list=[
     {
      number: '1',
      title: 'Masters',
      icon: 'dashboard',
      open: false,
      children:
       [{
          number:'1.1',
          title:'General',
           icon: 'dashboard',
           open: false,
           children:
           [   {
                title:'Bank Account',
                routerLink:'/accountm',
                 queryParam:{view:true}
           },
            { 
                title:'WorkFlow Master',
                routerLink:'/workflowm',
                 queryParam:{view:true}
           },
           {
                title:'Department Master',
                routerLink:'/departmentm',
           },
           {
               title:'Designation Master',
              routerLink:'/designationm',
           },  {
               title:'Branch Master',
              routerLink:'/branchm',
           }]
       } ,{
          number:'1.2',
          title:'Users',
           icon: 'dashboard',
           open: false,
            children:
           [{ 
                title:'Officials',
                routerLink:'/officialsm',
                 queryParam:{view:true}
           },
           {
                title:'Custmers',
                routerLink:'/customersm',
                 queryParam:{view:true}
           },
           {
                title:'Vendors',
                routerLink:'/vendorsm',
                 queryParam:{view:true}
           }]
       } ,{
             number:'1.3',
          title:'Warehouse',
           icon: 'dashboard',
           open: false,
           children:
           [{
               
                title:'Make',
                routerLink:'/makem',
                 queryParam:{view:true}
           },{ 
                title:'Model',
                routerLink:'/modelsm',
                 queryParam:{view:true}
           },{ 
                title:'Module',
                routerLink:'/modulem',
                 queryParam:{view:true}
           },{ 
                title:'Roles',
                routerLink:'/rolem',
                 queryParam:{view:true}
           },]
       } 
                  
       ]
    },
    {
      number: '2',
      title: 'Reports',
      icon: 'bar_chart',
      open: false,
      children: [
        {
          number: '2.1',
          title: 'Sales',
          open: false,
          children: [
            {
              number: '2.1.1',
              title: 'Monthly Report',
              routerLink: '/reports/monthly'
            },
            {
              number: '2.1.2',
              title: 'Yearly Report',
              routerLink: '/reports/yearly'
            }
          ]
        },
        {
          number: '2.2',
          title: 'Inventory',
          routerLink: '/reports/inventory'
        }
      ]
    } ,{
      number: '2',
      title: 'Support',
      icon: 'bar_chart',
      open: false,
      children: [{ 
                title:'Ticket',
                routerLink:'/ticketm',
                 queryParam:{view:true}
           },
      ] 
    }  
  ];