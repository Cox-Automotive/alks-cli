#!/usr/bin/env bats

# if developing in VScode, install Bats (Bash Automated Testing System)
# VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=jetmartin.bats

setup_file() {
    BATS_TEST_TIMEOUT=10 
}

teardown_file() {
    # deleting all created roles no matter what
    roles=("alks-cli-e2e-test-role-with-roletype" "alks-cli-e2e-test-role-with-trustpolicy")
    for name in ${roles[@]}; do
        # hardcoding the account and role for now because setup_file and
        # teardow_file are tricky
        alks iam deleterole -a 805619180788 -r LabAdmin -n ${name} 2&1 > /dev/null
    done

    # removing .alks credentials file because plain text creds are bad
    local alks_credentials_file=~/.alks-cli/credentials
    test -f ${alks_credentials_file} \
      && rm ${alks_credentials_file} \
      || true
}

setup() {
    load 'node_modules/bats-assert/load'
    load 'node_modules/bats-support/load'

    ACCOUNT=805619180788 # awscoxautolabs95
    ROLE="LabAdmin"
    AWS_CREDENTIALS_FILE=~/.aws/credentials
    BASE_ROLE_NAME="alks-cli-e2e-test-role"
}


# bats test_tags=developer,info
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

# bats test_tags=sessions,open
@test "alks sessions open" {

    local output_types=(env creds json docker)

    for o in ${output_types[@]}; do
        echo "# should supply AWS account credentials with output type $o" >&3

        run alks sessions open -i -a ${ACCOUNT} -r ${ROLE} -o ${o}
        [ "$status" -eq 0 ]

        case $o in
            env)
                assert_output --partial "AWS_ACCESS_KEY_ID="
                assert_output --partial "AWS_SECRET_ACCESS_KEY="
                assert_output --partial "AWS_SESSION_TOKEN="
                ;;
            creds)
                run test -f ${AWS_CREDENTIALS_FILE}
                [ "$status" -eq 0 ]
                run cat ${AWS_CREDENTIALS_FILE}
                assert_output --partial "default"
                assert_output --partial "aws_access_key_id="
                assert_output --partial "aws_secret_access_key="
                assert_output --partial "aws_session_token="
                ;;
            json)
                assert_output --partial "accessKey"
                assert_output --partial "secretKey"
                assert_output --partial "sessionToken"
                ;;
            docker)
                assert_output --partial "AWS_ACCESS_KEY_ID="
                assert_output --partial "AWS_SECRET_ACCESS_KEY="
                assert_output --partial "AWS_SESSION_TOKEN="
                ;;
        esac
    done

}

# bats test_tags=iam,createrole
@test "alks iam createrole" {
    echo "# should create a role and output the created role's ARN" >&3

    local trust_policy="{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\"\
:{\"Service\":\"s3.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}"

    name=${BASE_ROLE_NAME}-with-roletype
    echo "# should create ${name} given a role type" >&3
    run alks iam createrole -a ${ACCOUNT} -r ${ROLE} -n ${name}  -t S3 Key=daft,Value=punk
    [ "$status" -eq 0 ]
    assert_output --partial "The role: ${name} was created"

    name=${BASE_ROLE_NAME}-with-trustpolicy 
    echo "# should create ${name} given a trust policy" >&3
    run alks iam createrole -a ${ACCOUNT} -r ${ROLE} -n ${name} -p ${trust_policy} Key=daft,Value=punk
    [ "$status" -eq 0 ]
    assert_output --partial "The role: ${name} was created"
}

# bats test_tags=iam,deleterole
@test "alks iam deleterole" {
    # skip -- uncommenting would skip this test
    echo "# should delete a role" >&3

    name=${BASE_ROLE_NAME}-with-roletype
    echo "# deleting ${name}" >&3
    run alks iam deleterole -a ${ACCOUNT} -r ${ROLE} -n ${name}
    [ "$status" -eq 0 ]
    assert_output --partial "The role ${name} was deleted"

    name=${BASE_ROLE_NAME}-with-trustpolicy
    echo "# deleting ${name}" >&3
    run alks iam deleterole -a ${ACCOUNT} -r ${ROLE} -n ${name}
    [ "$status" -eq 0 ]
    assert_output --partial "The role ${name} was deleted"
}
