var all_data;

d3.csv("data/two_drugs.csv", function(data){
  var row_data = d3.nest()
                    .key(function(d) {return d.drug1 })
                    .key(function(d){return d.drug2;})
                    // .key(function(d){ return d.ADR;})
                    .entries(data);
                    set_data(row_data);
  // console.log(row_data)
})



function set_data(data){
    if (data!== undefined || data !==null){
          if (data.keys){
            // console.log(data[0].values)
            all_data= data
            // console.log(all_data)
          }
    }

    plot(all_data)
}


function plot(data){
  // console.log(data)
      var drug1_links = d3.select("#div_drug1")
                          .selectAll("a")
                          .data(data)
                          .enter()
                          .append("a")
                          .text(function(d, i) {
                            // console.log(d,i)
                            return d.key.toUpperCase().replace('[','').replace(']','');
                          })
                          .on ('click',show_div_drug2);

      drug1_links.insert("br",":first-child");

      var drug2_links = d3.select("#div_drug2")
                          .selectAll("a")
                          .data(data[0].values)
                          .enter()
                          .append("a")
                          // .attr("href", show_div_ADR)
                          .text(function(d, i) {
                            // console.log(data[0].values[0].values[0].ADR)
                            return d.key.toUpperCase().replace('[','').replace(']','');
                          })
                          .on ('click',show_div_ADR);

      drug2_links.insert("br",":first-child");

      var ADR_links = d3.select("#div_ADR")
                        .selectAll("a")
                        .data(data[0].values)
                        .enter()
                        .append("a")
                        // .attr("href", show_div_ADR)
                        .text(function(d, i) {
                          // console.log(d)
                          return d.values[0].ADR;
                        });

      ADR_links.insert("br",":first-child");
}

function show_div_drug2(d,i){
  // console.log(d,i)

      d3.selectAll("#div_drug2 > * ").remove();
      d3.selectAll("#div_ADR > * ").remove();

      var drug2_links = d3.select("#div_drug2")
                  .selectAll("a")
                  .data(d.values)
                  .enter()
                  .append("a")
                  // .attr("href", show_div_ADR)
                  .text(function(d, i) {
                    // console.log(d, d.drug2, d.drug1)
                     return d.key.toUpperCase().replace('[','').replace(']','');
                  })
                   .on ('click',show_div_ADR);

      drug2_links.insert("br",":first-child");


      var ADR_links = d3.select("#div_ADR")
                        .selectAll("a")
                        .data(d.values)
                        .enter()
                        .append("a")
                        // .attr("href", show_div_ADR)
                        .text(function(d, i) {
                          console.log(d,i,  d.values[0])
                          if (i==0)
                              return d.values[i].ADR;
                        });
}



function show_div_ADR(d,i){
  // console.log("Hi")
       d3.selectAll("#div_ADR > * ").remove();

      var ADR_links = d3.select("#div_ADR")
                  .selectAll("a")
                  .data(d.values)
                  .enter()
                  .append("a")
                  // .attr("href", function(d) {
                  //   return d.drug2;
                  // })
                  .text(function(d, i) {
                    // console.log(d)
                    return d.ADR;
                  })

      ADR_links.insert("br",":first-child");
}


// function plot_graph(){


