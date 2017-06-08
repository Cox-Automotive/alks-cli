package=github.com/Cox-Automotive/alkscli
GOFMT_FILES?=$(find . -name '*.go' | grep -v vendor)

format:
	gofmt -w $(GOFMT_FILES)

build:
	go fmt
	go build -v -o bin/alks .

test:
	go test -v .

install:
	go get -t -v ./...

release:
	mkdir -p release

	GOOS=darwin GOARCH=386 go build -o release/alks $(package)
	chmod +x release/alks
	tar -cvzf release/alks-darwin-386.tar.gz -C release/ alks

	GOOS=darwin GOARCH=amd64 go build -o release/alks $(package)
	chmod +x release/alks
	tar -cvzf release/alks-darwin-amd64.tar.gz -C release/ alks

	GOOS=freebsd GOARCH=386 go build -o release/alks $(package)
	chmod +x release/alks
	tar -cvzf release/alks-freebsd-386.tar.gz -C release/ alks

	GOOS=freebsd GOARCH=amd64 go build -o release/alks $(package)
	chmod +x release/alks
	tar -cvzf release/alks-freebsd-amd64.tar.gz -C release/ alks

	GOOS=linux GOARCH=386 go build -o release/alks $(package)
	chmod +x release/alks
	tar -cvzf release/alks-linux-386.tar.gz -C release/ alks

	GOOS=linux GOARCH=amd64 go build -o release/alks $(package)
	chmod +x release/alks
	tar -cvzf release/alks-linux-amd64.tar.gz -C release/ alks

	GOOS=solaris GOARCH=amd64 go build -o release/alks $(package)
	chmod +x release/alks
	tar -cvzf release/alks-solaris-amd64.tar.gz -C release/ alks

	GOOS=windows GOARCH=386   go build -o release/alks-windows-386.exe $(package)
	GOOS=windows GOARCH=amd64 go build -o release/alks-windows-amd64.exe $(package)