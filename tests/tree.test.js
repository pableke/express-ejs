
import test from "node:test";
import assert from "node:assert";
import tb from "app/mod/tree-box.js";

// Tree, group and resume
const arr = [
	{ text: "text3", g1: "aaa", g2: "210", id: "3", parentId: "2" },
	{ text: "text2", g1: "aaa", g2: "210", id: "2", parentId: "1" },
	{ text: "text4", g1: "aaa", g2: "210", id: "4", parentId: "1" },
	{ text: "text1", g1: "bbb", g2: "210", id: "1" },
	{ text: "text5", g1: "ccc", g2: "210", id: "5" },
	{ text: "text6", g1: "ccc", g2: "213", id: "6", parentId: "2" }
];

const root = { maxLevel: 0, fk: "parentId" };
root.onGroup = function(parent, child) {
	root.maxLevel = Math.max(root.maxLevel, child.level);
	return true;
}

test("Tree", () => {
	tb.tree(arr, root);
	assert.equal(root.maxLevel, 3);
});

test("Group", () => {
	root.maxLevel = 0;
	tb.group(arr, ["g1", "g2"], root);
	assert.equal(root.maxLevel, 2);
});

test("Resume", () => {
	let results = tb.resume(arr, (prev, node) => (prev.g1!=node.g1));
	assert.equal(results.length, 3);
});
