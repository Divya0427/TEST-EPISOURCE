/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// The initialize function must be run each time a new page is loaded
Office.initialize = () => {
  
  document.getElementById("set-default-button").onclick = setDefaultValues;
  document.getElementById("reset-default-button").onclick = removeStorage;
  document.getElementById("default-values-section").addEventListener('change', (event) => {
  document.querySelector('.set-default-success-alert').style.display = 'none';   
   });
  
};

async function run() {
  try {
    await Excel.run(async context => {
      /**
       * Insert your Excel code here
       */
      const range = context.workbook.getSelectedRange();

      // Read the range address
      range.load("address");

      // Update the fill color
      range.format.fill.color = "yellow";

      await context.sync();
      console.log(`The range address was ${range.address}.`);
    });
  } catch (error) {
    console.error(error);
  }
}

function assignDefaultValues() {        
  var baserate= (868.0).toFixed(1);
  var defaultValues = ['v23', false, true, 0, 'CNA',  65, 'M',baserate, 0];
      /*  Version disable verbose nevertrump Model baserate age sex orec */
      var val = Array.from(document.querySelectorAll('.default-values-dropdown')).map((el, index) => {
          var defaultVal = defaultValues[index];
          if(!el.value) {
              el.value = defaultVal;
          }
          return el.value;
      });
      return val;
  }

function setDefaultValues() {
      var defaultValue = assignDefaultValues();      
      OfficeRuntime.storage.setItem("version", defaultValue.join()).then(function() {
          document.querySelector('.set-default-success-alert').style.display = 'block';
              }, function (error) {
                  document.getElementById("tokenSendStatus").innerHTML = "Error: Unable to save item with key '" + "Not Save" + "' to Storage. " + error;
              });  
  }

  function removeStorage() {
      OfficeRuntime.storage.removeItem("version");     
      Array.from(document.querySelectorAll('.default-values-dropdown')).map((el) => {
          el.selectedIndex = 0;
      });
      document.querySelector('.set-default-success-alert').style.display = 'none';
  }
