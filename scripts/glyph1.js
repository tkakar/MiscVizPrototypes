var width = 300;
var height = 300 + 15;
var originX =150;
var originY = 150 + 15;
var main_radius=0;
var pi = Math.PI/180;
var color = ['#016c59', '#d0d1e6', '#a6bddb', '#67a9cf', '#1c9099'];
var Drugs_check =0;
var obj = {};
var list = [];
var drugs_list = [];

d3.select('#two-drugs').on('click', function() {

    d3.selectAll("#middle_container > *").remove();
    Drugs_check = 2
    d3.select("h2").text("Graphs for " + Drugs_check+ " Drugs");
    read_data(Drugs_check)    
});

d3.select('#search_txbox').on('change', function() {

    d3.select("h2").text("Graphs for searched Drug: " + this.value);
    var search_drug = this.value
    d3.selectAll("#middle_container > *").remove();
    // Drugs_check = 2
    // read_data(Drugs_check)  
    // console.log(search_drug) 
    search_Drugs(this.value)

});

window.onload = function load_glyphs(){
  d3.selectAll("#middle_container > *").remove();
  read_data(2)  
}

d3.select('#three-drugs').on('click', function() {
    d3.selectAll("#middle_container > *").remove();
    Drugs_check = 3
    d3.select("h2").text("Graphs for " + Drugs_check+ " Drugs");
    read_data(Drugs_check)   
});

d3.select('#four-drugs').on('click', function() {

    d3.selectAll("#middle_container > *").remove();
    Drugs_check = 4
    d3.select("h2").text("Graphs for " + Drugs_check+ " Drugs");
    read_data(Drugs_check) 
});


function search_Drugs(searchDrug){

  d3.text("data/data.csv", function(unparsedData)
      {
       var data = d3.csv.parseRows(unparsedData);
       for ( var row=0; row<data.length;row++){
            var id = data[row][0]
            var No_of_drugs = data[row][2]
            var ADR = data [row][3]
            var No_of_itmes = (Math.pow(2,No_of_drugs) - 1) * 3 + 4
            drugs_split(data[row][4])
            if(drugs_list.indexOf(searchDrug) > -1){
                for ( i =4; i<No_of_itmes && data[row][i]!=''; i=i+3){
                  /* Splitting the drug names to search for the specific drug*/
                      // console.log(drugs_list)
                      obj['name'] = data[row][i]
                      obj['support']= +data[row][i+1]
                      obj['Conf'] = +data[row][i+2]
                      list.push(obj)
                      obj ={}
                  }
                  // console.log( list)
                       // break;
                  plot(list, id, ADR, No_of_drugs)
                  list = []
              }
            drugs_list = [];
       }
     });

}
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
       var No_of_rules = Math.pow(2, No_of_drugs) - 2
       // console.log(No_of_drugs, No_of_rules,id)
       var flag =0;
       var end_sub_index=0;
       var check = No_of_drugs- 1;
       var angle = 360/ No_of_rules;
       var subrules_conf = [];
       var main_conf = find_Main_Conf(data)
       var max_sub_conf = find_Max_Conf(data)
       // console.log(main_radius)

       // origin = (main_conf + (2*max_sub_conf))/2


       // width= main_conf + (2*max_sub_conf)+ originX
       // height = main_conf + (2*max_sub_conf)+ originY
      text_location=  originY + (main_conf/2) + max_sub_conf

      // console.log(main_conf,2*max_sub_conf,  height, width)
      var svgContainer = d3.select("#middle_container")
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

       var arc =   d3.svg.arc()
                     .outerRadius(function(d,i){
                      // console.log(id, No_of_rules, No_of_drugs ,main_radius, d.Conf,d.Conf+main_radius );
                        if (i==0){
                             main_radius= d.Conf/2
                             // console.log(main_radius)
                             return 0
                        }
                        else if (i=!0){
                            
                            return d.Conf+main_radius
                        }
                     })  
                     .innerRadius(function(d,i){
                      // console.log(d,i)
                      if (i==0){

                             main_radius= d.Conf/2
                             // console.log(main_radius)
                             return 0
                        }
                        else 
                            return main_radius
                        
                     }) 
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
                     })

       var paths =  MainCirlce.append("path")
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
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style('fill', '#1e0ad3')
        .style("font-size","15px")
        .text( "Rank:   " + id); 
 }
 
 
function find_Max_Conf(data){
          /* slice:  to remove the main confidence to find the maximum of sub-rule's confidences*/
          var data = data.slice(1)
          // console.log(Math.max(...data.map(o => o.Conf)))
          return Math.max(...data.map(o => o.Conf));
}

function find_Main_Conf(data){
          return data[0].Conf
}


function drugs_split(str){
        /* To remove the square brackets from the drug names */
            str = str.replace(/[\[\]']+/g,'')
            str=  str.split(" ");

            for (i = 0; i < str.length; i++){
              drugs_list.push(str[i])
            }

          
}