const pug = require('pug');
var fs = require('fs');
require('log-timestamp');
const chokidar = require('chokidar');

const archives_fp = "src/data/archives/archives.json";
const members_fp = "src/data/roster/members-test.json";
const translation_fp = "src/data/text.json";
const robot_fp = "src/data/robot/robot.json";
const crc_fp = "src/data/crc/crc.json";
const video_fp = "src/data/video/video.json";

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
function get_robot() {
	return get(robot_fp);
}
function get_crc() {
	return get(crc_fp);
}
function get_video() {
	return get(video_fp);
}

generate = function (dir, fp, src, data) {
	dir = dir.toLowerCase()
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
function generate_article(lang, page, articles) {
	generate(`build/${lang}/${page}`,
		"index.html",
		"src/pug/pages/text-page.pug",
		{
			lang: lang,
			articles: articles,
		}
	)
}
function generate_robot(langs, robot) {
	langs.forEach(lang => {
		generate_article(lang, "robot", robot)
	})
}

function generate_crc(langs, crc) {
	langs.forEach(lang => {
		generate_article(lang, "crc", crc);
		// generate(
		// 	`build/${lang}/crc`,
		// 	"index.html",
		// 	"src/pug/pages/crc.pug",
		// 	{
		// 		crc:crc,
		// 		lang:lang
		// 	}
		// )
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
function generate_video (langs, video) {
	langs.forEach(lang => {
		generate(
			`build/${lang}/video`,
			"index.html",
			"src/pug/pages/video.pug",
			{lang:lang, videos:video}
		)
	})
}
function main() {
	var archives = get_archives()
	var roster = get_members();
	var robot = get_robot();
	var crc = get_crc();
	var video = get_video();
	let articles = [
		archives.build, archives.kiosk, archives.video, archives.journalism
	];
	generate(`build`, `index.html`, `src/pug/pages/landingpage.pug`, {});
	generate_map(langs);
	generate_archives(langs, articles);
	generate_roster(langs, roster);
	generate_robot(langs, robot);
	generate_crc(langs, crc);
	generate_video(langs, video)
	langs.forEach(lang => {
		generate(
			`build/${lang}/error`,
			"index.html",
			"src/pug/pages/404.pug",
			{lang:lang}
		)
	})
	generate(`build/`, "404.html", "src/pug/pages/404.pug", {})
	console.log("Generated Website!");
}
let langs = ["en", "fr"];

if (process.argv.includes("-w") == true || process.argv.includes("--watch") == true) {
	chokidar.watch("src/**/*").on('change', (event, path) => {
		main();
	})

} else {
	main();
}