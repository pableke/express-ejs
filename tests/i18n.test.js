
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
});
