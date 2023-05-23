#!/usr/bin/env bats

setup() {
    load 'node_modules/bats-assert/load'
    load 'node_modules/bats-support/load'
}

@test "alks developer configure" {
    run alks developer info
    assert_output --partial "Developer Configuration"
    assert_output --partial "${USERNAME}"
    
}
