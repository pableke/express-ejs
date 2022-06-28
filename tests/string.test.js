
import test from "node:test";
import assert from "node:assert";
import sb from "../src/lib/string-box.js";

test("Wrap", () => {
	assert.equal(sb.iwrap("23024374V - Pablo Rosique Vidal"), "23024374V - Pablo Rosique Vidal");
	assert.equal(sb.iwrap("23024374V - Pablo Rosique Vidal", ""), "23024374V - Pablo Rosique Vidal");
	assert.equal(sb.iwrap("23024374V - Pablo Rosique Vidal", "kk", "(", ")"), "23024374V - Pablo Rosique Vidal");
	assert.equal(sb.iwrap("23024374V - Pablo Rosique Vidal", "v - p", "(", ")"), "23024374(V - P)ablo Rosique Vidal");
	assert.equal(sb.iwrap("23024374V - Pablo Rosique Vidal", "4v - pA", "(", ")"), "2302437(4V - Pa)blo Rosique Vidal");
	assert.equal(sb.iwrap("23024374V - Pablo Rosique Vidal", "4v - pÁ", "(", ")"), "2302437(4V - Pa)blo Rosique Vidal");
	assert.equal(sb.iwrap("23024374V - Pablo Rosique Vidal", "4v - pá", "(", ")"), "2302437(4V - Pa)blo Rosique Vidal");
});

test("Ilike", () => {
	assert.equal(sb.ilike("23024374V - Pablo Rosique Vidal"), true);
	assert.equal(sb.ilike("23024374V - Pablo Rosique Vidal", null), true);
	assert.equal(sb.ilike("23024374V - Pablo Rosique Vidal", "kk"), false);
	assert.equal(sb.ilike("23024374V - Pablo Rosique Vidal", "4v - pA"), true);
	assert.equal(sb.ilike("23024374V - Pablo Rosique Vidal", "4v - pÁ"), true);
	assert.equal(sb.ilike("23024374V - Pablo Rosique Vidal", "4v - pá"), true);
});

test("Sort", () => {
	assert.deepEqual([null, undefined, "bb", "", "aa"].sort(sb.cmp), ["", "aa", "bb", null, undefined]);
	assert.deepEqual([undefined, null, "bb", "kk", "aa"].sort(sb.cmp), ["aa", "bb", "kk", null, undefined]);
	assert.deepEqual([undefined, "null", "bb", "kk", "aa"].sort(sb.cmp), ["aa", "bb", "kk", "null", undefined]);
	assert.deepEqual(["undefined", "null", "bb", "kk", "aa"].sort(sb.cmp), ["aa", "bb", "kk", "null", "undefined"]);
	assert.deepEqual(["2", "10", "bb", "kk", "aa"].sort(sb.cmp), ["10", "2", "aa", "bb", "kk"]);
});
