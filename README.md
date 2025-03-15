# JS Library

JavaScript library to save some time ;)

**Author:** [Cepeda Julian](https://cepedajulian.com/)

<hr>
Load the lib in the HTML section Head:<br><br>

<script src="library.js" defer></script>

<hr>

# Available methods

### At ready LOAD body function<br><br>
```js
  _.ready(...script js...)
```
Demo:<br>
```js
  _.ready( alert('Hola mundo!') )
```
<hr>

### TRIM function<br><br>
```js
  _.trim(String)
```
Demo:<br>
```js
  let string2 = _.trim("    Hola Mundo!    ")
```
<hr>

### LEFT function<br><br>
```js
  _.left(string, int)
```
Demo:<br>
```js
    let string2 = _.left("Hola Mundo!", 4)
```
<hr>

### RIGHT function<br><br>
```js
  _.right(string, int)
```
Demo:<br>
```js
    let string2 = _.right("Hola Mundo!", 6)
```
<hr>

### IS DATE spanish function (dd/mm/aaa)   Spanish version<br><br>
```js
  _.isDate(date)
```
Demo:<br>
```js
      
```
<hr>

### IS DATE English function (aaaa/mm/dd) Database version<br><br>
  ```js
  _.isDateEnglish(date)
```
Demo:<br>
```js
      
```
<hr>

### Check IS INT value<br><br>
  ```js
  _.isInt(value)
```
Demo:<br>
```js
      
```
<hr>

### DAY of week TEXT<br><br>
  ```js
  _.dayWeekText(date)
```
Demo:<br>
```js
      
```
<hr>

### DAY of week Number 0 to 7<br><br>
  ```js
  _.dayWeekNumber(date)
```
Demo:<br>
```js
      
```
<hr>

### Input get/set value by ID<br><br>
  ```js
  _.input(id, string)
```
Demo:<br>
```js
      
```
<hr>

### DIV tag get/set content by ID<br><br>
  ```js
  _.div(id, string)
```
Demo:<br>
```js
      
```
<hr>

### DIV tag hide content by ID<br><br>
  ```js
  _.divHide(id)
  ```
Demo:<br>
```js
      
```
<hr>

###  DIV tag show content by ID<br><br>
  ```js
  _.divShow(id)
  ```
Demo:<br>
```js
      
```
<hr>

### SELECT tag VALUE selected by ID<br><br>
  ```js
  _.selectSelectedValue(id)
  ```
Demo:<br>
```js
      
```
<hr>

### SELECT tag TEXT selected by ID<br><br>
  ```js
  _.selectSelectedText(id)
  ```
Demo:<br>
```js
      
```
<hr>

### SELECT tag TRANSLATE selected to OTHER SELECT<br><br>
  ```js
  _.selectSelectedTranslate(source, target, sort)
  ```
Demo:<br>
```js
      
```
<hr>

### SELECT tag SORT content by ID<br><br>
  ```js
  _.selectSort(id)
  ```
Demo:<br>
```js
      
```
<hr>

### SELECT tag DELETE selected by ID<br><br>
  ```js
  _.selectSelectedDelete(id)
  ```
Demo:<br>
```js
      
```
<hr>

### RADIO input tag VALUE selected by ID<br><br>
  ```js
  _.radioSelected(id, radio_name)
  ```
Demo:<br>
```js
      
```
<hr>

### SET JS into the web context, Very useful when receiving HTML code containing JavaScript via Ajax<br><br>
  ```js
  _.setJS=function(string)
  ```
Demo:<br>
```js
      
```
<hr>

### Call to back server via AJAX<br><br>
  ```js
  async function ax(type, url, parameters)
  ```
  OPTIONS:
  
  parameters.d    data to send DEFAULT: {}
  
  parameters.f    format to send DEFAULT: FORM
  
  parameters.r    format of response DEFAULT: JSON
  
  parameters.ss   function case success
  
  parameters.dd   function olways whitout error
  
  parameters.ee   funciton case error
 
  <br><br>
Demo:<br>
```js
      
```
<hr>

### JSON 2d to Array 2d by keys:value (key to column)<br><br>
  ```js
  _.json2array(json, keys)
  ```
  Demo:<br>
```js
      
```
<hr>

### Crate Table (id is name of future table)<br><br>
  ```js
  _.tableCreate(headers, rows, id)
  ```
Demo:<br>
```js
      
```
<hr>

### Table Add row by ID<br><br>
  ```js
  _.tableRowAdd (id, rows)
  ```
Demo:<br>
```js
      
```
<hr>
