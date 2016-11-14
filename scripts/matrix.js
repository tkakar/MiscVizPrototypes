/* Adjacency Matrix */
var color = ['#016c59', '#d0d1e6', '#a6bddb', '#67a9cf', '#1c9099'];
var drugs_check =0;
var obj = {};
var list = [];
var overall = [];
var drugs_list = [];
var search_check=0
var searchDrug=""
var matrix, nodes;
    
window.onload = function load_glyphs(){
  d3.selectAll("#matrix_plot > *").remove();
  read_data() 
  drugs_monitored() 
}

d3.select('#search_txbox').on('change', function() {

    d3.select("h2").text("Graph for searched Drug: " + this.value);
    searchDrug = this.value
    search_check = 1
    d3.selectAll("#matrix_plot > *").remove();
    read_data()
});

function drugs_monitored(){
         var drugs_mont= ['AVANDIA', 'NEXIUM', 'ALCOHOL', 'HUMIRA']
         var svg_container = d3.select("#drugs_div")
                              .append("svg")
                              .attr("width", 100)
                              .attr("height", 400);

         var drug_rects = svg_container.selectAll("g")
              .data(drugs_mont)
              .enter()
              .append("g")

          drug_rects.append("rect")
                    // .attr("transform", "translate(10,10)")
                    .attr("width", 90)
                    .attr("height", 40)
                    .attr("x", function(d,i){ return 10})
                    .attr("y", function(d,i){ return i*40})
                    .style("stroke", "#808284")
                    .style("stroke-width", "1px")
                    .style("fill", "orange")

          var rect_text = drug_rects.append("text")
                    .attr("x", 40)
                    .attr("y", function (d,i){
                      return (i * 40) + 20 })
                    .attr("text-anchor", "middle")
                    .style('fill', '#1e0ad3')
                    .style("font-size","10px")
                    .text(function (d){
                      return d})
                    .on("click", function(d){
                         // console.log(d)
                       d3.selectAll("#matrix_plot > *").remove();
                       plot(matrix, nodes, d)
                    });
 }

/* matrix_data is the smaller file , while data is the huge file */

function read_data(){
   d3.text("data/data.csv", function(unparsedData)
        {
         var data = d3.csv.parseRows(unparsedData);
         for ( var row=0; row<data.length;row++){
              var id = data[row][0]
              var score = data[row][1]
              var No_of_drugs = data[row][2]
              var ADR = data [row][3]
              var No_of_items = (Math.pow(2,No_of_drugs) - 1) * 3 + 4
              var drugs_comb = data[row][4]
              
              // console.log(drugs_list)
              if (No_of_drugs == 2){
                   drugs_split(drugs_comb)
                   obj['weight'] = +score
                   obj['ADR'] = ADR
              }
                  overall.push(obj)
                  obj ={}
         }
         // console.log(overall)
         var drugs_list_no_duplicates = remove_duplicates(drugs_list)
         // console.log(drugs_list_no_duplicates)
         createAdjacencyMatrix (drugs_list_no_duplicates, overall)
      });
}
    
function createAdjacencyMatrix(nodes_data,edges) {
      // console.log(edges, nodes_data)
         var drug_list=[]
         var drug_list_to_object ={}

         for (var i = 0; i<nodes_data.length; i++){
                      // console.log(i)
                    drug_list_to_object['id'] =nodes_data[i]
                    drug_list.push(drug_list_to_object)
                    drug_list_to_object={}
         }
          nodes = drug_list
          var edgeHash = {};
          // console.log(nodes)
          for (x in edges) {
            // console.log(x)
            var id = edges[x].source + "-" + edges[x].target;
            edgeHash[id] = edges[x];
            // console.log(id, edgeHash[id])
          }
           matrix = [];
          //create all possible edges
          for (a in nodes) {
            for (b in nodes) {
              var grid = {id: nodes[a].id + "-" + nodes[b].id, x: b, y: a, weight: 'abc', ADR:''};
              if (edgeHash[grid.id]) {
                grid.weight = edgeHash[grid.id].weight;
                grid.ADR = edgeHash[grid.id].ADR
              }
              matrix.push(grid);

            }
          }
          // console.log(matrix)
          plot(matrix, nodes)
}

function plot(matix, nodes,hh){
  // if (hh) console.log(hh)

        var div = d3.select("body")
                  .append("div")
                  .attr("class", "toolTip");

        var svg_container = d3.select("#matrix_plot")
                              .append("svg")
                              .attr("width", 1600)
                              .attr("height", 1600);

         // <svg style="width:1650px;height:1650px;border:1px lightgray solid;" > </svg>
         svg_container.selectAll("g")
              .data(matrix)
              .enter()
              .append("rect")
              .attr("transform", "translate(10,10)")
              .attr("width", 5)
              .attr("height", 5)
              .attr("x", function (d) {return d.x * 5})
              .attr("y", function (d) {return d.y * 5})
              .style("stroke", "white")
              .style("stroke-width", "1px")
              .style("fill", function (d) {
                    if (d.weight !== 'abc') {
                        if (+d3.round(d.weight ,3) < 0) {
                          return "red";
                        }
                        else 
                          return "rgb(20,108,69)";
                        // {
                            // if (hh || search_check==1){
                            //   // console.log(d.id.search(hh), d.id.search(searchDrug))
                            //   if ((hh!= undefined && d.id.search(hh) != -1 )|| (d.id.search(searchDrug) !=-1)){
                            //     console.log(hh, d.id.search(hh));
                            //     return "blue";
                            //   } 
                            //   else 
                            //     return "rgb(20,108,69)";
                            // } 
                            // else {
                                // return "rgb(20,108,69)";
                            // }
                        // }

                    }
                    else{
                      // console.log(d.id.search(hh), hh)
                      if ((hh!= undefined && d.id.search(hh) != -1 )|| (search_check == 1 && d.id.search(searchDrug) !=-1))
                        return "orange"
                      else
                            return "#eff0f2";
                    }
                      
                           
                
                    //     if ( d.id.search(hh) !=-1 || (search_check==1 && d.id.search(searchDrug) !=-1)  )
                    //       // {console.log(hh || (search_check==1 && d.id.search(searchDrug) !=-1))
                    //       return "orange"
                    //     // if (hh)
                    //     //   return "orange"
                    //     else
                    //       return "white"
                    // }
              })
              // .style("fill-opacity", function (d) {    return +d3.round(d.weight , 1)})
              .on("click", showDetail)
              .on("mousemove", function(d){
                  div.style("left", d3.event.pageX+10+"px");
                  div.style("top", d3.event.pageY-25+"px");
                  div.style("display", "inline-block");
                  div.html((d.id));
              })

              .on("mouseout", function(d){
                  div.style("display", "none");
              });

              var scaleSize = nodes.length * 20;
              var nameScale = d3.scale.ordinal().domain(nodes.map(function (el) {  return el.id})).rangePoints([0,scaleSize],1);
              
              // xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);    
              // yAxis = d3.svg.axis().scale(nameScale).orient("left").tickSize(4);    
              // d3.select("#adjacencyG").append("g").call(xAxis).selectAll("text").style("text-anchor", "end").style ('font-size', 10).attr("transform", "translate(-10,-10) rotate(90)");
              // d3.select("#adjacencyG").append("g").call(yAxis).selectAll("text").style("text-anchor", "end").style ('font-size', 10);
              
              function gridOver(d,i) {
                d3.selectAll("rect").style("stroke-width", function (p) {return p.x == d.x || p.y == d.y ? "3px" : "1px"})
                
              }
      }

      function showDetail(d,i){
        d3.selectAll("#detail_Drug > *").remove();
        d3.selectAll("#detail_ADR > *").remove();
        d3.selectAll("#detail_Score > *").remove();

        if (d.weight=='abc'){
          d3.select("#detail_Drug")
            .append("text")
            .attr("x",200)
            .attr("y", "15px")
            .attr("text-anchor", "middle")
            .style('fill', '#1e0ad3')
            .style("font-size","15px")
            .text( "No interaction found")
        }
        else
        {
          // console.log(d,i)
            d3.select("#detail_Drug")
              .append("text")
              .attr("x",200)
              .attr("y", "15px")
              .attr("text-anchor", "middle")
              .style('fill', '#1e0ad3')
              .style("font-size","15px")
              .text( "Drugs:   " + d.id )

          // console.log(d,i)
          
            d3.select("#detail_ADR")
              .append("text")
              .attr("x",200)
              .attr("y", "15px")
              .attr("text-anchor", "middle")
              .style('fill', '#1e0ad3')
              .style("font-size","15px")
              .text( "Adverse Reactions:   " + d.ADR )


            d3.select("#detail_Score")
              .append("text")
              .attr("x",200)
              .attr("y", "15px")
              .attr("text-anchor", "middle")
              .style('fill', '#1e0ad3')
              .style("font-size","15px")
              .html( "Score:   " + "<br/>" + d.weight )
        }

      }




    function drugs_split(str){

        /* To remove the square brackets from the drug names */
            str = str.replace(/[\[\]']+/g,'')
            str=  str.split(" ");

            obj['source'] = str[0]
            obj['target'] = str[1]

            drugs_list.push (str[0])
            drugs_list.push(str[1])
    }

      
    function remove_duplicates(data){
                // console.log(data)
                /* To remove the duplicate drug names */
        uniqueArray = data.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
        })
        // console.log(uniqueArray)
        return uniqueArray
        
    }




