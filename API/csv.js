var json2csv = require('json2csv');

module.exports = function (res,name,data){
  // other parameters contained in data: store_hours
  // map data object to an array of objects, needed for json2csv
  var fields = [ "name", "description", "phone", "website", "email", "street","city","zip","state"],
  csv = json2csv({ data: data, fields: fields });
  res.send(csv);
};
