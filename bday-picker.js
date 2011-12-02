/*!
 * jQuery Birthday Picker: v1.4 - 10/16/2011
 * http://abecoffman.com/stuff/birthdaypicker
 *
 * Copyright (c) 2010 Abe Coffman
 * Dual licensed under the MIT and GPL licenses.
 *
 */

(function( $ ){
  // plugin variables
	var months = {
		"short": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		"long": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
		todayDate = new Date(),
		todayYear = todayDate.getFullYear(),
		todayMonth = todayDate.getMonth() + 1,
		todayDay = todayDate.getDate();

	//Calculate DateParts
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Get total days of each month in a specific year
			// @PARAM			: Month
			// @PARAM			: Year
			// @SOURCE			: http://www.smartwebby.com/DHTML/date_validation.asp
			function totalDays(mm,yyyy) {
				var i = 31;
				if (mm==4 || mm==6 || mm==9 || mm==11) {i = 30
				}else if (mm==2) {
					i = (((yyyy % 4 == 0) && ((!(yyyy % 100 == 0))|| (yyyy % 400 == 0))) ? 29 : 28 );
				}
				return(i)
			};
			
	//Validate the import date
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Validate if a date is a valid date (NEED jquery UI datepicker)
			// @PARAM			: Date value
			// @PARAM			: DateFormat (ex: yy-mm-dd)
			// @SOURCE			: http://byatool.com/ui/jquery-validate-datecheck-if-is-date/	
			function isValidDate(dateValue, format){
				var isValid = true;
				try{
					jQuery.datepicker.parseDate(format, dateValue, null);
				}catch(error){
					isValid = false;
				}
				return isValid;
			}

	//Remove leading zeros from a string
		//-------------------------
		// @STATUS			: Active			
		// @SDESCRIPTION	: Remove the first zero of a string
		// @PARAM			: Number input
		// @SOURCE			: http://snipplr.com/view/57577/	
		function trimLeadZero(s) {
			if (s.lenght > 1){
				s = s.replace(/^0+/, "");
				return parseInt(s);
				}else{
				return parseInt(s);
			}
			}
	
	//Add readonly
		//-------------------------
		// @STATUS			: Active			
		// @SDESCRIPTION	: Add readonly to datepicker, disabled works, readonly doesnt
		// @PARAM			: true or false
		function readonly(s) {
			if (s = true){
				return "disabled='disabled'"
			}
			}
	
	//Calculate DateDifference
		//-------------------------
		// @STATUS			: Active			
		// @SDESCRIPTION	: Calculate the difference between two dates
		// @PARAM			: Date1
		// @PARAM			: Date2
		// @PARAM			: Interval
		// @SOURCE			: http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-jquery
		function mydiff(date1,date2,interval) { 
			var second=1000, minute=second*60, hour=minute*60, day=hour*24, week=day*7; 
				
				date1 = new Date(date1); 
				date2 = new Date(date2); 
				var timediff = date2 - date1; 
			if (isNaN(timediff)) return NaN; 
			switch (interval) { 
				case "years": return date2.getFullYear() - date1.getFullYear(); 
				case "months": return (( date2.getFullYear() * 12 + date2.getMonth() ) - ( date1.getFullYear() * 12 + date1.getMonth() ) ); 
				case "weeks"  : return Math.floor(timediff / week); 
				case "days"   : return Math.floor(timediff / day);  
				case "hours"  : return Math.floor(timediff / hour);  
				case "minutes": return Math.floor(timediff / minute); 
				case "seconds": return Math.floor(timediff / second); 
				default: return undefined; 
				} 
			};
			
	//Birthday Function (creating dropdownList)
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Create the different dropdownlists
	$.fn.SelectDatePicker = function( options ){

		//Default settings can be changed if needed
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: If nothing is set then these settings will take over
			var settings = {
				"maxYear": 100,			//yearrange future
				"minYear": 100,			//yaerrange past
				"futureDates": false,
				"dateFormat": "yy-mm-dd",
				"monthFormat": "short",
				"placeholder": false,
				"legend": false,
				"fieldset" : false,
				"defaultDate": false,
				"hiddenDate": true,
				"hiddenFieldName": null,
				"fieldset" : false,
				"onChange" : null,
				"tabindex" : null,
				"ServerRender" : false,  // false = nothing renderd on server, 1 = day, 2 = month, 3 = year
				"optionPlaceholder" : ["year","month","day"],
				"selectId" : ["y-i","m-i","d-i"],
				"selectname" : ["y-n","m-n","d-n"],
				"readOnly" : [false,false,false], // true = readonly, format year, month, day
				"minDate" : false,
				"maxDate" : false
				
			};  
			
		//Return the dropdownlist
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: return function
			return this.each(function() {
				

			//Default values or use configured values
				//-------------------------
				// @STATUS			: Active			
				// @SDESCRIPTION	: Choose between default settings or custom settings
				if (options) {$.extend(settings, options);}
	
			//Container
				//-------------------------
				// @STATUS			: Active			
				// @SDESCRIPTION	: 
				var $container = $(this),$selectIdtainer = $("<div class='selectIdtainer'></div>"),$day	= '',$month	= '',$year	= '';
				
				
			//ServerRender
				//-------------------------
				// @STATUS			: Active			
				// @SDESCRIPTION	: Determin if the DOM skeleton is renderd by JS or by the server
				// @PARAM			: ServerRender (true or false)
				if(settings["ServerRender"]){
					//all is renderd by the server
					}else{
				// Create the html picker skeleton
						$year 		= $("<select class=''	name="+settings["selectname"][0] +"	id="+settings["selectId"][0]+" ></select>");
						$month 		= $("<select class=''	name="+settings["selectname"][1] +" id="+settings["selectId"][1]+"></select>");
						$day 		= $("<select class=''	name="+settings["selectname"][2] +"	id="+settings["selectId"][2]+" " + readonly(settings["readOnly"][2])+"></select>");
					var tabindex	= settings["tabindex"];
				}

			// date selectionscontainers
			var	$dateCheck = isValidDate(settings["defaultDate"], "dd-mm-yy");
			
			var $curNumDays =  0;
			if ($day.length>1){$curNumDays =  $day.children(":last").val();}

			
		//Calculate DateParts
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Validate if a given date is a valid date otherwise use new date to Calculate dateparts
			// @PARAM			: defaultDate
			if (settings["defaultDate"] && $dateCheck) {
				var datepart = settings["defaultDate"].split('-');
				var setYear =	datepart[2];
				var setMonth =	datepart[1];
				var setDay =	datepart[0];
				var daysInMonth = ((totalDays(setMonth,setYear)));
			}else{
				var curDate = new Date();
				var setYear = curDate.getFullYear();
				var setMonth = curDate.getMonth() + 1;
				var setDay = curDate.getDate();
				var daysInMonth = ((totalDays(setMonth,setYear)));
				}

		//Insert Hiddenfield
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: When needed insert hidden field and fill with defaultdate
			// @PARAM			: defaultDate
			// @PARAM			: hiddenDate				
			// @PARAM			: hiddenFieldName		
					
			if(settings["defaultDate"]) {var hiddenDate = settings["defaultDate"]}
			if(settings["hiddenDate"]) {
				$("<input type='hidden' name='"+ settings["hiddenFieldName"] +"' id='"+ settings["hiddenFieldName"] +"'/>").val(hiddenDate).appendTo($(this));
			}
		
		//Deal with the various Date Formats
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Deal with the various Date Formats
			// @PARAM			: 
			switch(settings["dateFormat"]){
				case "yy-mm-dd": $selectIdtainer.append($year).append($month).append($day);
					if (tabindex != null) {
							$year.attr('tabindex', tabindex);
							$month.attr('tabindex', tabindex++);
							$day.attr('tabindex', tabindex++);
					}
					break;
				case "dd-mm-yy": $selectIdtainer.append($day).append($month).append($year);
					if (tabindex != null) {
							$year.attr('tabindex', tabindex);
							$month.attr('tabindex', tabindex++);
							$day.attr('tabindex', tabindex++);
					}
					break;
				default:	$selectIdtainer.append($month).append($day).append($year);
					if (tabindex != null) {
						$month.attr('tabindex', tabindex);
						$day.attr('tabindex', tabindex++);
						$year.attr('tabindex', tabindex++);
					}
			}
		
		//Add the option placeholders if specified
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Add the option placeholders if specified
			// @PARAM			: placeholder
			if (settings["placeholder"]) {
				$("<option value='0'>"+settings["optionPlaceholder"][0]+"</option>").appendTo($year);
				$("<option value='0'>"+settings["optionPlaceholder"][1]+"</option>").appendTo($month);
				$("<option value='0'>"+settings["optionPlaceholder"][2]+"</option>").appendTo($day);
			}
			
		//Build the initial select options
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Determen YearRange start with default value
			// @PARAM			: year
			// @PARAM			: maxYear
			// @PARAM			: minYear
			var startYear = ((parseInt(todayYear)) - (parseInt(settings["minYear"])));
			var endYear =  (parseInt(todayYear) + parseInt(settings["maxYear"]));
			
			for( var S=endYear; S > startYear; S--) {
				$("<option></option>").attr("value", S).text(S).appendTo($year);
			}

			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Determen Month Range
			// @PARAM			: minYear
			for( var j=0; j<12; j++) {
				$("<option></option>").attr("value", j+1).text(months[settings["monthFormat"]][j]).appendTo($month);
			}
		
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Determen day Range
			// @PARAM			: curNumDays
			// @PARAM			: daysInMonth
			//alert("Curdays: " + $curNumDays +" - DaysinMonth: " + daysInMonth );
			if($curNumDays > daysInMonth) {
				while($curNumDays > daysInMonth) {
					$(day).children(":last").remove();
					$curNumDays--;
				}
			}else if($curNumDays < daysInMonth) {
				while($curNumDays < daysInMonth) {
					$("<option></option>").attr("value", $curNumDays+1).text($curNumDays+1).appendTo($day); 
					$curNumDays++;
				}
			}
			
		//Add fieldset ifspecified
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Add the legend if specified
			// @PARAM			: fieldset	
			var $fieldset = $("");
			if(settings["fieldset"]){
				$fieldset = $("<fieldset></fieldset>");
				$fieldset.append($selectIdtainer)
			}else{
				$fieldset = $selectIdtainer
			}

		//Add legend ifspecified
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Add the legend if specified
			// @PARAM			: legend
			var $legend = $("");
			if(settings["legend"]){
				var $legend = $("<legend></legend>");
				$legend.append($fieldset)
			}else{
				$legend = $fieldset
			}
		
			$container.append($legend);		
		//Set default values
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: 
			// @PARAM			: 
			$("#"+settings["selectId"][0]+" option[value="+parseInt(setYear)+"]").attr("selected","selected");
			$("#"+settings["selectId"][1]+" option[value="+trimLeadZero(setMonth)+"]").attr("selected","selected");
			$("#"+settings["selectId"][2]+" option[value="+trimLeadZero(setDay)+"]").attr("selected","selected");
		

		//$selectIdtainer.live('change', function () {
		$selectIdtainer.change(function(){
		
		// Read selected values
		var 
		selectedDD = $("#"+settings["selectId"][2]).val(),
		selectedMM = $("#"+settings["selectId"][1]).val(),
		selectedYYYY = $("#"+settings["selectId"][0]).val(),
		daysInMonth = totalDays(selectedMM,selectedYYYY);
		

		//Correcting Days to month afther selection
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: If selected day is bigger than the total days in the month, reset to 1 
			//					 (example if you chooose 31 jan and then select febr, febr has only 28 or 29 days)
		var $dayValidation = totalDays(selectedMM,selectedYYYY);
		if ($dayValidation <= selectedDD){selectedDD = 1};

		//Create Selected date 
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Create a Full date
		var $selectedDate = (selectedDD + "-" + selectedMM +"-"+selectedYYYY);
	
		//Create Start date 
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Default is actual date otherwise use the date in the config and parse this date (validate in jquery UI)
		var $startdate = todayDate;
		if (settings["defaultDate"]){$startdate = $.datepicker.parseDate("dd-mm-yy", settings["defaultDate"])};
		
		//Calculate Date Difference
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: USe function to calculate date difference in days
		var $diff = mydiff($startdate,$selectedDate,"days")
		
		//Determin if a date is selected that lays in the past 
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: If user may not select a date in the past a future date is added		
			//					 (example If user can only select a date in the future)
		if(settings["minDate"]){
			if($diff < 0 ){
				selectedYYYY = parseInt(selectedYYYY) + 1
				$("#"+settings["selectId"][0]+" option[value="+parseInt(selectedYYYY)+"]").attr("selected","selected");
			}
		}
		
		//Extra Parameters needed if user is using IE
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Declare the IE HACKS 
			// @SOURCE			: (w3school) and http://stackoverflow.com/questions/1397478/forcing-a-dom-refresh-in-internet-explorer-after-javascript-dom-manipulation
		var msie = 'Microsoft Internet Explorer'; 
		var msieID = settings["selectId"][2];
		var msieSelectId = document.getElementById(msieID);
		
		//Update the Days
			//-------------------------
			// @STATUS			: Active			
			// @SDESCRIPTION	: Update the days accoordingly whit IE hacks, otherwise the days are not updated properly
		if($curNumDays > daysInMonth){
			while($curNumDays > daysInMonth) {
				if (navigator.appName == msie){ 
					msieSelectId.remove($curNumDays-1);
				}else{ 
					$("#"+settings["selectId"][2]).children(":last").remove();
				} 
				$curNumDays--;
			}
		}else if($curNumDays < daysInMonth){
			while($curNumDays < daysInMonth) {
				if (navigator.appName == msie){ 
					var msieOption = document.createElement("option");
						msieOption.text = $curNumDays + 1;
						msieOption.value = $curNumDays + 1;
					try	{
						// for IE earlier than version 8
						msieSelectId.add(msieOption,msieSelectId.options[null]);
						}catch (e){
							msieSelectId.add(msieOption,null);
					}
				}else{ 
					$("<option></option>").attr("value", ($curNumDays)).text($curNumDays+1).appendTo($("#"+settings["selectId"][2])); 
				}
				$curNumDays++;
			}
		}
		
		// update the hidden date
		var curYear = $("#"+settings["selectId"][0]).val(), curMonth = $("#"+settings["selectId"][1]).val(), curDay = $("#"+settings["selectId"][2]).val();
		
		if((curYear * curMonth * curDay) != 0) {
			var hiddenDate = curDay + "-" + curMonth + "-" + curYear;
			$("#"+settings["hiddenFieldName"]).val(hiddenDate);
			}
		});
	});
};
})
( jQuery );	