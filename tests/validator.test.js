
const valid = require("app/controllers/validators.js");
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

describe("Form validators", () => {
	test("No Forms Found", () => {
		expect(valid.setInputs({}).validate()).toBeFalsy();
		expect(valid.setInputs({}).validate(null)).toBeFalsy();
		expect(valid.setInputs({}).validate("")).toBeFalsy();
		expect(valid.setInputs({}).validate("kk")).toBeFalsy();
	});
	test("No Data Inputs", () => {
		expect(valid.validate("/login.html")).toBe(false);
		expect(valid.setInputs({}).validate("/contact.html")).toBe(false);
		expect(valid.setInputs({}).validate("/signup.html")).toBe(false);
		expect(valid.setInputs({}).validate("/menu/filter.html")).toBe(true);
	});
	test("Data Inputs", () => {
		expect(valid.setInputs({ usuario: "kk", clave: null }).validate("/login.html")).toBe(false);
		expect(valid.setInputs({ fn: "", n1: "1", d1: "", d2: null }).validate("/menu/filter.html")).toBe(true);
		expect(valid.setInputs({ n1: null, d1: "kkk" }).validate("/menu/filter.html")).toBe(true);
	});
	test("Data Parse", () => {
		valid.setInputs({ fn: "", n1: "1", d1: "", d2: null }).validate("/menu/filter.html");
		expect(valid.getData()).toEqual({ fn: "", n1: 1, n2: null, d1: null, d2: null });

		valid.setInputs({ fn: "", n1: "1", d1: "2021-02-26", d2: null }).validate("/menu/filter.html");
		expect(valid.getData()).toEqual({ fn: "", n1: 1, n2: null, d1: new Date("2021-02-26"), d2: null });
	});
});
