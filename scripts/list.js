var rules_data, reports_data;

// d3.csv("data/two_drugs.csv", function(data){
//   var row_data = d3.nest()
//                     .key(function(d) {return d.drug1 })
//                     .key(function(d){return d.drug2;})
//                     // .key(function(d){ return d.ADR;})
//                     .entries(data);
//                     set_data(row_data);
//   // console.log(row_data)
// })

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
                        // .key(function(d){ return d.ADR;})
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

        var drug1_links = d3.select("#div_drug1")//.append("svg").attr("width", 300).attr("height",1200)
                            .selectAll("text")
                            .data(data)
                            .enter()
                            .append("text")
                            // .style("background-color","red")
                            .text(function(d, i) {
                              // console.log(d,i)
                              return d.key.toUpperCase().replace('[','').replace(']','');
                            })

                            .on ('click',show_div_drug2);

       drug1_links.insert("br",":first-child");

      var drug2_links = d3.select("#div_drug2")
                          .selectAll("text")
                          .data(data[0].values)
                          .enter()
                          .append("text")
                          // .attr("href", show_div_ADR)
                          .text(function(d, i) {
                            // console.log(data[0].values[0].values[0].ADR)
                            return d.key.toUpperCase().replace('[','').replace(']','');
                          })
                          .on ('click',show_div_ADR);

      drug2_links.insert("br",":first-child");

      var ADR_links = d3.select("#div_ADR")
                        .selectAll("text")
                        .data(data[0].values)
                        .enter()
                        .append("text")
                        // .attr("href", show_div_ADR)
                        .text(function(d, i) {
                          // console.log(d)
                          return d.values[0].ADR;
                        })
                        .on ('click',show_div_Id);

      ADR_links.insert("br",":first-child");

      var Id_links = d3.select("#div_Ids")
                        .selectAll("text")
                        .data(data[0].values)
                        .enter()
                        .append("text")
                        // .attr("href", show_div_ADR)
                        .text(function(d, i) {
                          // console.log(d)
                          return d.values[0].id[0]//.split(",").join("\n");
                        })
                        .on('click', showReport);
;
                        

      Id_links.insert("br",":first-child");
}

function show_div_drug2(d,i){
  console.log(d,i)
      d3.selectAll("#div_drug1 text").style("background-color","white")
      d3.select(this).style("background-color","#e0ebeb")
      // d3.select(this).style('fill','blue');
      d3.selectAll("#div_drug2 text ").remove();
      d3.selectAll("#div_ADR text ").remove();
      d3.selectAll("#div_Ids text ").remove();
      d3.selectAll("#div_report text").remove();



      var drug2_links = d3.select("#div_drug2")
                  .selectAll("text")
                  .data(d.values)
                  .enter()
                  .append("text")
                  // .attr("href", show_div_ADR)
                  .text(function(d, i) {
                    // console.log(d, d.drug2, d.drug1)
                     return d.key.toUpperCase().replace('[','').replace(']','');
                  })
                   .on ('click',show_div_ADR);

      drug2_links.insert("br",":first-child");


      var ADR_links = d3.select("#div_ADR")
                        .selectAll("text")
                        .data(d.values)
                        .enter()
                        .append("text")
                        // .attr("href", show_div_ADR)
                        .text(function(d, i) {
                         // console.log(d,i,  d.values[0])
                          if (i==0)
                              return d.values[i].ADR;
                        })
                         .on ('click',show_div_Id);

      if (d.values.length > 1){
              console.log(d.values[0], d.values[0].values[0].id)
             var id_length = d.values[0].values[0].id.length
             console.log(id_length)

             if (id_length> 1)
                d =  d.values[0].values[0].id; 
              else
                d= d.values[0].values[0]
      }
      else
          d=d.values[0].values[0]                   

     console.log(d, d.id )

      // if(id_length > 1){
      //     console.log(id_length, d.values[0].id )


      // }
      // else {

        if (d.id[0].length>1){
              d= d.id[0]
              console.log("if", d)
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
                               .on('click', showReport);


        }
        else{
          console.log('else')

              var Id_links = d3.select("#div_Ids")
                               .append("text")
                                          // .attr("href", show_div_ADR)
                               .text(d.id)
                               .on('click', showReport);
                    // }

        }
}



function show_div_ADR(d,i){
    // console.log(d)

      d3.selectAll("#div_drug2 text").style("background-color","white")
      d3.select(this).style("background-color","#e0ebeb")
  // console.log("Hi")
       d3.selectAll("#div_ADR text").remove();
       d3.selectAll("#div_Ids text ").remove();

      var ADR_links = d3.select("#div_ADR")
                  .selectAll("text")
                  .data(d.values)
                  .enter()
                  .append("text")
                  // .attr("href", function(d) {
                  //   return d.drug2;
                  // })
                  .text(function(d, i) {
                    //console.log(d)
                    // if(i==0)
                     return d.ADR;
                  })
                   .on ('click',show_div_Id);

      ADR_links.insert("br",":first-child");

      var Id_links = d3.select("#div_Ids")
                        .selectAll("text")
                        .data(d.values)
                        .enter()
                        .append("text")
                        // .attr("href", show_div_ADR)
                        .text(function(d, i) {
                         // console.log(d.id[0])
                            return d.id[0]//.split(",").join("\n");
                        })
                        .on('click', showReport);
      Id_links.insert("br",":first-child");

}

function show_div_Id(d,i){

      d3.selectAll("#div_ADR text").style("background-color","white")
      d3.select(this).style("background-color","#e0ebeb")
      // console.log("Hi")
       d3.selectAll("#div_Ids text").remove();

       if(d.values){
            var Id_links = d3.select("#div_Ids")
                        .selectAll("text")
                        .data(d.values)
                        .enter()
                        .append("text")
                        .text(function(d, i) {
                              return d.id//.split(",").join("\n")
                        })
                        .on('click', showReport);

            Id_links.insert("br",":first-child");

       }
       else{
        // console.log(d)
              var Id_links = d3.select("#div_Ids")
                          .append("text")
                          .text(d.id)//.split(",").join("\n"))
                          .on('click', showReport);

              Id_links.insert("br",":first-child");
       }

       // console.log(d, d.id)
}


function showReport(){

      d3.selectAll("#div_Ids text").style("background-color","white")
      d3.select(this).style("background-color","#e0ebeb")
      // console.log("Hi")
       d3.selectAll("#div_report text").remove();

      // console.log(data)

      var id = d3.select(this).text();

      console.log(id, typeof(id))

      reports_data.forEach(function (d){
        // type(d.key)

            if (id.toString().indexOf(d.key) !== -1){
                  console.log(d, d.key);

                  d3.select("#div_report")
                    .selectAll("text")
                    .data(d.values)
                    .enter()
                    .append("text")
                    .text(function (d){
                          console.log(d)
                          return  "Id:" +  d.primaryId + "\n" +
                                  "Age:" +  d.age + "<br>" +
                                  "Age-Cod: " + d.age_cod + "\n" +
                                  "Age-Group: " + d.age_grp + "\n" + 
                                  "Gender: " + d.sex + "\n" +
                                  "weight:" +  d.wt + "\n" +
                                  "weight_Cod:" +  d.wt_cod + "\n" +
                                  "drugname: " + d.drugname + "\n"
                                  "occr_country: " + d.occr_country + "\n" +
                                  "outcome: " + d.outc_cod + "\n" +
                                  "SideEffects: " + d.sideEffect + "\n" 
                    })
            }
      })
}



