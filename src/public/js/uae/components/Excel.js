
import coll from "./Collection.js";

// doc link: https://docs.sheetjs.com/docs/csf/cell
const LETTERS = [ // Columns names
    "A",  "B",  "C",  "D",  "E",  "F",  "G",  "H",  "I",  "J",  "K",  "L",  "M",  "N",  "O",  "P",  "Q",  "R",  "S",  "T",  "U",  "V",  "W",  "X",  "Y",  "Z",
    "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "aW", "AX", "AY", "AZ",
    "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ",
    "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ"
];
const HEADER_STYLES = { // style only for pro version
    alignment: { horizontal: "center", wrapText: true },
    font: { bold: true }
};

function Excel() {
	const self = this; //self instance

    this.json = (data, opts) => {
        opts = opts || {}; // Default options
        opts.titles = opts.titles || []; // Header names
        opts.file = opts.file || "myFile.xlsx"; // File name
        opts.type = opts.type || "binary"; // Export settings
        opts.bookType = opts.bookType || "xlsx"; // Export settings
        opts.cellStyles = opts.cellStyles ?? true;

        const workBook = XLSX.utils.book_new();
        workBook.Props = {
            Author: opts.author || "UPCT",
            Title: opts.title || "Campus Virtual",
            CreatedDate: new Date()
        };

        // Header iterator
        const columns = opts.keys || Object.keys(data[0]);
        const cloned = data.map(row => coll.clone(row, columns));
        const workSheet = XLSX.utils.json_to_sheet(cloned); //XLSX.utils.sheet_add_json(workSheet, data)
        columns.forEach((name, i) => {
            const cell = workSheet[LETTERS[i] + "1"];
            const title = opts.titles[i] || name;
            cell.v = title.toUpperCase();
            cell.s = HEADER_STYLES;
            cell.t = "s"; // type string
        });

        // Columns iterator
        for (const column in opts.columns) { // data property name
            const fn = opts.columns[column]; // data property handler
            const colIndex = columns.findIndex(name => (name == column));
            const col = LETTERS[colIndex]; //A,B,C,...
            for (let i = 0; (i < data.length); i++)
                fn(workSheet[col + (i + 2)], data[i]); // avoid header
        }

        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet1");
        XLSX.writeFile(workBook, opts.file, opts);
        return self;
    }
}

export default new Excel();
