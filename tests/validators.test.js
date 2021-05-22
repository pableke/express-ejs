
const valid = require("app/lib/validator-box.js");
const i18n = require("../src/i18n/i18n.js"); //languages

valid.setI18n(i18n.es);

describe("Type validators", () => {
	test("Integers", () => {
		expect(valid.integer("int")).toBeFalsy();
		expect(valid.integer("int", null)).toBeFalsy();
		expect(valid.integer("int", "kk")).toBeFalsy();
		expect(valid.integer("int", "1.10")).toBeTruthy();
		expect(valid.integer("int", "1.10").getData("int")).toBe(110);
		expect(valid.integer("int", "1,10").getData("int")).toBe(110);
		expect(valid.integer("int", "kk1,10").getData("int")).toBe(110);
	});
	test("Floats", () => {
		expect(valid.float("float")).toBeFalsy();
		expect(valid.float("float", null)).toBeFalsy();
		expect(valid.float("float", "kk")).toBeFalsy();
		expect(valid.float("float", "1.10")).toBeTruthy();
		expect(valid.float("float", "1.10").getData("int")).toBe(110);
		expect(valid.float("float", "1,10").getData("int")).toBe(110);
		expect(valid.float("float", "kk1,10").getData("int")).toBe(110);
	});
	test("Dates", () => {
		expect(valid.date("date")).toBeFalsy();
	});

	test("Loggin RegExp", () => {
		expect(valid.login("login")).toBeFalsy();
		expect(valid.login("login", null)).toBeFalsy();
		expect(valid.login("login", "0,13")).toBe(false);
	});

	test("Spanish ID's: NIF/CIF/NIE", () => {
		expect(valid.idES()).toBeFalsy();
		expect(valid.idES("nif")).toBeFalsy();
		expect(valid.idES(null)).toBeFalsy();
		expect(valid.idES("nif", null)).toBeFalsy();
		expect(valid.idES("nif", "")).toBeFalsy();
		expect(valid.idES("nif", "   ")).toBeFalsy();
		expect(valid.idES("nif", "asdklñfj asdf")).toBeFalsy();
		expect(valid.idES("nif", "0,13")).toBe(false);
		expect(valid.idES("nif", "11111111j")).toBe(false);
		expect(valid.idES("nif", "11111111h ")).toBe(true);
		expect(valid.idES("nif", " 11111111-H")).toBe(true);
		expect(valid.idES("nif", " 23024374 v ")).toBe(true);
	});

	test("IBAN", () => {
		expect(valid.iban()).toBeFalsy();
		expect(valid.iban("iban")).toBeFalsy();
		expect(valid.iban("iban", "  ")).toBeFalsy();
		expect(valid.iban("iban", null)).toBeFalsy();
		expect(valid.iban("iban", "0,13")).toBe(false);
		expect(valid.iban("iban", " es34 4000056655665556 ")).toBe(false);
		expect(valid.iban("iban", " es21 4242 4242 4242 4242 ")).toBe(false);
	});

	test("Credit Card Number", () => {
		expect(valid.creditCardNumber()).toBeFalsy();
		expect(valid.creditCardNumber("ccn")).toBeFalsy();
		expect(valid.creditCardNumber("ccn", null)).toBeFalsy();
		expect(valid.creditCardNumber("ccn", "0,13")).toBe(false);
		expect(valid.creditCardNumber("ccn", "4001056655665556")).toBe(false);
		expect(valid.creditCardNumber("ccn", "4000056655665556")).toBe(true);
		expect(valid.creditCardNumber("ccn", " 4000 056655665 556 ")).toBe(true);
		expect(valid.creditCardNumber("ccn", " 4242 4242 4242 4242 ")).toBe(true);
	});
});
