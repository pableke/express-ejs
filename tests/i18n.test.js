
const i18n = require("../src/i18n/i18n.js"); //languages

describe("ES I18N Helpers", () => {
	test("ES Integers", () => {
		expect(i18n.es.toInt()).toBeFalsy();
		expect(i18n.es.toInt(null)).toBeFalsy();
		expect(i18n.es.toInt("")).toBeFalsy();
		expect(i18n.es.toInt("kk")).toBeFalsy();
		expect(i18n.es.toInt("1.10")).toBeTruthy();
		expect(i18n.es.toInt("1.10")).toBe(110);
		expect(i18n.es.toInt("1,10")).toBe(110);
		expect(i18n.es.toInt("kk1,10")).toBe(110);
	});
	test("ES Format Integer", () => {
		expect(i18n.es.isoInt()).toBe(null);
		expect(i18n.es.isoInt(null)).toBe(null);
		expect(i18n.es.isoInt(.1)).toBe("1");
		expect(i18n.es.isoInt(0.01)).toBe("1");
		expect(i18n.es.isoInt(123324.982734)).toBe("123.324.982.734");
		expect(i18n.es.isoInt(21123324.982734)).toBe("21.123.324.982.734");
	});
	test("ES String Integers to Formated Integer Strings", () => {
		expect(i18n.es.fmtInt()).toBe(undefined);
		expect(i18n.es.fmtInt(null)).toBe(null);
		expect(i18n.es.fmtInt("kk")).toBe(null);
		expect(i18n.es.fmtInt(",1")).toBe("1");
		expect(i18n.es.fmtInt("0,01")).toBe("1");
		expect(i18n.es.fmtInt("123324,982734")).toBe("123.324.982.734");
		expect(i18n.es.fmtInt("21123324,982734")).toBe("21.123.324.982.734");
	});
	test("ES Floats", () => {
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
	test("ES Format Floats", () => {
		expect(i18n.es.isoFloat()).toBe(null);
		expect(i18n.es.isoFloat(null)).toBe(null);
		expect(i18n.es.isoFloat(.1)).toBe("0,10");
		expect(i18n.es.isoFloat(0.01)).toBe("0,01");
		expect(i18n.es.isoFloat(123324.982734)).toBe("123.324,98");
		expect(i18n.es.isoFloat(21123324.982734, 3)).toBe("21.123.324,982");
	});
	test("ES String Floats to Formated Float Strings", () => {
		expect(i18n.es.fmtFloat()).toBe(undefined);
		expect(i18n.es.fmtFloat(null)).toBe(null);
		expect(i18n.es.fmtFloat("kk")).toBe(null);
		expect(i18n.es.fmtFloat(",1")).toBe("0,10");
		expect(i18n.es.fmtFloat("0,01")).toBe("0,01");
		expect(i18n.es.fmtFloat("123324,982734")).toBe("123.324,98");
		expect(i18n.es.fmtFloat("21123324,982734", 3)).toBe("21.123.324,982");
	});
	test("ES Dates", () => {
		expect(i18n.es.toDate()).toBeFalsy();
		expect(i18n.es.toDate(null)).toBeFalsy();
		expect(i18n.es.toDate("")).toBe(null);
		expect(i18n.es.toDate("kk")).toBe(null);
		expect(i18n.es.toDate("kk00hjgk")).toBe(null);
		expect(i18n.es.toDate("kk/2/2")).toEqual(new Date(2002, 1, 1, 0, 0, 0));
		expect(i18n.es.toDate("kk/1/0")).toEqual(new Date(2000, 0, 1, 0, 0, 0));
		expect(i18n.es.toDate("1/1/21T0:0:0.0")).toEqual(new Date(2021, 0, 1, 0, 0, 0));
	});
});

describe("EN I18N Helpers", () => {
	test("EN Integers", () => {
		expect(i18n.en.toInt()).toBeFalsy();
		expect(i18n.en.toInt(null)).toBeFalsy();
		expect(i18n.en.toInt("")).toBeFalsy();
		expect(i18n.en.toInt("kk")).toBeFalsy();
		expect(i18n.en.toInt("1.10")).toBeTruthy();
		expect(i18n.en.toInt("1.10")).toBe(110);
		expect(i18n.en.toInt("1,10")).toBe(110);
		expect(i18n.en.toInt("kk1,10")).toBe(110);
	});
	test("EN Format Integer", () => {
		expect(i18n.en.isoInt()).toBe(null);
		expect(i18n.en.isoInt(null)).toBe(null);
		expect(i18n.en.isoInt(.1)).toBe("1");
		expect(i18n.en.isoInt(0.01)).toBe("1");
		expect(i18n.en.isoInt(123324.982734)).toBe("123,324,982,734");
		expect(i18n.en.isoInt(21123324.982734)).toBe("21,123,324,982,734");
	});
	test("EN String Integers to Formated Integer Strings", () => {
		expect(i18n.en.fmtInt()).toBe(undefined);
		expect(i18n.en.fmtInt(null)).toBe(null);
		expect(i18n.en.fmtInt("kk")).toBe(null);
		expect(i18n.en.fmtInt(".1")).toBe("1");
		expect(i18n.en.fmtInt("0.01")).toBe("1");
		expect(i18n.en.fmtInt("123324.982734")).toBe("123,324,982,734");
		expect(i18n.en.fmtInt("21123324.982734")).toBe("21,123,324,982,734");
	});
	test("EN Floats", () => {
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
	test("EN Format Floats", () => {
		expect(i18n.en.isoFloat()).toBe(null);
		expect(i18n.en.isoFloat(null)).toBe(null);
		expect(i18n.en.isoFloat(.1)).toBe("0.10");
		expect(i18n.en.isoFloat(0.01)).toBe("0.01");
		expect(i18n.en.isoFloat(123324.982734)).toBe("123,324.98");
		expect(i18n.en.isoFloat(21123324.982734, 3)).toBe("21,123,324.982");
	});
	test("EN String Floats to Formated Float Strings", () => {
		expect(i18n.en.fmtFloat()).toBe(undefined);
		expect(i18n.en.fmtFloat(null)).toBe(null);
		expect(i18n.en.fmtFloat("kk")).toBe(null);
		expect(i18n.en.fmtFloat(".1")).toBe("0.10");
		expect(i18n.en.fmtFloat("0.01")).toBe("0.01");
		expect(i18n.en.fmtFloat("123324.982734")).toBe("123,324.98");
		expect(i18n.en.fmtFloat("21123324.982734", 3)).toBe("21,123,324.982");
	});
	test("EN Dates", () => {
		expect(i18n.en.toDate()).toBeFalsy();
		expect(i18n.en.toDate(null)).toBeFalsy();
		expect(i18n.en.toDate("")).toBe(null);
		expect(i18n.en.toDate("kk")).toBe(null);
		expect(i18n.en.toDate("kk00hjgk")).toBe(null);
		expect(i18n.en.toDate("2-2-kk")).toEqual(new Date(2002, 1, 1, 0, 0, 0));
		expect(i18n.en.toDate("0-1-kk")).toEqual(new Date(2000, 0, 1, 0, 0, 0));
		expect(i18n.en.toDate("21-1-1T0:0:0.0")).toEqual(new Date(2021, 0, 1, 0, 0, 0));
	});
});
