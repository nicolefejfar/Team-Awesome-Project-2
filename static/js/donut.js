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

var neighborhoods_key = Object.keys(nhCounts);  
console.log(neighborhoods_key);

var chart = new Chartist.Pie('.ct-chart', {
  // series: [Object.values(nhCounts)],
  // labels: [Object.keys(nhCounts)]
  series: [10, 20, 50, 20, 5, 50, 15],
  labels: [1, 2, 3, 4, 5, 6, 7]
}, {
  donut: true,
  showLabel: true
  // plugins: [
  //   Chartist.plugins.fillDonut({
  //       items: [{
        //     content: '<i class="fa fa-tachometer"></i>',
        //     position: 'bottom',
        //     offsetY : 10,
        //     offsetX: -2
        // }, {
    //         content: '<h6>crimes<span class="small">by Neighborhood</span></h6>'
    //     }]
    //   })
    // ],
});

chart.on('draw', function(data) {
  if(data.type === 'slice') {
    // Get the total path length in order to use for dash array animation
    var pathLength = data.element._node.getTotalLength();

    // Set a dasharray that matches the path length as prerequisite to animate dashoffset
    data.element.attr({
      'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
    });

    // Create animation definition while also assigning an ID to the animation for later sync usage
    var animationDefinition = {
      'stroke-dashoffset': {
        id: 'anim' + data.index,
        dur: 1000,
        from: -pathLength + 'px',
        to:  '0px',
        easing: Chartist.Svg.Easing.easeOutQuint,
        // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
        fill: 'freeze'
      }
    };

    // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
    if(data.index !== 0) {
      animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
    }

    // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
    data.element.attr({
      'stroke-dashoffset': -pathLength + 'px'
    });

    // We can't use guided mode as the animations need to rely on setting begin manually
    // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
    data.element.animate(animationDefinition, false);
  }
});



// For the sake of the example we update the chart every time it's created with a delay of 8 seconds
chart.on('created', function() {
  if(window.__anim21278907124) {
    clearTimeout(window.__anim21278907124);
    window.__anim21278907124 = null;
  }
  window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
});


