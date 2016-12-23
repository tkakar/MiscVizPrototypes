var rules_data, reports_data;
d3.tsv("data/rules_ids_c.txt", function(data){

     data.map(function(d,i){
             // console.log(d,i)
          var charArr =[];
           charArr.push(d.id.split(','));
           // console.log(d.id, charArr)
           d.id = charArr
           
      })

      var row_data = d3.nest()
                        .key(function(d) {// console.log(d)
                          return d.Drug1 })
                        .key(function(d){return d.Drug2;})
                        .entries(data);

      set_rules_data(row_data);          
})

d3.tsv("data/Q4_2014.txt", function(data){
  var row_data = d3.nest()
                    .key(function(d) {  // console.log(d)
                      return d.primaryId })
                    .entries(data);
  set_report_data(row_data);
  // console.log(row_data)
})

function set_rules_data(data){
    if (data!== undefined || data !==null){
          if (data.keys){
            // console.log(data[0].values)
            rules_data= data
            // console.log(all_data)
          }
    }
    plot(rules_data)
}

function set_report_data(data){
    if (data!== undefined || data !==null){
          if (data.keys){
            // console.log(data[0].values)
            reports_data= data
            // console.log(all_data)
          }
    }

    // showReport(reports_data)
}


function plot(data){
  // console.log(data)

        var drug1_svg = d3.select("#div_drug1")
                            .attr("class", "left style_div")
                            .append("svg")
                            .attr("width", 120)
                            .attr("height", 1500)
                           

        var drug1_rects =   drug1_svg.selectAll("g")
                            .data(data)
                            .enter()
                            .append("g")
                            .on ('click',show_div_drug2);                

        var rect_text_height = 20;
                            drug1_rects.append("rect") 
                                   .attr("width", 120)
                                   .attr("height",rect_text_height)
                                   .attr("x", function(d,i){ return 0})
                                   .attr("y", function(d,i){ return i*rect_text_height})
                                   .style("fill", "white")
                                   // .style("stroke", "#808284")
                                   

          var rect_text = drug1_rects.append("text")
                                    .attr("x", 0)
                                    .attr("y", function (d,i){
                                      if (i==0){
                                        return rect_text_height - 5;
                                      }
                                      else
                                        return ((i+1 ) * rect_text_height)-5 })
                                    // .attr("text-anchor", "middle")
                                    .style('fill', 'black')
                                    .style("font-size","12px")
                                    .text(function(d, i) {
                                      // console.log(d,i)
                                      return d.key.toUpperCase().replace('[','').replace(']','');
                                    })
}

var drug1_clicked = null;
function show_div_drug2(d,i){

      d3.select("#div_drug2").attr("class", "left style_div")
      d3.select("#div_ADR").attr("class", "left")
      d3.select("#div_Ids").attr("class", "left")
      d3.selectAll("input[name='nl']").property("checked", true)
      d3.selectAll("input[name='radial']").property("checked", false)

      var data = d;

      d3.selectAll("#div_drug1 rect").style("fill","white")
      d3.select(this).select("rect").style("fill","#4586ef")
      drug1_clicked = d3.select(this).select("rect")

      d3.selectAll("#div_drug2 > *").remove();
       d3.selectAll("#div_ADR > *").remove();
       d3.selectAll("#div_Ids > * ").remove();
       d3.selectAll("#div_report > *").remove();
   

      var drug2_svg = d3.select("#div_drug2").append("svg")
                            .attr("width", 120)
                            .attr("height", 500)
                            // .attr("border", 1)
                           

        var drug2_rects =   drug2_svg.selectAll("g")
                            .data(d.values)
                            .enter()
                            .append("g")
                            .on ('click',show_div_ADR);                

        var rect_text_height = 20;
                            drug2_rects.append("rect") 
                                   .attr("width", 120)
                                   .attr("height",rect_text_height)
                                   .attr("x", function(d,i){ return 0})
                                   .attr("y", function(d,i){ return i*rect_text_height}) 
                                   .style("fill", "white")
                                   // .style("stroke", "#808284")
                                   

          var rect_text = drug2_rects.append("text")
                                    .attr("x", 0)
                                    .attr("y", function (d,i){
                                    if (i==0){
                                        // console.log(rect_text_height)
                                        return rect_text_height - 5; 
                                      }
                                      else
                                        return ((i+1 ) * rect_text_height) -5; })
                                    .style('fill', 'black')
                                    .style("font-size","12px")
                                    .text(function(d, i) {
                                      // console.log(d,i)
                                      return d.key.toUpperCase().replace('[','').replace(']','');
                                    })

        draw_tree(d);     

        d3.selectAll('input').on('change', function() {
          d3.selectAll("#div_report > *").remove();

          console.log(this.value)
          if (this.value=='radial'){
            draw_radial_tree(d);
            d3.selectAll("input[name='nl']").property("checked", false)
      
          }
            
          else {
            d3.selectAll("input[name='radial']").property("checked", false)
            draw_tree(d);
          }
            
        });

}

var drug2_clicked=null
function show_div_ADR(d,i){    
      var data = d;
      d3.select("#div_ADR").attr("class", "left style_div")   
      d3.select("#div_Ids").attr("class", "left")  
      // d3.select("#div_ADR").attr("class", "left")

      d3.selectAll("#div_drug2 rect").style("fill","white")
      d3.select(this).select("rect").style("fill","#4586ef")
      drug1_clicked.style("fill","#a6bddb")

      drug2_clicked = d3.select(this).select("rect")

       d3.selectAll("#div_ADR > *").remove();
       d3.selectAll("#div_Ids > * ").remove();
       d3.selectAll("#div_report > *").remove();

       var ADR_svg = d3.select("#div_ADR").append("svg")
                            .attr("width", 120)
                            .attr("height",500)
                           

        var ADR_rects =   ADR_svg.selectAll("g")
                            .data(d.values)
                            .enter()
                            .append("g")
                            .on ('click',show_div_Id);                

        var rect_text_height = 20;
                            ADR_rects.append("rect") 
                                   .attr("width", 120)
                                   .attr("height",rect_text_height)
                                   .attr("x", function(d,i){ return 0})
                                   .attr("y", function(d,i){ return i*rect_text_height})
                                   .style("fill", "white")
                                   // .style("stroke", "#808284")
                                   

          var rect_text = ADR_rects.append("text")
                                    .attr("x", 0)
                                    .attr("y", function (d,i){
                                      if (i==0){
                                        return rect_text_height - 5;
                                      }
                                      else
                                        return ((i+1 ) * rect_text_height)-5 })
                                    // .attr("text-anchor", "middle")
                                    .style('fill', 'black')
                                    .style("font-size","12px")
                                    .text(function(d, i) {
                                      // console.log(d,i)
                                      return d.ADR.toUpperCase();
                                    }) 
}
var ADR_clicked=null;

function show_div_Id(d,i){
        ADR_clicked = d3.select(this).select("rect")

        d3.select("#div_Ids").attr("class", "left style_div")     
        // d3.select("#div_ADR").attr("class", "left")

        d3.selectAll("#div_ADR rect").style("fill","white")
        d3.select(this).select("rect").style("fill","#4586ef")
        drug2_clicked.style("fill","#a6bddb")

        d3.selectAll("#div_Ids > * ").remove();
        d3.selectAll("#div_report table").remove();

       if(d.values){

            // console.log("if", d.values)

            if (d.values.length > 1){
              // console.log(d.values[0], d.values[0].id)
             var id_length = d.values[0].id.length
             // console.log(id_length)

             if (id_length> 1)
                d =  d.values[0].id; 
              else
                d= d.values[0]
            }
            else
                d=d.values[0]                 

            if (d.id[0].length>1){
                    d= d.id[0]
                    // console.log("if", d)
                    var Id_links = d3.select("#div_Ids")
                                     .selectAll("text")
                                     .data(d)
                                     .enter()
                                     .append("text")
                                                // .attr("href", show_div_ADR)
                                     .text(function(d,i){
                                      console.log(d)
                                      return d + "\n"
                                      // return d.id
                                     })
                                     .style("font-size","12px")
                                     .style("text-anchor", "middle")
                                     .on('click', plot_report_table);
              }
              else{
                // console.log('else')

                    var Id_links = d3.select("#div_Ids")
                                     .append("text")
                                                // .attr("href", show_div_ADR)
                                     .text(d.id)
                                     .style("font-size","12px")
                                     .style("text-anchor", "middle")
                                     .on('click', plot_report_table);
                          // }

              }
       }
       else{
          // console.log("else",d)

          if (d.id[0].length>1){
             d= d.id[0]
             var Id_links = d3.select("#div_Ids")
                        .selectAll("text")
                        .data(d)
                        .enter()
                        .append("text")
                        .text(function(d, i) {
                              return d//.split(",").join("\n")
                        })
                        .style("font-size","12px")
                        .style("text-anchor", "middle")
                        .on('click', plot_report_table);

            Id_links.insert("br",":first-child");
          }
          else{
              var Id_links = d3.select("#div_Ids")
                          .append("text")
                          .text(d.id)//.split(",").join("\n"))
                          .style("font-size","12px")
                          .style("text-align", "center")
                          .on('click', plot_report_table);

              Id_links.insert("br",":first-child");

          }
              
       }
}

function  plot_report_table(){

            // console.log(Id_clicked)

      d3.selectAll("#div_Ids text").style("background-color","white");
      d3.select(this).style("background-color","#4586ef");
      ADR_clicked.style("fill","#a6bddb");
      // console.log("Hi")
       d3.selectAll("#div_report *").remove();
      

        
      var id = d3.select(this).text();
      // console.log(id, typeof(id))
      reports_data.forEach(function (d){
            if (id.toString().indexOf(d.key) !== -1){

                  console.log(id, d.key, id.indexOf(d.key), d)
                  d= d.values[0]

                  data = Object.keys(d).map(function(k) { return {key:k, value:d[k]} })

                  console.log(data)

                  var table = d3.select("#div_report").append("table")
                            .attr("style", "margin: 20px; border: 2px"),

                        thead = table.append("thead"),
                        tbody = table.append("tbody");

                    // append the header row
                    // thead.append("tr")
                    //     .selectAll("th")
                    //     .data(["Field", "Value"])
                    //     .enter()
                    //     .append("th")
                    //         .text(function(d) { console.log(d);return d; });


                    // create a row for each object in the data
                    var rows = tbody.selectAll("tr")
                        .data(data)
                        .enter()
                        .append("tr");
                        ///add the key in first td
                        rows.append("td")
                      .text(function(d) { ;return d.key; });

                    rows.append("td")
                              .append("text")
                              .text(function(d) { console.log(d.value); return d.value; });  
            }

            // else {
            //       d3.select("#div_report")
            //         .append("text")
            //         .text("Report not found")


            // }
      })
       
}
// d3.selectAll("#div_report *").remove();


function draw_radial_tree(data){

        var treeData2 = { "name": data.key, "children":
                      data.values.map(function(drugs){
                          return { "name": drugs.key, "children": 
                            drugs.values.map( function(ADRs){
                              // console.log(ADRs)
                               return { "name": ADRs.ADR
                               }; //end of ADR
                            }) //end of ADRs
                          } //end of drug_Values 
                      })  //end of drugs
                    }  // end of root key
      console.log(treeData2)

      var diameter = 860;

      var margin = {top: 20, right: 120, bottom: 20, left: 120},
          width = diameter,
          height = diameter;
          
      var i = 0,
          duration = 350,
          root;

      var tree = d3.layout.tree()
          .size([360, diameter / 2 - 80])
          .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / Math.max(1, a.depth); });

      var diagonal = d3.svg.diagonal.radial()
          .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

      var svg = d3.select("#div_report").append("svg")
          .attr("width", width )
          .attr("height", height )
          .append("g")
          .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

      root = treeData2;
      root.x0 = height / 2;
      root.y0 = 0;

      function collapse(d) {
          if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
          }
        }

      root.children.forEach(collapse);  
      //root.children.forEach(collapse); // start with all children collapsed
      update(root);

      d3.select(self.frameElement).style("height", "800px");

      function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 80; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { console.log(d.x); return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
            .on("click", click);

        nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "#41b6c4" : "#fff"; })
          .style("stroke", function(d){  if (!d.parent) 
                                return "#225ea8"
                              else
                                return d._children ? "#41b6c4" : "red"; });


        nodeEnter.append("text")
            .attr("x", 10)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .attr("transform", function(d) { return d.x < 180 ? "translate(-10, -20)" : "rotate(180)translate(-8,-12)"; })
            // .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length * 8.5)  + ")"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

        nodeUpdate.select("circle")
            .attr("r", 10)
            .style("fill", function(d) { return d._children ? "#41b6c4" : "#fff"; });


        nodeUpdate.select("text")
            .style("fill-opacity", 1)
            .attr("transform", function(d) { return d.x < 180 ? "translate(0)" : "rotate(180)translate(-" + (d.name.length)  + ")"; });

        // TODO: appropriate transform
        var nodeExit = node.exit().transition()
            .duration(duration)
            //.attr("transform", function(d) { return "diagonal(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
              var o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        
        update(d);
      }

      // Collapse nodes
      function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
          }
      }

}
function draw_tree(data){
    // console.log(data)
    var margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 860 - margin.right - margin.left,
      height = 500 - margin.top - margin.bottom;
      
    var i = 0,
      duration = 750,
      root;

    /*To convert data into name children format like the flare data set*/
    var treeData2 = { "name": data.key, "children":
                      data.values.map(function(drugs){
                          return { "name": drugs.key, "children": 
                            drugs.values.map( function(ADRs){
                              // console.log(ADRs)
                               return { "name": ADRs.ADR
                               }; //end of ADR
                            }) //end of ADRs
                          } //end of drug_Values 
                      })  //end of drugs
                    }  // end of root key

    var tree = d3.layout.tree()
      .size([height, width]);

    var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select("#div_report").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     // console.log(treeData2)   

      root = treeData2
      root.x0 = height / 2;
      root.y0 = 0;
        


       function collapse(d) {
          if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
          }
        }

        root.children.forEach(collapse);  
        update(root);

      d3.select(self.frameElement).style("height", "500px");

      function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
          .on("click", click);

        nodeEnter.append("circle")
          .attr("r", 1e-6)
          .style("fill", function(d) { return d._children ? "#41b6c4" : "#fff"; })
          .style("stroke", function(d){  if (!d.parent) 
                                return "#225ea8"
                              else
                                return d._children ? "#41b6c4" : "red"; });

        nodeEnter.append("text")
          .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
          .attr("r", 10)
          .style("fill", function(d) { return d._children ? "#41b6c4" : "#fff"; });

        nodeUpdate.select("text")
          .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
          .remove();

        nodeExit.select("circle")
          .attr("r", 1e-6);

        nodeExit.select("text")
          .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", function(d) {
          var o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
          });

        // Transition links to their new position.
        link.transition()
          .duration(duration)
          .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
          .duration(duration)
          .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
          })
          .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
        });
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
        d._children = d.children;
        d.children = null;
        } else {
        d.children = d._children;
        d._children = null;
        }
        update(d);
      }

}



