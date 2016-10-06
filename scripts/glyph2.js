var width = 300;
var height = 300 + 15;
var originX =150;
var originY = 150 + 15;
var main_radius=0;
var pi = Math.PI/180;
// var color = ['#016c59', '#1c9099','#67a9cf', '#a6bddb', '#d0d1e6'];
var color = ['#016c59', '#d0d1e6', '#a6bddb', '#67a9cf', '#1c9099'];

var obj = {};
var list = [];
var Drugs_check =0;

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

      // console.log(data,id, ADR, No_of_drugs)
       /*        data has main confidence too, so number of drugs are less than length of data         */ 
       var No_of_rules = Math.pow(2, No_of_drugs) - 2
       var flag =0;
       var end_sub_index=0;
       var check = No_of_drugs-1;
       var angle = 360/ No_of_rules;
       var subrules_conf = [];
       var main_width = 0;

      var svgContainer = d3.select("#drug_svg")
                      .append("svg")
                      .attr("width",width)
                      .attr("height", height)
                      // .attr("viewBox", "0 0 3200 3200")

      var div = d3.select("body")
                  .append("div")
                  .attr("class", "toolTip");

      var MainCirlce = svgContainer.selectAll("g")
          .data(data)
          .enter()

      var circle = MainCirlce
           .append("circle")
           .attr("cx", originX)
           .attr("cy", originY)
           .attr("r",function(d,i){
             // console.log(d,i)
              if( i==0){
                  // console.log(d.name,d.value);
                    return d.Conf/2;
                } else
                    return 
            })
           .style("fill",color[0]) 

           .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html("Drugname: "+ (d.name)+"<br>"+ "Support: " + (d.support) +"<br>"+ "Confidence: " + (d.Conf));
          })

          .on("mouseout", function(d){
              div.style("display", "none");
          });

       var arc = d3.svg.arc()
                     .outerRadius(function(d,i){
                        if (i==0){

                             main_radius= d.Conf/2
                             // console.log(main_radius)
                             return 0
                        }
                        else if (i!==0){
                            // console.log(id, No_of_rules ,main_radius, d.value,d.value+main_radius );
                            return d.Conf
                        }
                     })  
                     .innerRadius(0) 
                     .startAngle(function (d,i ){
                      if (i!=0){
                        // console.log((i-1) * angle*pi)
                        return (i-1) *angle* (pi)
                      }
                    })
                    .endAngle(function (d,i ){
                      if (i!=0){
                        // console.log("hi",(i) * (Math.PI))
                        return (i)* angle * (pi)
                      }
                    });          

        // var color_index = 5                

        MainCirlce.append("path")
        .attr("d", arc)
        // .style("fill", color[1])
        .style("fill", function(d,i){
          if (i>flag && i <= end_sub_index + math.combinations (No_of_drugs,No_of_drugs-check )){
              // console.log("iffff",  i, flag, end_sub_index + math.combinations( No_of_drugs,No_of_drugs-check))
              // console.log(i)
              flag = i
              // console.log(flag)
              return color[check]
          }
          else if (i > end_sub_index +  math.combinations( No_of_drugs,No_of_drugs-check)){
              // console.log("else", i, math.combinations( No_of_drugs,No_of_drugs-check));
              end_sub_index = flag;
              check = check -1;
              flag = i;
              // console.log("else", i, flag, end_sub_index + math.combinations( No_of_drugs,No_of_drugs-check));
              return color[check]
            }
        })
        .attr("transform", function(d,i){
            // console.log('hello', ((i-1)* (Math.PI)))
            return "translate("+originX + "," + originY + ") rotate(" +  ((-1)* (Math.PI))+  ")"
            // return  "rotate(" +  ((-1)* (Math.PI))+  ")"
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


      svgContainer.append("text")
        .attr("x",width/2)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style('fill', 'Blue')
        .style("font-size","12px")
        .text( "Rank:   " + id); 
           
 }
 
 

