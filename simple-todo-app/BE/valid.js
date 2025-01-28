const { z, string, boolean } = require("zod");

const valid = z.object({
    title : string,
    desc : string,
    done : boolean
});

module.exports = {
    valid,
} 