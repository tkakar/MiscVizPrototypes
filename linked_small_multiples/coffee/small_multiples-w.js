// Generated by CoffeeScript 1.8.0
(function() {
  var SmallMultiples, plotData, setupIsoytpe, transformData;

SmallMultiples = function() {

  var link_distance = 50;
  var menu ;

  var width = 200,height = 200;
  var next_cluster =0

  var main_drug_radius = 5;
  var known_r = 3;
  var unknown_r = 6;
  var main_drug_color= 'green';
  var default_link_color = '#FAEBD7';

  var legend = ['', 'Main Drug', 'Known DDI', 'Unknown DDI']

 var area, bisect, caption, chart, circle, curYear, data_trnasformed, format, height, line, margin, mousemove, mouseout, mouseover, setupScales, width, xScale, xValue, yAxis, yScale, yValue;
    width = 150;
    height = 150;
    margin = 20
    data_new = [];
    // circle = null;
    // caption = null;
    // curYear = null;
    // bisect = d3.bisector(function(d) {
    //   return d.date;
    // }).left;
    // format = d3.time.format("%Y");
    // xScale = d3.time.scale().range([0, width]);
    // yScale = d3.scale.linear().range([height, 0]);
    // xValue = function(d) {
    //   return d.date;
    // };
    // yValue = function(d) {
    //   return d.n;
    // };

    // var w = 150;
    // var h = 120;
    var n = 50;  // to converge the force layout to make it static


    // yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(4).outerTickSize(0).tickSubdivide(1).tickSize(-width);
    // area = d3.svg.area().x(function(d) {
    //   return xScale(xValue(d));
    // }).y0(height).y1(function(d) {
    //   return yScale(yValue(d));
    // });
    // // line = d3.svg.line().x(function(d) {
    // //   return xScale(xValue(d));
    // // }).y(function(d) {
    // //   return yScale(yValue(d));
    // // });

    // setupScales = function(data) {
    //   var extentX, maxY;
    //   maxY = d3.max(data, function(c) {
    //     return d3.max(c.values, function(d) {
    //       return yValue(d);
    //     });
    //   });
    //   maxY = maxY + (maxY * 1 / 4);
    //   yScale.domain([0, maxY]);
    //   // console.log(data)
    //   extentX = d3.extent(data[0].values, function(d) {
    //     return xValue(d);
    //   });
    //   return xScale.domain(extentX);
       
    // };

chart = function(selection) {
      return selection.each(function(rawData) {

    data_new = rawData
    // console.log(rawData)

    var links, nodes_data, focus_drug;
    var div, gi, lines, svg;
    // setupScales(data_new);
    
   
var default_node_color = "#2196f3" // "#E8CDDC"; 
    //var default_node_color = //"rgb(3,190,100)";
    var nominal_base_node_size = 4;
    var nominal_text_size = 12;
    var max_text_size = 24;
    var nominal_stroke = 2.5;
    var max_stroke = 5;
    var max_base_node_size = 36;
    var min_zoom = 0.1;
    var max_zoom = 7;
    var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
    // var svg_g = svg.append("g").attr("class", "cluster").attr("width", 200).attr("height",200);//.attr("fill", "yellow");
    //.attr("class", "cluster")//.append("rect").attr("width", 200).attr("height",200).attr("fill", "yellow");
    
   
    var focus_node = null, highlight_node = null;

    

    var text_center = false;
    var outline = false;

    var min_score = 0;
    var max_score = 1;

    var color = d3.scale.linear()
      .domain([min_score, (min_score+max_score)/2, max_score])
      .range(["grey", "#fb6a4a", "red"]);

    var highlight_color = "#006d2c";
    var highlight_trans = 0.1;
      
    var size = d3.scale.pow().exponent(1)
      .domain([1,100])
      .range([8,24]);         

   var defs = d3.select("#legend_svg").append("defs");

//Append a linearGradient element to the defs and give it a unique id

    var linearGradient = defs.append("linearGradient")
                             .attr("id", "linear-gradient");

    d3.select("#legend_svg").append("rect")
        .attr("width", 180)
        .attr("height", 20)
        .style("fill", "url(#linear-gradient)");


    linearGradient.attr("x1", "0%")
                  .attr("y1", "0%")
                  .attr("x2", "100%")
                  .attr("y2", "0%");
                         

    linearGradient.selectAll("stop") 
                  .data( color.range() )                  
                  .enter().append("stop")
                  .attr("offset", function(d,i) { return i/(color.range().length-1); })
                  .attr("stop-color", function(d) { return d; });

   // console.log(links) 
    
    
var data_l = data_new.length 

  // div = d3.select(this).selectAll(".chart").data(data_new);
  // div.enter().append("div").attr("class", "chart").append("svg").append("g");
  // svg = div.select("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

  // gi = svg.select("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  // gi.append("rect").attr("class", "background").style("pointer-events", "all").attr("width", width + margin.right).attr("height", height)//.on("mouseover", mouseover).on("mousemove", mousemove).on("mouseout", mouseout);
  

for (i =0; i< data_l; i++){

  // div = d3.select(this).selectAll(".chart").data(data_new);
  // div = d3.select(this).selectAll(".chart").data(data_new[i]).enter().append("div").attr("class", "chart").append("svg").append("g");
  console.log(d3.select(this))

  div = d3.select(this).append("div").attr("class", "chart").append("svg").attr("width", width + margin + margin).attr("height", height + margin + margin)
  svg = div.append("g");
  // svg = div.select("svg")//.append("g");
  // var  gi = svg.select("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  // svg = div.append("rect").attr("class", "background").style("pointer-events", "all").attr("width", width + margin.right).attr("height", height).attr("stroke","grey");
  
 
 // var gi = svg.append("g")
 // svg = div.append("text").text("HI").attr("dx", 10).attr("dy", 50);
  
  // console.log(gi)
    var nodes =[]
    

    
    // console.log(data_l)
    var g = svg;
    // console.log(i)
       links = data_new[i].values[0].links;
       nodes_data = data_new[i].values[0].nodes;
       focus_drug = data_new[i].key

     var drug_list_to_object= {};
     var n_l = nodes_data.length
          // console.log(nodes_data)

/************  Add the node.push inside loop if we want all rules for one drug intearction******/
   for (var x = 0; x<n_l; x++){
            // console.log(i)
          drug_list_to_object['id']=nodes_data[x]
          for(y in links){
            // console.log(links[j])
              if (links[y].Drug2 == nodes_data[x]){
                  drug_list_to_object['Score'] = links [y].Score
                  drug_list_to_object['status'] = links[y].status
                  drug_list_to_object['ADR'] = links[y].ADR
              }
          }
          nodes.push(drug_list_to_object)
          drug_list_to_object={}
   }
   // console.log(nodes.length, links.length)

    var hash_lookup = [];
    // make it so we can lookup nodes in O(1):

    nodes.forEach(function(d, i) {
      // console.log(d)
      hash_lookup[d.id] = d;
      // console.log(hash_lookup)
    });


    links.forEach(function(d, i) {
      d.source = hash_lookup[d.Drug1];
      d.target = hash_lookup[d.Drug2];
    });

    // console.log(nodes)
    console.log(i, nodes.length, links.length)

    var force = d3.layout.force()
      .linkDistance(10)
      .linkStrength(2)
      .charge(-200)
      .size([width,height])

    var drag = d3.behavior.drag()
                  .on("dragstart", dragstart)
                  .on("drag", dragmove)
                  .on("dragend", dragend);

     function dragstart(d, i) {
      // console.log("Hi")
          force.stop() // stops the force auto positioning before you start dragging
      }

      function dragmove(d, i) {

          d.px += d3.event.dx;
          d.py += d3.event.dy;
          d.x += d3.event.dx;
          d.y += d3.event.dy; 
          tick(); // this is the key to make it work together with updating both px,py,x,y on d !
      }

      function dragend(d, i) {
          // d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
          tick();
          // force.resume();
      }
        
    force
      .nodes(nodes)
      .links(links)
      // .start();

     // console.log(nodes,links)     

    var link = g.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke", function(d){
        // if (d.status=='known')
        //   return default_link_color;
        // else
          return default_link_color;
    })
    .style("stroke-width", function(d) { 
      // console.log(d.score, isNumber(d.score) && d.score>0)
      if (isNumber(d.score) && d.score>0.1) 
        return 5;
      else return  2; 
    })


    var node = g.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(drag)

       
    var circle = node.append("circle")
                 .attr("r", function(d){
                      if(d.id==focus_drug){
                         d3.select(this).attr("class","focus_drug")
                         return main_drug_radius;
                      }
                      else if (d.status=='known'){
                        d3.select(this).attr("class","inter_drugs")
                        return known_r; 
                      }
                          
                      else {
                        d3.select(this).attr("class","inter_drugs")
                        return unknown_r;
                        
                      }
                })
                 // .style("stroke", function(d) { 
                 //  if(d.id==focus_drug)
                 //      return "green" 
                 //  else
                 //     return default_node_color; })
                 // .style("stroke-width", 1)
                 .style("fill", function(d){
                  // console.log(d)
                     if(d.id==focus_drug)
                         return "green" 
                     // else if (d.status=='known')
                     //    return "grey"  
                      else return color(d.Score)
                  });    

    var prev_radius= 0 ;

    // circle.on("mouseover", function(d){
    //     prev_radius=  d3.select(this).attr("r");
    //     // console.log(prev_radius)
    //     // console.log(d.id)

    //     d3.selectAll(".node circle").style("fill", function(x){
    //         // console.log(x.id, d.id)
    //         if (x.id == d.id){
    //           // console.log("x.id")
    //             return "blue";
    //         }  
    //          else return color(x.Score)
    //     })
    // })
    // .on("mouseout", function(d){
    //     div.style("display", "none");
    //     d3.select(this).attr("r", prev_radius)
    //     // console.log(d3.select(this).attr("class"))

    //     d3.selectAll(".node circle.focus_drug").style("fill", function(x){
    //             console.log(d3.select(this).attr("class"))
    //             return main_drug_color;
    //     })

    //     d3.selectAll(".node circle.inter_drugs").style("fill", function(x){
    //             return color(x.Score)
    //     })

    // })
    // .on("mousemove", function(d){
    //   // console.log(d3.select(this).attr("r"))
    //   d3.select(this).attr("r", 20)
    //   div.style("left", d3.event.pageX+10+"px");
    //   div.style("top", d3.event.pageY-25+"px");
    //   div.style("display", "inline-block");
    //   if(d3.select(this).attr("class")==='focus_drug')
    //       div.html("Drugname: "+ (d.id));
    //   else
    //        div.html("Drugname: "+ (d.id)+"<br>"+ "ADR: " + d.ADR +"<br>"+ "Score: " + (d.Score) +"<br>");

    // });  


            
    var text = g.selectAll(".text")
                .data(nodes)
                .enter().append("text")
                .attr("dy", "-.15em")
                .style("font-size", nominal_text_size + "px")
                .style("opacity",0)

      if (text_center)
       text.text(function(d) { return d.id; })
           .style("text-anchor", "middle");
      else 
      text.attr("dx", function(d) {return (size(d.size)||nominal_base_node_size);})
          .text(function(d) { return '\u2002'+d.id; });

     
    zoom.on("zoom", function() {
        var stroke = nominal_stroke;
        if (nominal_stroke*zoom.scale()>max_stroke) stroke = max_stroke/zoom.scale();

        var t = d3.event.translate,
          s = d3.event.scale;

          t[0] = Math.max(0, Math.min(t[0], width - s*50));
          t[1] = Math.max(0, Math.min(t[1], height - s*50));

          // d3.selectAll(".group").attr("transform", "translate(" + t + ")scale(" + d3.event.scale + ")");
       
      // d3.selectAll(".group")
      g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

    });

    svg.call(zoom); 

    force .start()
        .on("tick", tick);

 for (let i = 0; i < n; ++i)  force.tick();
    force.stop();

    console.log(nodes)
     
    function tick(){
         var radius = 10;

         nodes[0].x = (width-margin) / 2;
         nodes[0].y = (height-margin) / 2;

            // force.on("tick", function() {
          node.attr("transform", function(d) { //console.log(d);
           return "translate(" + d.x + "," + d.y+ ")"; });

          // text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });
      }
      // return g;
   } //end For

   
   });    
  };

  // chart.x = function(_) {
  //     if (!arguments.length) {
  //       return xValue;
  //     }
  //     xValue = _;
  //     return chart;
  //   };
  //   chart.y = function(_) {
  //     if (!arguments.length) {
  //       return yValue;
  //     }
  //     yValue = _;
  //     return chart;
  //   };
    return chart;
  };

  transformData = function(rData) {
     rData.map(function(d,i){
                   // console.log(d,i)
                var charArr =[];
                 charArr.push(d.id.split(','));
                 // console.log(d.id, charArr)
                 d.id = charArr
                 
      })

     data_copy = JSON.parse(JSON.stringify(rData));
      /*  to create double sided links a-> b and x -> a */

     var drug1_array= []
     data_copy.forEach(function(d,i){
          d.Drug1= d.Drug1.toLowerCase();
          d.Drug2= d.Drug2.toLowerCase();
          d.Rank = +d.Rank
          d.Score = d3.round (d.Score,3)
           d.ADR=  d.ADR

          if((i-1)%2 == 0)
              d.status = 'known';
            else
              d.status ='unknown';             

          if (i== 0 || drug1_array.indexOf(d.Drug1) == -1)
               drug1_array.push(d.Drug1)

          if (drug1_array.indexOf(d.Drug2) != -1){
                // console.log(d)
                var obj_copy= JSON.parse(JSON.stringify(d));
                var temp = obj_copy.Drug1;
                obj_copy.Drug1 = obj_copy.Drug2;
                obj_copy.Drug2 = temp
                /* Do change the support and conf of individual drugs too*/
                // console.log(obj_copy)
                data_copy.push(obj_copy)
          }

          if (drug1_array.indexOf(d.Drug2)==-1){
                    // console.log(d)
                var obj_copy= JSON.parse(JSON.stringify(d));
                var temp = obj_copy.Drug1;
                obj_copy.Drug1 = obj_copy.Drug2;
                obj_copy.Drug2 = temp
                /* Do change the support and conf of individual drugs too*/
                data_copy.push(obj_copy)

          }

    }) //end foreach

 // var rawData = d3.nest().key(function(d) {
 //                    return d.Drug1;
 //                  }).sortValues(function(a, b) {
 //                    return d3.ascending(a.Drug1, b.Drug1);
 //                  }).entries(data_copy);

    var rawData = set_rules_data (data_copy)
    // set_rules_data (data_copy)
    // console.log(rawData)
    return rawData
};  // end transform data

  plotData = function(selector, data, plot) {
    // console.log(data)
    return d3.select(selector).datum(data).call(plot);
  };  //end plot_data

  function set_rules_data(data){
       var selected_drugs = ['urso',  'xgeva', 'lasix']
       var all_drugs_list=[];

       for ( i in data){
             all_drugs_list.push(data[i].Drug1)
      }

      all_drugs_list= remove_duplicates(all_drugs_list)
      all_drugs_list.sort();
            
      /* getting list of all DRugs*/
      
      d3.select("#reset_button").on("click", function(){
        // console.log("Hi")
          selected_drugs = [];
      d3.selectAll("#middle_container > *").remove();
      })

      menu= d3.selectAll("#drugs_menu")

      menu.selectAll("option")
          .data(all_drugs_list)
          .enter()
          .append("option")
          .attr("value", function(d) { return d; })
          .text(function(d) { return d; }); 

      return set_data_with_menu (data, selected_drugs)

      menu.on("change",function(event) {

          d3.selectAll("#vis > *").remove();
 
          d3.select(this).selectAll("option").filter(function (d, i) { if (this.selected) selected_drugs.push (this.value); return this.selected; });
          data_trnasformed= set_data_with_menu (data, selected_drugs)
          // 
      })
  } //end set rules_data

  function set_data_with_menu(data, selected_drugs){
      var data_overall={}, drug_list_to_object={}, data_overall_array=[];
      var sub_data=[], nodes=[], n_l=0;
      var all_drugs_list = [], drugs_list=[]
      var d_l= selected_drugs.length;

      var row_data ={};
      var values =[];
      // console.log(d_l)
      for (var j = 0; j<d_l  ; j++){
          var focus_drug = selected_drugs[j] 
          // console.log(focus_drug)
          for ( i in data){
            // console.log(data[i].Drug1, selected_drugs[j])
              if (data[i].Drug1 == selected_drugs[j]){
                drugs_list.push(data[i].Drug1)
                drugs_list.push(data[i].Drug2)
                // if(data[i].Drug2=='revlimid') console.log("hi")
                sub_data.push(data[i])
                // console.log(data[i])
              }
          }
          // console.log(sub_data.length)

          var drugs_list_no_duplicates = remove_duplicates(drugs_list)
            // console.log(drugs_list_no_duplicates)
         
          // console.log(nodes.length, sub_data.length)
          row_data['nodes']= drugs_list_no_duplicates
          row_data['links']= sub_data
          values.push(row_data)
          data_overall['key'] = focus_drug
          data_overall['values'] = values
          drugs_list = [];
          sub_data=[], values= [];
          row_data={}, 
          // console.log(data_overall)
          data_overall_array.push(data_overall)
          data_overall={}
      }
      // console.log(data_overall_array)

      return data_overall_array

}  //end set_data

function remove_duplicates(data){
                // console.log(data)
                /* To remove the duplicate drug names */
        uniqueArray = data.filter(function(item, pos, self) {
                return self.indexOf(item) == pos;
        })
        // console.log(uniqueArray)
        return uniqueArray
        
    } //end remove_duplicates

  setupIsoytpe = function() {
    var i=0;
    $("#vis").isotope({
      itemSelector: '.chart',
      layoutMode: 'fitRows',
      getSortData: {
        // count: function(e) {
        //   var d, sum;
        //   d = d3.select(e).datum();
        //   sum = d3.sum(d.values, function(d) {
        //     return d.n;
        //   });
        //   return sum * -1;
        // },
        name: function(e) {
          var d;
          d = d3.select(e).datum();
          console.log(d)
          // for (var i =0; i < d.length; i++){
              console.log(i, d.key)
              return d.key;
          // }

        }
        // i++;
      }
    });
    return $("#vis").isotope({
      sortBy: 'name'
    });
  };   //end setupIsotype



    $(function() {
      var display, plot;
      plot = SmallMultiples();
      // console.log(plot)
      display = function(error, rawData) {
        // var data;
        if (error) {
          console.log(error);
        }
        data= transformData(rawData);
        // console.log(data)

        plotData("#vis", data, plot);
        return setupIsoytpe();
      };


      queue().defer(d3.tsv, "data/Q4_2014_rules_new.txt").await(display);
      return d3.select("#button-wrap").selectAll("div").on("click", function() {
        // console.log("Hi")
        var id;
        id = d3.select(this).attr("id");
        d3.select("#button-wrap").selectAll("div").classed("active", false);
        d3.select("#" + id).classed("active", true);
        return $("#vis").isotope({
          sortBy: id
        });
      });
    });  // end function

}).call(this);  //end function

function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
}