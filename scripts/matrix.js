/* Adjacency Matrix */


var color = ['#016c59', '#d0d1e6', '#a6bddb', '#67a9cf', '#1c9099'];
var drugs_check =0;
var obj = {};
var list = [];
var overall = [];
var drugs_list = [];

/* matrix_data is the smaller file , while data is the huge file */
    d3.text("data/matrix_data.csv", function(unparsedData)
      {
       var data = d3.csv.parseRows(unparsedData);
       for ( var row=0; row<data.length;row++){
            var id = data[row][0]
            var score = data[row][1]
            var No_of_drugs = data[row][2]
            var ADR = data [row][3]
            var No_of_items = (Math.pow(2,No_of_drugs) - 1) * 3 + 4
            var drugs_comb = data[row][4]

            // console.log(drugs_comb)
            if (No_of_drugs == 2){
                 drugs_split(drugs_comb)
                 obj['weight'] = +score
            }
                overall.push(obj)
                obj ={}
       }
       // console.log(overall)
       var drugs_list_no_duplicates = remove_duplicates(drugs_list)
       // console.log(drugs_list_no_duplicates)
       createAdjacencyMatrix (drugs_list_no_duplicates, overall)
    });

    function createAdjacencyMatrix(nodes_data,edges) {
         var drugs_list=[]
         var drug_list_to_object ={}

         for (var i = 0; i<nodes_data.length; i++){
                      // console.log(i)
                    drug_list_to_object['id'] =nodes_data[i]
                    drugs_list.push(drug_list_to_object)
                    drug_list_to_object={}
         }

          var nodes = drugs_list
          var edgeHash = {};

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
              var grid = {id: nodes[a].id + "-" + nodes[b].id, x: b, y: a, weight: 0};
              if (edgeHash[grid.id]) {
                grid.weight = edgeHash[grid.id].weight;
              }
              matrix.push(grid);

            }
          }
        // console.log(matrix)

        var div = d3.select("body")
                  .append("div")
                  .attr("class", "toolTip");


        d3.select("svg")
              .append("g")
              .attr("transform", "translate(250,250)")
              .attr("id", "adjacencyG")
              .selectAll("rect")
              .data(matrix)
              .enter()
              .append("rect")
              .attr("width", 20)
              .attr("height", 20)
              .attr("x", function (d) {return d.x * 20})
              .attr("y", function (d) {return d.y * 20})
              .style("stroke", "black")
              .style("stroke-width", "1px")
              .style("fill", "red")
              .style("fill-opacity", function (d) {   return +d3.round(d.weight , 1)})
              .on("mouseover", gridOver)
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
              
              xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);    
              yAxis = d3.svg.axis().scale(nameScale).orient("left").tickSize(4);    
              d3.select("#adjacencyG").append("g").call(xAxis).selectAll("text").style("text-anchor", "end").style ('font-size', 10).attr("transform", "translate(-10,-10) rotate(90)");
              d3.select("#adjacencyG").append("g").call(yAxis).selectAll("text").style("text-anchor", "end").style ('font-size', 10);
              
              function gridOver(d,i) {
                d3.selectAll("rect").style("stroke-width", function (p) {return p.x == d.x || p.y == d.y ? "3px" : "1px"})
                
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
