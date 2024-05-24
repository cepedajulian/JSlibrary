/* 
---------------------------------------------------------------------------
 
JS librarie to save time ;)

Author: Cepeda Julian

---------------------------------------------------------------------------
*/

const _ = new Object

//---------------------------------------------------------------------------
// At end LOAD body function
//---------------------------------------------------------------------------
_.load = function (init){
    document.addEventListener('DOMContentLoaded', ()=>{
        eval(init())
    })
}

//---------------------------------------------------------------------------
// At ready LOAD body function
//---------------------------------------------------------------------------
_.ready = function (init){
    if (document.readyState === 'complete') {
        eval(init())
    }
}

//---------------------------------------------------------------------------
// TRIM function
//---------------------------------------------------------------------------
_.trim = function(string){
	return string.trim()
}

//---------------------------------------------------------------------------
// LEFT function
//---------------------------------------------------------------------------
_.left = function(string, n){
	if (n <= 0)
		return ''
	else if (n > String(string).length)
		return string
	else
		return String(string).substring(0,n)
}

//---------------------------------------------------------------------------
// RIGHT function
//---------------------------------------------------------------------------
_.right = function(string, n){
	if (n <= 0)
		return ''
	else if (n > String(string).length)
		return string
	else {
		return String(string).substring(String(string).length, String(string).length - n)
	}
}

//---------------------------------------------------------------------------
// IS DATE spanish function (dd/mm/aaa)
//---------------------------------------------------------------------------
_.isDate = function (date){
	let dateArray = date.split('/');
	let day = dateArray[0];
	let month = dateArray[1];
	let year = dateArray[2];	
	let mask = new Date(year, month - 1, day); //mes empieza de cero Enero = 0
	
	if(!mask || mask.getFullYear() == year && mask.getMonth() == month -1 && mask.getDate() == day){
		return true;
	}else{
		return false;
	}
}

//---------------------------------------------------------------------------
// IS DATE English function (aaaa/mm/dd)
//---------------------------------------------------------------------------
_.isDateEnglish = function (date){			
	let dateArray = date.split('-');
	let year = dateArray[0];
	let month = dateArray[1];
	let day = dateArray[2];
		
	let mask = new Date(year, month - 1, day); //month start in cero January = 0
	
	if(!mask || mask.getFullYear() == year && mask.getMonth() == month -1 && mask.getDate() == day){
		return true;
	}else{
		return false;
	}
}

//---------------------------------------------------------------------------
// IS INT function
//---------------------------------------------------------------------------
_.isInt = function (value){    
    value = parseInt(value);
	
    if (isNaN(value)) {
       return false;
    }else{       
       return true;
    }
}

//---------------------------------------------------------------------------
// DAY of week TEXT
//---------------------------------------------------------------------------
_.dayWeekText = function(date){
	let daysNames = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
	let date2 = new Dat(date);
	let index = date2.getUTCDay();
	return daysNames[index]; 
}

//---------------------------------------------------------------------------
// DAY of week Number 0 to 7
//---------------------------------------------------------------------------
_.dayWeekNumber = function(date){
	let date2 = new Dat(date);
	let index = date2.getUTCDay();
	return index; 
}

//---------------------------------------------------------------------------
// Input get/set value by ID
//---------------------------------------------------------------------------
_.input = function(id, string){
    if(typeof string === "undefined"){
        return document.getElementById(id).value
    }else{
        document.getElementById(id).value=string
    }
}

//---------------------------------------------------------------------------
// DIV tag get/set content by ID
//---------------------------------------------------------------------------
_.div = function(id, string){
    if(typeof string === "undefined"){
        return document.getElementById(id).innerHTML
    }else{
        document.getElementById(id).innerHTML=string
    }
}

//---------------------------------------------------------------------------
// DIV tag hide content by ID
//---------------------------------------------------------------------------
_.divHide = function (id){
	document.getElementById(id).style.display = 'none';	
	document.getElementById(id).style.filter= "alpha(opacity="+0+")";	//para IE					
	document.getElementById(id).style.opacity= 0;
}

//---------------------------------------------------------------------------
// DIV tag show content by ID
//---------------------------------------------------------------------------
_.divShow = function (id){
	document.getElementById(id).style.display = 'block';
	document.getElementById(id).style.filter= "alpha(opacity="+100+")";	//para IE
	document.getElementById(id).style.opacity= 1;	
}

//---------------------------------------------------------------------------
// SELECT tag VALUE selected by ID
//---------------------------------------------------------------------------
_.selectSelectedValue = function (id){	
	if(document.getElementById(id)!=null){
		return 	document.getElementById(id).options[document.getElementById(id).selectedIndex].value
	}		
}

//---------------------------------------------------------------------------
// SELECT tag TEXT selected by ID
//---------------------------------------------------------------------------
_.selectSelectedText = function (id){
	if(document.getElementById(id)!=null){
		return 	document.getElementById(id).options[document.getElementById(id).selectedIndex].text	
	}
}

//---------------------------------------------------------------------------
// SELECT tag TRANSLATE selected to OTHER SELECT
//---------------------------------------------------------------------------
_.selectSelectedTranslate = function (source, target, sort){
	source = document.getElementById(source)
	target = document.getElementById(target)
	position = target.options.length
	index = source.selectedIndex
	
	if(index != -1) {
		volcado = source.options[index]
		target.options[position] = new Option(volcado.text, volcado.value)
		source.options[index] = null
		source.selectedIndex=index

		if(index>source.length-1){
			source.selectedIndex=source.length-1
		}
	}

	if (sort==true){_.selectSort(target)}
}

//---------------------------------------------------------------------------
// SELECT tag SORT content by ID
//---------------------------------------------------------------------------
_.selectSort = function(id){
    let select = document.getElementById(id)
	let tmpArray = new Array()

	for (let i=0;i<selElem.options.length;i++) {
		tmpArray[i] = new Array();
		tmpArray[i][0] =select.options[i].text;
		tmpArray[i][1] =select.options[i].value;
	}
	
	tmpArray.sort();

	while (select.options.length > 0) {
		select.options[0] = null;
	}
    
	for (let i=0;i<tmpArray.length;i++) {
		let op = new Option(tmpArray[i][0], tmpArray[i][1]);
		select.options[i] = op;
    }
}

//---------------------------------------------------------------------------
// SELECT tag DELETE selected by ID
//---------------------------------------------------------------------------
_.selectSelectedDelete = function (id){
	document.getElementById(id).options[document.getElementById(id).selectedIndex] = null;
}

//---------------------------------------------------------------------------
// RADIO input tag VALUE selected by ID
//---------------------------------------------------------------------------
_.radioSelected = function (id, radio_name){
	let div=document.getElementById(id);
	let all=div.getElementsByTagName('input');

	let value;

	let input, i=0;
	while(input=all[i++]) {
		if(input.id==radio_name){
			if(input.checked){value=input.value;}
		}
	}	
	
	return value;
}

//---------------------------------------------------------------------------
// SET JS into the web context
//---------------------------------------------------------------------------
_.setJS=function (string){
    let script;
 
    while( _script = string.match(/(<script>\s*(<!--)?)/i)){ 
		string = string.substr(string.indexOf(RegExp.$1) + RegExp.$1.length); 
 
		if (!(endscript = string.match(/((-->)?\s*<\/script>)/))) break; 
 
		let block = string.substr(0, string.indexOf(RegExp.$1)); 
		string = string.substring(block.length + RegExp.$1.length); 
 
		let oScript = document.createElement('script'); 
		oScript.text = block;
        document.getElementsByTagName("head").item(0).replaceChild(oScript, document.getElementsByTagName("head").item(0).childNodes[0]);
    } 
}

//---------------------------------------------------------------------------
// AJAX
//---------------------------------------------------------------------------
async function ax(type, url, parameters = new Object) {
    /*    
    parameters.d    data to send DEFAULT: {}
    parameters.f    format to send DEFAULT: FORM
    parameters.r    format of response DEFAULT: JSON
    parameters.ss   function case success
    parameters.dd   function olways whitout error
    parameters.ee   funciton case error
    */

    dataFormat = "application/json; charset=UTF-8"

    if(typeof parameters.d != "undefined" ){
        if(typeof parameters.f === "undefined" || parameters.f === "FORM"){
            const formData = new FormData();

            for(const [key, value] of Object.entries(parameters.d)){
                formData.append(key, value);
            }

            data = formData
            dataFormat = "form-data; charset=UTF-8"
        }else{
            data = JSON.stringify(parameters.d)
        }
    }else{
        data = "{}"
    }

    if(typeof parameters.r === "undefined" || parameters.r === 'JSON'){
        if(type==="HEAD" || type === "GET"){
            try {
                const response = await fetch(url, {
                    method: type,
                    headers: {
                        headers: {
                            "Content-type": dataFormat
                        }
                    }
                });

                const res = await response.json()
                
                if (response.ok) {
                    if(typeof parameters.ss !== "undefined"){
                        eval(parameters.ss(res))
                    }
                }

                if(typeof parameters.dd !== "undefined"){
                    eval(parameters.dd(res))
                }

                return res
        
            } catch (error) {
                console.error("Error:", error);
                if(typeof parameters.ee !== "undefined"){
                    eval(parameters.ee(res))
                }
            }
        }else{
            try {
                const response = await fetch(url, {
                    method: type,
                    headers: {
                        headers: {
                            "Content-type": dataFormat
                        }
                    },
                    body: data
                });

                const res = await response.json()
                
                if (response.ok) {
                    if(typeof parameters.ss !== "undefined"){
                        eval(parameters.ss(res))
                    }
                }

                if(typeof parameters.dd !== "undefined"){
                    eval(parameters.dd(res))
                }

                return res
        
            } catch (error) {
                console.error("Error:", error);
                if(typeof parameters.ee !== "undefined"){
                    eval(parameters.ee(res))
                }
            }
        }
    }else{
        if(type==="HEAD" || type === "GET"){
            try {
                const response = await fetch(url, {
                    method: type,
                    headers: {
                        headers: {
                            "Content-type": dataFormat
                        }
                    }
                });
                
                const res = await response.text()
                
                if (response.ok) {
                    _.setJS(res)
                    
                    if(typeof parameters.ss !== "undefined"){
                        eval(parameters.ss(res))
                    }
                }

                if(typeof parameters.dd !== "undefined"){
                    eval(parameters.dd(res))
                }

                return res

            } catch (error) {
                console.error("Error:", error);
                if(typeof parameters.ee !== "undefined"){
                    eval(parameters.ee(res))
                }
            }
        }else{
            try {
                const response = await fetch(url, {
                    method: type,
                    headers: {
                        headers: {
                            "Content-type": dataFormat
                        }
                    },
                    body: data
                });
                
                const res = await response.text()
                
                if (response.ok) {
                    _.setJS(res)
                    
                    if(typeof parameters.ss !== "undefined"){
                        eval(parameters.ss(res))
                    }
                }

                if(typeof parameters.dd !== "undefined"){
                    eval(parameters.dd(res))
                }

                return res

            } catch (error) {
                console.error("Error:", error);
                if(typeof parameters.ee !== "undefined"){
                    eval(parameters.ee(res))
                }
            }
        }
        
    }
}

//---------------------------------------------------------------------------
// JSON 2d to Array 2d by keys:value (key to column)
//---------------------------------------------------------------------------
_.json2array = function (json, keys){
    let result = []
    for (let r = 0; r < json.length; r++) {
        let row = json[r];
        let row2 = []

        for (let c = 0; c < keys.length; c++) {
            row2.push(json[r][keys[c]]);
        }

        result.push(row2)
    }

    return result
}

//---------------------------------------------------------------------------
// Crate Table (id is name of future table)
//---------------------------------------------------------------------------
_.tableCreate = function (headers, rows, id){
    let table = document.createElement('table')
    table.setAttribute("id", id);

    //thead
    let thead = document.createElement('thead')
    let row = thead.insertRow()
        
    for (let h = 0; h< headers.length; h++) {
        row.insertCell(h).innerHTML = headers[h]   
    }

    //tbody
    let tbody = document.createElement('tbody')

    for (let r = 0; r< rows.length; r++) {
        let row = table.insertRow()
        
        for (let c = 0; c< rows[r].length; c++) {
            row.insertCell(c).innerHTML = rows[r][c]    
        }

        tbody.appendChild(row)
    }

    //join elements
    table.appendChild(thead)
    table.appendChild(tbody)

    return table
}

//---------------------------------------------------------------------------
// Table Add row by ID
//---------------------------------------------------------------------------
_.tableRowAdd = function (id, rows){
    let table = document.getElementById(id);

    for (let r = 0; r< rows.length; r++) {
        let row = table.insertRow()
        
        for (let c = 0; c< rows[r].length; c++) {
            row.insertCell(c).innerHTML = rows[r][c]    
        }
    }
}
