require "json"
File.open("src.txt") do |f|
	x = f.readlines.map {|l|
		{"content" => l.chomp}
	}
	File.open("out.json", "w").write(JSON.pretty_generate(x))
end
