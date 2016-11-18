var obj_links = {};
var drugs_list = [];
var json_data={};

function matrix(json) {
  // console.log(json)
    var matrix = [],
        nodes = json.nodes,
        n = nodes.length;

    // Compute index per node.
    nodes.forEach(function(node, i) {
      node.index = i;
      node.count = 0;
      matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0,value:0}; });
      node.max = 0;
    });

    // Convert links to matrix; count character occurrences.
    json.links.forEach(function(link) {

      // if (link.source=='30' && link.target=='35'){
      //     console.log(link, nodes[link.source].max)
      //   }
       
      if (link.value > nodes[link.source].max ){
        // console.log(link)
          nodes[link.source].max = link.value
          // nodes[link.target].max = link.value
        }

        if (link.value > nodes[link.target].max ){
        // console.log(link)
          // nodes[link.source].max = link.value
          nodes[link.target].max = link.value
        }



        matrix[link.source][link.target].z += link.value;
        // console.log(link.source, link.target, link.value)
          matrix[link.source][link.target].value = nodes[link.source].max
        matrix[link.target][link.source].z += link.value;
        matrix[link.source][link.source].z += link.value;
        matrix[link.target][link.target].z += link.value;

        if (link.value < 0){
          // console.log(link.value, link)
            nodes[link.source].count += (-1* 1);
            nodes[link.target].count += (-1* 1);
        }
        else{
            nodes[link.source].count +=1;
            nodes[link.target].count +=1;
        }
              
    });

    var adjacency = matrix.map(function(row) {
        return row.map(function(c) { return c.z; });
    });

    // console.log(adjacency)

    var graph = reorder.graph()
      .nodes(json.nodes)
      .links(json.links)
      .init();

    var dist_adjacency;

    var leafOrder = reorder.optimal_leaf_order()
          .distance(science.stats.distance.manhattan);
          // console.log(leafOrder)

    function computeLeaforder() {
        var order = leafOrder(adjacency);
        // console.log(order)

        order.forEach(function(lo, i) {
          // console.log(lo,i, nodes)
            nodes[i].leafOrder = lo;
            // console.log(nodes)
        });
        return nodes.map(function(n) { console.log(n);
          return n.leafOrder; });
    }
    // console.log(order)

    function computeLeaforderDist() {
        if (! dist_adjacency)
            dist_adjacency = reorder.graph2valuemats(graph);

        var order = reorder.valuemats_reorder(dist_adjacency,
                      leafOrder);

        order.forEach(function(lo, i) {
            nodes[i].leafOrderDist = lo;
        });
        return nodes.map(function(n) { return n.leafOrderDist; });
  
    }
    
    function computeBarycenter() {
        var barycenter = reorder.barycenter_order(graph),
            improved = reorder.adjacent_exchange(graph,
                   barycenter[0],
                   barycenter[1]);

        improved[0].forEach(function(lo, i) {
            nodes[i].barycenter = lo;
        });

        return nodes.map(function(n) { return n.barycenter; });
    }

    function computeRCM() {
        var rcm = reorder.reverse_cuthill_mckee_order(graph);
        rcm.forEach(function(lo, i) {
            nodes[i].rcm = lo;
        });

        return nodes.map(function(n) { return n.rcm; });
          }

          function computeSpectral() {
        var spectral = reorder.spectral_order(graph);

        spectral.forEach(function(lo, i) {
            nodes[i].spectral = lo;
        });

        return nodes.map(function(n) { return n.spectral; });
    }

  // Precompute the orders.
    var orders = {
        name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
        count: d3.range(n).sort(function(a, b) { //console.log (a, b, nodes[b].count, nodes[a].count,nodes[b].count - nodes[a].count ) ;
          // return nodes[b].count - nodes[a].count; }),
        return d3.ascending(nodes[b].count, nodes[a].count); }),
        // group: d3.range(n).sort(function(a, b) {
        //     var x = nodes[b].group - nodes[a].group;
        //     return (x != 0) ?  x : d3.ascending(nodes[a].name, nodes[b].name);
        // }),
        leafOrder: computeLeaforder,
        leafOrderDist: computeLeaforderDist,
        barycenter: computeBarycenter,
        rcm: computeRCM,
        spectral: computeSpectral
    };

  // The default sort order.
    // console.log(orders.name)
    x.domain(orders.name);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);

    var row = svg.selectAll(".row")
        .data(matrix)
      .enter().append("g")
        .attr("id", function(d, i) { return "row"+i; })
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
        .each(row);

    row.append("line")
        .attr("x2", width);

    // row.append("text")
    //     .attr("x", -6)
    //     .attr("y", x.rangeBand() / 2)
    //     .attr("dy", ".32em")
    //     .attr("text-anchor", "end")
    //     .text(function(d, i) { return nodes[i].name; });

    var column = svg.selectAll(".column")
        .data(matrix)
      .enter().append("g")
        .attr("id", function(d, i) { return "col"+i; })
        .attr("class", "column")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

    column.append("line")
        .attr("x1", -width);

    // column.append("text")
    //     .attr("x", 6)
    //     .attr("y", x.rangeBand() / 2)
    //     .attr("dy", ".32em")
    //     .attr("text-anchor", "start")
    //     .text(function(d, i) { return nodes[i].name; });

    function row(row) {
      var cell = d3.select(this).selectAll(".cell")
      .data(row.filter(function(d) { return d.z; }))
        .enter().append("rect")
          .attr("class", "cell")
          .attr("x", function(d) { return x(d.x); })
          .attr("width", x.rangeBand())
          .attr("height", x.rangeBand())
          // .style("fill-opacity", function(d) {  console.log(d); return z(d.z); })
          .style("fill", function(d) { 
              // console.log(d, d.value)
             if (+d3.round(d.value ,4) < 0) {
                return "red";
             }
              else 
                // return "rgb(20,108,69)";
                return '#045adb'
          }) // nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);
    }

    function mouseover(p) {
      d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
      d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
      d3.select(this).insert("title").text(nodes[p.y].name + "--" + nodes[p.x].name);
      d3.select(this.parentElement)
        .append("rect")
        .attr("class", "highlight")
        .attr("width", width)
        .attr("height", x.rangeBand());
      d3.select("#col"+p.x)
        .append("rect")
        .attr("class", "highlight")
        .attr("x", -width)
        .attr("width", width)
        .attr("height", x.rangeBand());
    }

    function mouseout(p) {
      d3.selectAll("text").classed("active", false);
      d3.select(this).select("title").remove();
      d3.selectAll(".highlight").remove();
    }

    var currentOrder = 'name';

    function order(value) {
        var o = orders[value];
        currentOrder = value;
        
        if (typeof o === "function") {
            orders[value] = o.call();
        }
        x.domain(orders[value]);

        var t = svg.transition().duration(1500);

        t.selectAll(".row")
                  .delay(function(d, i) { return x(i) * 4; })
                  .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
            .selectAll(".cell")
                  .delay(function(d) { return x(d.x) * 4; })
                  .attr("x", function(d) { return x(d.x); });

        t.selectAll(".column")
                  .delay(function(d, i) { return x(i) * 4; })
                  .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
    }
    function distance(value) {
      console.log(distance)
        leafOrder.distance(science.stats.distance[value]);

        if (currentOrder == 'leafOrder') {
            orders.leafOrder = computeLeaforder;
            order("leafOrder");
            //d3.select("#order").property("selectedIndex", 3);
        }
        else if (currentOrder == 'leafOrderDist') {
            orders.leafOrderDist = computeLeaforderDist;
            order("leafOrderDist");
            //d3.select("#order").property("selectedIndex", 4);
        }

        // leafOrder.forEach(function(lo, i) {
        //      nodes[lo].leafOrder = i;
        //  });
        //  orders.leafOrder = d3.range(n).sort(function(a, b) {
        //      return nodes[b].leafOrder - nodes[a].leafOrder; });
    }

      matrix.order = order;
      matrix.distance = distance;

      var timeout = setTimeout(function() {}, 1000);
      matrix.timeout = timeout;
      
      return matrix;
}


function loadJson() {
      
      var list = [];
      var overall_nodes = [];
      var overall_links = [];
      var obj_nodes={};
      // var mat;

      // console.log(json)
        d3.text("data/data.csv", function(unparsedData){
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
                         obj_links['value'] = + d3.round(score, 5)
                         obj_links['ADR'] = ADR
                         overall_links.push(obj_links)
                         obj_links ={}
                    }
               }

               json_data['links'] = overall_links
               // console.log(data['links'])
               var drugs_list_no_duplicates = remove_duplicates(drugs_list)

               for (i in drugs_list_no_duplicates){
                 // console.log(drugs_list_no_duplicates[i])
                obj_nodes['name'] = drugs_list_no_duplicates[i];
                obj_nodes['group'] = Math.floor((Math.random(1, 10) * 10) + 1);
                overall_nodes.push(obj_nodes)
                obj_nodes={}
               }


               for (j in overall_links){

                // console.log(drugs_list_no_duplicates.indexOf(overall_links[j].source), overall_links[j].source)
                  overall_links[j].source = drugs_list_no_duplicates.indexOf(overall_links[j].source)
                  overall_links[j].target = drugs_list_no_duplicates.indexOf(overall_links[j].target)

               }
               json_data['nodes'] = overall_nodes
               json_data['links'] = overall_links
               // console.log(json_data)
               call_matrix(json_data);
               // mat = matrix(json_data);
               
            });

}

function call_matrix(data){
          // console.log(data)
          var mat = matrix(data);

          d3.select("#order").on("change", function() {
            mat.order(this.value);
          });

          d3.select("#distance").on("change", function() {
            mat.distance(this.value);
          });
}

function drugs_split(str){

        /* To remove the square brackets from the drug names */
            str = str.replace(/[\[\]']+/g,'')
            str=  str.split(" ");

            obj_links['source'] = str[0]
            obj_links['target'] = str[1]

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