const pug = require('pug');
var fs = require('fs');

let rawdata = fs.readFileSync("src/data/archives/archives.json");
let data = JSON.parse(rawdata);

let articles = [data.video];
let langs = ["en", "fr"];
langs.forEach(lang => {
	var dir = `build/${lang}/archives`;
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	fs.writeFile(`${dir}/index.html`,
			pug.renderFile("src/pug/pages/archives.pug",
				{articles:articles, lang:lang}),
			function (err) {
				if (err) throw err;
				console.log('Saved!');
			}
		)
})