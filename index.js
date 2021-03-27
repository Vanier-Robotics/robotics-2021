const pug = require('pug');
var fs = require('fs');
require('log-timestamp');
const chokidar = require('chokidar');

const archives_fp = "src/data/archives/archives.json";
const members_fp = "src/data/roster/members-test.json";
const translation_fp = "src/data/text.json";

function get(fp) {
	var rawdata = fs.readFileSync(fp);
	return JSON.parse(rawdata);
}
function get_archives() {
	return get(archives_fp);
}
function get_members() {
	return get(members_fp);
}
function get_translation() {
	return get(translation_fp);
}

generate = function (dir, fp, src, data) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	data["text"] = get_translation();
	// console.log(data)
	fs.writeFile(`${dir}/${fp}`,
		pug.renderFile(src,
			data),
		function (err) {
			if (err) throw err;
			// console.log('Saved!');
		}
	)
}

function generate_archives(langs, articles) {
	langs.forEach(lang => {
		generate(
			`build/${lang}/archives`,
			"index.html",
			"src/pug/pages/archives.pug",
			{
				articles: articles,
				lang: lang
			})
	})
}
function generate_roster(langs, roster) {
	roster.teams.forEach(t => {
		langs.forEach(lang => {
			generate(
				`build/${lang}/roster/${t}`,
				"index.html",
				"src/pug/pages/roster/team.pug",
				{
					fmembers: roster.members.filter(m => m.teams.includes(t)),
					lang: lang,
					t: t
				})
		})
	})
}

function generate_map(langs) {
	langs.forEach(lang => {
		generate(
			`build/${lang}`,
			"index.html",
			"src/pug/pages/map.pug",
			{ lang: lang }
		)
	})
}
function main() {
	var archives = get_archives()
	var roster = get_members();
	let articles = [
		archives.kiosk, archives.video, archives.journalism
	];
	generate(`build`, `index.html`, `src/pug/pages/landingpage.pug`, {})
	generate_archives(langs, articles)
	generate_roster(langs, roster)
	generate_map(langs)
	console.log("Generated Website!")
}
let langs = ["en", "fr"];

if (process.argv.includes("-w") == true || process.argv.includes("--watch") == true) {
	chokidar.watch("src/**/*").on('change', (event, path) => {
		main();
	})

} else {
	main();
}