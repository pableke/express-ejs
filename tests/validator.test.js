
const valid = require("../src/lib/validator-box.js");

describe("Size validators", () => {
	test("String / text length", () => {
		expect(valid.required()).toBeFalsy();
		expect(valid.required("")).toBeFalsy();
		expect(valid.required("asdfalks dfklasdj flaksdj ddfasdf")).toBe("asdfalks dfklasdj flaksdj ddfasdf");
		expect(valid.size10("dsfadfgd afsddsfaf")).toBeFalsy();
		expect(valid.size50("dsfadfgd")).toBeTruthy();
		expect(valid.size200()).toBe(undefined);

		expect(valid.text()).toBe(null);
		expect(valid.text("akdsfj \\ adskfl")).toBe("akdsfj &#92; adskfl");
	});
});

describe("Range validators", () => {
	test("Integer / Floats ranges", () => {
		expect(valid.intval()).toBeFalsy();
		expect(valid.intval("")).toBeFalsy();
		expect(valid.intval(0)).toBeFalsy();
		expect(valid.intval(9)).toBe(9);
		expect(valid.intval(10)).toBe(null);

		expect(valid.gt0()).toBeFalsy();
		expect(valid.gt0("")).toBeFalsy();
		expect(valid.gt0(0)).toBeFalsy();
		expect(valid.gt0(.01)).toBe(.01);
		expect(valid.gt0(-.01)).toBe(null);
	});
});

describe("RegExp validators", () => {
	test("E-Mails / Digits", () => {
		expect(valid.email()).toBeFalsy();
		expect(valid.email("asdf@asdf.com")).toBe("asdf@asdf.com");

		expect(valid.digits()).toBeFalsy();
		expect(valid.digits("230948 2")).toBe(null);
	});
});

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
