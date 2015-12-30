//PARSE_APP_ID = '9S16GhoFsiKeidxsLDMBvuESYJPWyyacFbd8zgys'
//PARSE_JS_KEY = 'YBqU0O4eqgSh6EdFihUj6jjtznr0SQENfGO6b8lB'

PARSE_APP_ID = 'XIpP60GkEQF4bQtKFOcceguywNhzOs3Lpsw1H17Z'
PARSE_JS_KEY = 'sqkZKgggrbz6osdU4BopAqhGi9WL5jmXCykZLFPG'
Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
var VisualGolink = Parse.Object.extend("VisualGolink");
var ParseGoLink = Parse.Object.extend("ParseGoLink");
var Link= Parse.Object.extend("Link");
var SocialTabLog = Parse.Object.extend("SocialTabLog");
var SocialTabs= Parse.Object.extend("SocialTabs");

function convertParse(parseObject, fields){
  res = {};
  _.each(fields, function(field){
    res[field] = parseObject.get(field);
  });
  res.objectId = parseObject.id;
  return res;
}

function convertParseObjects(parseObjects, fields){
  return _.map(parseObjects, function(obj){
    return convertParse(obj, fields);
  });
}
function lookupUrl(url, callback){
  q = new Parse.Query(ParseGoLink);
  q.startsWith('url', url);
  q.find({
    success:function(golinks){
      callback(golinks);
    }
  });
}
