
import test from "node:test";
import assert from "node:assert";
import i18n from "../src/lib/i18n-box.js";

const ERR_REQUIRED = "errRequired";

// I18N Messages"
test("Common I18n Messages", () => {
	assert.equal(i18n.get(), undefined);
	assert.equal(i18n.get(null), undefined);

	assert.equal(i18n.setError().getError(), undefined);
	assert.equal(i18n.setError(null).getError(), null);
	assert.equal(i18n.setError("").getError(), "");
	assert.equal(i18n.setError("kk").getError(), "kk");
});

test("ES Error Messages", () => {
	const MSG = i18n.setI18n("en").get(ERR_REQUIRED); // Set ES language

	assert.equal(i18n.setError(ERR_REQUIRED).getError(), MSG);
	assert.equal(i18n.setError(MSG).getError(), MSG);

	assert.equal(i18n.setError(ERR_REQUIRED, "test", ERR_REQUIRED).getError("test"), MSG);
	assert.equal(i18n.setError(ERR_REQUIRED, "test", "Test Error").getError("test"), "Test Error");
});

test("EN Error Messages", () => {
	const MSG = i18n.setI18n("en").get(ERR_REQUIRED); // Set EN language

	assert.equal(i18n.setError(ERR_REQUIRED).getError(), MSG);
	assert.equal(i18n.setError(MSG).getError(), MSG);

	assert.equal(i18n.setError(ERR_REQUIRED, "test", ERR_REQUIRED).getError("test"), MSG);
	assert.equal(i18n.setError(ERR_REQUIRED, "test", "Test Error").getError("test"), "Test Error");
});

// I18N ES Integers
test("Parse Integer", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.toInt(), undefined);
	assert.equal(i18n.toInt(null), null);
	assert.equal(i18n.toInt(""), null);
	assert.equal(i18n.toInt("kk"), null);
	assert.ok(i18n.toInt("1.10")); // Truthy
	assert.equal(i18n.toInt("1.10"), 110);
	assert.equal(i18n.toInt("1,10"), 110);
	assert.equal(i18n.toInt("-1,10"), -110);
	assert.equal(i18n.toInt("kk1,10"), 110);
});
test("Format Integer", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.isoInt(), null);
	assert.equal(i18n.isoInt(null), null);
	assert.equal(i18n.isoInt(.1), "1");
	assert.equal(i18n.isoInt(0.01), "1");
	assert.equal(i18n.isoInt(123324.982734), "123.324.982.734");
	assert.equal(i18n.isoInt(21123324.982734), "21.123.324.982.734");
	assert.equal(i18n.isoInt(-21123324.982734), "-21.123.324.982.734");
});
test("String to Formated Strings Integer", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.fmtInt(), undefined);
	assert.equal(i18n.fmtInt(null), null);
	assert.equal(i18n.fmtInt("kk"), null);
	assert.equal(i18n.fmtInt(",1"), "1");
	assert.equal(i18n.fmtInt("-,1"), "-1");
	assert.equal(i18n.fmtInt("0,01"), "1");
	assert.equal(i18n.fmtInt("123324,982734"), "123.324.982.734");
	assert.equal(i18n.fmtInt("21123324,982734"), "21.123.324.982.734");
	assert.equal(i18n.fmtInt("-21123324,982734"), "-21.123.324.982.734");
});

// I18N ES Floats
test("Parse Floats", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.toFloat(), undefined);
	assert.equal(i18n.toFloat(null), null);
	assert.equal(i18n.toFloat(""), null);
	assert.equal(i18n.toFloat("kk"), null);
	assert.ok(i18n.toFloat("1.10")); // Truthy
	assert.equal(i18n.toFloat("1.10"), 110);
	assert.equal(i18n.toFloat("1,10"), 1.10);
	assert.equal(i18n.toFloat("-1,10"), -1.10);
	assert.equal(i18n.toFloat("kk1,10"), 1.10);
	assert.equal(i18n.toFloat("kk1.10"), 110);
});
test("Format Floats", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.isoFloat(), null);
	assert.equal(i18n.isoFloat(null), null);
	assert.equal(i18n.isoFloat(.1), "0,10");
	assert.equal(i18n.isoFloat(-.1), "-0,10");
	assert.equal(i18n.isoFloat(0.01), "0,01");
	assert.equal(i18n.isoFloat(123324.982734), "123.324,98");
	assert.equal(i18n.isoFloat3(123324.982734), "123.324,983"); // round(3)
});
test("String to Formated Strings Float", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.fmtFloat(), undefined);
	assert.equal(i18n.fmtFloat(null), null);
	assert.equal(i18n.fmtFloat("kk"), null);
	assert.equal(i18n.fmtFloat(",1"), "0,10");
	assert.equal(i18n.fmtFloat("0,01"), "0,01");
	assert.equal(i18n.fmtFloat("123324,982734"), "123.324,98");
	assert.equal(i18n.fmtFloat1("21123324,982734"), "21.123.324,9");
	assert.equal(i18n.fmtFloat3("21123324,982734"), "21.123.324,982");
	assert.equal(i18n.fmtFloat3("-4321123324,982734"), "-4.321.123.324,982");
});

// I18N ES DateTime
test("Parse Dates", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.toDate(), undefined);
	assert.equal(i18n.toDate(null), null);
	assert.equal(i18n.toDate(""), null);
	assert.equal(i18n.toDate("kk"), null);
	assert.equal(i18n.toDate("kk00hjgk"), null);
	assert.deepEqual(i18n.toDate("02/02/2002"), new Date(2002, 1, 2, 0, 0, 0));
	assert.deepEqual(i18n.toDate("01/01/2000"), new Date(2000, 0, 1, 0, 0, 0));
	assert.deepEqual(i18n.toDate("01/01/2021T0:0:0.0"), new Date(2021, 0, 1, 0, 0, 0));
});
test("Format Dates", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.isoDate(), null);
	assert.equal(i18n.isoDate(null), null);
	assert.equal(i18n.isoDate(new Date(2021, 1, 1)), "01/02/2021");
	assert.equal(i18n.isoDate(new Date(2021, 1, 1, 12, 14, 9)), "01/02/2021");
});
test("String to Formated Strings Date", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.fmtDate(), null);
	assert.equal(i18n.fmtDate(null), null);
	assert.equal(i18n.fmtDate("kk"), "//kk");
	assert.equal(i18n.fmtDate("kkkk/02/01"), "01/02/kkkk");
	assert.equal(i18n.fmtDate("2002/01/01"), "01/01/2002");
	assert.equal(i18n.fmtDate("2000/kk/01"), "01/kk/2000");
	assert.equal(i18n.fmtDate("2000/kk/09"), "09/kk/2000");
	assert.equal(i18n.fmtDate("kk10ll"), "/l/kk10");
});
test("Parse Times", () => {
	let sysdate = new Date();
	sysdate.setHours(0, 0, 0, 0);
	i18n.setI18n("es"); // Change language

	assert.equal(i18n.toTime(), null);
	assert.equal(i18n.toTime(null), null);
	assert.deepEqual(i18n.toTime(""), null);
	assert.deepEqual(i18n.toTime("kk"), sysdate);
	assert.deepEqual(i18n.toTime("kk00hjgk"), sysdate);
	assert.deepEqual(i18n.toTime("7"), new Date(sysdate.setHours(7, 0, 0, 0)));
	assert.deepEqual(i18n.toTime("kk:2:2"), new Date(sysdate.setHours(0, 2, 2, 0)));
	assert.deepEqual(i18n.toTime("2:42:35"), new Date(sysdate.setHours(2, 42, 35, 0)));
	assert.deepEqual(i18n.toTime("0:0:0.1"), new Date(sysdate.setHours(0, 0, 0, 1)));
});
test("Format Time", () => {
	i18n.setI18n("es"); // Set ES language

	assert.equal(i18n.isoTime(), null);
	assert.equal(i18n.isoTime(null), null);
	assert.equal(i18n.isoTime(new Date(2021, 1, 1)), "00:00:00");
	assert.equal(i18n.isoTime(new Date(2021, 1, 1, 12, 14, 9)), "12:14:09");
	assert.equal(i18n.minTime(new Date(2021, 1, 1, 12, 14, 9)), "12:14");
});

// I18N EN Integers"
test("Parse Integer", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.toInt(), undefined);
	assert.equal(i18n.toInt(null), null);
	assert.equal(i18n.toInt(""), null);
	assert.equal(i18n.toInt("kk"), null);
	assert.ok(i18n.toInt("1.10")); // Truthy
	assert.equal(i18n.toInt("1.10"), 110);
	assert.equal(i18n.toInt("1,10"), 110);
	assert.equal(i18n.toInt("-1,10"), -110);
	assert.equal(i18n.toInt("kk1,10"), 110);
});
test("Format Integer", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.isoInt(), null);
	assert.equal(i18n.isoInt(null), null);
	assert.equal(i18n.isoInt(.1), "1");
	assert.equal(i18n.isoInt(0.01), "1");
	assert.equal(i18n.isoInt(123324.982734), "123,324,982,734");
	assert.equal(i18n.isoInt(21123324.982734), "21,123,324,982,734");
	assert.equal(i18n.isoInt(-721123324.982734), "-721,123,324,982,734");
});
test("String to Formated Strings Integer", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.fmtInt(), undefined);
	assert.equal(i18n.fmtInt(null), null);
	assert.equal(i18n.fmtInt("kk"), null);
	assert.equal(i18n.fmtInt(".1"), "1");
	assert.equal(i18n.fmtInt("-.1"), "-1");
	assert.equal(i18n.fmtInt("0.01"), "1");
	assert.equal(i18n.fmtInt("123324.982734"), "123,324,982,734");
	assert.equal(i18n.fmtInt("21123324.982734"), "21,123,324,982,734");
	assert.equal(i18n.fmtInt("-921123324.982734"), "-921,123,324,982,734");
});

// I18N EN Floats
test("Parse Floats", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.toFloat(), undefined);
	assert.equal(i18n.toFloat(null), null);
	assert.equal(i18n.toFloat(""), null);
	assert.equal(i18n.toFloat("kk"), null);
	assert.ok(i18n.toFloat("1.10")); //Truthy
	assert.equal(i18n.toFloat("1.10"), 1.10);
	assert.equal(i18n.toFloat("-1.10"), -1.10);
	assert.equal(i18n.toFloat("1,10"), 110);
	assert.equal(i18n.toFloat("kk1,10"), 110);
	assert.equal(i18n.toFloat("kk1.10"), 1.10);
});
test("Format Floats", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.isoFloat(), null);
	assert.equal(i18n.isoFloat(null), null);
	assert.equal(i18n.isoFloat(.1), "0.10");
	assert.equal(i18n.isoFloat(-.1), "-0.10");
	assert.equal(i18n.isoFloat(0.01), "0.01");
	assert.equal(i18n.isoFloat(123324.982734), "123,324.98");
	assert.equal(i18n.isoFloat3(123324.982734), "123,324.983"); // round(3)
});
test("String to Formated Strings Float", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.fmtFloat(), undefined);
	assert.equal(i18n.fmtFloat(null), null);
	assert.equal(i18n.fmtFloat("kk"), null);
	assert.equal(i18n.fmtFloat(".1"), "0.10");
	assert.equal(i18n.fmtFloat("0.01"), "0.01");
	assert.equal(i18n.fmtFloat("123324.982734"), "123,324.98");
	assert.equal(i18n.fmtFloat1("21123324.982734"), "21,123,324.9");
	assert.equal(i18n.fmtFloat3("21123324.982734"), "21,123,324.982");
	assert.equal(i18n.fmtFloat3("-621123324.982734"), "-621,123,324.982");
});

// I18N EN DateTime
test("Parse Dates", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.toDate(), undefined);
	assert.equal(i18n.toDate(null), null);
	assert.equal(i18n.toDate(""), null);
	assert.equal(i18n.toDate("kk"), null);
	assert.equal(i18n.toDate("kk00hjgk"), null);
	assert.deepEqual(i18n.toDate("2002-02-02"), new Date(2002, 1, 2, 0, 0, 0));
	assert.deepEqual(i18n.toDate("2000/01/01"), new Date(2000, 0, 1, 0, 0, 0));
	assert.deepEqual(i18n.toDate("2021-01-01T0:0:0.0"), new Date(2021, 0, 1, 0, 0, 0));
});
test("Format Dates", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.isoDate(), null);
	assert.equal(i18n.isoDate(null), null);
	assert.equal(i18n.isoDate(new Date(2021, 1, 1)), "2021-02-01");
	assert.equal(i18n.isoDate(new Date(2021, 1, 1, 12, 14, 9)), "2021-02-01");
});
test("String to Formated Strings Date", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.fmtDate(), null);
	assert.equal(i18n.fmtDate(null), null);
	assert.equal(i18n.fmtDate("kk"), "kk");
	assert.equal(i18n.fmtDate("1-2-kk"), "1-2-kk");
	assert.equal(i18n.fmtDate("0-0-2"), "0-0-2");
	assert.equal(i18n.fmtDate("0/kk/0"), "0/kk/0");
	assert.equal(i18n.fmtDate("0/kk/9"), "0/kk/9");
	assert.equal(i18n.fmtDate("kk10ll"), "kk10ll");
});
test("Parse Times", () => {
	let sysdate = new Date();
	sysdate.setHours(0, 0, 0, 0);
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.toTime(), null);
	assert.equal(i18n.toTime(null), null);
	assert.deepEqual(i18n.toTime(""), null);
	assert.deepEqual(i18n.toTime("kk"), sysdate);
	assert.deepEqual(i18n.toTime("kk00hjgk"), sysdate);
	assert.deepEqual(i18n.toTime("7"), new Date(sysdate.setHours(7, 0, 0, 0)));
	assert.deepEqual(i18n.toTime("kk:2:2"), new Date(sysdate.setHours(0, 2, 2, 0)));
	assert.deepEqual(i18n.toTime("2:42:35"), new Date(sysdate.setHours(2, 42, 35, 0)));
	assert.deepEqual(i18n.toTime("0:0:0.1"), new Date(sysdate.setHours(0, 0, 0, 1)));
});
test("Format Time", () => {
	i18n.setI18n("en"); // Change language

	assert.equal(i18n.isoTime(), null);
	assert.equal(i18n.isoTime(null), null);
	assert.equal(i18n.isoTime(new Date(2021, 1, 1)), "00:00:00");
	assert.equal(i18n.isoTime(new Date(2021, 1, 1, 12, 14, 9)), "12:14:09");
	assert.equal(i18n.minTime(new Date(2021, 1, 1, 12, 14, 9)), "12:14");
});
