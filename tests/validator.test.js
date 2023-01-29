
import test from "node:test";
import assert from "node:assert";
import valid from "app/mod/validator-box.js";

// Size validators
test("String / text length", () => {
	assert.equal(valid.required(), null);
	assert.equal(valid.required(""), null);
	assert.equal(valid.required("asdfalks dfklasdj flaksdj ddfasdf"), "asdfalks dfklasdj flaksdj ddfasdf");
	assert.equal(valid.size10("dsfadfgd afsddsfaf"), null);
	assert.equal(valid.size50("dsfadfgd"), "dsfadfgd");
	assert.equal(valid.size200(), null);

	assert.equal(valid.text(), null);
	assert.equal(valid.text("akdsfj \\ adskfl"), "akdsfj &#92; adskfl");
});

// Range validators
test("Integer / Floats ranges", () => {
	assert.equal(valid.intval(), null);
	assert.equal(valid.intval(""), null);
	assert.equal(valid.intval(0), 0);
	assert.equal(valid.intval(9), 9);
	assert.equal(valid.intval3(10), null);
	assert.equal(valid.intval(10), 10);

	assert.equal(valid.gt0(), null);
	assert.equal(valid.gt0(""), null);
	assert.equal(valid.gt0(0), null);
	assert.equal(valid.gt0(.01), .01);
	assert.equal(valid.gt0(-.01), null);

	assert.equal(valid.digits(), null);
	assert.equal(valid.digits("230948 2"), null);
});

// RegExp validators
test("E-Mails / Digits", () => {
	assert.equal(valid.email(), null);
	assert.equal(valid.email("asdf@asdf.com"), "asdf@asdf.com");

	assert.deepEqual(valid.array(), null);
	assert.deepEqual(valid.array(""), null);
	assert.deepEqual(valid.array("13"), [13]);
	assert.deepEqual(valid.array("13,0,849,041"), [13,0,849,41]);
	assert.deepEqual(valid.array("13, 0, 849,041"), [13,0,849,41]);
	assert.deepEqual(valid.array(["13", "0", "849", "1029"]), [13,0,849, 1029]);
	assert.deepEqual(valid.array("1,000,0,234,754,7676"), [1,0,0,234,754,7676]);
});

// Type validators
test("Loggin RegExp", () => {
	assert.equal(valid.login(), null);
	assert.equal(valid.login(null), null);
	assert.equal(valid.login("0,13"), null);
});

test("Spanish ID's: NIF/CIF/NIE", () => {
	assert.equal(valid.idES(), null);
	assert.equal(valid.idES(null), null);
	assert.equal(valid.idES(""), null);
	assert.equal(valid.idES("   "), null);
	assert.equal(valid.idES("asdklñfj asdf"), null);
	assert.equal(valid.idES("0,13"), null);
	assert.equal(valid.idES("11111111j"), null);
	assert.equal(valid.idES("11111111h "), "11111111H");
	assert.equal(valid.idES(" 11111111-H"), "11111111H");
	assert.equal(valid.idES(" 23024374 v "), "23024374V");
});

test("IBAN", () => {
	assert.equal(valid.iban(), null);
	assert.equal(valid.iban("  "), null);
	assert.equal(valid.iban(null), null);
	assert.equal(valid.iban("0,13"), null);
	assert.equal(valid.iban(" es34 4000056655665556 "), null);
	assert.equal(valid.iban(" es21 4242 4242 4242 4242 "), null);
});

test("Credit Card Number", () => {
	assert.equal(valid.creditCardNumber(), null);
	assert.equal(valid.creditCardNumber(null), null);
	assert.equal(valid.creditCardNumber("0,13"), null);
	assert.equal(valid.creditCardNumber("4001056655665556"), null);
	assert.equal(valid.creditCardNumber("4000056655665556"), "4000056655665556");
	assert.equal(valid.creditCardNumber(" 4000 056655665 556 "), "4000056655665556");
	assert.equal(valid.creditCardNumber(" 4242 4242 4242 4242 "), "4242424242424242");
});
