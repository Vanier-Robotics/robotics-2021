require 'json'
out = {
	"members" => [],
	"teams" => [
		"Captains",
		"Build",
		"Programming",
		"Kiosk",
		"Video",
		"Web"
	]
}
no_l = ["Name","img","teams"]
{"en" => 'english.json', "fr" => "french.json"}.each_pair do |lang, value|
	data = JSON.parse File.open(value).read
	data['members'].each {|m| m.delete_if {|key, value| true if key.downcase.include? "feedback" or key.downcase.include? "point" or key == "ID" or key == "Start time" or key == "Completion time" or key == "Email" or key =="Nom" or key =="" or key =="__1" or key=="Column1"}}
	
	data['members'].each do |m|
		m["teams"] = m['What sub-teams are you a part of in robotics?'] if lang == "en"
		m['What sub-teams are you a part of in robotics?'] = m['What sub-teams are you a part of in robotics?'].split(', ').map!{|t| t.capitalize};
		m["teams"] = m['What sub-teams are you a part of in robotics?'] if lang == "en"
	end
	data['members'].each do |m|
		if m["You can upload a picture of yourself that will be used for your biography page on the robotics page. You do not have to upload a picture at all if you are not comfortable or do not want to. This i..."] != ""
			m["img"] = m["Name"]
		else
			m["img"] = "error/" + rand(0..6).to_s
			# puts m["img"]
		end
	end
	data['members'].each_with_index do |m, index|
		member = out["members"][index]
		reset = false
		m.each_pair {|key, value|
			if member.nil?
				member = {}
				reset = true
			end
			if member[key].nil?
				member[key] = {} unless no_l.include? key
			end
			if no_l.include? key
				member[key] = value if lang == "en"
			else
				member[key][lang] = value
			end
			out["members"][index] = member if reset
		}
		# m.each_pair |key, value|
		# 	m[key] = {}
		# 	m[key][lang] = value
		# end
		# if out["members"][index].nil?
		# 	out["members"][index] = member
		# 	puts "nil member in #{lang}"
		# 	puts member
		# else
		# 	puts out["members"][index]
		# 	out["members"][index] = out["members"][index].merge member
		# 	puts out["members"][index]
		# end
	end
	File.open("members-#{lang}.json", "w").write JSON.generate data
end

# puts out
File.open("members-test.json", "w").write JSON.generate out