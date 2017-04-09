# Company-API
Get information about US companies

This project provides a covenient solution for gathering information about United States companies based on two parameters: 
(location and a search query) and outputting the data into a application/user friendly format ( json or csv ).

The location parameter can be any valid United States: zip code, city, or state.
The search query parameter can be anything!

<h5>Examples:</h5>

  If I want to get data on all bicycle companies in Destin, Fl and output the data to a csv file named destinBicycles.csv, 
  I could make the following http get request from bash:
  
  <code> curl -o destinBicycles.csv "http://localhost:8060/API?company=bicycle&location=Destin" </code>
  
  Furthermore if I want to return the data as json so that some other processing script can consume it:
  <code> curl "http://localhost:8060/API?company=bicycle&location=Destin&json=true" | python processing.py </code>
  
<h5>Output:</h5>

  An example of the json output:
 
  <pre>
  json = {
    "0":{ 
      name: 'Surf & Cycles Rentals and Beach shop',
      description: 'Rentals for scooters. ST. LEGAL golf cart rentals.',
      phone: '(850) 424-3815',
      website: 'http://www.destinspeedboat.com',
      email: 'Surfandcycles@gmail.com',
      street: '981 Highway 98 E, ',
      city: 'Destin, ',
      zip: '32541',
      state: 'FL ',
      store_hours: { days: 'Mon - Fri', hours: '9:00 am - 5:00 pm' } 
    },
  ...
    "n":{
      // same keys as above for the nth results, with the nth values
    }
  }
  </pre>
  

