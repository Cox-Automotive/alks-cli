#!/usr/bin/env bats

setup() {
    load 'node_modules/bats-assert/load'
    load 'node_modules/bats-assert/bats-support/load'
}

@test "can run our script" {
    run alks developer info
    assert_output --partial "Developer Configuration"
    
}
