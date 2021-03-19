const pug = require('pug');
var fs = require('fs');

generate = function(dir, fp, src, data){
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	fs.writeFile(`${dir}/${fp}`,
			pug.renderFile(src,
				data),
			function (err) {
				if (err) throw err;
				console.log('Saved!');
			}
		)
}
let langs = ["en", "fr"];

let raw_arachives = fs.readFileSync("src/data/archives/archives.json");
let raw_members = fs.readFileSync("src/data/roster/members-test.json");
let archives = JSON.parse(raw_arachives);
let roster = JSON.parse(raw_members);

let articles = [archives.video, archives.video, archives.video];

generate(`build`, `index.html`,`src/pug/pages/landingpage.pug`, {})


langs.forEach(lang => {
	generate (
		`build/${lang}/archives`, 
		"index.html", 
		"src/pug/pages/archives.pug", 
		{
			articles:articles, 
			lang:lang
		})
})
roster.teams.forEach(t => {
	langs.forEach(lang => {
		generate(
			`build/${lang}/roster/${t}`, 
			"index.html", 
			"src/pug/pages/roster/team.pug", 
			{
				fmembers: roster.members.filter(m => m.teams.includes(t)),
				lang:lang
			})
	})
})