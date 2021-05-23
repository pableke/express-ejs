
const valid = require("app/lib/validator-box.js");
const i18n = require("../src/i18n/i18n.js"); //languages

valid.setI18n(i18n.es);

describe("Type validators", () => {
	test("Loggin RegExp", () => {
		expect(valid.login()).toBeFalsy();
		expect(valid.login(null)).toBeFalsy();
		expect(valid.login("0,13")).toBe(null);
	});

	test("Spanish ID's: NIF/CIF/NIE", () => {
		expect(valid.idES()).toBeFalsy();
		expect(valid.idES(null)).toBeFalsy();
		expect(valid.idES("")).toBeFalsy();
		expect(valid.idES("   ")).toBeFalsy();
		expect(valid.idES("asdklñfj asdf")).toBeFalsy();
		expect(valid.idES("0,13")).toBe(null);
		expect(valid.idES("11111111j")).toBe(null);
		expect(valid.idES("11111111h ")).toBe("11111111H");
		expect(valid.idES(" 11111111-H")).toBe("11111111H");
		expect(valid.idES(" 23024374 v ")).toBe("23024374V");
	});

	test("IBAN", () => {
		expect(valid.iban()).toBeFalsy();
		expect(valid.iban("  ")).toBeFalsy();
		expect(valid.iban(null)).toBeFalsy();
		expect(valid.iban("0,13")).toBe(null);
		expect(valid.iban(" es34 4000056655665556 ")).toBe(null);
		expect(valid.iban(" es21 4242 4242 4242 4242 ")).toBe(null);
	});

	test("Credit Card Number", () => {
		expect(valid.creditCardNumber()).toBeFalsy();
		expect(valid.creditCardNumber(null)).toBeFalsy();
		expect(valid.creditCardNumber("0,13")).toBe(null);
		expect(valid.creditCardNumber("4001056655665556")).toBe(null);
		expect(valid.creditCardNumber("4000056655665556")).toBe("4000056655665556");
		expect(valid.creditCardNumber(" 4000 056655665 556 ")).toBe("4000056655665556");
		expect(valid.creditCardNumber(" 4242 4242 4242 4242 ")).toBe("4242424242424242");
	});
});
