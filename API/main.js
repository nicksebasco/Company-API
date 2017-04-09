var express = require("express"),
path = require("path"),
csv = require("./csv.js"),
search = require("./search.js"),
logger = require("morgan"),
app = express();

function getData(company,location,json,response){
  var THROTTLE = 1000; // 1 second delay between requests.
  search(company,location,1)
    // $ = is object returned from cheerio.load(body_http_get_request)
    .then(function($){
      // find pagination, determine max results and number of pages.
      var interval = ["of ","results"], text = $("div.pagination").text(),results;
      if(text){
        // console.log("text: ",text);
        if(text.indexOf(interval[0])>=0 && text.indexOf(interval[1])>=0){
          results = text.slice( parseInt(text.indexOf(interval[0])+interval[0].length) , parseInt(text.indexOf(interval[1])) );
        }
      }
      // now that the number of pages is known for said query, scrape them all.
      var numberOfPages = results ? Math.floor(parseInt(results)/30)+1: 1, pool = [];
      for(var i = 1; i <= numberOfPages; i++){
        pool.push( search(company,location,i) );
      }
      console.log("Pages found: ",numberOfPages);
      return Promise.all(pool);
    },function(e){console.log("\n\tE1\n",e);response.status(404).end("\nFATAL REQUEST");})
    .then(function(_$s){
      var pool1 = [];
      _$s.forEach(function($,i){
        $("div.search-results.organic").find(".business-name").each(function(j){
          // console.log("Found A link: ","("+j+")"," https:\/\/www.yellowpages.com"+$(this).attr("href"));
          pool1.push( "https:\/\/www.yellowpages.com"+$(this).attr("href") );
        });
      });
      return Promise.all(pool1.map(function(t,idx){
        return new Promise(function(res){
          setTimeout(function(){
            res( search(company,location,1,t) );
          },(idx)*THROTTLE);
        });
      }),function(e){console.log("\n\tE2\n");response.status(404).end("\nFATAL REQUEST");});
    })
    .then(function(results){
      var master = [];
      results.forEach(function($){
        var $address = $(".address"), name = $(".sales-info > h1").text(), street, city, state, zip;
        $address.find("span").each(function(i){
          switch($(this).attr("itemprop")){
            case "streetAddress":
              street=$(this).text();
              console.log(street);
              break;
            case "addressLocality":
              city=$(this).text();
              break;
            case "addressRegion":
              state=$(this).text();
              break;
            case "postalCode":
              zip=$(this).text();
              break;
          }
        });
        var dataSet = {
          name: name,
          description:$(".general-info").text(),
          phone:$(".phone").text(),
          website:$(".business-card-footer>a").attr("href")? $(".business-card-footer>a").attr("href").replace("/?utm_source=yextpages&utm_medium=locallistings&utm_campaign=yextpages",""):void(0),
          email:$(".email-business").attr("href")?$(".email-business").attr("href").replace("mailto:",""):void(0),
          street:street,
          city:city,
          zip:zip,
          state:state,
          store_hours:{
            days:$(".day-label").text(),
            hours:$(".day-hours").text()
          }
        };
        console.dir(dataSet,{colors:true});
        master.push(dataSet);
      });
      // console.dir(master,{colors:true});
      console.log("Job complete");
      if(json){
        var jason = {}; master.forEach(function(v,i){jason[i]=v;});
        response.json(jason);
      }else{
        csv(response,"data",master);
      }
    },function(e){console.log("\n\tE3\n",e);response.status(404).end("\nFATAL REQUEST");});
}

// Morgan logging middleware.
app.use(logger("short"));

// API routing.
app.get("/API",function(request,response){
  if(!request.query.company || !request.query.location){
    response.status(404).end("\nBAD REQUEST (404), check arguments.");
  }
  else{
    getData(request.query.company,request.query.location,request.query.json,response);
  }
});

// API fallback response.
app.use(function(request,response){
  response.status(404).send("BAD REQUEST (404), check arguments.\nRequest with the following format:http://localhost:8060/API?company=company_name&location=search_location");
});

// Port/server initialization.
app.listen(8060,function(){
  console.log("Server running on port 8060.");
});
