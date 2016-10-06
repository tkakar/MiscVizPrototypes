var width = 200;
var height = 200;
var color = ['#016c59', '#d0d1e6', '#a6bddb', '#67a9cf', '#1c9099'];
var gap = 5;
var margin = {top: 15, bottom: 30, left: 15, right: 15};
var Drugs_check =0;
var obj = {};
var list = [];


d3.select('#two-drugs').on('click', function() {
    d3.selectAll("#drug_svg > *").remove();
    Drugs_check = 2
    read_data(Drugs_check)    
});

d3.select('#three-drugs').on('click', function() {
    d3.selectAll("#drug_svg > *").remove();
    Drugs_check = 3
    read_data(Drugs_check)   
});

d3.select('#four-drugs').on('click', function() {

    d3.selectAll("#drug_svg > *").remove();
    Drugs_check = 4
    read_data(Drugs_check) 
});

function read_data(Drugs){
  
    d3.text("data/data.csv", function(unparsedData)
      {
       var data = d3.csv.parseRows(unparsedData);
       for ( var row=0; row<data.length;row++){
            var id = data[row][0]
            var No_of_drugs = data[row][2]
            var ADR = data [row][3]
            var No_of_itmes = (Math.pow(2,No_of_drugs) - 1) * 3 + 4

            if(parseInt(No_of_drugs) === parseInt(Drugs)){
                for ( i =4; i<No_of_itmes && data[row][i]!=''; i=i+3){
                    obj['name'] = data[row][i]
                    obj['support']= +data[row][i+1]
                    obj['Conf'] = +data[row][i+2]

                    list.push(obj)
                     // console.log(obj, list)
                    obj ={}
                }
                // if (row==2)
                //      break;
                plot(list, id, ADR, No_of_drugs)
                list = []
            }
       }
     });
}


function plot(data,id, ADR, No_of_drugs){
        // console.log(data)
         var No_of_rules = Math.pow(2, No_of_drugs) - 2
         var No_of_drugs =  Math.log2(No_of_rules +2 )
         var flag =0;
         var end_sub_index=0;
         var check = No_of_drugs- 1;
         
         // console.log(fields)
          var x0 = d3.scale.ordinal().rangeRoundBands([0,width-margin.left-margin.right],0.05);
          var y =  d3.scale.linear().range([height-margin.top-margin.bottom, 0]);
          var x1 = d3.scale.ordinal().domain(d3.range(No_of_drugs-1)).rangeBands([0, x0.rangeBand()]);

          x0.domain(data.map(function(d) {
           return d.name; }));
     
          // x1.domain(fields).rangeRoundBands([0,x0.rangeBand()]);

          y.domain([0,100])

         var xAxis = d3.svg.axis()
                    .scale(x0)
                    .orient("bottom")
                    .ticks(No_of_rules+1)
                    .tickValues([]);

         var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(5)
                    // .tickFormat(d3.format(".2s"))
                    // .innerTickSize(-width+margin.left+margin.right)
                    // .outerTickSize(0);


          var svg = d3.select("#drug_svg")
                      .append("svg")
                      .attr("width", width)
                      .attr("height", height)
                      // .attr("viewBox", "0 0 3200 3200")
                      .append("g")
                      .attr("transform", "translate("+ margin.left + "," + margin.top + ")")
                      // .classed("drug-class", true);;

          var div = d3.select("body")
                  .append("div")
                  .attr("class", "toolTip");
                
          svg.append('g')
              .attr('class', 'x axis')
              .attr("transform", "translate(0, "+ (height-margin.bottom-margin.top)+")")
              .call(xAxis)
              .selectAll("text")
              // .call(wrap, x0.rangeBand())
              .style("text-anchor", "end")
              // .style("font-size", "5px")
              // .attr("dx", -10)
              // .attr("dy", -15)
              // .attr("transform", "translate(15,15) rotate(0)");

          svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              .selectAll("text")
              // .style("text-anchor", "end")
              .style("font-size", "5px");                        

          svg.selectAll("drug")
              .data(data)
              .enter()
              .append('rect')
              .attr('width', function(d) { 
                // console.log(x1.rangeBand(d)/2)
                   return x0.rangeBand()
              }) 
              .attr('height', function(d,i) {      
                // console.log(d,data[i] )
                 return height-margin.top-margin.bottom - y(d.Conf);
                }) 
              .attr('x', function(d){ 
                return   x0(d.name); 
              })
              .attr('y', function(d) { 
                return y(d.Conf);  
              })
              .style("fill", function(d,i){
                  if (i==0){
                    return color[0]
                  }
                  else if (i>flag && i <= end_sub_index + math.combinations (No_of_drugs,No_of_drugs-check )){
                      // console.log("iffff",  i, flag, end_sub_index + math.combinations( No_of_drugs,No_of_drugs-check))
                      flag = i
                      return color[check]
                  }
                  else if (i > end_sub_index +  math.combinations( No_of_drugs,No_of_drugs-check)){
                      end_sub_index = flag;
                      check = check -1;
                      flag = i;
                      // console.log("else", i, flag, end_sub_index + math.combinations( No_of_drugs,No_of_drugs-check));
                      return color[check]
                  }
             })
               .attr("transform", function(d,i) { 
                  if (i>flag && i <= end_sub_index + math.combinations (No_of_drugs,No_of_drugs-check )){
                        flag = i
                        console.log(math.combinations (No_of_drugs,No_of_drugs-check ))
                        return "translate(0,0)";
                    }
                    else if (i > end_sub_index +  math.combinations( No_of_drugs,No_of_drugs-check)){
                        end_sub_index = flag;
                        check = check -1;
                        flag = i;
                        return "translate(15,0)"
                    }
                })

               .on("mousemove", function(d){
                    div.style("left", d3.event.pageX+10+"px");
                    div.style("top", d3.event.pageY-25+"px");
                    div.style("display", "inline-block");
                    div.html("Drugname: "+ (d.name)+"<br>"+ "ADR: " + ADR +"<br>"+ "Support: " + (d.support) +"<br>"+ "Confidence: " + (d.Conf));
                })

                .on("mouseout", function(d){
                    div.style("display", "none");
                });   
                // return "translate(" + x1(d.name) + ",0)"; });
            
            // svg.append("g").attr("class", "y label")
            //   .attr("transform", "rotate(-90)")
            //   .append("text").attr("x", -(height-margin.left-margin.right)/2)
            //   .attr("y",-40).attr("text-anchor", "middle")
            //   .text("Confidence for subsets"); 

            svg.append("g").attr("class", "x label")
              .attr("transform", "rotate(0)")
              .append("text").attr("x", (width-margin.left-margin.right)/2)
              .attr("x",100).attr("text-anchor", "middle")
              .text( "Rank:   " + id); 
 }
 

