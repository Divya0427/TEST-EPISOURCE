﻿var default_dxmap = require("./load_dxmap.json");
var default_hccmap = require("./load_hccmap.json");
var default_hcccoefn = require("./load_hcccoefn.json");
var default_disease_duration = require("./disease_duration.json");
var default_ver = "v23";
var default_model = "CNA";
var default_age = 65;
var default_sex = "M";
var default_baserate = 868.0;
var default_verbose = true;
var default_disabl = false;
var default_never_trump = 0;
var default_orec=0;
var ver_temp;
var disabl_temp;
var never_trump_temp;
var verbose_temp;
var model_temp;
var age_temp;
var sex_temp;
var baserate_temp;
var orec_temp;
var interactions = { v22: v22_interactions, v23: v23_interactions, v24: v24_interactions };
var _ = require("../../lib/underscore");

// function to convert to uppercase (a fix to unit tests)
function convertToUppperCase(string) {
  var result = string.toString().toUpperCase();
  return result;
}

//To get a proper date out of excel formatted one
function getJsDateFromExcel(excelDate) {
  if(excelDate.includes('/') || excelDate.includes('-')) {
    return new Date(excelDate).getFullYear();
  }  
  var obj = new Date((excelDate - (25567 + 1)) * 86400 * 1000);
  return obj.getFullYear();
}

//To get the user data in a formatted manner
const formatData = (data) => {
  return data && data.map((item) => {
      return item[0];
  });
};
//To get the header of respective column for the memprofile and compare functions
function getHeader(colArray, defaultHeader) {
  return colArray.length > 0 ? colArray && colArray[0] : defaultHeader;
}
//Reusable function to get the grouped user data
function getUserData(name_array,
  memid_array,
  chartid_array,
  age_array,
  Gender_array,
  DOS_array,
  dx_array,
  model_array,
  hasHeader,
  groupby_array,
  isProfileCompare,
  isGrouped) {
    if(hasHeader) {
      var headerMap = {};
      headerMap[getHeader(name_array, "MemberName")] = "name";
      headerMap[getHeader(memid_array, "MID")] = "memid";
      headerMap[getHeader(DOS_array, "DOS")] = "dos";
      headerMap[getHeader(age_array, "Age")] = "age";
      headerMap[getHeader(Gender_array, "Gender")] = "gender";
      headerMap[getHeader(model_array, "Model")] = "model";
      headerMap[getHeader(chartid_array, "ChartID")] = "chartid";
      headerMap['Dxs'] = "dx";
    }
    //An array of arrays with column data. Ex: all the names in an array etc.,
    var formattedNames = formatData(name_array);
    var formattedMemIds = formatData(memid_array);
    var formattedChartIds = formatData(chartid_array);
    var formattedAges = formatData(age_array);
    var formattedGenders = formatData(Gender_array);
    var formattedDos = [];
    var temp_formattedDos = formatData(DOS_array);
    temp_formattedDos.map((item, i) => {
      if(i === 0 && hasHeader) {
        formattedDos.push(item);
      } else {
        formattedDos.push(getJsDateFromExcel(item));
      }
    });
    var formattedModels = formatData(model_array);
    var formattedDx = dx_array.map(dxArray => {
        return _.uniq(dxArray.map(function (dx) {
          var dx = dx.toUpperCase();
          if(dx !== 'NAN') {
            return dx;
          }
        })).filter(Boolean);
    });
        
    if (hasHeader) {
      formattedNames.shift();
      formattedMemIds.shift();
      formattedChartIds.shift();
      formattedAges.shift();
      formattedGenders.shift();
      formattedDos.shift();
      formattedModels.shift();
      formattedDx.shift();
    }
    var groupByColumns = [];
    if (hasHeader) {
      if(groupby_array && groupby_array.length > 0) {
        groupByColumns = formatData(formatData(groupby_array)).map(col => {
          return headerMap[col];
        });
      }
    }
    groupByColumns = hasHeader ? (groupby_array && groupby_array.length > 0 ? groupByColumns : (isProfileCompare ? ['name', 'memid', 'dos'] : ["name", "memid", "age", "gender", "model", "dos"])) : ['name', 'memid', 'dos'];
    var object = {
      name: formattedNames,
      age: formattedAges,
      gender: formattedGenders,
      memid: formattedMemIds,
      chartid: formattedChartIds,
      dos: formattedDos,
      model: formattedModels,
      dx: formattedDx
    };
  //result is an array of objects. Each object represents the user and we add 
  //version; few default values like model, age, gender if not present; Calculated HCCs, RAF, DEMORAF, TOTALRAF
    var result = Object.keys(object).reduce(function(acc, cur) {
      object[cur].map(function(prop, i) {
        acc[i] = acc[i] || {};
        acc[i][cur] = prop;
      });
      return acc;
    }, []);
    
    result.map(obj => {
      var dos = obj.dos;
      //Assign version
      if (dos === 2017) {
        obj.ver = "v22";
      } else if (dos === 2018) {
        obj.ver = "v23";
      } else if (dos === 2019 || dos === 2020) {
        obj.ver = "v24";
      } else {
        obj.ver = "";
      }
      //Add default values of Model, age, gender
      if (!obj.model) {
        obj.model = "CNA";
      }
      if (!obj.age) {
        obj.age = 65;
      }
      if (!obj.gender) {
        obj.gender = "M";
      }
      //Calculate HCC, Demo_RAF, HCC_RAF, Total_RAF
      obj.HCCs = dx2ccs(obj.dx, (age = obj.age), (ver = obj.ver), (model = obj.model));
      obj.DemoRAF = demo_rafs(
        (condition_list = ""),
        (age = obj.age),
        (sex = obj.gender),
        (model = obj.model),
        (orec = "0"),
        (ver = obj.ver),
        (baserate = 0.0)
      );
      obj.HCCRAF = cc_rafs(
        obj.HCCs,
        (ver = obj.ver),
        (model = obj.model),
        (disabl = false),
        (age = obj.age),
        (never_trump = 0),
        (baserate = 0.0)
      );
      obj.TotalRAF = parseFloat(obj.DemoRAF) + parseFloat(obj.HCCRAF);
      return obj;
    });
  //Underscore mixin allows us to extend Underscore with our own utility functions
    _.mixin({
      groupByComposite: (collection, keys, delimiter = "-") =>
        _.groupBy(collection, item => {
          const compositeKey = [];
          _.each(keys, key => compositeKey.push(item[key]));
          return compositeKey.join(delimiter);
        })
    });
    //An array of user data; Each user as a separate object
    var consolidatedOutput = [];
    var output = [];
    if(isGrouped) {
      consolidatedOutput.push(result);
    } else {
      Object.values(_.groupByComposite(result, groupByColumns)).map((array) => {
        var mergedObj = array.reduce((acc, obj) => {
          acc[obj] ? (acc[obj].dx = acc[obj].dx.concat(obj.dx)) : (acc[obj] = obj);
          return acc;
        }, {});
        for (var prop in mergedObj) {
          output.push(mergedObj[prop]);
        }
      });
      consolidatedOutput.push(output);
    }
    consolidatedOutput.map((arr, idx) => {
      return arr.map((item, index) => {
        return groupByColumns.concat("dx").map((col, index) => {
          return item[col];
        });
      });
    });
    return {
          consolidatedOutput,
          groupByColumns
    }
}

/**
* Returns the user data grouped by a certain grouping criteria
* @customfunction
* @helpurl https://hccexplorer.com/support
* @param {string[][]} name_array accepts array
* @param {string[][]} memid_array accepts array
* @param {string[][]} chartid_array accepts array
* @param {string[][]} age_array accepts
* @param {string[][]} Gender_array accepts array
* @param {string[][]} DOS_array accepts array
* @param {string[][]} dx_array accepts array
* @param {string[][]} model_array accepts array
* @param {string[][][]} groupby_array accepts array
* @returns {string[][]} A dynamic array with multiple resutls
*/
function memprofile(
  name_array,
  memid_array,
  chartid_array,
  age_array,
  Gender_array,
  DOS_array,
  dx_array,
  model_array,
  hasHeader,
  groupby_array
) {  
    var userDataOutput = getUserData(name_array,
      memid_array,
      chartid_array,
      age_array,
      Gender_array,
      DOS_array,
      dx_array,
      model_array,
      hasHeader,
      groupby_array
      );     
      //tabularUsersData is an array which holds table-like user data
      var tabularUsersData = [];
      Object.values(userDataOutput.consolidatedOutput)[0]
        .map(item => {
            //userData is an array of single user data as an array
        var userData = [];
        
        userDataOutput.groupByColumns.map(col => {
            item[col];
            userData.push(item[col]);
            //delete item[col];
            item[col] = 'groupedCol';
        });
    
        if(item.name !== 'groupedCol') {
            userData.push(item.name);
        }
        if(item.memid !== 'groupedCol') {
            userData.push(item.memid);
        }
        if(item.dos !== 'groupedCol') {
            userData.push(item.dos);
        }
        userData.push(item.dx.toString(), item.HCCs, item.DemoRAF, item.HCCRAF, item.TotalRAF);
        tabularUsersData.push(userData);
        });
        //name, memid, age, gender, model, dos
        var default_header_value = ["name", "memid", "dos", "dx", "HCCs", "DemoRAF", "HCCRAF", "TotalRAF"];
        var final_header_value = [...new Set([...userDataOutput.groupByColumns, ...default_header_value])];
        //tabularOutput contains tabularUsersData with headers
        var tabularOutput = [];
        tabularOutput.push(final_header_value);
        for (i = 0; i < tabularUsersData.length; i++) {
        tabularOutput.push(tabularUsersData[i]);
        }
      return tabularOutput;
}

function getResultObject(cols, cdngObj, clmsObj, cmpObj) {
  var objKeys = Object.keys(cdngObj || clmsObj);
  cols.map((col) => {
    var indx = objKeys.indexOf(col);
    if(indx >= 0) {
      cmpObj[col] = cdngObj[col] || clmsObj[col];
      objKeys.splice(indx, 1);
    }
  });
  if(cols.includes('name')) {
      var memidIndx = objKeys.indexOf('memid');
      if(memidIndx >= 0) {
          if(cdngObj && clmsObj) {
                cmpObj['memid'] = cdngObj['memid'] || clmsObj['memid'];
            } else if(cdngObj && !clmsObj) {
                cmpObj['memid'] = cdngObj['memid'];
            } else if(!cdngObj && clmsObj) {
                cmpObj['memid'] = clmsObj['memid'];
            }
        objKeys.splice(memidIndx, 1);
      }
  }
  if(cols.includes('memid')) {
    var nameIndx = objKeys.indexOf('name');
    if(nameIndx >= 0) {
        if(cdngObj && clmsObj) {
              cmpObj['name'] = cdngObj['name'] || clmsObj['name'];
          } else if(cdngObj && !clmsObj) {
              cmpObj['name'] = cdngObj['name'];
          } else if(!cdngObj && clmsObj) {
              cmpObj['name'] = clmsObj['name'];
          }
      objKeys.splice(nameIndx, 1);
    }
}
  var ageIndx = objKeys.indexOf('age');
    if(ageIndx >= 0) {
        if(cdngObj && clmsObj) {
            cmpObj['age'] = cdngObj['age'] || clmsObj['age'];
        } else if(cdngObj && !clmsObj) {
            cmpObj['age'] = cdngObj['age'];
        } else if(!cdngObj && clmsObj) {
            cmpObj['age'] = clmsObj['age'];
        }
    objKeys.splice(ageIndx, 1);
  }
  var genderIndx = objKeys.indexOf('gender');
  if(genderIndx >= 0) {
    if(cdngObj && clmsObj) {
        cmpObj['gender'] = cdngObj['gender'] || clmsObj['gender'];
    } else if(cdngObj && !clmsObj) {
        cmpObj['gender'] = cdngObj['gender'];
    } else if(!cdngObj && clmsObj) {
        cmpObj['gender'] = clmsObj['gender'];
    }
    
    objKeys.splice(genderIndx, 1);
  }
    var isChartIdPartOfMergeCols = cols.indexOf('chartid');
    if(isChartIdPartOfMergeCols >= 0 ) {
        if(cdngObj && clmsObj) {
            cmpObj['chartid'] = [cdngObj['chartid'], clmsObj['chartid']].toString();
            cmpObj['gender'] = cdngObj['gender'] || clmsObj['gender'];
        } else if(cdngObj && !clmsObj) {
            cmpObj['chartid'] = cdngObj['chartid'];
        } else if(!cdngObj && clmsObj) {
            cmpObj['chartid'] = clmsObj['chartid'];
        }
    } else {
        objKeys.splice(objKeys.indexOf('chartid'), 1);
    }
    if(cdngObj && clmsObj) {
        objKeys.map((prop) => {
            cmpObj[prop+'_1'] = cdngObj[prop];
        });
        objKeys.map((prop) => {
            cmpObj[prop+'_2'] = clmsObj[prop];
        });
    }
    else if(cdngObj && !clmsObj) {
        objKeys.map((prop) => {
            cmpObj[prop+'_1'] = '';
        });
        objKeys.map((prop) => {
            cmpObj[prop+'_2'] = cdngObj[prop];
        });
    } else if(!cdngObj && clmsObj) {
        objKeys.map((prop) => {
            cmpObj[prop+'_1'] = clmsObj[prop];
        });
        objKeys.map((prop) => {
            cmpObj[prop+'_2'] = '';
        });
    }
  return cmpObj;
}
/**
* Returns the result data by comparing dx_values of the 2 sets of user data(2 different excel sheets)
* @customfunction
* @helpurl https://hccexplorer.com/support
* @param {string[][]} name_array1 accepts array
* @param {string[][]} memid_array1 accepts array
* @param {string[][]} chartid_array1 accepts array
* @param {string[][]} age_array1 accepts
* @param {string[][]} Gender_array1 accepts array
* @param {string[][]} DOS_array1 accepts array
* @param {string[][]} dx_array1 accepts array
* @param {string[][]} model_array1 accepts array
* @param {string[][]} name_array2 accepts array
* @param {string[][]} memid_array2 accepts array
* @param {string[][]} chartid_array2 accepts array
* @param {string[][]} age_array2 accepts
* @param {string[][]} Gender_array2 accepts array
* @param {string[][]} DOS_array2 accepts array
* @param {string[][]} dx_array2 accepts array
* @param {string[][]} model_array2 accepts array
* @param {string[][][]} groupby_array accepts array
* @returns {string[][]} A dynamic array with multiple resutls
*/
function dx_profile_compare(
    name_array1,
    memid_array1,
    chartid_array1,
    age_array1,
    Gender_array1,
    DOS_array1,
    dx_array1,
    model_array1,
    name_array2,
    memid_array2,
    chartid_array2,
    age_array2,
    Gender_array2,
    DOS_array2,
    dx_array2,
    model_array2,
    hasHeader,
    isGrouped,
    groupby_array) {
    var clmsData, cdngData, merge_cols_list;
    //var isGrouped = false;
        var usrData = getUserData(
            name_array1,
            memid_array1,
            chartid_array1,
            age_array1,
            Gender_array1,
            DOS_array1,
            dx_array1,
            model_array1,
            hasHeader,            
            groupby_array,
            isProfileCompare = true,
            isGrouped);
            cdngData = usrData.consolidatedOutput[0];
            merge_cols_list = usrData.groupByColumns.filter(Boolean);
    clmsData = getUserData(
        name_array2,
        memid_array2,
        chartid_array2,
        age_array2,
        Gender_array2,
        DOS_array2,
        dx_array2,
        model_array2,
        hasHeader,        
        groupby_array,
        isProfileCompare = true,
        isGrouped).consolidatedOutput[0];
    var isMatchedWithAnyUser;
    var cmp = [];
    clmsData.map((clmsObj, index, clmsArr) => {
        var isColDataMatched;
        isMatchedWithAnyUser = cdngData.map((cdngObj, i, cdngArr) => {
            var cmpObj = {};
            var idx = i;

            isColDataMatched = merge_cols_list.map((merge_col) => {
                return (clmsObj[merge_col] === cdngObj[merge_col]) ? true : false;
            });
            //True if all the merge_cols_list are equal in both the arrays
            matched = isColDataMatched.every((val) => val === true);
            if(matched) {
                cmp.push(getResultObject(merge_cols_list, cdngObj, clmsObj, cmpObj));
                cdngData.splice(idx, 1);
                return true;
            }
        });
        isMatchedWithAnyUser = isMatchedWithAnyUser.some(data => data === true);
        if(!isMatchedWithAnyUser) {
            //clmsObj couldn't find match in cdngData array; Means it's a unique obj from table1 and push it to cmp array
            var obj = {};
            //Push unique objects from table1 which doesn't match with table2 objects
            cmp.push(getResultObject(merge_cols_list, '', clmsObj, obj));
        }
    });
//Push remainining objects from table2 to result
    cdngData.map((cdngOb) => {
        var ob = {};
        cmp.push(getResultObject(merge_cols_list, cdngOb, '', ob));
    });
   
    var tHeaders = [];
    var tUserData = [];
    var cnt = 0;
    cmp.map((obj) => {
      var dx_1 = obj.dx_1 || [],
        dx_2 = obj.dx_2 || [],
        ver = obj.ver || obj.ver_1 || obj.ver_2,
        model = obj.model || obj.model_1 || obj.model_2,
        age = obj.age || obj.age_1 || obj.age_2,
        disabl = false,
        never_trump = 0,
        baserate = 0.0,
        sex = obj.gender || obj.gender_1 || obj.gender_2;

      var dx_dict =  dx_increments(dx_1, dx_2, ver, model, age, disabl, never_trump, baserate);
      var neg_arry = dx_dict["upgraded"].map(element => "-" + element);
      obj.dx_increment = (dx_dict["adds"].concat(neg_arry)).toString();
      dx_dict = dx_increments(dx_1, dx_2, ver, model, age, disabl, never_trump, baserate);
      obj.RAF_increment = parseFloat(dx_dict["raf"]).toFixed(3);
      dx_dict = dx_gap(dx_1, dx_2, ver, model, age, sex, disabl, never_trump, baserate);
      obj.RAF_gaps = parseFloat(dx_dict["raf"]).toFixed(3);
      dx_dict = dx_gap(dx_1, dx_2, ver, model, age, sex, disabl, baserate);
      obj.dx_gaps = (dx_dict["Deletes"].concat(dx_dict["Downgraded"])).toString();
    });
    cmp.map((resObj) => {
        var uData = [];
        Object.entries(resObj).map((val) => {
            if(cnt === 0) {
                tHeaders.push(val[0]);
            }
            if(val[1] instanceof Array) {
                val[1] = val[1].toString()
            }
            uData.push(val[1]);
        });
        tUserData.push(uData);
        cnt++;
    });
    var tabularOutput = [];
    tabularOutput.push(tHeaders);
    for (i = 0; i < tUserData.length; i++) {
        tabularOutput.push(tUserData[i]);
    }
    return tabularOutput;
}

/**
* Returns the result data by comparing hcc_values of the 2 sets of user data(2 different excel sheets)
* @customfunction
* @helpurl https://hccexplorer.com/support
* @param {string[][]} name_array1 accepts array
* @param {string[][]} memid_array1 accepts array
* @param {string[][]} chartid_array1 accepts array
* @param {string[][]} age_array1 accepts
* @param {string[][]} Gender_array1 accepts array
* @param {string[][]} DOS_array1 accepts array
* @param {string[][]} dx_array1 accepts array
* @param {string[][]} model_array1 accepts array
* @param {string[][]} name_array2 accepts array
* @param {string[][]} memid_array2 accepts array
* @param {string[][]} chartid_array2 accepts array
* @param {string[][]} age_array2 accepts
* @param {string[][]} Gender_array2 accepts array
* @param {string[][]} DOS_array2 accepts array
* @param {string[][]} dx_array2 accepts array
* @param {string[][]} model_array2 accepts array
* @param {string[][][]} groupby_array accepts array
* @returns {string[][]} A dynamic array with multiple resutls
*/
function hcc_profile_compare(
  name_array1,
  memid_array1,
  chartid_array1,
  age_array1,
  Gender_array1,
  DOS_array1,
  dx_array1,
  model_array1,
  name_array2,
  memid_array2,
  chartid_array2,
  age_array2,
  Gender_array2,
  DOS_array2,
  dx_array2,
  model_array2,
  hasHeader,
  isGrouped,
  groupby_array) {
  var clmsData, cdngData, merge_cols_list;
  //var isGrouped = false;
      var usrData = getUserData(
          name_array1,
          memid_array1,
          chartid_array1,
          age_array1,
          Gender_array1,
          DOS_array1,
          dx_array1,
          model_array1,
          hasHeader,
          groupby_array,
          isProfileCompare = true,
          isGrouped);
          cdngData = usrData.consolidatedOutput[0];
          merge_cols_list = usrData.groupByColumns.filter(Boolean);
  clmsData = getUserData(
      name_array2,
      memid_array2,
      chartid_array2,
      age_array2,
      Gender_array2,
      DOS_array2,
      dx_array2,
      model_array2,
      hasHeader,
      groupby_array,
      isProfileCompare = true,
      isGrouped).consolidatedOutput[0]; 

  var isMatchedWithAnyUser;
  var cmp = [];
  clmsData.map((clmsObj, index, clmsArr) => {
      var isColDataMatched;
      var compareOb = {};
      isMatchedWithAnyUser = cdngData.map((cdngObj, i, cdngArr) => {
          var cmpObj = {};
          var idx = i;

          isColDataMatched = merge_cols_list.map((merge_col) => {
              return (clmsObj[merge_col] === cdngObj[merge_col]) ? true : false;
          });
          //True if all the merge_cols_list are equal in both the arrays
          matched = isColDataMatched.every((val) => val === true);
          if(matched) {
              cmp.push(getResultObject(merge_cols_list, cdngObj, clmsObj, cmpObj));
              cdngData.splice(idx, 1);
              return true;
          }
      });
      isMatchedWithAnyUser = isMatchedWithAnyUser.some(data => data === true);
      if(!isMatchedWithAnyUser) {
          //clmsObj couldn't find match in cdngData array; Means it's a unique obj from table1 and push it to cmp array
          var obj = {};
          //Push unique objects from table1 which doesn't match with table2 objects
          cmp.push(getResultObject(merge_cols_list, '', clmsObj, obj));
      }
  });
//Push remainining objects from table2 to result
  cdngData.map((cdngOb) => {
      var ob = {};
      cmp.push(getResultObject(merge_cols_list, cdngOb, '', ob));
  });
 
  var tHeaders = [];
  var tUserData = [];
  var cnt = 0;
  cmp.map((obj) => {
      var dx_1 = obj.dx_1 || [],
          dx_2 = obj.dx_2 || [],
          ver = obj.ver || obj.ver_1 || obj.ver_2,
          model = obj.model || obj.model_1 || obj.model_2,
          age = obj.age || obj.age_1 || obj.age_2,
          disabl = false,
          never_trump = 0,
          baserate = 0.0,
          sex = obj.gender || obj.gender_1 || obj.gender_2;
      var hcc_inc = hcc_increment(old_list = [],
                                  new_list = [],
                                  ver,
                                  model,
                                  age,
                                  disabl,
                                  never_trump = 0,
                                  baserate = 0.0);
      var hcc_gps = hcc_gaps(old_list = [],
                              new_list = [],
                              ver,
                              model,
                              age,
                              disabl,
                              baserate = 0.0);
      obj.hcc_increment = (hcc_inc.adds.concat(hcc_inc.upgraded)).toString();
      obj.hcc_increment_raf = hcc_inc.raf;
      obj.hcc_gaps = (hcc_gps.Deletes.concat(hcc_gps.Downgraded)).toString();
      obj.hcc_gaps_raf = hcc_gps.raf;
  });
  cmp.map((resObj) => {
      var uData = [];
      Object.entries(resObj).map((val) => {
          if(cnt === 0) {
              tHeaders.push(val[0]);
          }
          if(val[1] instanceof Array) {
              val[1] = val[1].toString()
          }
          uData.push(val[1]);
      });
      tUserData.push(uData);
      cnt++;
  });
  var tabularOutput = [];
  tabularOutput.push(tHeaders);
  for (i = 0; i < tUserData.length; i++) {
      tabularOutput.push(tUserData[i]);
  }
  return tabularOutput;
}

/**
 * Returns the subset of a dx list that pertain to acute conditions
 * @customfunction
 * @param {string[][]} dx_array accepts array of dx codes
 */
async function dx_acute(dx_array = [], ver = "") {
  // Convert string to list and ensure DX are formatted correctly.
  for (var i = 0; i < dx_array.length; i++) {
    for (var j = 0; j < dx_array[i].length; j++) {
      dx_array = dx_array;
    }
  }
  var temp_dx_array = dx_array.toString();
  temp_dx_array = temp_dx_array.split(",");
  for (i = 0; i < temp_dx_array.length; i++) {
    temp_dx_array[i] = temp_dx_array[i].toString().trim();
  }
  // added default value code
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var dx_values = dx_duration(temp_dx_array, (ver = defOb.ver));
  return dx_values.Acute.toString();
}
/**
 * Returns the subset of a dx list that pertain to chronic conditions
 * @customfunction
 * @param {string[][]} dx_array accepts array of dx codes
 */
async function dx_chronic(dx_array, ver = "") {
  // Convert string to list and ensure DX are formatted correctly.
  for (var i = 0; i < dx_array.length; i++) {
    for (var j = 0; j < dx_array[i].length; j++) {
      dx_array = dx_array;
    }
  }
  var temp_dx_array = dx_array.toString();
  temp_dx_array = temp_dx_array.split(",");
  for (i = 0; i < temp_dx_array.length; i++) {
    temp_dx_array[i] = temp_dx_array[i].toString().trim();
  }
  // added default value code
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value); 
  var verOb = { ver, ver_temp, default_ver };
  var model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var dx_values = dx_duration(temp_dx_array, (ver = defOb.ver));
  return dx_values.Chronic.toString();
}
/**
 * Returns the subset of a cc list that pertain to acute conditions
 * @customfunction
 * @param {string[][]} cc_array accepts array of hcc codes
 */
async function cc_acute(cc_array, ver = "") {
  for (var i = 0; i < cc_array.length; i++) {
    for (var j = 0; j < cc_array[i].length; j++) {
      cc_array = cc_array;
    }
  }
  var temp_cc_array = cc_array.toString();
  temp_cc_array = temp_cc_array.split(",");
  for (i = 0; i < temp_cc_array.length; i++) {
    temp_cc_array[i] = temp_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_values = hcc_duration(temp_cc_array, (ver = defOb.ver));
  return hcc_values.Acute.toString();
}
/**
 * Returns the subset of a cc list that pertain to chronic conditions
 * @customfunction
 * @param {string[][]} cc_array accepts array of hcc codes
 */
async function cc_chronic(cc_array, ver = "") {
  for (var i = 0; i < cc_array.length; i++) {
    for (var j = 0; j < cc_array[i].length; j++) {
      cc_array = cc_array;
    }
  }
  var temp_cc_array = cc_array.toString();
  temp_cc_array = temp_cc_array.split(",");
  for (i = 0; i < temp_cc_array.length; i++) {
    temp_cc_array[i] = temp_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_values = hcc_duration(temp_cc_array, (ver = defOb.ver));
  return hcc_values.Chronic.toString();
}
/**
 * Returns the subset of a cc list that pertain to hybrid (both acute and chronic) conditions
 * @customfunction
 * @param {string[][]} cc_array accepts array of hcc codes
 */
async function cc_hybrid(cc_array, ver = "") {
  for (var i = 0; i < cc_array.length; i++) {
    for (var j = 0; j < cc_array[i].length; j++) {
      cc_array = cc_array;
    }
  }
  var temp_cc_array = cc_array.toString();
  temp_cc_array = temp_cc_array.split(",");
  for (i = 0; i < temp_cc_array.length; i++) {
    temp_cc_array[i] = temp_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_values = hcc_duration(temp_cc_array, (ver = defOb.ver));
  return hcc_values.Hybrid.toString();
}

/**
 * Compares a base list of ccs and additional ccs and returns a list of ccs that are considered adds over the baseline.
 * @customfunction
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 *
 */
async function cc_diff_adds(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  age = 0,
  sex = "",
  model = "",
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }
  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var cclist = hcc_diff(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (age = defOb.age),
    (model = defOb.model),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = cclist.adds;
  return result.toString();
}
/**
 * Returns the net raf value of ccs that are considered adds over the baseline.
 * @customfunction
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_diff_adds_raf(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }
  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_increment(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = hcc_dict.raf;
  result = parseFloat(result);
  result = result.toFixed(3);
  return result.toString();
}
/**
 * Compares a base list of ccs and additional ccs and returns a list of ccs that are deletes between the additional codes vs the baseline.
 * @customfunction
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_diff_deletes(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }
  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_diff(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (age = defOb.age),
    (model = defOb.model),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = hcc_dict["deletes"];
  return result.toString();
}
/**
 * Returns the net raf value of ccs that are deletes between the additional codes vs the baseline.
 * @customfunction
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_diff_deletes_raf(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  sex = "",
  disabl = false,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }
  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_gaps(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (baserate = defOb.baserate)
  );
  var result = parseFloat(hcc_dict["raf"]);
  result = result.toFixed(3);
  return result.toString();
}
/**
 * Compares a base list of ccs and additional ccs and returns a list of ccs that are considered upgraded in the baseline.
 * @customfunction
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_diff_upgraded(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }
  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_diff(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (age = defOb.age),
    (model = defOb.model),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = hcc_dict.upgraded;
  return result.toString();
}
/**
 * Compares a base list of ccs and additional ccs and returns a list of ccs that are downgraded in the baseline compared to additional codes.
 * @customfunction
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_diff_downgraded(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }
  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_diff(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (age = defOb.age),
    (model = defOb.model),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = hcc_dict["downgraded"];
  return result.toString();
}
/**
 * Compares a base list of ccs and additional ccs and returns a list of ccs that are downgraded_to in additional codes compared to the baseline.
 * @customfunction
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_diff_downgrade_to(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }
  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_diff(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (age = defOb.age),
    (model = defOb.model),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = hcc_dict["downgrade_to"];
  return result.toString();
}

/**
 * Utility to Classify a list of DxCodes as acute or chronic.
 * @param dx_list List of dx codes; case and decimal insensitive
 * @param ver Optional HCC version. Otherwise uses default version of ccalc object
 * @return dict Dict containing Acute and Chronic DxCodes.
 */
function dx_duration(dx_list, ver) {
  var cleaned_dx_list = clean_dxlist(dx_list, ver);
  var disease_duration = default_disease_duration[ver];
  var acute = [];
  var chronic = [];
  for (var dx of cleaned_dx_list) {
    if (disease_duration[dx] && disease_duration[dx] == "Acute") {
      acute.push(dx);
    }
  }
  for (var dx of cleaned_dx_list) {
    if (disease_duration[dx] && disease_duration[dx] == "Chronic") {
      chronic.push(dx);
    }
  }
  return { Acute: acute, Chronic: chronic };
}
/**
 * Utility to Classify a list of HCC as acute or chronic.
 * @param hcc_list List of hcc; case and decimal insensitive
 * @param ver Optional HCC version. Otherwise uses default version of ccalc object
 * @return dict Dict containing Acute and Chronic HCC.
 */
function hcc_duration(hcc_list, ver) {
  var cleaned_hcc_list = clean_hcclist(hcc_list, ver);
  var disease_duration = default_disease_duration[ver];
  var acute = [];
  var chronic = [];
  var hybrid = [];
  for (var cc of cleaned_hcc_list) {
    if (disease_duration[cc] && disease_duration[cc] == "Acute") {
      acute.push(cc);
    }
  }
  for (var cc of cleaned_hcc_list) {
    if (disease_duration[cc] && disease_duration[cc] == "Chronic") {
      chronic.push(cc);
    }
  }
  for (var cc of cleaned_hcc_list) {
    if (disease_duration[cc] && disease_duration[cc] == "Hybrid") {
      hybrid.push(cc);
    }
  }
  return { Acute: acute, Chronic: chronic, Hybrid: hybrid };
}

/**
 * Returns demographic raf value based on age, gender and coding model
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} condition_list accepts array
 */
async function demo_raf(condition_list, age = 65, sex = "M", model = "", orec = "0", ver = "", baserate = 0.0) {
  for (var i = 0; i < condition_list.length; i++) {
    for (var j = 0; j < condition_list[i].length; j++) {
      condition_list = condition_list;
    }
  }
  var temp_condition_list = condition_list.toString();
  temp_condition_list = temp_condition_list.split(",");
  for (i = 0; i < temp_condition_list.length; i++) {
    temp_condition_list[i] = temp_condition_list[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var raf_dict = member(
    condition_list,
    (age = defOb.age),
    (sex = defOb.sex),
    (model = defOb.model),
    (orec = defOb.orec),
    (ver = defOb.ver),
    (baserate = defOb.baserate)
  );
  var result = raf_dict["raf"]["demo_score"];
  result = parseFloat(result);
  result = result.toFixed(3);
  return result.toString();
}

function demo_rafs(condition_list, age, sex, model, orec, ver, baserate) {
  for (var i = 0; i < condition_list.length; i++) {
    for (var j = 0; j < condition_list[i].length; j++) {
      condition_list = condition_list;
    }
  }
  var temp_condition_list = condition_list.toString();
  temp_condition_list = temp_condition_list.split(",");
  for (i = 0; i < temp_condition_list.length; i++) {
    temp_condition_list[i] = temp_condition_list[i].toString().trim();
  }
  
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;

  var raf_dict = member(
    condition_list,
    (age = age),
    (sex = sex),
    (model = model),
    (orec = orec),
    (ver = ver),
    (baserate = baserate)
  );
  var result = raf_dict["raf"]["demo_score"];
  result = parseFloat(result);
  result = result.toFixed(3);
  return result.toString();
}

/**
 * Returns comma-separated list of descriptions of each DX Code from CMS crosswalk
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} dx_array accepts array of hcc codes
 */
async function dx_desc(dx_array, ver = "", age = 0, sex = "", verbose = true) {
  for (i = 0; i < dx_array.length; i++) {
    for (j = 0; j < dx_array[i].length; j++) {
      dx_array = dx_array;
    }
  }
  var temp_dx_array = dx_array.toString();
  temp_dx_array = temp_dx_array.split(",");
  for (i = 0; i < temp_dx_array.length; i++) {
    temp_dx_array[i] = temp_dx_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = dx_hccs(temp_dx_array, (ver = defOb.ver), (age = defOb.age), (sex = defOb.sex), (verbose = defOb.verbose));
  var hcc_cust_list = [];
  for (var [key, value] of Object.entries(hcc_dict)) {
    var val = key + ":" + value["desc"];
    hcc_cust_list.push(val);
  }
  return hcc_cust_list.toString();
}

/**
 * Returns a comma separated list of the ccs represented by a list of DX codes after trumping/interaction logic is applied
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} dx_array accepts array of dx codes
 */
async function dx2cc(dx_array, age = 0, ver = "", model = "", sex = "", disabl = false, never_trump = 0, verbose = false) {
  for (var i = 0; i < dx_array.length; i++) {
    for (var j = 0; j < dx_array[i].length; j++) {
      dx_array = dx_array;
    }
  }
  var temp_dx_array = dx_array.toString();
  temp_dx_array = temp_dx_array.split(",");
  for (i = 0; i < temp_dx_array.length; i++) {
    temp_dx_array[i] = temp_dx_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var unique_hccs = dx2hcc(
    temp_dx_array,
    (age = defOb.age),
    (ver = defOb.ver),
    (model = defOb.model),
    (sex = defOb.sex),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (verbose = verbose)
  );
  return unique_hccs.toString();
}
function dx2ccs(dx_array, age, ver, model, sex = "", disabl = false, never_trump = 0, verbose = false) {
  for (var i = 0; i < dx_array.length; i++) {
    for (var j = 0; j < dx_array[i].length; j++) {
      dx_array = dx_array;
    }
  }
  var temp_dx_array = dx_array.toString();
  temp_dx_array = temp_dx_array.split(",");
  for (i = 0; i < temp_dx_array.length; i++) {
    temp_dx_array[i] = temp_dx_array[i].toString().trim();
  }
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  never_trump = never_trump || default_never_trump;
  var unique_hccs = dx2hcc(
    temp_dx_array,
    (age = age),
    (ver = ver),
    (model = model),
    (sex = sex),
    (disabl = disabl),
    (never_trump = never_trump),
    (verbose = verbose)
  );
  return unique_hccs.toString();
}

async function getStorageItem() {
  return await OfficeRuntime.storage.getItem("version").then(function(v) {
    return v;
  }).catch(function(err) {
    return err;
  });
}
function assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb) {
  var ver = verOb.ver ? verOb.ver.toLowerCase() : (verOb.ver_temp ? verOb.ver_temp.toLowerCase() : verOb.default_ver);
  var model = modelOb.model ? convertToUppperCase(modelOb.model) : (modelOb.model_temp ? convertToUppperCase(modelOb.model_temp) : modelOb.default_model);
  var never_trump = neverTrumpOb.never_trump ? neverTrumpOb.never_trump : (neverTrumpOb.never_trump_temp ? neverTrumpOb.never_trump_temp : neverTrumpOb.default_never_trump);
  var disable = disableOb.disabl ? disableOb.disabl : (disableOb.disabl_temp ? disableOb.disabl_temp : disableOb.default_disabl);
  var verbose = verboseOb.verbose ? verboseOb.verbose : (verboseOb.verbose_temp ? verboseOb.verbose_temp : verboseOb.default_verbose);
  var age = ageOb.age ? ageOb.age : (ageOb.age_temp ? ageOb.age_temp : ageOb.default_age);
  var sex = sexOb.sex ? sexOb.sex : (sexOb.sex_temp ? sexOb.sex_temp : sexOb.default_sex);
  var baserate = baserateOb.baserate ? baserateOb.baserate : (baserateOb.baserate_temp ? baserateOb.baserate_temp : baserateOb.default_baserate);
 var orec = orecOb.orec ? orecOb.orec : (orecOb.orec_temp ? orecOb.orec_temp : orecOb.default_orec);
  return {
    ver, model, never_trump, disable, verbose, age, sex, baserate,orec
  }
}
function getdefaultvalue(value){
ver_temp ='';
disabl_temp ='';
never_trump_temp ='';
verbose_temp ='';
model_temp ='';
age_temp ='';
sex_temp ='';
baserate_temp ='';
orec_temp ='';
if (value !== null && value !== undefined) {
   value = value.split(",");   
 ver_temp = value[0];
 disabl_temp = Boolean(value[1]);
 verbose_temp = Boolean(value[2]);
 never_trump_temp = parseInt(value[3]);
 model_temp = value[4];
age_temp = value[5];
sex_temp = value[6];
baserate_temp = parseInt(value[7]);
orec_temp = parseInt(value[8]);
  }  
}
/**
 * Returns cc raf of associated dx codes after conversion to cc and trumping/interaction logic is applied (equivalent of cc_raf(dx2cc(dx_array))
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} dx_array accepts array of dx codes
 */
async function dx_raf(
  dx_array,
  age = 0,
  ver = "",
  model = "",
  sex = "",
  disabl = false,
  verbose = false,
  never_trump = 0,
  baserate = 0.0
) {
  /*
  Utility to calculate raf from list of DX codes
  */
  for (var i = 0; i < dx_array.length; i++) {
    for (var j = 0; j < dx_array[i].length; j++) {
      dx_array = dx_array;
    }
  }
  var temp_dx_array = dx_array.toString();
  temp_dx_array = temp_dx_array.split(",");
  for (i = 0; i < temp_dx_array.length; i++) {
    temp_dx_array[i] = temp_dx_array[i].toString().trim();
  }
 
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);   
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var raf_value = dx2raf(
    temp_dx_array,
    (age = defOb.age),
    (ver = defOb.ver),
    (model = defOb.model),
    (sex = defOb.sex),
    (disabl = defOb.disabl),
    (verbose = defOb.verbose),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );    
  var result = parseFloat(raf_value);
  result = result.toFixed(3);
  return result.toString();
}

/**
 * Given a list of dx codes, return a list of deduped, normalized and untrumped dx codes valid for the coding model
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} dx_array accepts array of dx codes
 */
async function clean_dx(dx_array, ver = "") {
  // Convert string to list, dedupe, and ensure DX are formatted correctly.
  for (var i = 0; i < dx_array.length; i++) {
    for (var j = 0; j < dx_array[i].length; j++) {
      dx_array = dx_array;
    }
  }
  var temp_dx_array = dx_array.toString();
  temp_dx_array = temp_dx_array.split(",");
  for (i = 0; i < temp_dx_array.length; i++) {
    temp_dx_array[i] = temp_dx_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var dx_values = clean_dxlist(temp_dx_array, (ver = defOb.ver));
  var dx_set_values = [];
  dx_values.forEach(v => dx_set_values.push(v));
  return dx_set_values.toString();
}

/**
 * Given a list of ccs, return a list of deduped, normalized and untrumped ccs codes valid for the coding model
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} cc_array accepts array of hcc codes
 */
async function clean_cc(cc_array, ver = "") {
  for (var i = 0; i < cc_array.length; i++) {
    for (var j = 0; j < cc_array[i].length; j++) {
      cc_array = cc_array;
    }
  }
  var temp_cc_array = cc_array.toString();
  temp_cc_array = temp_cc_array.split(",");
  for (i = 0; i < temp_cc_array.length; i++) {
    temp_cc_array[i] = temp_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_values = clean_hcclist(temp_cc_array, (ver = defOb.ver));
  return hcc_values.toString();
}

/**
 * Returns comma-separated list of descriptions of each HCC Code from CMS crosswalk
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} cc_array accepts array of hcc codes
 */
async function cc_desc(cc_array, ver = "", age = 0, sex = "", verbose = false) {
  for (i = 0; i < cc_array.length; i++) {
    for (j = 0; j < cc_array[i].length; j++) {
      cc_array = cc_array;
    }
  }
  var temp_cc_array = cc_array.toString();
  temp_cc_array = temp_cc_array.split(",");
  for (i = 0; i < temp_cc_array.length; i++) {
    temp_cc_array[i] = temp_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
 
  var verOb = { ver, ver_temp, default_ver };
  var model;
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_dct(temp_cc_array, (ver = defOb.ver), (age = defOb.age), (sex = defOb.sex), (verbose = defOb.verbose));
  var hcc_cust_list = [];
  for (var [key, value] of Object.entries(hcc_dict)) {
    var val = key + ":" + value["desc"];
    hcc_cust_list.push(val);
  }
  return hcc_cust_list.toString();
}

/**
 * Returns multi-line info block for an HCC: Description, Children, Parents, RAF
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} cc accepts array of hcc codes
 */
async function cc_info(cc, ver = "", model = "", disabl = false, age = 0, never_trump = 0, baserate = 0.0) {
  var temp_hccmap, raf_value;
  for (i = 0; i < cc.length; i++) {
    for (j = 0; j < cc[i].length; j++) {
      cc = cc;
    }
  }
  var temp_cc = cc.toString();
  temp_cc = temp_cc.split(",");
  for (i = 0; i < temp_cc.length; i++) {
    temp_cc[i] = temp_cc[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) {}
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hccmap = default_hccmap[defOb.ver];
  temp_hccmap = hccmap[temp_cc];
  raf_value = hcc2raf(
    temp_cc,
    (ver = defOb.ver),
    (model = defOb.model),
    (disabl = defOb.disabl),
    (age = defOb.age),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  raf_value = parseFloat(raf_value);
  raf_value = raf_value.toFixed(3);
  var result = `desc: ${temp_hccmap["desc"]}, children: ${temp_hccmap["children"]}, parents: ${temp_hccmap["parents"]}, RAF: ${raf_value}`;
  return result;
}

/**
 * Returns cc raf (does not include demographic RAF) of cc codes after trumping/interaction logic is applied
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} cc_array accepts array of hcc codes
 */
async function cc_raf(cc_array, ver = "", model = "", disabl = false, age = 0, never_trump = 0, baserate = 0.0) {
  for (i = 0; i < cc_array.length; i++) {
    for (j = 0; j < cc_array[i].length; j++) {
      cc_array = cc_array;
    }
  }
  var temp_cc_array = cc_array.toString();
  temp_cc_array = temp_cc_array.split(",");
  for (i = 0; i < temp_cc_array.length; i++) {
    temp_cc_array[i] = temp_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var raf_value = hcc2raf(
    temp_cc_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (disabl = defOb.disabl),
    (age = defOb.age),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = parseFloat(raf_value);
  result = result.toFixed(3);
  return result.toString();
}

function cc_rafs(cc_array, ver = "", model = "", disabl = false, age = 0, never_trump = 0, baserate = 0.0) {
  for (i = 0; i < cc_array.length; i++) {
    for (j = 0; j < cc_array[i].length; j++) {
      cc_array = cc_array;
    }
  }
  var temp_cc_array = cc_array.toString();
  temp_cc_array = temp_cc_array.split(",");
  for (i = 0; i < temp_cc_array.length; i++) {
    temp_cc_array[i] = temp_cc_array[i].toString().trim();
  }
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;
  never_trump = never_trump || default_never_trump;
  var raf_value = hcc2raf(
    temp_cc_array,
    (ver = ver),
    (model = model),
    (disabl = disabl),
    (age = age),
    (never_trump = never_trump),
    (baserate = baserate)
  );
  var result = parseFloat(raf_value);
  result = result.toFixed(3);
  return result.toString();
}

/**
 * Returns a list of ccs after combining them and applying trumping/interaction logic
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} cc_array accepts array of hcc codes
 */
async function cc_combine(cc_array, ver = "", model = "", age = 0, disabl = false, never_trump = 0) {
  for (i = 0; i < cc_array.length; i++) {
    for (j = 0; j < cc_array[i].length; j++) {
      cc_array = cc_array;
    }
  }
  var temp_cc_array = cc_array.toString();
  temp_cc_array = temp_cc_array.split(",");
  for (i = 0; i < temp_cc_array.length; i++) {
    temp_cc_array[i] = temp_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserate;
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hccs = prep_hccs(
    temp_cc_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump)
  );
  return hccs.toString();
}

/**
 * Returns the RAF of the net incremental change (+Adds - Upgraded) between cc_lists.  Equivalent of cc_raf(cc_diff_increment)
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_increment_raf(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }

  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_increment(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = hcc_dict["raf"];
  result = parseFloat(result);
  result = result.toFixed(3);
  return result.toString();
}

/**
 * Returns the net incremental change between cc_lists, for example for calculating the value of a coding project over claims. Equivalent of +Adds - Upgraded in the format('+HCC001, +HCC18, - HCC019')
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_increment(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }

  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_increment(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var neg_arry = hcc_dict["upgraded"].map(element => "-" + element);
  var result = hcc_dict["adds"].concat(neg_arry);
  return result.toString();
}

/**
 * Compares a base list of ccs and additional ccs and returns a list of ccs that are deletes or downgrades between the additional codes vs the baseline
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_gaps(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  sex = "",
  disabl = false,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }

  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_gaps(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (baserate = defOb.baserate)
  );
  var result = hcc_dict["Deletes"].concat(hcc_dict["Downgraded"]);
  return result.toString();
}

/**
 * Compares a base list of ccs and additional ccs and returns raf of ccs that are deletes or downgrades between the additional codes vs the baseline
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 */
async function cc_gaps_raf(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  model = "",
  age = 0,
  sex = "",
  disabl = false,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }

  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var hcc_dict = hcc_gaps(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (baserate = defOb.baserate)
  );
  var result = hcc_dict["raf"];
  result = parseFloat(result);
  result = result.toFixed(3);
  return result.toString();
}

/**
 * Compares a base list of ccs and additional ccs and returns an information block on the differences ; eg: "Adds: HCC001, HCC18; Deletes: HCC135; Upgraded: HCC019; Downgraded:"
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 *
 */
async function cc_diff(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  age = 0,
  sex = "",
  model = "",
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }

  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var cclist = hcc_diff(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (age = defOb.age),
    (model = defOb.model),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = `adds: ${cclist["adds"]}, upgraded: ${cclist["upgraded"]}, downgraded: ${cclist["downgraded"]}, downgraded_to: ${cclist["downgrade_to"]}, deletes: ${cclist["deletes"]}`;
  return result;
}

/**
 * Returns net raf difference between baseline ccs and additional ccs
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_cc_array accepts array of cc codes
 * @param {string[][]} additional_cc_array accepts array of cc codes
 *
 */
async function cc_diff_raf(
  base_cc_array = [],
  additional_cc_array = [],
  ver = "",
  age = 0,
  sex = "",
  model = "",
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_cc_array.length; i++) {
    for (j = 0; j < base_cc_array[i].length; j++) {
      base_cc_array = base_cc_array;
    }
  }
  var temp_base_cc_array = base_cc_array.toString();
  temp_base_cc_array = temp_base_cc_array.split(",");
  for (i = 0; i < temp_base_cc_array.length; i++) {
    temp_base_cc_array[i] = temp_base_cc_array[i].toString().trim();
  }

  for (i = 0; i < additional_cc_array.length; i++) {
    for (j = 0; j < additional_cc_array[i].length; j++) {
      additional_cc_array = additional_cc_array;
    }
  }
  var temp_additional_cc_array = additional_cc_array.toString();
  temp_additional_cc_array = temp_additional_cc_array.split(",");
  for (i = 0; i < temp_additional_cc_array.length; i++) {
    temp_additional_cc_array[i] = temp_additional_cc_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var cclist = hcc_diff(
    temp_base_cc_array,
    temp_additional_cc_array,
    (ver = defOb.ver),
    (age = defOb.age),
    (model = defOb.model),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = parseFloat(cclist["raf"]);
  result = result.toFixed(3);
  return result.toString();
}

/**
 * Compares a base list of dx and additional dx and returns an information block on the differences ; eg: "Adds: E119,  I2720; Deletes: I495; Upgraded: F10250; Downgraded:"
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_dx_array accepts array of dx codes
 * @param {string[][]} additional_dx_array accepts array of dxs codes
 *
 */
async function dx_diff(base_dx_array = [], additional_dx_array = [], ver = "", model = "", never_trump = 0, baserate = 0.0) {
  for (i = 0; i < base_dx_array.length; i++) {
    for (j = 0; j < base_dx_array[i].length; j++) {
      base_dx_array = base_dx_array;
    }
  }
  var temp_base_dx_array = base_dx_array.toString();
  temp_base_dx_array = temp_base_dx_array.split(",");
  for (i = 0; i < temp_base_dx_array.length; i++) {
    temp_base_dx_array[i] = temp_base_dx_array[i].toString().trim();
  }

  for (i = 0; i < additional_dx_array.length; i++) {
    for (j = 0; j < additional_dx_array[i].length; j++) {
      additional_dx_array = additional_dx_array;
    }
  }
  var temp_additional_dx_array = additional_dx_array.toString();
  temp_additional_dx_array = temp_additional_dx_array.split(",");
  for (i = 0; i < temp_additional_dx_array.length; i++) {
    temp_additional_dx_array[i] = temp_additional_dx_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var cclist = dx_diffc(temp_base_dx_array, temp_additional_dx_array, defOb.ver, defOb.model, defOb.never_trump, defOb.baserate);
  var result = `adds: ${cclist["adds"]}, upgraded: ${cclist["upgraded"]}, downgraded: ${cclist["downgraded"]}, downgraded_to: ${cclist["downgrade_to"]}, deletes: ${cclist["deletes"]}`;
  return result;
}

/**
 * Returns net raf difference between baseline ccs and additional ccs
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_dx_array accepts array of dx codes
 * @param {string[][]} additional_dx_array accepts array of dxs codes
 *
 */
async function dx_diff_raf(
  base_dx_array = [],
  additional_dx_array = [],
  ver = "",
  model = "",
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_dx_array.length; i++) {
    for (j = 0; j < base_dx_array[i].length; j++) {
      base_dx_array = base_dx_array;
    }
  }
  var temp_base_dx_array = base_dx_array.toString();
  temp_base_dx_array = temp_base_dx_array.split(",");
  for (i = 0; i < temp_base_dx_array.length; i++) {
    temp_base_dx_array[i] = temp_base_dx_array[i].toString().trim();
  }

  for (i = 0; i < additional_dx_array.length; i++) {
    for (j = 0; j < additional_dx_array[i].length; j++) {
      additional_dx_array = additional_dx_array;
    }
  }
  var temp_additional_dx_array = additional_dx_array.toString();
  temp_additional_dx_array = temp_additional_dx_array.split(",");
  for (i = 0; i < temp_additional_dx_array.length; i++) {
    temp_additional_dx_array[i] = temp_additional_dx_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disabl;
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var age;
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var cclist = dx_diffc(temp_base_dx_array, temp_additional_dx_array, defOb.ver, defOb.model, defOb.never_trump, defOb.baserate);
  var result = parseFloat(cclist["raf"]);
  result = result.toFixed(3);
  return result.toString();
}

/**
 * Returns the net incremental change between dx_lists, for example for calculating the value of a coding project over claims. Equivalent of +Adds - Upgraded in the format('+dx001, +dx18, - dx019')
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_dx_array accepts array of cc codes
 * @param {string[][]} additional_dx_array accepts array of cc codes
 *
 */
async function dx_increment(
  base_dx_array = [],
  additional_dx_array = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_dx_array.length; i++) {
    for (j = 0; j < base_dx_array[i].length; j++) {
      base_dx_array = base_dx_array;
    }
  }
  var temp_base_dx_array = base_dx_array.toString();
  temp_base_dx_array = temp_base_dx_array.split(",");
  for (i = 0; i < temp_base_dx_array.length; i++) {
    temp_base_dx_array[i] = temp_base_dx_array[i].toString().trim();
  }

  for (i = 0; i < additional_dx_array.length; i++) {
    for (j = 0; j < additional_dx_array[i].length; j++) {
      additional_dx_array = additional_dx_array;
    }
  }
  var temp_additional_dx_array = additional_dx_array.toString();
  temp_additional_dx_array = temp_additional_dx_array.split(",");
  for (i = 0; i < temp_additional_dx_array.length; i++) {
    temp_additional_dx_array[i] = temp_additional_dx_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var dx_dict = dx_increments(
    temp_base_dx_array,
    temp_additional_dx_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var neg_arry = dx_dict["upgraded"].map(element => "-" + element);
  var result = dx_dict["adds"].concat(neg_arry);
  return result.toString();
}

/**
 * Returns the RAF of the net incremental change (+Adds - Upgraded) between dx_lists.  Equivalent of dx_raf(dx_diff_increment)
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_dx_array accepts array of cc codes
 * @param {string[][]} additional_dx_array accepts array of cc codes
 *
 */
async function dx_increment_raf(
  base_dx_array = [],
  additional_dx_array = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  for (i = 0; i < base_dx_array.length; i++) {
    for (j = 0; j < base_dx_array[i].length; j++) {
      base_dx_array = base_dx_array;
    }
  }
  var temp_base_dx_array = base_dx_array.toString();
  temp_base_dx_array = temp_base_dx_array.split(",");
  for (i = 0; i < temp_base_dx_array.length; i++) {
    temp_base_dx_array[i] = temp_base_dx_array[i].toString().trim();
  }

  for (i = 0; i < additional_dx_array.length; i++) {
    for (j = 0; j < additional_dx_array[i].length; j++) {
      additional_dx_array = additional_dx_array;
    }
  }
  var temp_additional_dx_array = additional_dx_array.toString();
  temp_additional_dx_array = temp_additional_dx_array.split(",");
  for (i = 0; i < temp_additional_dx_array.length; i++) {
    temp_additional_dx_array[i] = temp_additional_dx_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sex;
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var dx_dict = dx_increments(
    temp_base_dx_array,
    temp_additional_dx_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (never_trump = defOb.never_trump),
    (baserate = defOb.baserate)
  );
  var result = dx_dict["raf"];
  var result = parseFloat(result);
  result = result.toFixed(3);
  return result.toString();
}

/**
 * Compares a base list of dxs and additional dxs and returns a list of dxs that are deletes or downgrades between the additional codes vs the baseline
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_dx_array accepts array of dx codes
 * @param {string[][]} additional_dx_array accepts array of dx codes
 *
 */
async function dx_gaps(
  base_dx_array = [],
  additional_dx_array = [],
  ver = "",
  model = "",
  age = 0,
  sex = "",
  disabl = false,
  baserate = 0.0
) {
  for (i = 0; i < base_dx_array.length; i++) {
    for (j = 0; j < base_dx_array[i].length; j++) {
      base_dx_array = base_dx_array;
    }
  }
  var temp_base_dx_array = base_dx_array.toString();
  temp_base_dx_array = temp_base_dx_array.split(",");
  for (i = 0; i < temp_base_dx_array.length; i++) {
    temp_base_dx_array[i] = temp_base_dx_array[i].toString().trim();
  }

  for (i = 0; i < additional_dx_array.length; i++) {
    for (j = 0; j < additional_dx_array[i].length; j++) {
      additional_dx_array = additional_dx_array;
    }
  }
  var temp_additional_dx_array = additional_dx_array.toString();
  temp_additional_dx_array = temp_additional_dx_array.split(",");
  for (i = 0; i < temp_additional_dx_array.length; i++) {
    temp_additional_dx_array[i] = temp_additional_dx_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var dx_dict = dx_gap(
    temp_base_dx_array,
    temp_additional_dx_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (baserate = defOb.baserate)
  );
  var result = dx_dict["Deletes"].concat(dx_dict["Downgraded"]);
  return result.toString();
}

/**
 * dx_diff_deletes_raf focuses on YoY Chronic Gaps and downgrades (net raf of downgraded).  Equivalent of dx_chronic(dx_diff_deletes).
 * @customfunction
 * @helpurl https://hccexplorer.com/support
 * @param {string[][]} base_dx_array accepts array of dx codes
 * @param {string[][]} additional_dx_array accepts array of dx codes
 *
 */
async function dx_gaps_raf(
  base_dx_array = [],
  additional_dx_array = [],
  ver = "",
  model = "",
  age = 0,
  sex = "",
  disabl = false,
  baserate = 0.0
) {
  for (i = 0; i < base_dx_array.length; i++) {
    for (j = 0; j < base_dx_array[i].length; j++) {
      base_dx_array = base_dx_array;
    }
  }
  var temp_base_dx_array = base_dx_array.toString();
  temp_base_dx_array = temp_base_dx_array.split(",");
  for (i = 0; i < temp_base_dx_array.length; i++) {
    temp_base_dx_array[i] = temp_base_dx_array[i].toString().trim();
  }

  for (i = 0; i < additional_dx_array.length; i++) {
    for (j = 0; j < additional_dx_array[i].length; j++) {
      additional_dx_array = additional_dx_array;
    }
  }
  var temp_additional_dx_array = additional_dx_array.toString();
  temp_additional_dx_array = temp_additional_dx_array.split(",");
  for (i = 0; i < temp_additional_dx_array.length; i++) {
    temp_additional_dx_array[i] = temp_additional_dx_array[i].toString().trim();
  }
  var value;
  try {
    value = await getStorageItem();
  } catch (err) { console.log('Processing'); }
  getdefaultvalue(value);
  var verOb = { ver, ver_temp, default_ver };
  var modelOb = { model, model_temp, default_model };
  var never_trump;
  var neverTrumpOb = { never_trump, never_trump_temp, default_never_trump };
  var disableOb = { disabl, disabl_temp, default_disabl };
  var verbose;
  var verboseOb = { verbose, verbose_temp, default_verbose };
  var ageOb = { age, age_temp, default_age };
  var sexOb = { sex, sex_temp, default_sex };
  var baserateOb = { baserate, baserate_temp, default_baserate };
  var orec;
  var orecOb = { orec, orec_temp, default_orec };
  var defOb = assignDefaultValues(verOb, modelOb, neverTrumpOb, disableOb, verboseOb, ageOb, sexOb, baserateOb,orecOb);
  var dx_dict = dx_gap(
    temp_base_dx_array,
    temp_additional_dx_array,
    (ver = defOb.ver),
    (model = defOb.model),
    (age = defOb.age),
    (disabl = defOb.disabl),
    (baserate = defOb.baserate)
  );
  var result = dx_dict["raf"];
  var result = parseFloat(result);
  result = result.toFixed(3);
  return result.toString();
}

function hcc_gaps(old_list = [], new_list = [], ver = "", model = "", age = 0, disabl = false, baserate = 0.0) {
  /*
  Utility to identify hccs that were dropped or downgraded from one list to the next
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;

  var new_hccs = prep_hccs(new_list, (ver = ver), (model = model), (age = age), (disabl = disabl));
  var old_hccs = prep_hccs(old_list, (ver = ver), (model = model), (age = age), (disabl = disabl));

  var diff = hcc_diff(
    old_hccs,
    new_hccs,
    (ver = ver),
    (age = ""),
    (model = model),
    (disabl = disabl),
    (never_trump = ""),
    (baserate = baserate)
  );
  var cal1 = parseFloat(hcc2raf(diff["deletes"], (ver = ver), (model = model), (disabl = disabl), (age = age)));
  var cal2 = parseFloat(hcc2raf(diff["downgraded"], (ver = ver), (model = model), (disabl = disabl), (age = age)));
  var cal3 = parseFloat(hcc2raf(diff["downgrade_to"], (ver = ver), (model = model), (disabl = disabl), (age = age)));
  var raf = -(cal1 + cal2) + cal3;
  var gaps = {
    Deletes: diff["deletes"],
    Downgraded: diff["downgraded"],
    raf: raf,
    premium: Math.round(raf * baserate, 2)
  };
  return gaps;
}

function dx_gap(old_list = [], new_list = [], ver = "", model = "", age = 0, disabl = false, baserate = 0.0) {
  /*
  Utility to identify hccs that were dropped or downgraded from one list to the next
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;

  var old_hccs = dx2hcc(
    old_list,
    (age = age),
    (ver = ver),
    (model = model),
    (sex = ""),
    (disabl = disabl),
    (never_trump = ""),
    (verbose = "")
  );
  var new_hccs = dx2hcc(
    new_list,
    (age = age),
    (ver = ver),
    (model = model),
    (sex = ""),
    (disabl = disabl),
    (never_trump = ""),
    (verbose = "")
  );
  var diff = hcc_gaps(
    old_hccs,
    new_hccs,
    (ver = ver),
    (model = model),
    (age = age),
    (disabl = disabl),
    (baserate = baserate)
  );
  diff["Downgraded"] = Array.from(get_hcc_dx(diff["Downgraded"], clean_dxlist(old_list, ver), ver));
  diff["Deletes"] = Array.from(get_hcc_dx(diff["Deletes"], clean_dxlist(old_list, ver), ver));
  return diff;
}

function dx2raf(
  dx_list,
  age = 0,
  ver = "",
  model = "",
  sex = "",
  disabl = false,
  verbose = false,
  never_trump = 0,
  baserate = 0.0
) {
  /*
  Utility to calculate raf from list of DX codes
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;
  never_trump = never_trump || default_never_trump;

  var hccs = dx2hcc(
    (dx_list = dx_list),
    (age = age),
    (ver = ver),
    (model = model),
    (sex = sex),
    (disabl = disabl),
    (never_trump = never_trump),
    (verbose = verbose)
  );
  var raf = get_raf([], hccs, (ver = ver), (model = model), (verbose = ""), (baserate = baserate));
  return raf["hcc_score"];
}

function dx2hcc(dx_list, age = 0, ver = "", model = "", sex = "", disabl = false, never_trump = 0, verbose = false) {
  /*
  Utility to calculate a list of unique, trumped, HCCs from dx codes, includes interactions and age/sex edits.
  :param dx_list: list of str
                  List of DX Codes (case and decimal insensitive)
  :param ver: str
              HCC Model version
  :param age: float
              Beneficiary age
  :param verbose:
  :param disabl: bool
                  Disability flag
  :param sex: Gender {"M" or "F"}
  :return: list of str
          List of HCC codes
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  never_trump = never_trump || default_never_trump;
  var dx_dct = dx_hccs(dx_list, (ver = ver), (age = age), (sex = sex), (verbose = verbose));
  var unique_hccs = dxdct_hccs(dx_dct, (never_trump = never_trump));
  var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  unique_hccs.sort(collator.compare);
  unique_hccs = interactions[ver](unique_hccs, model, disabl, age);
  return unique_hccs;
}

function dx_hccs(dx_list, ver = "", age = 0, sex = "", verbose = true) {
  /*
  Look up the HCC code for each unique DX code in a list of DX. Includes trumping and agesex edits
  :param dx_list: list of str
                  List of dx codes; case and decimal insensitive
  :param ver: str
              Optional HCC version. Otherwise uses default version of ccalc object
  :param age: float
              Member age
  :param sex: str
              Member gender {"M"/"F"}
  :param verbose: bool
                  Include Non HCC DX in outputs
  :return: dict
          Dict of unique DX codes and their corresponding hcc codes
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  verbose = verbose || default_verbose;

  var dxmap = default_dxmap[ver];
  var hccmap = default_hccmap[ver];
  var dx_dct = {};

  var unique_dx = clean_dxlist(dx_list, (ver = ver));
  // Validate DX against model and pull in DX info
  for (var dx of unique_dx) {
    if (dx in dxmap) {
      dx_dct[dx] = JSON.parse(JSON.stringify(dxmap[dx]));
    } else if (verbose) {
      dx_dct[dx] = { desc: "", hccs: {} };
    }
  }

  if (age && sex) {
    // age and sex are optional. w/o them this function can still generically do dx->hcc calcs
    agesex_edits(dx_dct, (age = age), (sex = sex));
  }

  // Find all unique HCCs that are valid in the hcc ver
  var unique_hccs = new Set();

  for (var key in dx_dct) {
    if (dx_dct.hasOwnProperty(key)) {
      for (var hcc in dx_dct[key]["hccs"]) {
        if (dx_dct[key]["hccs"].hasOwnProperty(hcc)) {
          if (dx_dct[key]["hccs"][hcc] in hccmap) {
            unique_hccs.add(dx_dct[key]["hccs"][hcc]);
          }
        }
      }
    }
  }

  var got_trumped = {};
  for (var hcc of unique_hccs) {
    for (var child of hccmap[hcc]["children"]) {
      got_trumped[child] = hcc;
    }
  }

  // Apply trumping and convert to HCC sets to lists (better for json serialization)

  for (var dx in dx_dct) {
    if (dx_dct.hasOwnProperty(dx)) {
      var temp_a = dx_dct[dx]["hccs"];
      var temp_b = [];
      for (var i in dx_dct[dx]["hccs"]) {
        temp_b.push({ desc: hccmap[dx_dct[dx]["hccs"][i]]["desc"] });
      }
      var c = temp_a.map(function(e, i) {
        return [e, temp_b[i]];
      });
      var temp_c = {};
      for (var key in c) {
        if (c.hasOwnProperty(key)) {
          temp_c[c[key][0]] = c[key][1];
        }
      }
      dx_dct[dx]["hccs"] = temp_c;
      for (var trumped_hcc in got_trumped) {
        if (got_trumped.hasOwnProperty(trumped_hcc)) {
          if (trumped_hcc in dx_dct[dx]["hccs"]) {
            // If we find trumped HCC, replace with note of its demise
            dx_dct[dx]["hccs"][trumped_hcc]["trumped by"] = got_trumped[trumped_hcc];
          }
        }
      }
    }
  }
  return dx_dct;
}

function dxdct_hccs(dx_dct, never_trump = 0) {
  never_trump = never_trump || default_never_trump;
  var hcc_list = new Set();

  if (never_trump == 0) {
    for (var key in dx_dct) {
      if (dx_dct.hasOwnProperty(key)) {
        for (var hcc in dx_dct[key]["hccs"]) {
          if (dx_dct[key]["hccs"].hasOwnProperty(hcc)) {
            if (!dx_dct[key]["hccs"][hcc].hasOwnProperty(["trumped by"])) {
              hcc_list.add(hcc);
            }
          }
        }
      }
    }
    hcc_list = Array.from(hcc_list);
    var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    hcc_list.sort(collator.compare);
  } else {
    var hcc_list = new Set();
    for (var key in dx_dct) {
      if (dx_dct.hasOwnProperty(key)) {
        for (var hcc in dx_dct[key]["hccs"]) {
          hcc_list.add(hcc);
        }
      }
    }
    hcc_list = Array.from(hcc_list);
    var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    hcc_list.sort(collator.compare);
  }
  return hcc_list;
}

function clean_dxlist(dx_list, ver = "") {
  // Convert string to list, dedupe, and ensure DX are formatted correctly.
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  var dxmap = default_dxmap[ver];
  var list_dx = [];
  for (var i = 0; i < dx_list.length; i++) {
    if (dx_list[i] != "") {
      list_dx[i] = String(dx_list[i])
        .replace(".", "")
        .toUpperCase();
    }
  }
  if (typeof list_dx == "string") {
    list_dx = list_dx.split(/\s*,\s*|\s+|\s*;\s*|\s*:\s*/);
  }
  var dx_set = new Set();
  for (var dx = 0; dx < list_dx.length; dx++) {
    if (dxmap.hasOwnProperty(list_dx[dx])) {
      dx_set.add(list_dx[dx]);
    }
  }
  return dx_set;
}

function clean_hcclist(hcc_list, ver = "") {
  // Convert string to list, dedupe, and ensure HCC are formatted correctly.

  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  var hcc_map = default_hccmap[ver];

  if (typeof hcc_list == "string") {
    hcc_list = hcc_list.split(/\s*,\s*|\s+|\s*;\s*|\s*:\s*/);
  } else if (typeof hcc_list == "number") {
    hcc_list = [hcc_list];
  }

  // If you got integers, add the HCC prefix. If strings, make sure they're stripped and uppercase
  var hcc_list_temp = [];
  for (var hcc of hcc_list) {
    if (!isNaN(hcc.toString().trim())) {
      hcc_list_temp.push("HCC" + hcc.toString().trim());
    } else {
      hcc_list_temp.push(hcc.trim().toUpperCase());
    }
  }
  hcc_list = hcc_list_temp;
  //Replacing HCC019 to HCC19
  var hcc_list_temp = [];
  for (var hcc1 of hcc_list) {
    hcc_list_temp.push(hcc1.replace(/HCC0+/, "HCC"));
  }
  hcc_list = hcc_list_temp;

  // We want HCC1 rather than HCC001, etc.
  var hcc_set = new Set();
  for (var hcc2 of hcc_list) {
    if (hcc_map.hasOwnProperty(hcc2)) {
      hcc_set.add(hcc2);
    }
  }
  return Array.from(hcc_set);
}

function hcc2raf(hcc_list, ver = "", model = "", disabl = false, age = 0, never_trump = 0, baserate = 0.0) {
  /*
  Utility for calculating hcc raf for a list of hccs
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;
  never_trump = never_trump || default_never_trump;

  var temp_hcc_list = prep_hccs(
    hcc_list,
    (ver = ver),
    (model = model),
    (age = age),
    (disabl = disabl),
    (never_trump = 0)
  );
  var raf = get_raf([], temp_hcc_list, (ver = ver), (model = model), (verbose = ""), (baserate = baserate));
  return raf["hcc_score"];
}

function prep_hccs(hcc_list, ver = "", model = "", age = 0, disabl = false, never_trump = 0) {
  /*
  Utility for prepping an HCC list, applying Trumping and Interactions; does not include age/sex interactions
  as they at the DX level
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  never_trump = never_trump || default_never_trump;
  var hccs = trump_hccs(hcc_list, (ver = ver), (never_trump = never_trump));
  hccs = interactions[ver](hccs, model, disabl, age);
  return hccs;
}

function trump_hccs(hcc_list, ver = "", never_trump = 0) {
  // Given a list of HCCs and an HCC version, returns a list of HCCs after trumping
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  never_trump = never_trump || default_never_trump;

  var hccmap = default_hccmap[ver];

  // Make sure we're getting the right format
  hcc_list_temp = clean_hcclist(hcc_list, (ver = ver));
  if (never_trump == 0) {
    var hcc_set = new Set(hcc_list_temp);
    var trumped_set = new Set();
    for (var hcc of hcc_set) {
      if (hcc in hccmap) {
        for (var child of hccmap[hcc]["children"]) {
          trumped_set.add(child);
        }
      }
    }
    var temp_hcc_set = new Set([...hcc_set].filter(x => !trumped_set.has(x)));
    hcc_list_temp = Array.from(temp_hcc_set);
  }

  var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  hcc_list_temp.sort(collator.compare);
  return hcc_list_temp;
}

function hcc_dct(hcc_list, ver = "", age = 0, sex = "", verbose = true) {
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  verbose = verbose || default_verbose;
  var hccmap = default_hccmap[ver];
  var unique_hccs = clean_hcclist(hcc_list, (ver = ver));
  var got_trumped = {};
  for (var hcc of unique_hccs) {
    for (var child of hccmap[hcc]["children"]) {
      got_trumped[child] = hcc;
    }
  }
  var hcc_dct = {};

  for (var hcc of unique_hccs) {
    if (hccmap.hasOwnProperty(hcc)) {
      hcc_dct[hcc] = JSON.parse(JSON.stringify(hccmap[hcc])); // Get details for this hcc Code
      delete hcc_dct[hcc]["parents"];
      delete hcc_dct[hcc]["children"];
    } else if (verbose) {
      hcc_dct[hcc] = { desc: "", parents: {} };
    }
  }

  for (var hcc in hcc_dct) {
    for (var trumped_hcc in got_trumped) {
      if (trumped_hcc == hcc) {
        // If we find trumped HCC, replace with note of its demise
        hcc_dct[hcc]["trumped by"] = got_trumped[trumped_hcc];
      }
    }
  }

  return hcc_dct;
}

function hcc_increment(
  old_list = [],
  new_list = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  // Utility to identify the incremental HCCs and value of adding a new list HCCs to a base list of HCCs
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;
  never_trump = never_trump || default_never_trump;

  var new_hccs = prep_hccs(
    new_list,
    (ver = ver),
    (model = model),
    (age = age),
    (disabl = disabl),
    (never_trump = never_trump)
  );
  var old_hccs = prep_hccs(old_list, (ver = ver), (model = model), (age = age), (disabl = disabl));
  new_hccs = new_hccs + ",".concat(old_hccs);
  var final_hccs = prep_hccs(
    new_hccs,
    (ver = ver),
    (model = model),
    (age = age),
    (disabl = disabl),
    (never_trump = never_trump)
  );
  var diff = hcc_diff(
    old_hccs,
    final_hccs,
    (ver = ver),
    (age = ""),
    (model = model),
    (disabl = disabl),
    (never_trump = never_trump),
    (baserate = baserate)
  );
  diff["final_hccs"] = final_hccs;
  delete diff["downgraded"];
  delete diff["downgrade_to"];
  delete diff["deletes"];
  return diff;
}

function dx_increments(
  old_list = [],
  new_list = [],
  ver = "",
  model = "",
  age = 0,
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  // Utility to identify the incremental HCCs and value of adding a new list DXs to a base list of DXs
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || this.default_baserate;
  never_trump = never_trump || this.default_never_trump;

  var old_hccs = dx2hcc(
    old_list,
    (age = age),
    (ver = ver),
    (model = model),
    (sex = ""),
    (disabl = disabl),
    (never_trump = never_trump),
    (verbose = "")
  );
  var new_hccs = dx2hcc(
    new_list,
    (age = age),
    (ver = ver),
    (model = model),
    (sex = ""),
    (disabl = disabl),
    (never_trump = never_trump),
    (verbose = "")
  );
  var diff = hcc_increment(
    old_hccs,
    new_hccs,
    (ver = ver),
    (model = model),
    (age = age),
    (disabl = disabl),
    (never_trump = never_trump),
    (baserate = baserate)
  );

  var dxinc = {
    adds: Array.from(get_hcc_dx(diff["adds"], clean_dxlist(new_list, ver), ver)),
    upgraded: Array.from(get_hcc_dx(diff["upgraded"], clean_dxlist(old_list, ver), ver))
  };
  dxinc["raf"] = diff["raf"];
  dxinc["premium"] = diff["premium"];
  return dxinc;
}

function get_hcc_dx(hcc_list, dx_list, ver) {
  // Utility to get the Dx Codes by comparing hcc_list with dx_list
  var dxmap = default_dxmap[ver];
  var hcc_set = new Set(hcc_list);
  var mydx = new Set();
  for (var dx of dx_list) {
    var temp_set = new Set(dxmap[dx]["hccs"]);
    var temp = [...temp_set].filter(x => hcc_set.has(x));
    if (dxmap.hasOwnProperty(dx) && temp.length) {
      mydx.add(dx);
    }
  }
  return mydx;
}

function dx_diffc(old_list = [], new_list = [], ver = "", model = "", never_trump = 0, baserate = 0.0) {
  /*
  Utility to compare HCCs and RAF for two lists of dx codes
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;
  never_trump = never_trump || default_never_trump;

  var old_dx = clean_dxlist(old_list, ver);
  var new_dx = clean_dxlist(new_list, ver);
  var old_hccs = dx2hcc(
    old_list,
    (age = ""),
    (ver = ver),
    (model = model),
    (sex = ""),
    (disabl = ""),
    (never_trump = never_trump),
    (verbose = "")
  );
  var new_hccs = dx2hcc(
    new_list,
    (age = ""),
    (ver = ver),
    (model = model),
    (sex = ""),
    (disabl = ""),
    (never_trump = never_trump),
    (verbose = "")
  );

  var diff = hcc_diff(
    old_hccs,
    new_hccs,
    (ver = ver),
    (age = ""),
    (model = model),
    (disabl = ""),
    (never_trump = never_trump),
    (baserate = baserate)
  );
  var dxdiff = {
    adds: Array.from(get_hcc_dx(diff["adds"], new_dx, ver)),
    upgraded: Array.from(get_hcc_dx(diff["upgraded"], old_dx, ver)),
    downgraded: Array.from(get_hcc_dx(diff["downgraded"], old_dx, ver)),
    downgrade_to: Array.from(get_hcc_dx(diff["downgrade_to"], new_dx, ver)),
    deletes: Array.from(get_hcc_dx(diff["deletes"], old_dx, ver))
  };
  dxdiff["raf"] = diff["raf"];
  dxdiff["premium"] = diff["premium"];
  return dxdiff;
}

function hcc_diff(
  old_list = [],
  new_list = [],
  ver = "",
  age = 0,
  model = "",
  disabl = false,
  never_trump = 0,
  baserate = 0.0
) {
  /*
  Calculate the changes between two hcc lists, {"adds":[], "upgraded":[] "downgraded":[], "deletes":[]}
  - "adds" are new HCC Codes (includes upgrades of other codes),
  - "upgraded" are codes from base that are no longer relevant due to new codes
  - "downgraded" are codes from base that are present at a lower specificity in new
  - "deletes" are codes from base that are no longer present at all
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;
  never_trump = never_trump || default_never_trump;

  var hccmap = default_hccmap[ver];
  // Prep cleans and trumps the list and add interactions
  var old_set = new Set(prep_hccs(old_list, (ver = ver), (model = model), (age = age), (disabl = disabl)));
  var new_set = new Set(
    prep_hccs(new_list, (ver = ver), (model = model), (age = age), (disabl = disabl), (never_trump = never_trump))
  );

  // Find the full set of codes that each set can trump
  var old_children = new Set();
  var new_children = new Set();
  var new_parents = new Set();
  for (var hcc1 of old_set) {
    if (hcc1 in hccmap) {
      for (var child of hccmap[hcc1]["children"]) {
        old_children.add(child);
      }
    }
  }
  for (var hcc2 of new_set) {
    if (hcc2 in hccmap) {
      for (var child of hccmap[hcc2]["children"]) {
        new_children.add(child);
      }
    }
  }
  for (var hcc3 of new_set) {
    if (hcc3 in hccmap) {
      for (var child of hccmap[hcc3]["parents"]) {
        new_parents.add(child);
      }
    }
  }

  // New HCCs, except where they are trumped by old HCCs (downgrades)
  var new_hccs_temp = new Set([...new_set].filter(x => !old_set.has(x)));
  var new_hccs = new Set([...new_hccs_temp].filter(x => !old_children.has(x)));
  var downgraded_temp = new Set([...old_set].filter(x => !new_set.has(x)));
  var downgraded = new Set([...downgraded_temp].filter(x => new_parents.has(x)));
  var downgrade_to_temp = new Set([...new_set].filter(x => !old_set.has(x)));
  var downgrade_to = new Set([...downgrade_to_temp].filter(x => old_children.has(x)));
  var upgraded = new Set();
  if (never_trump === 1) {
    var prep_hccs_set = new Set(
      prep_hccs(Array.from(new_set), (ver = ver), (model = model), (age = age), (disabl = disabl), (never_trump = ""))
    );
    var upgraded_temp = new Set([...old_set].filter(x => !prep_hccs_set.has(x)));
    upgraded = [...upgraded_temp].filter(x => new_children.has(x)); // Noqa E501
  } else {
    var upgraded_temp = new Set([...old_set].filter(x => !new_set.has(x)));
    upgraded = [...upgraded_temp].filter(x => new_children.has(x));
  }
  var del_hccs_temp = new Set([...old_set].filter(x => !new_set.has(x)));
  var del_hccs_union = new Set([...upgraded, ...downgraded]);
  var del_hccs = new Set([...del_hccs_temp].filter(x => !del_hccs_union.has(x)));
  var old_raf = hcc2raf(
    Array.from(old_set),
    (ver = ver),
    (model = model),
    (disabl = ""),
    (age = ""),
    (never_trump = never_trump),
    (baserate = baserate)
  );
  var new_raf = hcc2raf(
    Array.from(new_set),
    (ver = ver),
    (model = model),
    (disabl = ""),
    (age = ""),
    (never_trump = never_trump),
    (baserate = baserate)
  );
  var delta_raf = new_raf - old_raf;
  var premium = (delta_raf * baserate).toFixed(2);
  var diff = {
    adds: Array.from(new_hccs),
    upgraded: Array.from(upgraded),
    downgraded: Array.from(downgraded),
    downgrade_to: Array.from(downgrade_to),
    deletes: Array.from(del_hccs),
    raf: delta_raf,
    premium: premium
  };
  return diff;
}

function member(condition_list, age = 65, sex = "M", model = "", orec = "0", ver = "", baserate = 0.0) {
  /*
      Builds an HCC risk score for a Medicare Advantage member given demographic and disease factors
      :param dx_list: list of str
                      List of DX codes; case and decimal insensitive
      :param age: float
                  Age of member
      :param sex: str
                  Gender of Member: Accepts "M"/"F", "Male"/"Female" or CMS numerical codes 1/2
      :param model: str
                  HCC Model to be used for member. Accepts:
                      "CNA": Community - Non-dual aged
                      "CND": Community - Non-dual disabled
                      "CFA": Community - Full Benefit dual aged
                      "CFD": Community - Full Benefit dual disabled
                      "CPA": Community - Partial Benefit dual aged
                      "CPD": Community - Partial Benefit dual disabled
                      "INS": Institutional
                      "NE": New enrollee
                      "SNPNE": C-SNP new enrolee
      :param orec: str
                  Original Reason for Entitlement:
                      "0": Old age (OASI)
                      "1": Disability (DIB)
                      "2": End Stage Renal Disease (ESRD)
                      "3": Both DIB and ESRD

      :param ver: str
                  Version of HCC Model to be used (overrides default version set in Ccalc).
                  Accepts {'v22', 'v23', 'v24'}
      :return: dict
              Map of factors and risk scores for member
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;
  var verbose = default_verbose;
  var hccmap = default_hccmap[ver];

  // Get age/sex/disability demographic codes
  var disabl = model.endsWith("D");
  var demo_codes = agesex(age, sex, orec, model);

  // Condition resolver to get the condition list as either Dx or HCC
  var cond_dict = condition_resolver(condition_list, (ver = ver), (model = model), (never_trump = ""), (allhcc = ""));
  var condition = cond_dict["condition"];
  var allhcc = cond_dict["allhcc"];
  var flag;
  var raf;
  var dx_dct;

  if (allhcc == 1) {
    var dx_dct = hcc_dct(condition, (ver = ver), (age = age), (sex = sex), (verbose = verbose));
    var unique_hccs = prep_hccs(
      condition,
      (ver = ver),
      (model = model),
      (age = age),
      (disabl = ""),
      (never_trump = "")
    );
    unique_hccs = interactions[ver](unique_hccs, model, disabl, age);
    raf = get_raf(demo_codes, unique_hccs, (ver = ver), (model = model), (verbose = ""), (baserate = baserate));
    flag = "hcc";
    var dx_hcc = [];
    // Update the dictionary with interaction codes and desc as Interaction Codes
    for (var hcc of unique_hccs) {
      if (!(hcc in dx_dct)) {
        dx_dct.set(hcc, "{'desc': 'Interaction Codes'}");
      }
    }

    // Appending dictionary to the json format
    for (var hcc in dx_dct) {
      var dic_dxlist = {};
      dic_dxlist["dx_name"] = None;
      dic_dxlist["dx_desc"] = None;
      var temp_dict = {};
      temp_dict[hcc] = dx_dct[hcc];
      var hcc_list = mem_out_wrapper((dict1 = temp_dict), (raf = raf["hcc_detail"]), (baserate = baserate));
      dic_dxlist["hcc_list"] = hcc_list;
      dx_hcc.push(dic_dxlist);
    }
  } else {
    // process DX list
    dx_dct = dx_hccs(condition, (ver = ver), (age = age), (sex = sex), (verbose = verbose));
    var unique_hccs = dxdct_hccs(dx_dct, (never_trump = ""));
    unique_hccs = interactions[ver](unique_hccs, model, disabl, age);
    raf = get_raf(demo_codes, unique_hccs, (ver = ver), (model = model), (verbose = ""), (baserate = baserate));
    flag = "dx";
    dx_hcc = [];
    // Appending dictionary to the json format
    for (var dx in dx_dct) {
      var dic_dxlist = {};
      dic_dxlist["dx_name"] = dx; // Get details for this DX Code
      dic_dxlist["dx_desc"] = dx_dct[dx]["desc"];
      var hcc_list = mem_out_wrapper((raf = raf["hcc_detail"]), (dict1 = dx_dct[dx]["hccs"]), (baserate = baserate));
      dic_dxlist["hcc_list"] = hcc_list;
      dx_hcc.push(dic_dxlist);
    }

    // Appending interaction codes to the dictionary
    for (var hcc of unique_hccs) {
      if (!(hcc in hccmap)) {
        var dic_dxlist = {};
        dic_dxlist["dx_name"] = None; // Get details for this DX Code
        dic_dxlist["dx_desc"] = None;
        dic_hcclist = {};
        dic_hcclist["hcc_name"] = hcc;
        dic_hcclist["hcc_desc"] = "Interaction Codes";
        dic_hcclist["trumped_by"] = [];
        dic_hcclist["hcc_raf"] = raf["hcc_detail"][hcc];
        dic_hcclist["premium"] = Math.round(dic_hcclist["hcc_raf"] * baserate);
        hcc_list = [];
        hcc_list.push(dic_hcclist);
        dic_dxlist["hcc_list"] = hcc_list;
        dx_hcc.push(dic_dxlist);
      }
    }
  }

  return {
    hcc_model: { version: ver, model: model },
    demo: { age: age, sex: sex, orec: orec },
    raf: raf,
    flag: flag,
    dx_hccs: dx_dct
  };
}

function mem_out_wrapper(raf, baserate, dict1 = {}) {
  // Utility to convert dictionary output to desired format
  hcc_list = [];
  for (var hcc in dict1) {
    var dic_hcclist = {};
    dic_hcclist["hcc_name"] = hcc;
    dic_hcclist["hcc_desc"] = dict1[hcc]["desc"];
    dic_hcclist["trumped_by"] = [];
    if ("trumped by" in dict1[hcc]) {
      dic_hcclist["trumped_by"] = dict1[hcc]["trumped by"].split();
      dic_hcclist["hcc_raf"] = None;
      dic_hcclist["premium"] = None;
    } else {
      dic_hcclist["hcc_raf"] = raf[hcc];
      dic_hcclist["premium"] = Math.round(dic_hcclist["hcc_raf"] * baserate);
    }
    hcc_list.push(dic_hcclist);
  }
  return hcc_list;
}

function condition_resolver(conditionlist, ver = "", model = "", never_trump = 0, allhcc = 0) {
  /*
  Utility to convert the condition list to one: either Dx or HCC
  returns dict of:
      'condition': list of Dx/HCC based on the input
      'allhcc' : boolean,
                 Provides whether all were Dx or we converted them to HCC
  */

  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  never_trump = never_trump || default_never_trump;

  var list_hcc = [];
  for (item in conditionlist) {
    if (Number.isInteger(item) || item.startsWith("HCC")) {
      list_hcc.push(item);
    }
  }
  var list_dx = [];
  var list_dx_clean = [];
  var dct = new Set();
  if (list_hcc.length > 0 || allhcc) {
    allhcc = 1;
    list_dx = conditionlist.filter(item => !list_hcc.includes(item));
    list_dx_clean = clean_dxlist(list_dx, ver);
    var hccs = dx2hcc(
      list_dx_clean,
      (age = ""),
      (ver = ver),
      (model = model),
      (sex = ""),
      (disabl = ""),
      (never_trump = never_trump),
      (verbose = "")
    );
    var combined_hccs = list_hcc.concat(hccs);
    dct = { allhcc: allhcc, condition: combined_hccs };
  } else {
    list_dx = conditionlist;
    dct = { allhcc: allhcc, condition: list_dx };
  }
  return dct;
}

function agesex_edits(dx_dct, age, sex) {
  // noqa C901
  /*
  Edits DX List for a beneficiary based on AGE/SEX (From CMS I0V05ED2.TXT)
  Valid for V22, V23, V24
  :param dx_dct: dict
                 Dict of {DX:HCC}
  :param age: float
              Age of member
  :param sex: str
              Member's gender
  :return: dx_dct: dict
              Dictionary of {DX:HCC} edited per member age/sex rules
  */
  var ed_leukemia = [
    "C9100",
    "C9101",
    "C9102",
    "C9500",
    "C9501",
    "C9502",
    "C7400",
    "C7401",
    "C7402",
    "C7410",
    "C7411",
    "C7412",
    "C7490",
    "C7491",
    "C7492"
  ];

  var ed_bronchitis = ["J410", "J411", "J418", "J42", "J440", "J441"];

  var ed_vasc_insf = [
    "K55011",
    "K55012",
    "K55019",
    "K55021",
    "K55022",
    "K55029",
    "K55031",
    "K55032",
    "K55039",
    "K55041",
    "K55042",
    "K55049",
    "K55051",
    "K55052",
    "K55059",
    "K55061",
    "K55062",
    "K55069",
    "K5530",
    "K5531",
    "K5532",
    "K5533"
  ];

  var ed_emphysema = ["J430", "J431", "J432", "J438", "J439", "J449", "J982", "J983"];

  var ed_breastca = [
    "C50011",
    "C50012",
    "C50019",
    "C50021",
    "C50022",
    "C50029",
    "C50111",
    "C50112",
    "C50119",
    "C50121",
    "C50122",
    "C50129",
    "C50211",
    "C50212",
    "C50219",
    "C50221",
    "C50222",
    "C50229",
    "C50311",
    "C50312",
    "C50319",
    "C50321",
    "C50322",
    "C50329",
    "C50411",
    "C50412",
    "C50419",
    "C50421",
    "C50422",
    "C50429",
    "C50511",
    "C50512",
    "C50519",
    "C50521",
    "C50522",
    "C50529",
    "C50611",
    "C50612",
    "C50619",
    "C50621",
    "C50622",
    "C50629",
    "C50811",
    "C50812",
    "C50819",
    "C50821",
    "C50822",
    "C50829",
    "C50911",
    "C50912",
    "C50919",
    "C50921",
    "C50922",
    "C50929"
  ];

  var ed_low_bw = [
    "P0500",
    "P0501",
    "P0502",
    "P0503",
    "P0504",
    "P0505",
    "P0506",
    "P0507",
    "P0508",
    "P0509",
    "P0510",
    "P0511",
    "P0512",
    "P0513",
    "P0514",
    "P0515",
    "P0516",
    "P0517",
    "P0518",
    "P0519",
    "P052",
    "P059",
    "P0700",
    "P0701",
    "P0702",
    "P0703",
    "P0710",
    "P0714",
    "P0715",
    "P0716",
    "P0717",
    "P0718",
    "P0720",
    "P0721",
    "P0722",
    "P0723",
    "P0724",
    "P0725",
    "P0726",
    "P0730",
    "P0731",
    "P0732",
    "P0733",
    "P0734",
    "P0735",
    "P0736",
    "P0737",
    "P0738",
    "P0739",
    "P080",
    "P081",
    "P0821",
    "P0822"
  ];

  var ed_conjoined = ["Q894"];

  var ed_newbn_substance = [
    "K551",
    "K558",
    "K559",
    "P041",
    "P0411",
    "P0412",
    "P0413",
    "P0414",
    "P0415",
    "P0416",
    "P0417",
    "P0418",
    "P0419",
    "P041A",
    "P042",
    "P043",
    "P0440",
    "P0441",
    "P0442",
    "P0449",
    "P045",
    "P046",
    "P048",
    "P0481",
    "P0489",
    "P049",
    "P930",
    "P938",
    "P961",
    "P962",
    "Q390",
    "Q391",
    "Q392",
    "Q393",
    "Q394",
    "Q6410",
    "Q6411",
    "Q6412",
    "Q6419",
    "Q790",
    "Q791",
    "Q792",
    "Q793",
    "Q794",
    "Q7951"
  ];

  var ed_chron_resp = ["P270", "P271", "P278", "P279"];

  var ed_disruptive_mood = ["F3481"];

  var ed_hemophilia = ["D66", "D67"];

  // Optimal to have the loop outside of the age checks, but this is easier to read
  for (var dx in dx_dct) {
    // Split acute lymphoid and other acute leukemias, except  myeloid diagnoses to age 18+ (HCC 8)
    // and age <18 (HCC 9). Split adrenal gland cancer diagnoses to age 18+ (HCC 10) and age <18 (HCC 9).
    if (age < 18 && ed_leukemia.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC9"];
    }

    // Split chronic bronchitis diagnoses to age 18+ (HCC 160) and age <18 (HCC 161)
    if (age < 18 && ed_bronchitis.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC161"];
    }

    // Split acute vascular insufficiency of intestine diagnosis to age 2+ (HCC 154) and age <2 (HCC 42)
    if (age < 2 && ed_vasc_insf.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC42"];
    }

    // Split breast cancer diagnoses to age 50+ (HCC 12) and age <50 (HCC 11)
    if (age < 50 && ed_breastca.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC11"];
    }

    // Split emphysema diagnoses to age 18+ (HCC 160) and age 2-17 (HCC160; split not needed in HHS model).
    // If age <2 out of payment model
    if (age < 2 && ed_emphysema.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC1"];
    }

    // Edit for newborn low birthweight. If age 1+ out of payment model
    if (age != 0 && ed_low_bw.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC1"];
    }

    // Split conjoined twins diagnoses to age 1+ (HCC 97) and age <1 (HCC 247)
    if (age >= 1 && ed_conjoined.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC97"];
    }

    // Neonatal effects of maternal drug abuse: If age 2+ out of payment model
    if (age >= 2 && ed_newbn_substance.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC1"];
    }

    // Split chronic respiratory disease arising in the perinatal period diagnoses to age 2+
    // (HCC 162) and age <2 (HCC 127).
    if (age >= 2 && ed_chron_resp.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC162"];
    }

    // Mood disorder: Edit for targeted age of diagnosis. If age <6 or age >18 out of payment model.
    if (age < 6 || (age > 18 && ed_disruptive_mood.includes(dx))) {
      dx_dct[dx]["hccs"] = ["HCC1"];
    }

    // Split hemophilia diagnoses to male (HCC 66 if age <65 or HCC 66 if age 65+; age split not needed in HHS model)
    //  and female (HCC 75)
    female_sex = ["2", "F", "Female"];
    if (female_sex.includes(sex) && ed_hemophilia.includes(dx)) {
      dx_dct[dx]["hccs"] = ["HCC75"];
    }
  }

  edit_dct = {}; // Build new dict after filtering out all HCCs edited out
  for (dx in dx_dct) {
    if (dx_dct[dx]["hccs"] != ["HCC1"]) {
      edit_dct[dx] = dx_dct[dx];
    }
  }

  return edit_dct;
}

function get_raf(demo_lst, hcc_lst, ver = "", model = "", verbose = true, baserate = 0.0) {
  /*
  Look up demographic and hcc RAF for a member given codes. IMPORTANT: ASSUMES HCCs are already clean and deduped
  and hierarchy. Based on CMS V2218O1P.TXT.  Returns a dict of risk scores in the format:
  {
      raf: float of total risk factor,
      premium: PM PM payment for members of this raf and base rate($)
      demo_raf: float of demographic risk factor
      hcc_raf: float of hcc risk factor
      demo_detail: dict of {demographic_code: demo_raf} for each demographic code in list
      hcc_defail: dict of {hcc_code: hcc:raf} for each hcc code in list
  :param model: str
                  Hcc model for use
  :param demo_lst: list of str
                  List of applicable demographic codes for a member (eg CNA_F65_70)
  :param hcc_lst: list of str
                  List of hccs (assumes hccs have already been trumped)
  :param ver: str
                  Optional HCC version to be used in calculation
  :param model: str
          Optional HCC model to be used in calculation
  :param verbose: bool
  :param baserate: float
                  pmpm premium base rate
  :return: dict
          raf_dct
  */
  ver === null || ver === "" || ver === 0 ? (ver = default_ver) : (ver = ver.toLowerCase());
  model === null || model === "" || model === 0 ? (model = default_model) : convertToUppperCase(model);
  baserate = baserate || default_baserate;
  verbose = verbose || default_verbose;

  var hcccoefn = default_hcccoefn[ver];
  var demo_detail = {};
  var hcc_detail = {};
  var demo_raf = 0.0;
  var hcc_raf = 0.0;

  for (var demo of demo_lst) {
    if (hcccoefn.hasOwnProperty(demo)) {
      demo_detail[demo] = hcccoefn[demo];
      demo_raf += hcccoefn[demo];
    }
  }

  for (var hcc = 0; hcc < hcc_lst.length; hcc++) {
    var label = model + "_" + hcc_lst[hcc];
    if (label in hcccoefn) {
      hcc_detail[hcc] = hcccoefn[label];
      hcc_raf += hcccoefn[label];
    } else if (verbose) {
      hcc_detail[hcc] = 0.0;
    }
  }

  var score = (demo_raf + hcc_raf).toFixed(4);
  var raf_dct = {
    score: score,
    premium: (score * baserate).toFixed(),
    demo_score: demo_raf.toFixed(4),
    hcc_score: hcc_raf.toFixed(4),
    demo_detail: demo_detail,
    hcc_detail: hcc_detail
  };
  return raf_dct;
}

function agesex(age, sex, orec, model) {
  /*
      Create demographic variables used in regressions, from CMS SAS macro AGESEXV2
      Valid for V22, V23, V24
      :param age: float
                  Age of beneficiary
      :param sex: str
                  Gender of beneficiary
      :param orec: str
                  Original reason for enrollment
      :param model: str
                  Code for CMS model (str)
      :return: list of str
              list of demographic str for looking up demo coefficients
  */
  let age_maps = {
    STD: ["0_34", "35_44", "45_54", "55_59", "60_64", "65_69", "70_74", "75_79", "80_84", "85_89", "90_94", "95_GT"],
    NE: [
      "0_34",
      "35_44",
      "45_54",
      "55_59",
      "60_64",
      "65",
      "66",
      "67",
      "68",
      "69",
      "70_74",
      "75_79",
      "80_84",
      "85_89",
      "90_94",
      "95_GT"
    ]
  };

  age = Math.trunc(age); // In case float is passed and someone at upper age bound

  let demo_str;
  let male_sex = ["M", "MALE", "1"];
  if (male_sex.includes(sex.toUpperCase())) {
    demo_str = "M";
  } else {
    demo_str = "F";
  }

  // Directly from CMS AGESEXV2
  let disabl = age < 65 && orec != "0";
  let origds = orec == "1" && !disabl;
  let medicaid;
  let medicaid_condition = ["CP", "CF"];
  if (medicaid_condition.includes(model)) {
    medicaid = true;
  } else {
    medicaid = false;
  }
  let new_enrolee = model.endsWith("NE");
  let age_labels = [];
  if (new_enrolee) {
    age_labels = age_maps["NE"];
  } else {
    age_labels = age_maps["STD"];
  }

  // Derive the lower bound & upper bound of each age band from ordered list of age labels
  let age_lower_bounds = [];
  let age_upper_bounds = [];
  for (let i in age_labels) {
    let split = age_labels[i].split("_");
    age_lower_bounds.push(split[0]);
    age_upper_bounds.push(split[1]);
  }

  for (var [index, lower_bound] of age_lower_bounds.entries()) {
    if (index == age_lower_bounds[age_lower_bounds.length] - 1) {
      demo_str += age_labels[index];
      break;
    }
    if (lower_bound <= age && age < age_lower_bounds[index + 1]) {
      demo_str += age_labels[index];
      break;
    }
  }

  if (model.endsWith("NE")) {
    if (medicaid) {
      let mcaid_flag = "";
    } else {
      mcaid_flag = "N";
    }
    if (origds) {
      let origds_flag = "";
    } else {
      origds_flag = "N";
    }
    demo_str = mcaid_flag + "MCAID_" + origds_flag + "ORIGDIS_NE" + demo_str;
  }

  let demo_lst = [model + "_" + demo_str];
  let model_type = ["CNA", "CFA", "CPA"];
  let ds_str;
  let sex_type;

  if (model_type.includes(model) && origds) {
    if (sex === "M") {
      sex_type = "Male";
    } else {
      sex_type = "Female";
    }
    ds_str = model + "_OriginallyDisabled_" + sex_type;
    demo_lst.push(ds_str);
  }
  return demo_lst;
}

function v22_interactions(ccs, model, disabl = false, age = "") {
  /*
  Calculated interaction HCCs given a list of hccs, age, and disability flag
  :param ccs: List of HCCs in the format "HCC18" no trumping or cleaning of HCCs is done in this function
  :param disabl: CMS disabled flag
  :param age: Optional age of beneficiary; only one interaction uses age and it will be assumed false if not entered
  :return: List of HCC codes, including interaction codes
  */
  var cc_set = new Set(ccs);
  var int_hccs = {};

  // diagnostic categories

  var diag_cats = {
    CANCER: new Set(["HCC8", "HCC9", "HCC10", "HCC11", "HCC12"]),
    DIABETES: new Set(["HCC17", "HCC18", "HCC19"]),
    CARD_RESP_FAIL: new Set(["HCC82", "HCC83", "HCC84"]),
    CHF: new Set(["HCC85"]),
    gCopdCF: new Set(["HCC110", "HCC111", "HCC112"]),
    RENAL: new Set(["HCC134", "HCC135", "HCC136", "HCC137"]),
    SEPSIS: new Set(["HCC2"]),
    gSubstanceAbuse: new Set(["HCC54", "HCC55"]),
    gPsychiatric: new Set(["HCC57", "HCC58"])
  };

  var my_dcs = {};

  for (var key in diag_cats) {
    if (diag_cats.hasOwnProperty(key)) {
      var key_set = new Set(diag_cats[key]);
      var new_values = new Set([...key_set].filter(x => cc_set.has(x)));
      my_dcs[key] = new_values;
    }
  }
  // Community Interactions
  var arry1 = ["CNA", "CFA", "CPA", "CND", "CFD", "CPD"];
  if (arry1.includes(model)) {
    var hcc85_set = new Set([...new Set(["HCC85"])].filter(x => cc_set.has(x)));
    var hcc47_set = new Set([...new Set(["HCC47"])].filter(x => cc_set.has(x)));
    var hcc96_set = new Set([...new Set(["HCC96"])].filter(x => cc_set.has(x)));

    if (my_dcs["CANCER"].size && hcc47_set.size) {
      int_hccs["HCC47_gCancer"] = hcc47_set;
    } else {
      int_hccs["HCC47_gCancer"] = new Set();
    }

    if (my_dcs["DIABETES"].size && hcc85_set.size) {
      int_hccs["HCC85_gDiabetesMellit"] = hcc85_set;
    } else {
      int_hccs["HCC85_gDiabetesMellit"] = new Set();
    }

    if (my_dcs["gCopdCF"].size && hcc85_set.size) {
      int_hccs["HCC85_gCopdCF"] = hcc85_set;
    } else {
      int_hccs["HCC85_gCopdCF"] = new Set();
    }

    if (my_dcs["RENAL"].size && hcc85_set.size) {
      int_hccs["HCC85_gRenal_V23"] = hcc85_set;
    } else {
      int_hccs["HCC85_gRenal_V23"] = new Set();
    }
    if (my_dcs["gCopdCF"].size && my_dcs["CARD_RESP_FAIL"].size) {
      int_hccs["gRespDepandArre_gCopdCF"] = my_dcs["CARD_RESP_FAIL"];
    } else {
      int_hccs["gRespDepandArre_gCopdCF"] = new Set();
    }
    if (hcc96_set.size && hcc85_set.size) {
      int_hccs["HCC85_HCC96"] = hcc96_set;
    } else {
      int_hccs["HCC85_HCC96"] = new Set();
    }
    if (my_dcs["gPsychiatric"].size && my_dcs["gSubstanceAbuse"].size) {
      int_hccs["gSubstanceAbuse_gPsychiatric"] = my_dcs["gSubstanceAbuse"];
    } else {
      int_hccs["gSubstanceAbuse_gPsychiatric"] = new Set();
    }
  }

  // institutional model interactions
  var arry2 = ["INS"];
  if (arry2.includes(model)) {
    var hcc188_set = new Set([...new Set(["HCC188"])].filter(x => cc_set.has(x)));
    var hcc114_set = new Set([...new Set(["HCC114"])].filter(x => cc_set.has(x)));
    var hcc57_set = new Set([...new Set(["HCC57"])].filter(x => cc_set.has(x)));
    var hcc79_set = new Set([...new Set(["HCC79"])].filter(x => cc_set.has(x)));

    int_hccs["PRESSURE_ULCER"] = new Set([...new Set(["HCC157", "HCC158"])].filter(x => cc_set.has(x)));
    if (my_dcs["CHF"].size && my_dcs["gCopdCF"].size) {
      int_hccs["CHF_gCopdCF"] = my_dcs["gCopdCF"];
    } else {
      int_hccs["CHF_gCopdCF"] = new Set();
    }

    if (my_dcs["CARD_RESP_FAIL"].size && my_dcs["gCopdCF"].size) {
      int_hccs["gCopdCF_CARD_RESP_FAIL"] = my_dcs["CARD_RESP_FAIL"];
    } else {
      int_hccs["gCopdCF_CARD_RESP_FAIL"] = new Set();
    }

    if (my_dcs["SEPSIS"].size && int_hccs["PRESSURE_ULCER"].size) {
      int_hccs["SEPSIS_PRESSURE_ULCER"] = int_hccs["PRESSURE_ULCER"];
    } else {
      int_hccs["SEPSIS_PRESSURE_ULCER"] = new Set();
    }

    if (my_dcs["SEPSIS"].size && hcc188_set.size) {
      int_hccs["SEPSIS_ARTIF_OPENINGS"] = hcc188_set;
    } else {
      int_hccs["SEPSIS_ARTIF_OPENINGS"] = new Set();
    }

    if (int_hccs["PRESSURE_ULCER"].size && hcc188_set.size) {
      int_hccs["ART_OPENINGS_PRESSURE_ULCER"] = int_hccs["PRESSURE_ULCER"];
    } else {
      int_hccs["ART_OPENINGS_PRESSURE_ULCER"] = new Set();
    }

    if (my_dcs["DIABETES"].size && my_dcs["CHF"].size) {
      int_hccs["DIABETES_CHF"] = my_dcs["CHF"];
    } else {
      int_hccs["DIABETES_CHF"] = new Set();
    }

    if (my_dcs["gCopdCF"].size && hcc114_set.size) {
      int_hccs["gCopdCF_ASP_SPEC_B_PNEUM"] = hcc114_set;
    } else {
      int_hccs["gCopdCF_ASP_SPEC_B_PNEUM"] = new Set();
    }

    if (int_hccs["PRESSURE_ULCER"].size && hcc114_set.size) {
      int_hccs["ASP_SPEC_BACT_PNEUM_PRES_ULC"] = int_hccs["PRESSURE_ULCER"];
    } else {
      int_hccs["ASP_SPEC_BACT_PNEUM_PRES_ULC"] = new Set();
    }

    if (my_dcs["SEPSIS"].size && hcc114_set.size) {
      int_hccs["SEPSIS_ASP_SPEC_BACT_PNEUM"] = hcc114_set;
    } else {
      int_hccs["SEPSIS_ASP_SPEC_BACT_PNEUM"] = new Set();
    }

    if (my_dcs["gCopdCF"].size && hcc57_set.size) {
      int_hccs["SCHIZOPHRENIA_gCopdCF"] = my_dcs["gCopdCF"];
    } else {
      int_hccs["SCHIZOPHRENIA_gCopdCF"] = new Set();
    }
    if (my_dcs["CHF"].size && hcc57_set.size) {
      int_hccs["SCHIZOPHRENIA_CHF"] = my_dcs["CHF"];
    } else {
      int_hccs["SCHIZOPHRENIA_CHF"] = new Set();
    }
    if (hcc79_set.size && hcc57_set.size) {
      int_hccs["SCHIZOPHRENIA_SEIZURES"] = hcc79_set;
    } else {
      int_hccs["SCHIZOPHRENIA_SEIZURES"] = new Set();
    }
  }

  if (disabl === true || disabl == 1) {
    int_hccs["DISABLED_HCC85"] = new Set([...new Set(["HCC85"])].filter(x => cc_set.has(x)));
    if ("PRESSURE_ULCER" in int_hccs) {
      int_hccs["DISABLED_PRESSURE_ULCER"] = int_hccs["PRESSURE_ULCER"];
    }
    int_hccs["DISABLED_HCC161"] = new Set([...new Set(["HCC161"])].filter(x => cc_set.has(x)));
    int_hccs["DISABLED_HCC39"] = new Set([...new Set(["HCC39"])].filter(x => cc_set.has(x)));
    int_hccs["DISABLED_HCC77"] = new Set([...new Set(["HCC77"])].filter(x => cc_set.has(x)));
    int_hccs["DISABLED_HCC6"] = new Set([...new Set(["HCC6"])].filter(x => cc_set.has(x)));

    if (typeof age !== "undefined" && age < 65) {
      int_hccs["disable_substAbuse_psych_V23"] = int_hccs["gSubstanceAbuse_gPsychiatric"];
    }
  }

  var int_hccs_new = [];
  for (var key in int_hccs) {
    if (int_hccs.hasOwnProperty(key)) {
      if (int_hccs[key].size !== 0) {
        int_hccs_new.push(key);
      }
    }
  }
  return ccs.concat(int_hccs_new);
}

function v23_interactions(ccs, model, disabl = false, age = "") {
  /*
  Calculated interaction HCCs given a dict of hccs, age, and disability flag
  :param ccs: List of HCCs in the format "HCC18" no trumping or cleaning of HCCs is done in this function
  :param disabl: CMS disabled flag
  :param age: Optional age of beneficiary; only one interaction uses age and it will be assumed false if not entered
  :return: List of HCC codes, including interaction codes
  */
  var cc_set = new Set(ccs);
  var int_hccs = {};

  // diagnostic categories

  var diag_cats = {
    CANCER: new Set(["HCC8", "HCC9", "HCC10", "HCC11", "HCC12"]),
    DIABETES: new Set(["HCC17", "HCC18", "HCC19"]),
    CARD_RESP_FAIL: new Set(["HCC82", "HCC83", "HCC84"]),
    CHF: new Set(["HCC85"]),
    gCopdCF: new Set(["HCC110", "HCC111", "HCC112"]),
    RENAL_V23: new Set(["HCC134", "HCC135", "HCC136", "HCC137", "HCC138"]),
    SEPSIS: new Set(["HCC2"]),
    gSubstanceAbuse_V23: new Set(["HCC54", "HCC55", "HCC56"]),
    gPsychiatric_V23: new Set(["HCC57", "HCC58", "HCC59", "HCC60"])
  };

  var my_dcs = {};

  for (var key in diag_cats) {
    if (diag_cats.hasOwnProperty(key)) {
      var key_set = new Set(diag_cats[key]);
      var new_values = new Set([...key_set].filter(x => cc_set.has(x)));
      my_dcs[key] = new_values;
    }
  }
  // Community Interactions
  var arry1 = ["CNA", "CFA", "CPA", "CND", "CFD", "CPD"];
  if (arry1.includes(model)) {
    var hcc85_set = new Set([...new Set(["HCC85"])].filter(x => cc_set.has(x)));
    var hcc47_set = new Set([...new Set(["HCC47"])].filter(x => cc_set.has(x)));
    var hcc96_set = new Set([...new Set(["HCC96"])].filter(x => cc_set.has(x)));

    if (my_dcs["CANCER"].size && hcc47_set.size) {
      int_hccs["HCC47_gCancer"] = hcc47_set;
    } else {
      int_hccs["HCC47_gCancer"] = new Set();
    }

    if (my_dcs["DIABETES"].size && hcc85_set.size) {
      int_hccs["HCC85_gDiabetesMellit"] = hcc85_set;
    } else {
      int_hccs["HCC85_gDiabetesMellit"] = new Set();
    }

    if (my_dcs["gCopdCF"].size && hcc85_set.size) {
      int_hccs["HCC85_gCopdCF"] = hcc85_set;
    } else {
      int_hccs["HCC85_gCopdCF"] = new Set();
    }

    if (my_dcs["RENAL_V23"].size && hcc85_set.size) {
      int_hccs["HCC85_gRenal_V23"] = hcc85_set;
    } else {
      int_hccs["HCC85_gRenal_V23"] = new Set();
    }
    if (my_dcs["gCopdCF"].size && my_dcs["CARD_RESP_FAIL"].size) {
      int_hccs["gRespDepandArre_gCopdCF"] = my_dcs["CARD_RESP_FAIL"];
    } else {
      int_hccs["gRespDepandArre_gCopdCF"] = new Set();
    }
    if (hcc96_set.size && hcc85_set.size) {
      int_hccs["HCC85_HCC96"] = hcc96_set;
    } else {
      int_hccs["HCC85_HCC96"] = new Set();
    }
    if (my_dcs["gPsychiatric_V23"].size && my_dcs["gSubstanceAbuse_V23"].size) {
      int_hccs["gSubstanceAbuse_gPsychiatric_V23"] = my_dcs["gSubstanceAbuse_V23"];
    } else {
      int_hccs["gSubstanceAbuse_gPsychiatric_V23"] = new Set();
    }
  }

  // institutional model interactions
  var arry2 = ["INS"];
  if (arry2.includes(model)) {
    var hcc188_set = new Set([...new Set(["HCC188"])].filter(x => cc_set.has(x)));
    var hcc114_set = new Set([...new Set(["HCC114"])].filter(x => cc_set.has(x)));
    var hcc57_set = new Set([...new Set(["HCC57"])].filter(x => cc_set.has(x)));
    var hcc79_set = new Set([...new Set(["HCC79"])].filter(x => cc_set.has(x)));
    int_hccs["PRESSURE_ULCER"] = new Set([...new Set(["HCC157", "HCC158"])].filter(x => cc_set.has(x)));
    if (my_dcs["CHF"].size && my_dcs["gCopdCF"].size) {
      int_hccs["CHF_gCopdCF"] = my_dcs["gCopdCF"];
    } else {
      int_hccs["CHF_gCopdCF"] = new Set();
    }
    if (my_dcs["CARD_RESP_FAIL"].size && my_dcs["gCopdCF"].size) {
      int_hccs["gCopdCF_CARD_RESP_FAIL"] = my_dcs["CARD_RESP_FAIL"];
    } else {
      int_hccs["gCopdCF_CARD_RESP_FAIL"] = new Set();
    }
    if (my_dcs["SEPSIS"].size && int_hccs["PRESSURE_ULCER"].size) {
      int_hccs["SEPSIS_PRESSURE_ULCER"] = int_hccs["PRESSURE_ULCER"];
    } else {
      int_hccs["SEPSIS_PRESSURE_ULCER"] = new Set();
    }
    if (my_dcs["SEPSIS"].size && hcc188_set.size) {
      int_hccs["SEPSIS_ARTIF_OPENINGS"] = hcc188_set;
    } else {
      int_hccs["SEPSIS_ARTIF_OPENINGS"] = new Set();
    }
    if (int_hccs["PRESSURE_ULCER"].size && hcc188_set.size) {
      int_hccs["ART_OPENINGS_PRESSURE_ULCER"] = int_hccs["PRESSURE_ULCER"];
    } else {
      int_hccs["ART_OPENINGS_PRESSURE_ULCER"] = new Set();
    }
    if (my_dcs["DIABETES"].size && my_dcs["CHF"].size) {
      int_hccs["DIABETES_CHF"] = my_dcs["CHF"];
    } else {
      int_hccs["DIABETES_CHF"] = new Set();
    }
    if (my_dcs["gCopdCF"].size && hcc114_set.size) {
      int_hccs["gCopdCF_ASP_SPEC_B_PNEUM"] = hcc114_set;
    } else {
      int_hccs["gCopdCF_ASP_SPEC_B_PNEUM"] = new Set();
    }
    if (int_hccs["PRESSURE_ULCER"].size && hcc114_set.size) {
      int_hccs["ASP_SPEC_BACT_PNEUM_PRES_ULC"] = int_hccs["PRESSURE_ULCER"];
    } else {
      int_hccs["ASP_SPEC_BACT_PNEUM_PRES_ULC"] = new Set();
    }
    if (my_dcs["SEPSIS"].size && hcc114_set.size) {
      int_hccs["SEPSIS_ASP_SPEC_BACT_PNEUM"] = hcc114_set;
    } else {
      int_hccs["SEPSIS_ASP_SPEC_BACT_PNEUM"] = new Set();
    }
    if (my_dcs["gCopdCF"].size && hcc57_set.size) {
      int_hccs["SCHIZOPHRENIA_gCopdCF"] = my_dcs["gCopdCF"];
    } else {
      int_hccs["SCHIZOPHRENIA_gCopdCF"] = new Set();
    }
    if (my_dcs["CHF"].size && hcc57_set.size) {
      int_hccs["SCHIZOPHRENIA_CHF"] = my_dcs["CHF"];
    } else {
      int_hccs["SCHIZOPHRENIA_CHF"] = new Set();
    }
    if (hcc79_set.size && hcc57_set.size) {
      int_hccs["SCHIZOPHRENIA_SEIZURES"] = hcc79_set;
    } else {
      int_hccs["SCHIZOPHRENIA_SEIZURES"] = new Set();
    }
  }

  if (disabl === true || disabl == 1) {
    int_hccs["DISABLED_HCC85"] = new Set([...new Set(["HCC85"])].filter(x => cc_set.has(x)));
    if ("PRESSURE_ULCER" in int_hccs) {
      int_hccs["DISABLED_PRESSURE_ULCER"] = int_hccs["PRESSURE_ULCER"];
    }
    int_hccs["DISABLED_HCC161"] = new Set([...new Set(["HCC161"])].filter(x => cc_set.has(x)));
    int_hccs["DISABLED_HCC39"] = new Set([...new Set(["HCC39"])].filter(x => cc_set.has(x)));
    int_hccs["DISABLED_HCC77"] = new Set([...new Set(["HCC77"])].filter(x => cc_set.has(x)));
    int_hccs["DISABLED_HCC6"] = new Set([...new Set(["HCC6"])].filter(x => cc_set.has(x)));

    if (typeof age !== "undefined" && age < 65) {
      int_hccs["disable_substAbuse_psych_V23"] = int_hccs["gSubstanceAbuse_gPsychiatric_V23"];
    }
  }

  var int_hccs_new = [];
  for (var key in int_hccs) {
    if (int_hccs.hasOwnProperty(key)) {
      if (int_hccs[key].size !== 0) {
        int_hccs_new.push(key);
      }
    }
  }

  return ccs.concat(int_hccs_new);
}

function v24_interactions(ccs, model, disabl = false, age = "") {
  /*
  Calculated interaction HCCs given a list of hccs, age, and disability flag
  :param ccs: List of HCCs in the format "HCC18" no trumping or cleaning of HCCs is done in this function
  :param disabl: CMS disabled flag
  :param age: Optional age of beneficiary; only one interaction uses age and it will be assumed false if not entered
  :return: List of HCC codes, including interaction codes
  */
  var cc_set = new Set(ccs);
  var int_hccs = {};
  var cnt = cc_set.length;
  if (cnt > 9) {
    int_hccs["D10P"];
  }
  if (cnt > 3 && cnt < 10) {
    var index = "D".concat(cnt);
    int_hccs[index];
  }

  // diagnostic categories
  var diag_cats = {
    CANCER: new Set(["HCC8", "HCC9", "HCC10", "HCC11", "HCC12"]),
    DIABETES: new Set(["HCC17", "HCC18", "HCC19"]),
    CARD_RESP_FAIL: new Set(["HCC82", "HCC83", "HCC84"]),
    CHF: new Set(["HCC85"]),
    gCopdCF: new Set(["HCC110", "HCC111", "HCC112"]),
    RENAL_V24: new Set(["HCC134", "HCC135", "HCC136", "HCC137", "HCC138"]),
    SEPSIS: new Set(["HCC2"]),
    gSubstanceAbuse_V24: new Set(["HCC54", "HCC55", "HCC56"]),
    gPsychiatric_V24: new Set(["HCC57", "HCC58", "HCC59", "HCC60"])
  };

  var my_dcs = {};

  for (var key in diag_cats) {
    if (diag_cats.hasOwnProperty(key)) {
      var key_set = new Set(diag_cats[key]);
      var new_values = new Set([...key_set].filter(x => cc_set.has(x)));
      my_dcs[key] = new_values;
    }
  }
  // Community Interactions
  var arry1 = ["CNA", "CFA", "CPA", "CND", "CFD", "CPD"];
  if (arry1.includes(model)) {
    var hcc85_set = new Set([...new Set(["HCC85"])].filter(x => cc_set.has(x)));
    var hcc47_set = new Set([...new Set(["HCC47"])].filter(x => cc_set.has(x)));
    var hcc96_set = new Set([...new Set(["HCC96"])].filter(x => cc_set.has(x)));
    if (my_dcs["CANCER"].size && hcc47_set.size) {
      int_hccs["HCC47_gCancer"] = hcc47_set;
    } else {
      int_hccs["HCC47_gCancer"] = new Set();
    }

    if (my_dcs["DIABETES"].size && hcc85_set.size) {
      int_hccs["HCC85_gDiabetesMellit"] = hcc85_set;
    } else {
      int_hccs["HCC85_gDiabetesMellit"] = new Set();
    }

    if (my_dcs["gCopdCF"].size && hcc85_set.size) {
      int_hccs["HCC85_gCopdCF"] = hcc85_set;
    } else {
      int_hccs["HCC85_gCopdCF"] = new Set();
    }

    if (my_dcs["RENAL_V24"].size && hcc85_set.size) {
      int_hccs["HCC85_gRenal_V24"] = hcc85_set;
    } else {
      int_hccs["HCC85_gRenal_V24"] = new Set();
    }
    if (my_dcs["gCopdCF"].size && my_dcs["CARD_RESP_FAIL"].size) {
      int_hccs["gRespDepandArre_gCopdCF"] = my_dcs["CARD_RESP_FAIL"];
    } else {
      int_hccs["gRespDepandArre_gCopdCF"] = new Set();
    }
    if (hcc96_set.size && hcc85_set.size) {
      int_hccs["HCC85_HCC96"] = hcc96_set;
    } else {
      int_hccs["HCC85_HCC96"] = new Set();
    }
    if (my_dcs["gPsychiatric_V24"].size && my_dcs["gSubstanceAbuse_V24"].size) {
      int_hccs["gSubstanceAbuse_gPsychiatric_V24"] = my_dcs["gSubstanceAbuse_V24"];
    } else {
      int_hccs["gSubstanceAbuse_gPsychiatric_V24"] = new Set();
    }
  }

  // institutional model interactions
  var arry2 = ["INS"];
  if (arry2.includes(model)) {
    var hcc188_set = new Set([...new Set(["HCC188"])].filter(x => cc_set.has(x)));
    var hcc114_set = new Set([...new Set(["HCC114"])].filter(x => cc_set.has(x)));
    var hcc57_set = new Set([...new Set(["HCC57"])].filter(x => cc_set.has(x)));
    var hcc79_set = new Set([...new Set(["HCC79"])].filter(x => cc_set.has(x)));
    int_hccs["PRESSURE_ULCER"] = new Set([...new Set(["HCC157", "HCC158"])].filter(x => cc_set.has(x)));

    if (my_dcs["SEPSIS"].size && int_hccs["PRESSURE_ULCER"].size) {
      int_hccs["SEPSIS_PRESSURE_ULCER"] = int_hccs["PRESSURE_ULCER"];
    } else {
      int_hccs["SEPSIS_PRESSURE_ULCER"] = new Set();
    }
    if (my_dcs["SEPSIS"].size && hcc188_set.size) {
      int_hccs["SEPSIS_ARTIF_OPENINGS"] = hcc188_set;
    } else {
      int_hccs["SEPSIS_ARTIF_OPENINGS"] = new Set();
    }
    if (int_hccs["PRESSURE_ULCER"].size && hcc188_set.size) {
      int_hccs["ART_OPENINGS_PRESSURE_ULCER"] = int_hccs["PRESSURE_ULCER"];
    } else {
      int_hccs["ART_OPENINGS_PRESSURE_ULCER"] = new Set();
    }

    if (my_dcs["gCopdCF"].size && hcc114_set.size) {
      int_hccs["gCopdCF_ASP_SPEC_B_PNEUM"] = hcc114_set;
    } else {
      int_hccs["gCopdCF_ASP_SPEC_B_PNEUM"] = new Set();
    }
    if (int_hccs["PRESSURE_ULCER"].size && hcc114_set.size) {
      int_hccs["ASP_SPEC_BACT_PNEUM_PRES_ULC"] = int_hccs["PRESSURE_ULCER"];
    } else {
      int_hccs["ASP_SPEC_BACT_PNEUM_PRES_ULC"] = new Set();
    }
    if (my_dcs["SEPSIS"].size && hcc114_set.size) {
      int_hccs["SEPSIS_ASP_SPEC_BACT_PNEUM"] = hcc114_set;
    } else {
      int_hccs["SEPSIS_ASP_SPEC_BACT_PNEUM"] = new Set();
    }
    if (my_dcs["gCopdCF"].size && hcc57_set.size) {
      int_hccs["SCHIZOPHRENIA_gCopdCF"] = my_dcs["gCopdCF"];
    } else {
      int_hccs["SCHIZOPHRENIA_gCopdCF"] = new Set();
    }
    if (my_dcs["CHF"].size && hcc57_set.size) {
      int_hccs["SCHIZOPHRENIA_CHF"] = my_dcs["CHF"];
    } else {
      int_hccs["SCHIZOPHRENIA_CHF"] = new Set();
    }
    if (hcc79_set.size && hcc57_set.size) {
      int_hccs["SCHIZOPHRENIA_SEIZURES"] = hcc79_set;
    } else {
      int_hccs["SCHIZOPHRENIA_SEIZURES"] = new Set();
    }
  }

  if (disabl == true || disabl == 1) {
    int_hccs["DISABLED_HCC85"] = new Set([...new Set(["HCC85"])].filter(x => cc_set.has(x)));
    if ("PRESSURE_ULCER" in int_hccs) {
      int_hccs["DISABLED_PRESSURE_ULCER"] = int_hccs["PRESSURE_ULCER"];
    }
    int_hccs["DISABLED_HCC161"] = new Set([...new Set(["HCC161"])].filter(x => cc_set.has(x)));
    int_hccs["DISABLED_HCC39"] = new Set([...new Set(["HCC39"])].filter(x => cc_set.has(x)));
    int_hccs["DISABLED_HCC77"] = new Set([...new Set(["HCC77"])].filter(x => cc_set.has(x)));
    int_hccs["DISABLED_HCC6"] = new Set([...new Set(["HCC6"])].filter(x => cc_set.has(x)));

    if (typeof age !== "undefined" && age < 65) {
      int_hccs["disable_substAbuse_psych_V24"] = int_hccs["gSubstanceAbuse_gPsychiatric_V24"];
    }
  }

  var int_hccs_new = [];
  for (var key in int_hccs) {
    if (int_hccs.hasOwnProperty(key)) {
      if (int_hccs[key].size !== 0) {
        int_hccs_new.push(key);
      }
    }
  }
  return ccs.concat(int_hccs_new);
}

// Unit tests module export
module.exports = {
  cc_desc,
  cc_info,
  cc_combine,
  cc_gaps,
  cc_gaps_raf,
  cc_diff,
  cc_diff_raf,
  cc_increment,
  cc_increment_raf,
  cc_raf,
  demo_raf,
  dx_desc,
  dx2cc,
  dx_raf,
  clean_dx,
  clean_cc,
  dx_increment,
  dx_increment_raf,
  dx_gaps,
  dx_gaps_raf,
  dx_diff,
  dx_diff_raf,
  cc_diff_adds,
  cc_diff_adds_raf,
  cc_diff_deletes,
  cc_diff_deletes_raf,
  cc_diff_upgraded,
  cc_diff_downgraded,
  cc_diff_downgrade_to,
  dx_chronic,
  dx_acute,
  cc_acute,
  cc_chronic,
  cc_hybrid,
  memprofile,
  dx_profile_compare,
  hcc_profile_compare,
  getdefaultvalue,
  assignDefaultValues,
  hcc_gaps,
  dx_gap,
  cc_rafs,
  dx2raf,
  dx2hcc,
  dx_hccs,
  clean_dxlist,
  clean_hcclist,
  hcc2raf,
  prep_hccs,
  trump_hccs,
  hcc_dct,
  hcc_increment,
  dx_increments,
  dx_diffc,
  hcc_diff,
  member,
  condition_resolver,
  get_raf,
  v22_interactions,
  v23_interactions,
  v24_interactions

};

//associating the methods
CustomFunctions.associate("DEMO_RAF", demo_raf);
CustomFunctions.associate("DX_DESC", dx_desc);
CustomFunctions.associate("DX2CC", dx2cc);
CustomFunctions.associate("DX_RAF", dx_raf);
CustomFunctions.associate("CLEAN_DX", clean_dx);
CustomFunctions.associate("CLEAN_CC", clean_cc);
CustomFunctions.associate("CC_DESC", cc_desc);
CustomFunctions.associate("CC_INFO", cc_info);
CustomFunctions.associate("CC_RAF", cc_raf);
CustomFunctions.associate("CC_COMBINE", cc_combine);
CustomFunctions.associate("CC_INCREMENT_RAF", cc_increment_raf);
CustomFunctions.associate("CC_INCREMENT", cc_increment);
CustomFunctions.associate("CC_GAPS", cc_gaps);
CustomFunctions.associate("CC_GAPS_RAF", cc_gaps_raf);
CustomFunctions.associate("CC_DIFF", cc_diff);
CustomFunctions.associate("CC_DIFF_RAF", cc_diff_raf);
CustomFunctions.associate("DX_DIFF", dx_diff);
CustomFunctions.associate("DX_DIFF_RAF", dx_diff_raf);
CustomFunctions.associate("DX_INCREMENT", dx_increment);
CustomFunctions.associate("DX_INCREMENT_RAF", dx_increment_raf);
CustomFunctions.associate("DX_GAPS", dx_gaps);
CustomFunctions.associate("DX_GAPS_RAF", dx_gaps_raf);
CustomFunctions.associate("CC_DIFF_ADDS", cc_diff_adds);
CustomFunctions.associate("CC_DIFF_ADDS_RAF", cc_diff_adds_raf);
CustomFunctions.associate("CC_DIFF_DELETES", cc_diff_deletes);
CustomFunctions.associate("CC_DIFF_DELETES_RAF", cc_diff_deletes_raf);
CustomFunctions.associate("CC_DIFF_UPGRADED", cc_diff_upgraded);
CustomFunctions.associate("CC_DIFF_DOWNGRADED", cc_diff_downgraded);
CustomFunctions.associate("CC_DIFF_DOWNGRADE_TO", cc_diff_downgrade_to);
CustomFunctions.associate("DX_ACUTE", dx_acute);
CustomFunctions.associate("DX_CHRONIC", dx_chronic);
CustomFunctions.associate("CC_ACUTE", cc_acute);
CustomFunctions.associate("CC_CHRONIC", cc_chronic);
CustomFunctions.associate("CC_HYBRID", cc_hybrid);
CustomFunctions.associate("memprofile", memprofile);
CustomFunctions.associate("dx_profile_compare", dx_profile_compare);
CustomFunctions.associate("hcc_profile_compare", hcc_profile_compare);
CustomFunctions.associate("getdefaultvalue", getdefaultvalue);
CustomFunctions.associate("assignDefaultValues", assignDefaultValues);
CustomFunctions.associate("hcc_gaps", hcc_gaps);
CustomFunctions.associate("dx_gap", dx_gap); 
CustomFunctions.associate("cc_rafs", cc_rafs);
CustomFunctions.associate("dx2raf", dx2raf); 
CustomFunctions.associate("dx2hcc", dx2hcc);
CustomFunctions.associate("dx_hccs", dx_hccs);
CustomFunctions.associate("clean_dxlist", clean_dxlist);
CustomFunctions.associate("clean_hcclist", clean_hcclist);
CustomFunctions.associate("hcc2raf", hcc2raf);
CustomFunctions.associate("prep_hccs", prep_hccs);
CustomFunctions.associate("trump_hccs", trump_hccs);
CustomFunctions.associate("hcc_dct", hcc_dct);
CustomFunctions.associate("hcc_increment", hcc_increment);
CustomFunctions.associate("dx_increments", dx_increments);
CustomFunctions.associate("dx_diffc", dx_diffc);
CustomFunctions.associate("hcc_diff", hcc_diff);
CustomFunctions.associate("member", member);
CustomFunctions.associate("condition_resolver", condition_resolver);
CustomFunctions.associate("get_raf", get_raf);
CustomFunctions.associate("v22_interactions", v22_interactions);
CustomFunctions.associate("v23_interactions", v23_interactions);
CustomFunctions.associate("v24_interactions", v24_interactions);