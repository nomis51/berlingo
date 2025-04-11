const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const source = "../public/images/logo.png";
const outputDir = "../public/images/icons";
const sizes = [
    16, 32, 48, 60, 128, 256
];

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

(async () => {
    for (const size of sizes) {
        await sharp(source)
            .resize(size, size)
            .toFile(path.join(outputDir, `icon-${size}.png`));
        console.log(`Generated icon-${size}.png`);
    }
})();
