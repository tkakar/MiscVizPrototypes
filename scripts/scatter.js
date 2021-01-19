var color = ['#016c59', '#d0d1e6', '#a6bddb', '#67a9cf', '#1c9099'];
var Drugs_check =0;
var obj = {};
var list = [];
var overall = [];
var main_obj= {}


d3.text("data/data.csv", function(unparsedData){
       var data = d3.csv.parseRows(unparsedData);
       for ( var row=0; row<data.length;row++){
            var id = data[row][0]
            var score = data[row][1]
            var No_of_drugs = data[row][2]
            var ADR = data [row][3]
            var No_of_itmes = (Math.pow(2,No_of_drugs) - 1) * 3 + 4
            main_obj['id'] = +id
            main_obj['score']= +score

            for ( i =4; i<No_of_itmes && data[row][i]!=''; i=i+3){
                obj['name'] = data[row][i]
                obj['support']= +data[row][i+1]
                obj['Conf'] = +data[row][i+2]

                list.push(obj)
                 // console.log(obj, list)
                obj ={}
            }
            main_obj['subrules'] = list
           
            // if (row==2)
            //      break;
            // plot(list, id, ADR, No_of_drugs)
            overall.push(main_obj)
            list = []
            main_obj = {}
       }
       // console.log(overall)
       buildVis(overall)
});


function buildVis(d) {
    var vis = d3.select('#drug_svg'),
    WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(d, function(data) {
      return +data.id;
    }), d3.max(d, function(data) {
      return +data.id;
    })]),
   
    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(d, function(data) {
      return +data.score;
    }), d3.max(d, function(data) {
      return +data.score;
    })]),
    xAxis = d3.svg.axis()
      .scale(xRange)
      .tickSize(5)
      .tickSubdivide(true),
    yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient('left')
      .tickSubdivide(true);

    vis.selectAll("dot")  
      .data(d)                   
      .enter().append("circle")               
      .attr("r", 2) 
      .style("fill", "red")  
      .attr("cx", function(d) { return xRange(d.id); })     
      .attr("cy", function(d) { return yRange(d.score); });

    // Adding xAxis
    vis.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
      .call(xAxis);

    // Adding yAxis
    vis.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
      .call(yAxis);
}
