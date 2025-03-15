# JS Library

JS library to save some time ;)

**Author:** [Cepeda Julian](https://cepedajulian.com/)

** Load the lib in the HTML section Head:**
  <head>
    <script src="library.js" defer></script>
  </head>

  
**Available methods**

**At ready LOAD body function**

  _.ready(...script js...)
  
  DEMO:
  <script>
    _.ready( alert('Hola mundo!') )
  </script>


**TRIM function**
  _.trim(String)
  
  DEMO:
  <script>
    let string2 = _.trim("    Hola Mundo!    ")
  </script>


**LEFT function**
  
  _.left(string, int)
  
  DEMO:
  <script>
      let string2 = _.left("Hola Mundo!", 4)
  </script>
  
//----------------------------------------------------------------------------//
// RIGHT function
//----------------------------------------------------------------------------//
  
  _.right(string, int)
	
 DEMO:
  <script>
      let string2 = _.right("Hola Mundo!", 6)
  </script>

//----------------------------------------------------------------------------//
// IS DATE spanish function (dd/mm/aaa)   Spanish version
//----------------------------------------------------------------------------//

  _.isDate(date)

  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// IS DATE English function (aaaa/mm/dd) Database version
//----------------------------------------------------------------------------//

  _.isDateEnglish(date)
  
  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// Check IS INT value
//----------------------------------------------------------------------------//

  _.isInt(value)
  
  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// DAY of week TEXT
//----------------------------------------------------------------------------//

  _.dayWeekText(date)

  DEMO:
  <script>
      
  </script>
    
//----------------------------------------------------------------------------//
// DAY of week Number 0 to 7
//----------------------------------------------------------------------------//
  
  _.dayWeekNumber(date)

  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// Input get/set value by ID
//----------------------------------------------------------------------------//

  _.input(id, string)

  DEMO:
  <script>
     
  </script>

//----------------------------------------------------------------------------//
// DIV tag get/set content by ID
//----------------------------------------------------------------------------//

  _.div(id, string)
  
  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// DIV tag hide content by ID
//----------------------------------------------------------------------------//
  
  _.divHide(id)

  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// DIV tag show content by ID
//----------------------------------------------------------------------------//
  
  _.divShow(id)
  
  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// SELECT tag VALUE selected by ID
//----------------------------------------------------------------------------//
  
  _.selectSelectedValue(id)

  <script>
      
  </script>

//----------------------------------------------------------------------------//
// SELECT tag TEXT selected by ID
//----------------------------------------------------------------------------//

  _.selectSelectedText(id)
  
  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// SELECT tag TRANSLATE selected to OTHER SELECT
//----------------------------------------------------------------------------//

  _.selectSelectedTranslate(source, target, sort)

  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// SELECT tag SORT content by ID
//----------------------------------------------------------------------------//

  _.selectSort(id)

  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// SELECT tag DELETE selected by ID
//----------------------------------------------------------------------------//

  _.selectSelectedDelete(id)

  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// RADIO input tag VALUE selected by ID
//----------------------------------------------------------------------------//

  _.radioSelected(id, radio_name)
  
  DEMO:
  <script>
      
  </script>

//--------------------------------------------------------------------------------------------------//
// SET JS into the web context, Very useful when receiving HTML code containing JavaScript via Ajax
//--------------------------------------------------------------------------------------------------//

  _.setJS=function(string)
  
  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// Call to back server via AJAX
//----------------------------------------------------------------------------//

  async function ax(type, url, parameters)
  
  OPTIONS: 
  parameters.d    data to send DEFAULT: {}
  parameters.f    format to send DEFAULT: FORM
  parameters.r    format of response DEFAULT: JSON
  parameters.ss   function case success
  parameters.dd   function olways whitout error
  parameters.ee   funciton case error
  
  DEMO:
  <script>
      
  </script>
    
//----------------------------------------------------------------------------//
// JSON 2d to Array 2d by keys:value (key to column)
//----------------------------------------------------------------------------//

  _.json2array(json, keys)

  DEMO:
  <script>
      
  </script>
    
//----------------------------------------------------------------------------//
// Crate Table (id is name of future table)
//----------------------------------------------------------------------------//

  _.tableCreate(headers, rows, id)

  DEMO:
  <script>
      
  </script>

//----------------------------------------------------------------------------//
// Table Add row by ID
//----------------------------------------------------------------------------//

  _.tableRowAdd (id, rows)

  DEMO:
  <script>
      
  </script>
