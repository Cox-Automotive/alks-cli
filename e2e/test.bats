#!/usr/bin/env bats

# if developing in VScode, install Bats (Bash Automated Testing System)
# VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=jetmartin.bats

setup() {
    load 'node_modules/bats-assert/load'
    load 'node_modules/bats-support/load'
}

# bats config_tags=config:true
@test "alks developer info" {
    # fd 3 for printing always visible output (whether test passes or fails)
    echo "# should return output with username and 2FA token visible" >&3

    ########### failure message ###########
    echo ""
    echo "This test may have failed because the ALKS refresh token has expired"
    echo ""
    echo "In your environment: "
    echo "  export USERNAME=<your_network_username>"
    echo "  export REFRESH_TOKEN=<your_alks_refresh_token"
    echo ""
    echo "In GitHub, update environment secrets to reflect new username and ALKS refresh token"
    echo "GitHub actions will consume the secrets and export them as environment variables to the container"
    echo ""
    echo "If secrets have been updated and this test still fails, something else is amiss. Good luck!"
    echo ""
    echo "DO NOT LEAK YOUR REFRESH TOKEN BY COMMITTING IT TO PUBLIC GITHUB"
    #######################################

    run alks developer info
    [ "$status" -eq 0 ]
    assert_output --partial "Developer Configuration"
    assert_output --partial "${USERNAME}"
    assert_output --partial "${REFRESH_TOKEN:0:4}****"
}
