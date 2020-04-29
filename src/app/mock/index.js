/* eslint-disable */

import Mock from 'mockjs';

// const dataSource = [
//   {
//     key: '1',
//     name: '胡彦斌',
//     age: 32,
//     address: '西湖区湖底公园1号'
//   },
//   {
//     key: '2',
//     name: '胡彦祖',
//     age: 42,
//     address: '西湖区湖底公园1号'
//   }
// ];
const api = {
  getGridAPi: /\/api\/getGrid/,

}


function getQueryVariable(query,variable)
{
      //  var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

Mock.setup({
  timeout: 200
});

module.export = [
  Mock.mock(api.getGridAPi, 'get', opts => {
    // console.log(opts);
    const count = getQueryVariable(opts.url,"pageSize");
    let dataSource = []
    for(let i = 1 ;i <= count; i++){
      dataSource.push(Mock.mock({
          'uuid': '@guid',
          'key|+1': 1,
          'name': '@name',
          'age|1-99': 15,
          'address': '@region'
      }))
    }
    // console.log(dataSource);
    return {
      total:200,
      dataSource: dataSource
    }

  //   Mock.mock({
  //     'total|200-500': 1,
  //     'dataSource|20':[{
  //       'uuid': '@guid',
  //       'key|+1': 1,
  //       'name': '@name',
  //       'age|1-99': 15,
  //       'address': '@region'
  //     }]
  // })
  })
]
