
function DateBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string

	const sysdate = new Date(); //global sysdate
	const RE_DIGITS = /^\d.+$/; //starts by digits
	const RE_NO_DIGITS = /\D+/g; //no digits character
	const ONE_DAY = 86400000; //1d = 24 * 60 * 60 * 1000 = hours*minutes*seconds*milliseconds
	const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //january..december

	function hasParts(parts) { return parts && parts[0]; }
	function parseable(str) { return str && RE_DIGITS.test(str); }
	function splitDate(str) { return str.split(RE_NO_DIGITS); }
	function lpad(val) { return (val < 10) ? ("0" + val) : val; } //always 2 digits
	function century() { return parseInt(sysdate.getFullYear() / 100); } //ej: 20
	function swap(arr) { var aux = arr[2]; arr[2] = arr[0]; arr[0] = aux; return arr; }
	function range(val, min, max) { return Math.min(Math.max(val || 0, min), max); } //force range
	function range59(val) { return range(val, 0, 59); } //range for minutes and seconds
	function rangeYear(yy) { return (yy < 100) ? +(EMPTY + century() + lpad(yy)) : yy; } //autocomplete year=yyyy
	function isLeapYear(year) { return ((year & 3) == 0) && (((year % 25) != 0) || ((year & 15) == 0)); } //año bisiesto?
	function daysInMonth(y, m) { return daysInMonths[m] + ((m == 1) && isLeapYear(y)); }
	function isDate(date) { return date && date.getTime && !isNaN(date.getTime()); }

	function rangeDate(parts) {
		parts[0] = rangeYear(+parts[0] || 0); //year
		parts[1] = range(parts[1], 1, 12); //months
		parts[2] = range(parts[2], 1, daysInMonth(parts[0], parts[1]-1)); //days
		return parts;
	}
	function setTime(date, hh, mm, ss, ms) {
		date.setHours(range(hh, 0, 23), range59(mm), range59(ss), ms || 0);
		return isNaN(date.getTime()) ? null : date;
	}
	function fnBuild(parts) {
		let date = new Date(); //returned instance
		parts = rangeDate(parts); //limit date ranges
		date.setFullYear(parts[0], parts[1] - 1, parts[2]);
		return setTime(date, parts[3], parts[4], parts[5], parts[6]);
	}
	function toDateTime(parts) { //at least year required
		return hasParts(parts) ? fnBuild(parts) : null;
	}

	this.isValid = isDate;
	this.build = fnBuild;
	this.sysdate = function() { return sysdate; }
	this.isLeap = function(date) { return date && isLeapYear(date.getFullYear()); }
	this.getDays = function(d1, d2) { return Math.round(Math.abs((d1 - d2) / ONE_DAY)); }
	this.daysInMonth = function(date) { return date ? daysInMonth(date.getFullYear(), date.getMonth()) : 0; }
	this.toArray = function(date) { return date ? [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()] : []; }
	this.addDate = function(date, val) { date && date.setDate(date.getDate() + val); return self; }
	this.addHours = function(date, val) { date && date.setHours(date.getHours() + val); return self; }
	this.addMs = function(date, val) { date && date.setMilliseconds(date.getMilliseconds() + val); return self; }
	this.reset = function(date) { date && date.setFullYear(sysdate.getFullYear(), sysdate.getMonth(), sysdate.getDate()); return self; }
	this.trunc = function(date) { date && date.setHours(0, 0, 0, 0); return self; }
	this.clone = function(date) { return new Date((date || sysdate).getTime()); }
	this.getWeek = function(date) {
		date = date || sysdate; //default
		const d1 = new Date(date.getFullYear(), 0, 1);
		return Math.ceil((date.getDay() + 1 + self.getDays(date, d1)) / 7);
	}
	this.week = function(year, week) {
		week = week || 1; // default week = first week of year
		const firstDay = new Date(year, 0, 1); // first day of year
		const offset = (firstDay.getDay() + 6) % 7; //num days from start year and start week
		firstDay.setDate(firstDay.getDate() + (week * 7) - offset); //update date
		return firstDay; //first day of week
	}
	this.toWeek = function(str) { //ej: "2021-W27"
		return str ? self.week(+str.substr(0, 4), +str.substr(6)) : null;
	}
	this.isoWeek = function(date) {
		return date ? (date.getFullYear() + "-W" + lpad(self.getWeek(date))) : null;
	}

	this.diff = function(d1, d2) {
		d2 = d2 || sysdate;
		if (d1 > d2) //swap
			return self.diff(d2, d1);

		const result = self.toArray(d2); //date parts
		const dias = self.daysInMonth(d2) - d2.getDate() + d1.getDate();
		const ajustes = [0, 12, dias, 24, 60, 60, 1000]; //years, months, days...

		function fnAjustar(val, i) {
			result[i] -= val;
			if (result[i] < 0) {
				result[i] += ajustes[i];
				fnAjustar(1, i-1);
			}
		}

		self.toArray(d1).forEach(fnAjustar);
		return result;
	}
	this.interval = function(date, timeleft, onTic, onTimeLeft, interval) {
		let auxdate = self.clone(date); //start date
		interval = interval || 1000; //default 1seg.
		const endDate = new Date(auxdate.getTime() + timeleft); //end date.
		const idInterval = setInterval(function() {
			self.addMs(auxdate, interval);
			if (!onTic(auxdate, endDate) || (endDate <= auxdate)) {
				clearInterval(idInterval);
				onTimeLeft && onTimeLeft();
			}
		}, interval);
		return self;
	}

	//equality operators == != === !== cannot be used to compare (the value of) dates
	function eqDate(d1, d2) { return (d1.getTime() == d2.getTime()); }
	this.eq = function(d1, d2) { return isDate(d1) && isDate(d2) && eqDate(d1, d2); }

	function fnMinTime(date) { return lpad(date.getHours()) + ":" + lpad(date.getMinutes()); } //hh:MM
	function fnIsoTime(date) { return fnMinTime(date) + ":" + lpad(date.getSeconds()); } //hh:MM:ss
	this.minTime = function(date) { return date ? fnMinTime(date) : null; } //hh:MM
	this.isoTime = function(date) { return date ? fnIsoTime(date) : null; } //hh:MM:ss
	this.acTime = function(str) { return str && str.replace(/(\d\d)(\d+)$/g, "$1:$2").replace(/[^\d\:]/g, EMPTY); }
	this.toTime = function(str) {
		let parts = str && splitDate(str); //at least hours required
		return hasParts(parts) ? setTime(new Date(), parts[0], parts[1], parts[2], parts[3]) : null;
	}
	this.fmtTime = function(str) {
		let parts = str && splitDate(str);
		if (hasParts(parts)) { //at least hours required
			parts[0] = range(parts[0], 0, 23); //hours
			parts[1] = range59(parts[1]); //minutes
			if (parts[2]) //seconds optionals
				parts[2] = range59(parts[2]);
			return parts.map(lpad).join(":");
		}
		return null;
	}

	function fnEnDate(date) { return date.getFullYear() + "-" + lpad(date.getMonth() + 1) + "-" + lpad(date.getDate()); } //yyyy-mm-dd
	this.enDate = function(str) { return str ? toDateTime(splitDate(str)) : null; } //parse to Date object
	this.isoEnDate = function(date) { return isDate(date) ? fnEnDate(date) : null; } //yyyy-mm-dd
	this.isoEnDateTime = function(date) { return isDate(date) ? (fnEnDate(date) + " " + fnIsoTime(date)) : null; } //yyyy-mm-dd hh:MM:ss
	this.fmtEnDate = function(str) { return parseable(str) ? rangeDate(splitDate(str)).map(lpad).join("-") : null; } //String to formated String
	this.acEnDate = function(str) { return str && str.replace(/^(\d{4})(\d+)$/g, "$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g, "$1-$2").replace(/[^\d\-]/g, EMPTY); }

	function fnEsDate(date) { return lpad(date.getDate()) + "/" + lpad(date.getMonth() + 1) + "/" + date.getFullYear(); } //dd/mm/yyyy
	this.esDate = function(str) { return str ? toDateTime(swap(splitDate(str))) : null; } //parse to Date object
	this.isoEsDate = function(date) { return isDate(date) ? fnEsDate(date) : null; } //dd/mm/yyyy
	this.isoEsDateTime = function(date) { return isDate(date) ? (fnEsDate(date) + " " + fnIsoTime(date)) : null; } //dd/mm/yyyy hh:MM:ss
	this.fmtEsDate = function(str) { return parseable(str) ? swap(rangeDate(swap(splitDate(str)))).map(lpad).join("/") : null; } //String to formated String
	this.acEsDate = function(str) { return str && str.replace(/^(\d\d)(\d+)$/g, "$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g, "$1/$2").replace(/[^\d\/]/g, EMPTY); }
}

module.exports = new DateBox();
