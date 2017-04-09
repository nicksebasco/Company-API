var cheerio = require("cheerio"),
request = require("request");
module.exports = function (company,location,page,uri){
  var options = {
    url: uri || "https:\/\/www.yellowpages.com/"+"search?search_terms=SEARCHTERM&geo_location_terms=LOCALE&page=PAGE".replace("SEARCHTERM",encodeURIComponent(company)).replace("LOCALE",encodeURIComponent(location)).replace("PAGE",page).replace(/%20/g,"+"),
    headers: {
      'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit 537.36 (KHTML, like Gecko) Chrome"
    }
  };
  console.log("SCRAPING: "+options.url);
  return new Promise(function(resolve,reject){
	   request.get(options,function(e,res,body){
       if( !e  && res.statusCode == 200 ){
         // looking for organic results (not ads, not extended results).
         var $ = cheerio.load(body);
         resolve( $ );
       }
       else{
         var err = e || new Error("Bad request: status("+res.statusCode+")");
         reject( err );
       }
	    });
  });
};
