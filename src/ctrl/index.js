
import util from "app/ctrl/util.js";

function Index() {
    this.index = (req, res) => {
        util.tabs(res, 0).render(res, "web/index");
    }
}

export default new Index();
