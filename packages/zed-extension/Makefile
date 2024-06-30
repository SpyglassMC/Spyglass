build:
	mkdir -p target/spyglass
	zed-extension --source-dir ./ --output-dir ./target/ --scratch-dir ./target
	tar -xzf target/archive.tar.gz -C target/spyglass
	cp -Rf target/spyglass ~/Library/Application\ Support/Zed/extensions/installed/
	tree ~/Library/Application\ Support/Zed/extensions/installed/spyglass
