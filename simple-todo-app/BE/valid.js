const z = require("zod");

const valid = z.object({
    title : z.string(),
    desc : z.string(),
});

const update = z.object({
    id : z.string()
});
module.exports = {
    valid,
    update
} 