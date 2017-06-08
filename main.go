package main

import (
	"fmt"
	"os"

	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()
	app.Name = "ALKS"
	app.Usage = "CLI for ALKS"
	app.Action = func(c *cli.Context) error {
		fmt.Println("Hello world(s)!")
		return nil
	}

	app.Run(os.Args)
}
