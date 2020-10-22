console.log("reading the effing donut js");

var crime_data = "/crime_data";

var crimeName = [];
var crimeType = [];
var crimeCount = [];
var crimeCity = [];
var crimeYear = [];
var crimeCounts = {};
var nhCounts = {};

d3.json(crime_data).then(function(data) 
  {
  console.log(data);
  data.forEach(function(crime) 
    {
      crimeName.push(crime.Neighborhood)
      crimeType.push(crime.Incident)
      crimeCount.push(crime.Count)
      crimeYear.push(crime.Year);

      var currentcrime = crime.Incident;
        // If the crime has been seen before...
        if (currentcrime in crimeCounts) 
          {
            // Add crime count to the sum
            crimeCounts[currentcrime] += crime.Count;
          }
        else 
          {
    //       // Set the amount to first count of crime
          crimeCounts[currentcrime] = crime.Count;
          }
      return crimeCounts;
      
    })
  });

  d3.json(crime_data).then(function(data) 
  {
  console.log(data);
  data.forEach(function(crime) 
    {
      crimeName.push(crime.Neighborhood)
      crimeType.push(crime.Incident)
      crimeCount.push(crime.Count)
      crimeCity.push(crime.City)
      crimeYear.push(crime.Year);

      var currentcrime2 = crime.Neighborhood;
        // If the crime has been seen before...
        if (currentcrime2 in nhCounts) 
          {
            // Add crime count to the sum
            nhCounts[currentcrime2] += crime.Count;
          }
        else 
          {
      //       // Set the amount to first count of crime
            nhCounts[currentcrime2] = crime.Count;
          }
          
      return nhCounts;
      
    })
  });

//  Check your numbers.
console.log(crimeName);
console.log(crimeType);
console.log(crimeCount);
console.log(crimeYear);
console.log(crimeCounts);
console.log(nhCounts);



