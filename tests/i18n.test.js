
const i18n = require("../src/i18n/i18n.js"); //languages

describe("I18N ES Integers", () => {
	test("Parse Integer", () => {
		expect(i18n.es.toInt()).toBeFalsy();
		expect(i18n.es.toInt(null)).toBeFalsy();
		expect(i18n.es.toInt("")).toBeFalsy();
		expect(i18n.es.toInt("kk")).toBeFalsy();
		expect(i18n.es.toInt("1.10")).toBeTruthy();
		expect(i18n.es.toInt("1.10")).toBe(110);
		expect(i18n.es.toInt("1,10")).toBe(110);
		expect(i18n.es.toInt("kk1,10")).toBe(110);
	});
	test("Format Integer", () => {
		expect(i18n.es.isoInt()).toBe(null);
		expect(i18n.es.isoInt(null)).toBe(null);
		expect(i18n.es.isoInt(.1)).toBe("1");
		expect(i18n.es.isoInt(0.01)).toBe("1");
		expect(i18n.es.isoInt(123324.982734)).toBe("123.324.982.734");
		expect(i18n.es.isoInt(21123324.982734)).toBe("21.123.324.982.734");
	});
	test("String to Formated Strings Integer", () => {
		expect(i18n.es.fmtInt()).toBe(undefined);
		expect(i18n.es.fmtInt(null)).toBe(null);
		expect(i18n.es.fmtInt("kk")).toBe(null);
		expect(i18n.es.fmtInt(",1")).toBe("1");
		expect(i18n.es.fmtInt("0,01")).toBe("1");
		expect(i18n.es.fmtInt("123324,982734")).toBe("123.324.982.734");
		expect(i18n.es.fmtInt("21123324,982734")).toBe("21.123.324.982.734");
	});
});

describe("I18N ES Floats", () => {
	test("Parse Floats", () => {
		expect(i18n.es.toFloat()).toBeFalsy();
		expect(i18n.es.toFloat(null)).toBeFalsy();
		expect(i18n.es.toFloat("")).toBeFalsy();
		expect(i18n.es.toFloat("kk")).toBe(null);
		expect(i18n.es.toFloat("1.10")).toBeTruthy();
		expect(i18n.es.toFloat("1.10")).toBe(110);
		expect(i18n.es.toFloat("1,10")).toBe(1.10);
		expect(i18n.es.toFloat("kk1,10")).toBe(1.10);
		expect(i18n.es.toFloat("kk1.10")).toBe(110);
	});
	test("Format Floats", () => {
		expect(i18n.es.isoFloat()).toBe(null);
		expect(i18n.es.isoFloat(null)).toBe(null);
		expect(i18n.es.isoFloat(.1)).toBe("0,10");
		expect(i18n.es.isoFloat(0.01)).toBe("0,01");
		expect(i18n.es.isoFloat(123324.982734)).toBe("123.324,98");
		expect(i18n.es.isoFloat(21123324.982734, 3)).toBe("21.123.324,982");
	});
	test("String to Formated Strings Float", () => {
		expect(i18n.es.fmtFloat()).toBe(undefined);
		expect(i18n.es.fmtFloat(null)).toBe(null);
		expect(i18n.es.fmtFloat("kk")).toBe(null);
		expect(i18n.es.fmtFloat(",1")).toBe("0,10");
		expect(i18n.es.fmtFloat("0,01")).toBe("0,01");
		expect(i18n.es.fmtFloat("123324,982734")).toBe("123.324,98");
		expect(i18n.es.fmtFloat("21123324,982734", 3)).toBe("21.123.324,982");
	});
});

describe("I18N ES DateTime", () => {
	let sysdate = new Date();

	test("Parse Dates", () => {
		expect(i18n.es.toDate()).toBeFalsy();
		expect(i18n.es.toDate(null)).toBeFalsy();
		expect(i18n.es.toDate("")).toBe(null);
		expect(i18n.es.toDate("kk")).toBe(null);
		expect(i18n.es.toDate("kk00hjgk")).toBe(null);
		expect(i18n.es.toDate("kk/2/2")).toEqual(new Date(2002, 1, 1, 0, 0, 0));
		expect(i18n.es.toDate("kk/1/0")).toEqual(new Date(2000, 0, 1, 0, 0, 0));
		expect(i18n.es.toDate("1/1/21T0:0:0.0")).toEqual(new Date(2021, 0, 1, 0, 0, 0));
	});
	test("Format Dates", () => {
		expect(i18n.es.isoDate()).toBe(null);
		expect(i18n.es.isoDate(null)).toBe(null);
		expect(i18n.es.isoDate(new Date(2021, 1, 1))).toBe("01/02/2021");
		expect(i18n.es.isoDate(new Date(2021, 1, 1, 12, 14, 9))).toBe("01/02/2021");
	});
	test("String to Formated Strings Date", () => {
		expect(i18n.es.fmtDate()).toBe(null);
		expect(i18n.es.fmtDate(null)).toBe(null);
		expect(i18n.es.fmtDate("kk")).toBe(null);
		expect(i18n.es.fmtDate("1/2/kk")).toEqual("01/02/2000");
		expect(i18n.es.fmtDate("0/0/2")).toEqual("01/01/2002");
		expect(i18n.es.fmtDate("0/kk/0")).toEqual("01/01/2000");
		expect(i18n.es.fmtDate("0/kk/9")).toEqual("01/09/2000");
		expect(i18n.es.fmtDate("kk10ll")).toEqual(null);
	});
	test("Parse Times", () => {
		expect(i18n.es.toTime()).toBeFalsy();
		expect(i18n.es.toTime(null)).toBeFalsy();
		expect(i18n.es.toTime("")).toBe(null);
		expect(i18n.es.toTime("kk")).toBe(null);
		expect(i18n.es.toTime("kk00hjgk")).toBe(null);
		expect(i18n.es.toTime("kk/2/2")).toBe(null);
		expect(i18n.es.toTime("2/42/35")).toEqual(new Date(sysdate.setHours(2, 42, 35, 0)));
		expect(i18n.es.toTime("0:0:0.1")).toEqual(new Date(sysdate.setHours(0, 0, 0, 1)));
	});
	test("Format Time", () => {
		expect(i18n.es.isoTime()).toBe(null);
		expect(i18n.es.isoTime(null)).toBe(null);
		expect(i18n.es.isoTime(new Date(2021, 1, 1))).toBe("00:00:00");
		expect(i18n.es.isoTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("12:14:09");
		expect(i18n.es.minTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("12:14");
	});
	test("Format Date Time", () => {
		expect(i18n.es.isoDateTime()).toBe(null);
		expect(i18n.es.isoDateTime(null)).toBe(null);
		expect(i18n.es.isoDateTime(new Date(2021, 1, 1))).toBe("01/02/2021 00:00:00");
		expect(i18n.es.isoDateTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("01/02/2021 12:14:09");
	});
});

describe("I18N EN Integers", () => {
	test("Parse Integer", () => {
		expect(i18n.en.toInt()).toBeFalsy();
		expect(i18n.en.toInt(null)).toBeFalsy();
		expect(i18n.en.toInt("")).toBeFalsy();
		expect(i18n.en.toInt("kk")).toBeFalsy();
		expect(i18n.en.toInt("1.10")).toBeTruthy();
		expect(i18n.en.toInt("1.10")).toBe(110);
		expect(i18n.en.toInt("1,10")).toBe(110);
		expect(i18n.en.toInt("kk1,10")).toBe(110);
	});
	test("Format Integer", () => {
		expect(i18n.en.isoInt()).toBe(null);
		expect(i18n.en.isoInt(null)).toBe(null);
		expect(i18n.en.isoInt(.1)).toBe("1");
		expect(i18n.en.isoInt(0.01)).toBe("1");
		expect(i18n.en.isoInt(123324.982734)).toBe("123,324,982,734");
		expect(i18n.en.isoInt(21123324.982734)).toBe("21,123,324,982,734");
	});
	test("String to Formated Strings Integer", () => {
		expect(i18n.en.fmtInt()).toBe(undefined);
		expect(i18n.en.fmtInt(null)).toBe(null);
		expect(i18n.en.fmtInt("kk")).toBe(null);
		expect(i18n.en.fmtInt(".1")).toBe("1");
		expect(i18n.en.fmtInt("0.01")).toBe("1");
		expect(i18n.en.fmtInt("123324.982734")).toBe("123,324,982,734");
		expect(i18n.en.fmtInt("21123324.982734")).toBe("21,123,324,982,734");
	});
});

describe("I18N EN Floats", () => {
	test("Parse Floats", () => {
		expect(i18n.en.toFloat()).toBeFalsy();
		expect(i18n.en.toFloat(null)).toBeFalsy();
		expect(i18n.en.toFloat("")).toBeFalsy();
		expect(i18n.en.toFloat("kk")).toBe(null);
		expect(i18n.en.toFloat("1.10")).toBeTruthy();
		expect(i18n.en.toFloat("1.10")).toBe(1.10);
		expect(i18n.en.toFloat("1,10")).toBe(110);
		expect(i18n.en.toFloat("kk1,10")).toBe(110);
		expect(i18n.en.toFloat("kk1.10")).toBe(1.10);
	});
	test("Format Floats", () => {
		expect(i18n.en.isoFloat()).toBe(null);
		expect(i18n.en.isoFloat(null)).toBe(null);
		expect(i18n.en.isoFloat(.1)).toBe("0.10");
		expect(i18n.en.isoFloat(0.01)).toBe("0.01");
		expect(i18n.en.isoFloat(123324.982734)).toBe("123,324.98");
		expect(i18n.en.isoFloat(21123324.982734, 3)).toBe("21,123,324.982");
	});
	test("String to Formated Strings Float", () => {
		expect(i18n.en.fmtFloat()).toBe(undefined);
		expect(i18n.en.fmtFloat(null)).toBe(null);
		expect(i18n.en.fmtFloat("kk")).toBe(null);
		expect(i18n.en.fmtFloat(".1")).toBe("0.10");
		expect(i18n.en.fmtFloat("0.01")).toBe("0.01");
		expect(i18n.en.fmtFloat("123324.982734")).toBe("123,324.98");
		expect(i18n.en.fmtFloat("21123324.982734", 3)).toBe("21,123,324.982");
	});
});

describe("I18N EN DateTime", () => {
	let sysdate = new Date();

	test("Parse Dates", () => {
		expect(i18n.en.toDate()).toBeFalsy();
		expect(i18n.en.toDate(null)).toBeFalsy();
		expect(i18n.en.toDate("")).toBe(null);
		expect(i18n.en.toDate("kk")).toBe(null);
		expect(i18n.en.toDate("kk00hjgk")).toBe(null);
		expect(i18n.en.toDate("2-2-kk")).toEqual(new Date(2002, 1, 1, 0, 0, 0));
		expect(i18n.en.toDate("0/1/kk")).toEqual(new Date(2000, 0, 1, 0, 0, 0));
		expect(i18n.en.toDate("21-1-1T0:0:0.0")).toEqual(new Date(2021, 0, 1, 0, 0, 0));
	});
	test("Format Dates", () => {
		expect(i18n.en.isoDate()).toBe(null);
		expect(i18n.en.isoDate(null)).toBe(null);
		expect(i18n.en.isoDate(new Date(2021, 1, 1))).toBe("2021-02-01");
		expect(i18n.en.isoDate(new Date(2021, 1, 1, 12, 14, 9))).toBe("2021-02-01");
	});
	test("String to Formated Strings Date", () => {
		expect(i18n.en.fmtDate()).toBe(null);
		expect(i18n.en.fmtDate(null)).toBe(null);
		expect(i18n.en.fmtDate("kk")).toBe(null);
		expect(i18n.en.fmtDate("1-2-kk")).toEqual("2001-02-01");
		expect(i18n.en.fmtDate("0-0-2")).toEqual("2000-01-02");
		expect(i18n.en.fmtDate("0/kk/0")).toEqual("2000-01-01");
		expect(i18n.en.fmtDate("0/kk/9")).toEqual("2000-09-01");
		expect(i18n.en.fmtDate("kk10ll")).toEqual(null);
	});
	test("Parse Times", () => {
		expect(i18n.en.toTime()).toBeFalsy();
		expect(i18n.en.toTime(null)).toBeFalsy();
		expect(i18n.en.toTime("")).toBe(null);
		expect(i18n.en.toTime("kk")).toBe(null);
		expect(i18n.en.toTime("kk00hjgk")).toBe(null);
		expect(i18n.en.toTime("kk/2/2")).toBe(null);
		expect(i18n.en.toTime("2/42/35")).toEqual(new Date(sysdate.setHours(2, 42, 35, 0)));
		expect(i18n.en.toTime("0:0:0.1")).toEqual(new Date(sysdate.setHours(0, 0, 0, 1)));
	});
	test("Format Time", () => {
		expect(i18n.en.isoTime()).toBe(null);
		expect(i18n.en.isoTime(null)).toBe(null);
		expect(i18n.en.isoTime(new Date(2021, 1, 1))).toBe("00:00:00");
		expect(i18n.en.isoTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("12:14:09");
		expect(i18n.en.minTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("12:14");
	});
	test("Format Date Time", () => {
		expect(i18n.en.isoDateTime()).toBe(null);
		expect(i18n.en.isoDateTime(null)).toBe(null);
		expect(i18n.en.isoDateTime(new Date(2021, 1, 1))).toBe("2021-02-01 00:00:00");
		expect(i18n.en.isoDateTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("2021-02-01 12:14:09");
	});
});
