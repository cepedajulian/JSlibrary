# JS Library

JS library to save some time ;)

**Author:** [Cepeda Julian](https://cepedajulian.com/)

<hr>
Load the lib in the HTML section Head:<br><br>

<script src="library.js" defer></script>

<hr>

# Available methods

### At ready LOAD body function<br><br>

  _.ready(...script js...)
  
  DEMO:
  
  <script>
    _.ready( alert('Hola mundo!') )
  </script>

<hr>

### TRIM function<br><br>

  _.trim(String)
  
  DEMO:
  
  <script>
    let string2 = _.trim("    Hola Mundo!    ")
  </script>

<hr>

### LEFT function<br><br>
  
  _.left(string, int)
  
  DEMO:
  
  <script>
      let string2 = _.left("Hola Mundo!", 4)
  </script>

<hr>

###  RIGHT function<br><br>
  
  _.right(string, int)
	
 DEMO:
 
  <script>
      let string2 = _.right("Hola Mundo!", 6)
  </script>

<hr>

###  IS DATE spanish function (dd/mm/aaa)   Spanish version<br><br>

  _.isDate(date)

  DEMO:
  
  <script>
      
  </script>
  
<hr>

###  IS DATE English function (aaaa/mm/dd) Database version<br><br>
  _.isDateEnglish(date)
  
  DEMO:
  
  <script>
      
  </script>

<hr>

### Check IS INT value<br><br>

  _.isInt(value)
  
  DEMO:
  
  <script>
      
  </script>

<hr>

###  DAY of week TEXT<br><br>

  _.dayWeekText(date)

  DEMO:
  
  <script>
      
  </script>

<hr>

### DAY of week Number 0 to 7<br><br>
  
  _.dayWeekNumber(date)

  DEMO:
  
  <script>
      
  </script>

<hr>

### Input get/set value by ID<br><br>

  _.input(id, string)

  DEMO:
  
  <script>
     
  </script>

<hr>

### DIV tag get/set content by ID<br><br>

  _.div(id, string)
  
  DEMO:
  <script>
      
  </script>

<hr>

### DIV tag hide content by ID<br><br>
  
  _.divHide(id)

  DEMO:
  <script>
      
  </script>

<hr>

### DIV tag show content by ID<br><br>
  
  _.divShow(id)
  
  DEMO:
  <script>
      
  </script>

<hr>

###  SELECT tag VALUE selected by ID<br><br>
  
  _.selectSelectedValue(id)
 
  DEMO:
  
  <script>
      
  </script>

<hr>

### SELECT tag TEXT selected by ID<br><br>

  _.selectSelectedText(id)
 
  DEMO:
  
  <script>
      
  </script>

<hr>

### SELECT tag TRANSLATE selected to OTHER SELECT<br><br>

  _.selectSelectedTranslate(source, target, sort)

  DEMO:
  
  <script>
      
  </script>

<hr>

### SELECT tag SORT content by ID<br><br>

  _.selectSort(id)

  DEMO:
  
  <script>
      
  </script>

<hr>

### SELECT tag DELETE selected by ID<br><br>

  _.selectSelectedDelete(id)

  DEMO:
  
  <script>
      
  </script>

<hr>

### RADIO input tag VALUE selected by ID<br><br>

  _.radioSelected(id, radio_name)
 
  DEMO:
  
  <script>
      
  </script>

<hr>

### SET JS into the web context, Very useful when receiving HTML code containing JavaScript via Ajax<br><br>

  _.setJS=function(string)
 
  DEMO:
  
  <script>
      
  </script>

<hr>

### Call to back server via AJAX<br><br>

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

<hr>

### JSON 2d to Array 2d by keys:value (key to column)<br><br>

  _.json2array(json, keys)

  DEMO:
  
  <script>
      
  </script>

<hr>

### Crate Table (id is name of future table)<br><br>

  _.tableCreate(headers, rows, id)

  DEMO:
  
  <script>
      
  </script>

<hr>

### Table Add row by ID<br><br>

  _.tableRowAdd (id, rows)

  DEMO:
  
  <script>
      
  </script>
