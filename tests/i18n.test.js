
const i18n = require("../src/i18n/i18n.js"); //languages

describe("I18N Helpers", () => {
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
	test("ES Floats", () => {
		expect(i18n.es.toFloat()).toBeFalsy();
		expect(i18n.es.toFloat(null)).toBeFalsy();
		expect(i18n.es.toFloat("")).toBeFalsy();
		expect(i18n.es.toFloat("kk")).toBeFalsy();
		expect(i18n.es.toFloat("1.10")).toBeTruthy();
		expect(i18n.es.toFloat("1.10")).toBe(110);
		expect(i18n.es.toFloat("1,10")).toBe(1.10);
		expect(i18n.es.toFloat("kk1,10")).toBe(1.10);
		expect(i18n.es.toFloat("kk1.10")).toBe(110);
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
	test("EN Floats", () => {
		expect(i18n.en.toFloat()).toBeFalsy();
		expect(i18n.en.toFloat(null)).toBeFalsy();
		expect(i18n.en.toFloat("")).toBeFalsy();
		expect(i18n.en.toFloat("kk")).toBeFalsy();
		expect(i18n.en.toFloat("1.10")).toBeTruthy();
		expect(i18n.en.toFloat("1.10")).toBe(1.10);
		expect(i18n.en.toFloat("1,10")).toBe(110);
		expect(i18n.en.toFloat("kk1,10")).toBe(110);
		expect(i18n.en.toFloat("kk1.10")).toBe(1.10);
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
