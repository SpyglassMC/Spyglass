# https://github.com/jekyll/minima/issues/562#issuecomment-735120020

# frozen_string_literal: true

module JekyllFeed
	class Generator < Jekyll::Generator
		safe true
		priority :lowest

		# Main plugin action, called by Jekyll-core
		def generate(_site)
		end
	end
end
