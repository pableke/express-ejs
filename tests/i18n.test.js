
const { i18n } = require("../src/lib/util-box.js");

describe("I18N Messages", () => {
	test("ES Error Messages", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.get()).toBe(undefined);
		expect(i18n.get(null)).toBe(undefined);

		expect(i18n.setMsgError().getError()).toBe(undefined);
		expect(i18n.setMsgError(null).getError()).toBe(null);
		expect(i18n.setMsgError("").getError()).toBe("");
		expect(i18n.setMsgError("kk").getError()).toBe("kk");
		expect(i18n.setMsgError("errRequired").getError()).toBe("¡Campo obligatorio!");
		expect(i18n.setMsgError("¡Campo obligatorio!").getError()).toBe("¡Campo obligatorio!");

		expect(i18n.setError("test", "errRequired", "errRequired").getError("test")).toBe("¡Campo obligatorio!");
		expect(i18n.setError("test", "errRequired", "Test Error").getError("test")).toBe("Test Error");
	});

	test("EN Error Messages", () => {
		i18n.setI18n("en"); // Set ES language

		expect(i18n.get()).toBe(undefined);
		expect(i18n.get(null)).toBe(undefined);

		expect(i18n.setMsgError().getError()).toBe(undefined);
		expect(i18n.setMsgError(null).getError()).toBe(null);
		expect(i18n.setMsgError("").getError()).toBe("");
		expect(i18n.setMsgError("kk").getError()).toBe("kk");
		expect(i18n.setMsgError("errRequired").getError()).toBe("Required value!");
		expect(i18n.setMsgError("Required value!").getError()).toBe("Required value!");

		expect(i18n.setError("test", "errRequired", "errRequired").getError("test")).toBe("Required value!");
		expect(i18n.setError("test", "errRequired", "Test Error").getError("test")).toBe("Test Error");
	});
});

describe("I18N ES Integers", () => {
	test("Parse Integer", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.toInt()).toBeFalsy();
		expect(i18n.toInt(null)).toBeFalsy();
		expect(i18n.toInt("")).toBeFalsy();
		expect(i18n.toInt("kk")).toBeFalsy();
		expect(i18n.toInt("1.10")).toBeTruthy();
		expect(i18n.toInt("1.10")).toBe(110);
		expect(i18n.toInt("1,10")).toBe(110);
		expect(i18n.toInt("-1,10")).toBe(-110);
		expect(i18n.toInt("kk1,10")).toBe(110);
	});
	test("Format Integer", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.isoInt()).toBe(null);
		expect(i18n.isoInt(null)).toBe(null);
		expect(i18n.isoInt(.1)).toBe("1");
		expect(i18n.isoInt(0.01)).toBe("1");
		expect(i18n.isoInt(123324.982734)).toBe("123.324.982.734");
		expect(i18n.isoInt(21123324.982734)).toBe("21.123.324.982.734");
		expect(i18n.isoInt(-21123324.982734)).toBe("-21.123.324.982.734");
	});
	test("String to Formated Strings Integer", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.fmtInt()).toBe(undefined);
		expect(i18n.fmtInt(null)).toBe(null);
		expect(i18n.fmtInt("kk")).toBe(null);
		expect(i18n.fmtInt(",1")).toBe("1");
		expect(i18n.fmtInt("-,1")).toBe("-1");
		expect(i18n.fmtInt("0,01")).toBe("1");
		expect(i18n.fmtInt("123324,982734")).toBe("123.324.982.734");
		expect(i18n.fmtInt("21123324,982734")).toBe("21.123.324.982.734");
		expect(i18n.fmtInt("-21123324,982734")).toBe("-21.123.324.982.734");
	});
});

describe("I18N ES Floats", () => {
	test("Parse Floats", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.toFloat()).toBeFalsy();
		expect(i18n.toFloat(null)).toBeFalsy();
		expect(i18n.toFloat("")).toBeFalsy();
		expect(i18n.toFloat("kk")).toBe(null);
		expect(i18n.toFloat("1.10")).toBeTruthy();
		expect(i18n.toFloat("1.10")).toBe(110);
		expect(i18n.toFloat("1,10")).toBe(1.10);
		expect(i18n.toFloat("-1,10")).toBe(-1.10);
		expect(i18n.toFloat("kk1,10")).toBe(1.10);
		expect(i18n.toFloat("kk1.10")).toBe(110);
	});
	test("Format Floats", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.isoFloat()).toBe(null);
		expect(i18n.isoFloat(null)).toBe(null);
		expect(i18n.isoFloat(.1)).toBe("0,10");
		expect(i18n.isoFloat(-.1)).toBe("-0,10");
		expect(i18n.isoFloat(0.01)).toBe("0,01");
		expect(i18n.isoFloat(123324.982734)).toBe("123.324,98");
		expect(i18n.isoFloat3(123324.982734)).toBe("123.324,983"); // round(3)
	});
	test("String to Formated Strings Float", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.fmtFloat()).toBe(undefined);
		expect(i18n.fmtFloat(null)).toBe(null);
		expect(i18n.fmtFloat("kk")).toBe(null);
		expect(i18n.fmtFloat(",1")).toBe("0,10");
		expect(i18n.fmtFloat("0,01")).toBe("0,01");
		expect(i18n.fmtFloat("123324,982734")).toBe("123.324,98");
		expect(i18n.fmtFloat1("21123324,982734")).toBe("21.123.324,9");
		expect(i18n.fmtFloat3("21123324,982734")).toBe("21.123.324,982");
		expect(i18n.fmtFloat3("-4321123324,982734")).toBe("-4.321.123.324,982");
	});
});

describe("I18N ES DateTime", () => {
	let sysdate = new Date();

	test("Parse Dates", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.toDate()).toBeFalsy();
		expect(i18n.toDate(null)).toBeFalsy();
		expect(i18n.toDate("")).toBe(null);
		expect(i18n.toDate("kk")).toBe(null);
		expect(i18n.toDate("kk00hjgk")).toBe(null);
		expect(i18n.toDate("kk/2/2")).toEqual(new Date(2002, 1, 1, 0, 0, 0));
		expect(i18n.toDate("kk/1/0")).toEqual(new Date(2000, 0, 1, 0, 0, 0));
		expect(i18n.toDate("1/1/21T0:0:0.0")).toEqual(new Date(2021, 0, 1, 0, 0, 0));
	});
	test("Format Dates", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.isoDate()).toBe(null);
		expect(i18n.isoDate(null)).toBe(null);
		expect(i18n.isoDate(new Date(2021, 1, 1))).toBe("01/02/2021");
		expect(i18n.isoDate(new Date(2021, 1, 1, 12, 14, 9))).toBe("01/02/2021");
	});
	test("String to Formated Strings Date", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.fmtDate()).toBe(null);
		expect(i18n.fmtDate(null)).toBe(null);
		expect(i18n.fmtDate("kk")).toBe(null);
		expect(i18n.fmtDate("1/2/kk")).toEqual("01/02/2000");
		expect(i18n.fmtDate("0/0/2")).toEqual("01/01/2002");
		expect(i18n.fmtDate("0/kk/0")).toEqual("01/01/2000");
		expect(i18n.fmtDate("0/kk/9")).toEqual("01/09/2000");
		expect(i18n.fmtDate("kk10ll")).toEqual(null);
	});
	test("Parse Times", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.toTime()).toBeFalsy();
		expect(i18n.toTime(null)).toBeFalsy();
		expect(i18n.toTime("")).toBe(null);
		expect(i18n.toTime("kk")).toBe(null);
		expect(i18n.toTime("kk00hjgk")).toBe(null);
		expect(i18n.toTime("kk/2/2")).toBe(null);
		expect(i18n.toTime("2/42/35")).toEqual(new Date(sysdate.setHours(2, 42, 35, 0)));
		expect(i18n.toTime("0:0:0.1")).toEqual(new Date(sysdate.setHours(0, 0, 0, 1)));
	});
	test("Format Time", () => {
		i18n.setI18n("es"); // Set ES language

		expect(i18n.isoTime()).toBe(null);
		expect(i18n.isoTime(null)).toBe(null);
		expect(i18n.isoTime(new Date(2021, 1, 1))).toBe("00:00:00");
		expect(i18n.isoTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("12:14:09");
		expect(i18n.minTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("12:14");
	});
});

describe("I18N EN Integers", () => {
	test("Parse Integer", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.toInt()).toBeFalsy();
		expect(i18n.toInt(null)).toBeFalsy();
		expect(i18n.toInt("")).toBeFalsy();
		expect(i18n.toInt("kk")).toBeFalsy();
		expect(i18n.toInt("1.10")).toBeTruthy();
		expect(i18n.toInt("1.10")).toBe(110);
		expect(i18n.toInt("1,10")).toBe(110);
		expect(i18n.toInt("-1,10")).toBe(-110);
		expect(i18n.toInt("kk1,10")).toBe(110);
	});
	test("Format Integer", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.isoInt()).toBe(null);
		expect(i18n.isoInt(null)).toBe(null);
		expect(i18n.isoInt(.1)).toBe("1");
		expect(i18n.isoInt(0.01)).toBe("1");
		expect(i18n.isoInt(123324.982734)).toBe("123,324,982,734");
		expect(i18n.isoInt(21123324.982734)).toBe("21,123,324,982,734");
		expect(i18n.isoInt(-721123324.982734)).toBe("-721,123,324,982,734");
	});
	test("String to Formated Strings Integer", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.fmtInt()).toBe(undefined);
		expect(i18n.fmtInt(null)).toBe(null);
		expect(i18n.fmtInt("kk")).toBe(null);
		expect(i18n.fmtInt(".1")).toBe("1");
		expect(i18n.fmtInt("-.1")).toBe("-1");
		expect(i18n.fmtInt("0.01")).toBe("1");
		expect(i18n.fmtInt("123324.982734")).toBe("123,324,982,734");
		expect(i18n.fmtInt("21123324.982734")).toBe("21,123,324,982,734");
		expect(i18n.fmtInt("-921123324.982734")).toBe("-921,123,324,982,734");
	});
});

describe("I18N EN Floats", () => {
	test("Parse Floats", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.toFloat()).toBeFalsy();
		expect(i18n.toFloat(null)).toBeFalsy();
		expect(i18n.toFloat("")).toBeFalsy();
		expect(i18n.toFloat("kk")).toBe(null);
		expect(i18n.toFloat("1.10")).toBeTruthy();
		expect(i18n.toFloat("1.10")).toBe(1.10);
		expect(i18n.toFloat("-1.10")).toBe(-1.10);
		expect(i18n.toFloat("1,10")).toBe(110);
		expect(i18n.toFloat("kk1,10")).toBe(110);
		expect(i18n.toFloat("kk1.10")).toBe(1.10);
	});
	test("Format Floats", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.isoFloat()).toBe(null);
		expect(i18n.isoFloat(null)).toBe(null);
		expect(i18n.isoFloat(.1)).toBe("0.10");
		expect(i18n.isoFloat(-.1)).toBe("-0.10");
		expect(i18n.isoFloat(0.01)).toBe("0.01");
		expect(i18n.isoFloat(123324.982734)).toBe("123,324.98");
		expect(i18n.isoFloat3(123324.982734)).toBe("123,324.983"); // round(3)
	});
	test("String to Formated Strings Float", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.fmtFloat()).toBe(undefined);
		expect(i18n.fmtFloat(null)).toBe(null);
		expect(i18n.fmtFloat("kk")).toBe(null);
		expect(i18n.fmtFloat(".1")).toBe("0.10");
		expect(i18n.fmtFloat("0.01")).toBe("0.01");
		expect(i18n.fmtFloat("123324.982734")).toBe("123,324.98");
		expect(i18n.fmtFloat1("21123324.982734")).toBe("21,123,324.9");
		expect(i18n.fmtFloat3("21123324.982734")).toBe("21,123,324.982");
		expect(i18n.fmtFloat3("-621123324.982734")).toBe("-621,123,324.982");
	});
});

describe("I18N EN DateTime", () => {
	let sysdate = new Date();

	test("Parse Dates", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.toDate()).toBeFalsy();
		expect(i18n.toDate(null)).toBeFalsy();
		expect(i18n.toDate("")).toBe(null);
		expect(i18n.toDate("kk")).toBe(null);
		expect(i18n.toDate("kk00hjgk")).toBe(null);
		expect(i18n.toDate("2-2-kk")).toEqual(new Date(2002, 1, 1, 0, 0, 0));
		expect(i18n.toDate("0/1/kk")).toEqual(new Date(2000, 0, 1, 0, 0, 0));
		expect(i18n.toDate("21-1-1T0:0:0.0")).toEqual(new Date(2021, 0, 1, 0, 0, 0));
	});
	test("Format Dates", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.isoDate()).toBe(null);
		expect(i18n.isoDate(null)).toBe(null);
		expect(i18n.isoDate(new Date(2021, 1, 1))).toBe("2021-02-01");
		expect(i18n.isoDate(new Date(2021, 1, 1, 12, 14, 9))).toBe("2021-02-01");
	});
	test("String to Formated Strings Date", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.fmtDate()).toBe(null);
		expect(i18n.fmtDate(null)).toBe(null);
		expect(i18n.fmtDate("kk")).toBe(null);
		expect(i18n.fmtDate("1-2-kk")).toEqual("2001-02-01");
		expect(i18n.fmtDate("0-0-2")).toEqual("2000-01-02");
		expect(i18n.fmtDate("0/kk/0")).toEqual("2000-01-01");
		expect(i18n.fmtDate("0/kk/9")).toEqual("2000-09-01");
		expect(i18n.fmtDate("kk10ll")).toEqual(null);
	});
	test("Parse Times", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.toTime()).toBeFalsy();
		expect(i18n.toTime(null)).toBeFalsy();
		expect(i18n.toTime("")).toBe(null);
		expect(i18n.toTime("kk")).toBe(null);
		expect(i18n.toTime("kk00hjgk")).toBe(null);
		expect(i18n.toTime("kk/2/2")).toBe(null);
		expect(i18n.toTime("2/42/35")).toEqual(new Date(sysdate.setHours(2, 42, 35, 0)));
		expect(i18n.toTime("0:0:0.1")).toEqual(new Date(sysdate.setHours(0, 0, 0, 1)));
	});
	test("Format Time", () => {
		i18n.setI18n("en"); // Change language

		expect(i18n.isoTime()).toBe(null);
		expect(i18n.isoTime(null)).toBe(null);
		expect(i18n.isoTime(new Date(2021, 1, 1))).toBe("00:00:00");
		expect(i18n.isoTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("12:14:09");
		expect(i18n.minTime(new Date(2021, 1, 1, 12, 14, 9))).toBe("12:14");
	});
});
