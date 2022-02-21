
const sb = require("../src/lib/string-box.js");

describe("String Box", () => {
	test("Wrap tests", () => {
		expect(sb.iwrap("23024374V - Pablo Rosique Vidal")).toBe(undefined);
		expect(sb.iwrap("23024374V - Pablo Rosique Vidal", "kk", "(", ")")).toEqual("23024374V - Pablo Rosique Vidal");
		expect(sb.iwrap("23024374V - Pablo Rosique Vidal", "v - p", "(", ")")).toEqual("23024374(V - P)ablo Rosique Vidal");
		expect(sb.iwrap("23024374V - Pablo Rosique Vidal", "4v - pA", "(", ")")).toEqual("2302437(4V - Pa)blo Rosique Vidal");
		expect(sb.iwrap("23024374V - Pablo Rosique Vidal", "4v - pÁ", "(", ")")).toEqual("2302437(4V - Pa)blo Rosique Vidal");
		expect(sb.iwrap("23024374V - Pablo Rosique Vidal", "4v - pá", "(", ")")).toEqual("2302437(4V - Pa)blo Rosique Vidal");
	});

	test("Ilike", () => {
		expect(sb.ilike("23024374V - Pablo Rosique Vidal")).toBe(true);
		expect(sb.ilike("23024374V - Pablo Rosique Vidal", null)).toBe(true);
		expect(sb.ilike("23024374V - Pablo Rosique Vidal", "kk")).toBe(false);
		expect(sb.ilike("23024374V - Pablo Rosique Vidal", "4v - pA")).toBe(true);
		expect(sb.ilike("23024374V - Pablo Rosique Vidal", "4v - pÁ")).toBe(true);
		expect(sb.ilike("23024374V - Pablo Rosique Vidal", "4v - pá")).toBe(true);
	});

	test("Sort", () => {
		expect([null, undefined, "bb", "", "aa"].sort(sb.cmp)).toEqual(["", "aa", "bb", null, undefined]);
		expect([undefined, null, "bb", "kk", "aa"].sort(sb.cmp)).toEqual(["aa", "bb", "kk", null, undefined]);
		expect([undefined, "null", "bb", "kk", "aa"].sort(sb.cmp)).toEqual(["aa", "bb", "kk", "null", undefined]);
		expect(["undefined", "null", "bb", "kk", "aa"].sort(sb.cmp)).toEqual(["aa", "bb", "kk", "null", "undefined"]);
		expect(["2", "10", "bb", "kk", "aa"].sort(sb.cmp)).toEqual(["10", "2", "aa", "bb", "kk"]);
	});
});
