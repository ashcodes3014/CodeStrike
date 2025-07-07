const mongoose = require ('mongoose');

async function main() {
    await mongoose.connect(process.env.connect_str)
}

module.exports = main