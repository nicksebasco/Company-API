# Company-API
Get information about US companies

This project provides a lightweight solution to getting information about certain companies based on two parameters: 
(location and a search query).

The api provides a convenient solution to gathering company data and outputting into a more usable format ( json or csv ).

The location parameter can be any valid United States: zip code, city, or state.
The search query parameter can be anything:

Examples:

  If I want to get data on all bicycle companies in Destin, Fl and output the data to a csv file named destinBicycles.csv, 
  I could make the following http get request from bash:
  
  curl -o destinBicycles.csv "http://localhost:8060/API?company=bicycle&location=Destin"
  
  Furthermore if I wanted to get the data in json for some other processing script to consume I could do:
  curl "http://localhost:8060/API?company=bicycle&location=Destin&json=true" > processing.py
  
Output:

  An example of the json output:
  <code>
  json = {
  "0":{ 
    name: 'The Melting Pot',
    description: 'Jazz up your dinner tonight when you bring your friends and family to The Melting Pot in Pensacola, Florida.',
    phone: '(850) 438-4030',
    website: 'http://www.meltingpot.com',
    email: 'dsieg@meltingpot.com',
    street: '418 E Gregory St Ste 500, ',
    city: 'Pensacola',
    zip: '32502',
    state: 'FL',
    store_hours: { 
      days: 'M-F',
      hours: '8-10' 
    } 
  },
  ...
  "n":{
    // same keys as above for the nth results, with the nth values
  }
  }
  </code>

