
import util from "app/ctrl/util.js";

function Index() {
    this.index = (req, res) => {
        util.render(res, "web/index", 0);
    }
}

export default new Index();
