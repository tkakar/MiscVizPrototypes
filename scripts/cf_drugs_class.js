var margin = {top: 20, right: 20, bottom: 30, left: 40},

width = 1200 - margin.left - margin.right,
height = 500- margin.top - margin.bottom,
Height = 700 - height;
var color = ['#016c59', '#d0d1e6', '#a6bddb', '#67a9cf', '#1c9099'];
var drugs_list=[];
var overall=[],drugs_list_no_duplicates = [];
var  obj={};
var nodes, matrix
var default_class;
/* Reading Interaction Data*/
var intr_data = [];
var class_array=[];
var drugs_with_classes={'name': [], 'class':"",'freq':0};
var classes_list, overall_classes =[];
var check = 0;
var c_data, i_data;


function initialize(){
  c_data = read_intr_data()
  i_data = read_class_data()
  // ready()
  // ready(c_data, i_data)
}

var ready = function(){

console.log(default_class)

  // console.log(c.size,i)
   
  //  // for (x =0; x< 10; x++){
  //  //  console.log(c[x])
  //  // }

  //   // plot_drugs_barchart (default_class)
  //   // plot()

};

function read_intr_data(){
  var i_data;
 d3.text("data/data.csv", function(unparsedData){
         var data = d3.csv.parseRows(unparsedData);
         for (var row=0; row<data.length;row++){
              var id = data[row][0]
              var score = data[row][1]
              var No_of_drugs = data[row][2]
              var ADR = data [row][3]
              var No_of_items = (Math.pow(2,No_of_drugs) - 1) * 3 + 4
              var drugs_comb = data[row][4]
              
              // console.log(drugs_list)
              if (No_of_drugs == 2){
                   
                  var x = drugs_split(drugs_comb)
                  // console.log(x)
                   obj['weight'] = +score;
                   obj['ADR'] = ADR;
                   obj['drug1'] = x[0];
                   obj['drug2'] =x[1];

                   // if (obj != {})
                     overall.push(obj)
              }
                  obj ={}
         }
            drugs_list_no_duplicates = remove_duplicates(drugs_list)
            set_data (overall);
            i_data= overall;
      });
    return overall;
}
/* Reading Drug Class Data*/

function set_data(data){
  // console.log(data).
      intr_data =  data;

}


// function set_class(data){
//   // console.log(data).
//       classed_data =  data;
//       // default_class = classes[0]


// }

function read_class_data(){
  var c_data;
  d3.text("data/drug_classes.csv", function(unparsedData){
         var data = d3.csv.parseRows(unparsedData);
          // drugs_with_classes['name']= new Array();

           // console.log(typeof(drugs_with_classes['name']))
         for (var row=1; row<data.length;row++){
              var drug_class = data[row][3].toLowerCase()
              var gen_name = data[row][2].toLowerCase()
              var brand_name = data[row][1].toLowerCase()
              var split_array=[]

              if (drugs_list_no_duplicates.indexOf(gen_name) != -1 ){
                   split_class =  split_classes (drug_class)
                    
                    for (i =0; i< split_class.length;i++) {
                      // console.log(split_class, split_class[i], i, row)
                        if (overall_classes.length<1){
                                drugs_with_classes['class'] = split_class[i]
                                drugs_with_classes['name'].push(gen_name)
                                drugs_with_classes['freq'] = 1;
                        }
                       
                        else{

                                // console.log( split_class[i], row)
                                for (x in overall_classes){
                                      if (overall_classes[x].class == split_class[i]){
                                        // console.log( "split_class")
                                        
                                        if ((overall_classes[x].name.indexOf(gen_name) === -1)) {
                                          overall_classes[x].freq= overall_classes[x].freq + 1
                                          overall_classes[x]['name'].push (gen_name);
                                        }
                                            
                                       check = 1
                                       break;
                                      }
                                }

                                  
                               if (check !=1){
                                  // console.log( split_class[i], row)
                                  drugs_with_classes['class'] = split_class[i]
                                  if ((drugs_with_classes['name'].indexOf(gen_name) === -1))
                                      drugs_with_classes['name'].push(gen_name);
                                  drugs_with_classes['freq'] = 1;
                              }

                        }
                         if(drugs_with_classes.class!=""){
                         overall_classes.push(drugs_with_classes)
                         drugs_with_classes={'name': [], 'class':"",'freq':0};}
                          // else
                          //   console.log(split_class)
                          check = 0
                    }
            }
            // if (row==115 ){
            //   break;
            // }
      }
            // console.log(overall_classes.length)
             /*Some classes had same list of drugs so to remove those duplicate classes*/ 

            overall_classes= remove_dup_object (overall_classes, "name")
                        // console.log(overall_classes.length)  
            plot_classes(overall_classes) 
            plot_drugs_barchart (overall_classes[10])
            // set_class(overall_classes[10].name)
            createAdjacencyMatrix (drugs_list_no_duplicates, intr_data ,overall_classes[10].name )
            plot_interactions_table(overall_classes[10].name)
            // c_data = overall_classes
            // default_class = overall_classes[10]
  });

// console.log(default_class)
return overall_classes;
}

function plot_classes(data){
  
  // console.log(data)

          var x = d3.scale.ordinal().rangeRoundBands([0,width-margin.left-margin.right],0.1);
          var y =  d3.scale.linear().range([height-margin.bottom-margin.top, 0]);


          x.domain(data.map(function(d) {
            // console.log(d, d.class)
           return d.class; }));
     
         y.domain([0,d3.max(data.map(function(d) { return d.freq; }))])

         var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    // .ticks(No_of_rules+1)
                    .tickValues([]);

         var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(5)
                    // .tickFormat(d3.format(".2s"))
                    // .innerTickSize(-width+margin.left+margin.right)
                    // .outerTickSize(0);


          var svg = d3.select("#drug_classes")
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
              // .style("text-anchor", "end")
              .style("font-size", "10px")
              .attr("dx", 5)
              .attr("dy", 1000)
              .attr("transform", "translate(15,15) rotate(-90)");

          svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              .selectAll("text")
              // .style("text-anchor", "end")
              .style("font-size", "15px");                        

          svg.selectAll("g")
              .data(data)
              .enter()
              .append('rect')
              .attr('width', function(d) { 
                // console.log(x1.rangeBand(d)/2)
                   return x.rangeBand()
              }) 
              .attr('height', function(d) { return height - margin.top-margin.bottom - y(d.freq); }) 
              .attr('x', function(d){ 
                return  x(d.class)-80; 
              })
              .attr('y', function(d) { 
                // console.log(d)
                return y(d.freq);  
              })
              .style("fill",'#67a9cf')
              // .on("mouseover", function(d){
              //   d3.select(this).style("fill", "#016c59");
              // })
              .on("mousemove", function(d){
                    // d3.select(this).style("fill", "#67a9cf");
                    div.style("left", d3.event.pageX+10+"px");
                    div.style("top", d3.event.pageY-25+"px");
                    div.style("display", "inline-block");
                    div.html(d.class);
                })
                .on("mouseout", function(d){
                    div.style("display", "none");
                }) 

                // return "translate(" + x1(d.name) + ",0)"; });
            
                 d3.selectAll("#drug_classes rect").on("click", function(d, i){
                       d3.selectAll("#drug_classes rect").style("fill",'#67a9cf')
                       d3.select(this).style("fill", "#016c59");

                       plot_drugs_barchart(d)
                       // console.log( d.name[0])
                       createAdjacencyMatrix (drugs_list_no_duplicates,intr_data, d.name)
                       plot_interactions_table(d.name[0])

    });
                  
                  // console.log(default_class)
}


function plot_drugs_barchart(data){
  // console.log(data)
      d3.selectAll("#drugs svg").remove();
          var width = 500,
          height = 300;

          // console.log(data);
          var x = d3.scale.ordinal().rangeRoundBands([0,width-margin.left-margin.right],0.1);
          var y =  d3.scale.linear().range([height-margin.bottom-margin.top, 0]);


          // x.domain(data.map(function(d,i) { console.log(d, i);return d[name]; }));
          x.domain(data.name.map(function(d,i) {  return d; }));
     
         y.domain([0,30])

         var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")


         var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(5)


          var svg1 = d3.select("#drugs")
                      .append("svg")
                      .attr("width", width)
                      .attr("height", height)
                      .append("g")
                      .attr("transform", "translate("+ margin.left + "," + margin.top + ")")

          var div = d3.select("body")
                  .append("div")
                  .attr("class", "toolTip");
                
          svg1.append('g')
              .attr('class', 'x axis')
              .attr("transform", "translate(0, "+ (height-margin.bottom-margin.top)+")")
              .call(xAxis)
              .selectAll("text")
              // .style("text-anchor", "end")
              .style("font-size", "10px")
              .attr("dx", 5)
              .attr("dy", -10)
              .attr("transform", "translate(15,15) rotate(0)");

          svg1.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              .selectAll("text")
              // .style("text-anchor", "end")
              .style("font-size", "15px");                        

          svg1.selectAll("rect")
              .data(data.name)
              .enter()
              .append('rect')
              .attr('width',function(d) { 
                // console.log( d)
                   return x.rangeBand()/2;
              }) 
              .attr('height', function(d) { return 50; }) 
              .attr('x', function(d){ 
                return  x(d); 
              })
              .attr('y', function(d,i) { 
                // console.log(d)
                return height - 100;  
              })
              .style("fill","#016c59")
              .on("mousemove", function(d){
                    div.style("left", d3.event.pageX+10+"px");
                    div.style("top", d3.event.pageY-25+"px");
                    div.style("display", "inline-block");
                    div.html(d);
                })

                .on("mouseout", function(d){
                    div.style("display", "none");
                });   

        d3.selectAll("#drugs rect").on("click", function(d, i){
        d3.select(this).style("fill", '#1c9099');
        plot_interactions_table(d);
        // plot()
       
      });


}

function  plot_interactions_table(data){

  // if (typeof(data == "object")){


  // }
  // console.log(data, typeof(data))
  d3.selectAll("#detail_table tr").remove();

    var filtered_data = []
    var i_len = intr_data.length

    for (i = 0, j=0; i< i_len; i++){
      // console.log(i, intr_data[i], data)
          if (intr_data[i].drug1.toLowerCase() == data || intr_data[i].drug2.toLowerCase() == data){
            // console.log(i, "hi", intr_data[i].drug1,intr_data[i].drug2 )
                // if (filtered_data.drug1.indexOf(data) === -1 || filtered_data.drug2.indexOf(data) === -1 )
                    filtered_data.push(intr_data[i])
          }
    }

       // console.log(intr_data[0] )

       // filtered_data = remove_dup_object(filtered_data, "id")
        var thead = d3.select("thead").selectAll("th")
                      .data(d3.keys(filtered_data[0]))
                      .enter().append("th").text(function(d){return d});
        // fill the table
        // create rows
        var tr = d3.select("tbody").selectAll("tr")
                   .data(filtered_data).enter().append("tr")
        // cells
        var td = tr.selectAll("td")
                  .data(function(d){    return d3.values(d)})
                  .enter().append("td")
                  .text(function(d) {return d})
                  // .style ("fill", "#808284")
}

function createAdjacencyMatrix(nodes_data,edges, classes) {
  classed_data = classes
      // console.log(edges, nodes_data)
         var class_drug_list=[],
         intr_drug_list=[]
         var drug_list_to_object ={}
         var class_nodes;
         // console.log(nodes_data[258])
         for (var i = 0; i<nodes_data.length; i++){
                       // console.log(classed_data.indexOf(nodes_data[i]))
                    if (classed_data.indexOf(nodes_data[i]) != -1){
                    drug_list_to_object['id'] =nodes_data[i]
                    class_drug_list.push(drug_list_to_object)
                    drug_list_to_object={}
                    }

         }

         class_nodes = class_drug_list
          // console.log(classed_data)
          var edgeHash = {};
          // console.log(nodes)
          var edges_len = edges.length
          // console.log(edges_len, edges, edges[1798])
          for (x in edges) {
            // console.log(edges[x])
            // console.log(classed_data, edges[x].drug1, edges[x].drug2)
              if(classed_data.indexOf(edges[x].drug1) != -1 ){

                // console.log(edges[x].drug1, edges[x].drug2)
                  var id = edges[x].drug1 + "-" + edges[x].drug2;
                  edgeHash[id] = edges[x];

                  drug_list_to_object['id'] =edges[x].drug2
                        intr_drug_list.push(drug_list_to_object)
                        drug_list_to_object={}
                  // console.log(intr_drug_list)
               }
               else if(classed_data.indexOf(edges[x].drug2) != -1){
                // console.log(edges[x])

                var id = edges[x].drug2 + "-" + edges[x].drug1;
                  edgeHash[id] = edges[x];

                  drug_list_to_object['id'] =edges[x].drug1
                        intr_drug_list.push(drug_list_to_object)
                        drug_list_to_object={}

               }
          }
          nodes = remove_dup_object (intr_drug_list, "id")
          // nodes = intr_drug_list
          // console.log(  edgeHash)
           matrix = [];
          //create all possible edges
          for (a in class_nodes) {
            for (b in nodes) {
              // if(classed_data.indexOf(nodes[a].id) != -1){
              var grid = {id: class_nodes[a].id + "-" + nodes[b].id, x: b, y: a, weight: 'abc', ADR:''};
              // console.log(edgeHash, grid.id)
                  if (edgeHash[grid.id]) {
                    grid.weight = edgeHash[grid.id].weight;
                    // console.log(grid.weight)
                    grid.ADR = edgeHash[grid.id].ADR
                     
                  }
              matrix.push(grid);

            // }
              
            }
          }
          // console.log(matrix)
          plot(matrix, class_nodes,nodes)
}

function plot(matix, class_nodes,nodes){
  // if (hh) console.log(hh)
  // console.log(matix, class_nodes,nodes)
  var rect_size = 40

  d3.selectAll("#matrix_plot svg").remove();


        var div = d3.select("body")
                  .append("div")
                  .attr("class", "toolTip");

        var svg_container = d3.select("#matrix_plot")
                              .append("svg")
                              .attr("width", 800)
                              .attr("height", 400);

         // <svg style="width:1650px;height:1650px;border:1px lightgray solid;" > </svg>
         svg_container.append("g")
                      .attr("transform", "translate(150,150)")
                      .attr("id", "adjacencyG")
                      .selectAll("rect")
                      .data(matrix)
                      .enter()
                      .append("rect")
                      .attr("width", rect_size)
                      .attr("height", rect_size)
                      .attr("x", function (d) {return d.x * rect_size})
                      .attr("y", function (d) {return d.y * rect_size})
                      .style("stroke", "#808284")
                      .style("stroke-width", "1px")
                      .style("fill", function (d) {
                        // console.log(d.weight, d)
                            if (d.weight !== 'abc') {

                                if (+d3.round(d.weight ,3) < 0) {
                                  return "#99d8c9";
                                }
                                else 
                                  return "rgb(20,108,69)";
                            }
                            else
                              return "#eff0f2"
                      })
              //  .style("fill-opacity", function (d) {    return +d3.round(d.weight , 1)})
              .on("click", show_Glyph)
              .on("mousemove", function(d){
                  div.style("left", d3.event.pageX+10+"px");
                  div.style("top", d3.event.pageY-25+"px");
                  div.style("display", "inline-block");
                  div.html((d.id));
              })

              .on("mouseout", function(d){
                  div.style("display", "none");
              });
              // console.log(nodes, class_nodes)
              if (nodes && class_nodes){
                  var x_scaleSize = nodes.length * rect_size;
                  var y_scaleSize = class_nodes.length * rect_size;
                  var x_scale = d3.scale.ordinal().domain(nodes.map(function (el) {  return el.id})).rangePoints([0,x_scaleSize],1);
                  var y_scale = d3.scale.ordinal().domain(class_nodes.map(function (el) {  return el.id})).rangePoints([0,y_scaleSize],1);


                  xAxis = d3.svg.axis().scale(x_scale).orient("top").tickSize(4);    
                  yAxis = d3.svg.axis().scale(y_scale).orient("left").tickSize(4);    
                  d3.select("#adjacencyG").append("g").call(xAxis).selectAll("text").style("text-anchor", "end").style ('font-size', 14).attr("transform", "translate(-25,-5) rotate(90)");
                  d3.select("#adjacencyG").append("g").call(yAxis); //.selectAll("text").style("text-anchor", "end").style ('font-size', 14).attr("transform", "translate(0,0) rotate(0)");
              }
              
              function gridOver(d,i) {
                d3.selectAll("rect").style("stroke-width", function (p) {return p.x == d.x || p.y == d.y ? "3px" : "1px"})
                
              }
      }

initialize();

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




function remove_dup_object(obj_array, para){

      var len=obj_array.length;
      // console.log(len, para)
      var arr =[];

      for ( var i=0 ; i < len; i++ )
          arr[obj_array[i][para]] = obj_array[i];

      obj_array = new Array();
      for ( var key in arr )
          obj_array.push(arr[key]);

      // console.log(obj_array, obj_array.length)

      return obj_array

}



function drugs_split(str){

        /* To remove the square brackets from the drug names */
            str = str.replace(/[\[\]']+/g,'')
            str=  str.split(" ");
            drugs_list.push (str[0].toLowerCase())
            drugs_list.push(str[1].toLowerCase())
            return [str[0].toLowerCase(),str[1].toLowerCase() ]
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

function split_classes(array){
    var class_split_array=[];
      if (array.length > 0){
            for (j=0; j< array.split(",").length; j++){
               // console.log(array.split(",")[j])
                 drug_class = array.split(",")[j]
                 // console.log(drug_class)
                 class_split_array.push(drug_class)
            }
      }

    return class_split_array
}

function show_Glyph(d){
      console.log(d)


}