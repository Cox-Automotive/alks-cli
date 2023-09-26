#!/usr/bin/env bats


# if developing in VScode, install Bats (Bash Automated Testing System)
# VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=jetmartin.bats

# BATS documentation: https://bats-core.readthedocs.io/en/v1.9.0
# bats-assert Github: https://github.com/bats-core/bats-assert

# each test is tagged with its subcommand and first subcommand argument
#
# to execute all iam tests run: 
#    $ ./test.bats --filter-tags iam
#
# to execute only the test for iam deleterole, with verbose output, run: 
#    $ ./test.bats --filter-tags deleterole -x --trace

setup_file() {
    # alks-cli arguments
    export ROLE="LabAdmin"
    export ACCOUNT=805619180788 # awscoxautolabs95
    export TIMESTAMP=$(date +%s%N)
    export AWS_CREDENTIALS_FILE=~/.aws/credentials
    export ALKS_CREDENTIALS_FILE=~/.alks-cli/credentials
    export ROLE_WITH_ROLE_TYPE="alks-cli-e2e-test-role-with-roletype-${TIMESTAMP}"
    export ROLE_WITH_TRUST_POLICY="alks-cli-e2e-test-role-with-trustpolicy-${TIMESTAMP}"
    export NEW_TRUST_POLICY='{"Version":"2012-10-17","Statement":[{"Action":"sts:AssumeRole","Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"}}]}'

    # continue to next test if time exceeds 30 seconds
    export BATS_TEST_TIMEOUT=30
}

teardown_file() {
    # deleting roles after all tests complete no matter what 
    roles=(${ROLE_WITH_ROLE_TYPE} ${ROLE_WITH_TRUST_POLICY})
    for name in ${roles[@]}; do
        alks iam deleterole -a ${ACCOUNT} -r LabAdmin -n ${name} 2&1 > /dev/null
    done

    # removing .alks credentials file because plain text creds are bad
    test -f ${ALKS_CREDENTIALS_FILE} \
      && rm ${ALKS_CREDENTIALS_FILE} \
      || true
}

setup() {
    # setup runs after every test
    load 'node_modules/bats-assert/load'
    load 'node_modules/bats-support/load'
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

    echo "# should create ${ROLE_WITH_ROLE_TYPE} given a role type" >&3
    run alks iam createrole -a ${ACCOUNT} -r ${ROLE} -n ${ROLE_WITH_ROLE_TYPE}  -t S3 Key=daft,Value=punk
    [ "$status" -eq 0 ]
    assert_output --partial "The role \"${ROLE_WITH_ROLE_TYPE}\" was created"

    echo "# should create ${ROLE_WITH_TRUST_POLICY} given a trust policy" >&3
    run alks iam createrole -a ${ACCOUNT} -r ${ROLE} -n ${ROLE_WITH_TRUST_POLICY} -p ${trust_policy} Key=daft,Value=punk
    [ "$status" -eq 0 ]
    assert_output --partial "The role \"${ROLE_WITH_TRUST_POLICY}\" was created"
}

# bats test_tags=iam,updaterole
@test "alks iam updaterole" {
    # skip # uncommenting would skip this test
    echo "# should update a role" >&3

    echo "# updating ${ROLE_WITH_TRUST_POLICY}" >&3
    run alks iam updaterole -a ${ACCOUNT} -r ${ROLE} -n ${ROLE_WITH_TRUST_POLICY} -p "${NEW_TRUST_POLICY}" -k "Key=alks-cli-e2e-test-key,Value=some-value"
    [ "$status" -eq 0 ]
    assert_output --partial "The role \"${ROLE_WITH_TRUST_POLICY}\" was updated"
}

# bats test_tags=iam,deleterole
@test "alks iam deleterole" {
    # skip # uncommenting would skip this test
    echo "# should delete a role" >&3

    echo "# deleting ${ROLE_WITH_ROLE_TYPE}" >&3
    run alks iam deleterole -a ${ACCOUNT} -r ${ROLE} -n ${ROLE_WITH_ROLE_TYPE}
    [ "$status" -eq 0 ]
    assert_output --partial "The role \"${ROLE_WITH_ROLE_TYPE}\" was deleted"

    echo "# deleting ${ROLE_WITH_TRUST_POLICY}" >&3
    run alks iam deleterole -a ${ACCOUNT} -r ${ROLE} -n ${ROLE_WITH_TRUST_POLICY}
    [ "$status" -eq 0 ]
    assert_output --partial "The role \"${ROLE_WITH_TRUST_POLICY}\" was deleted"
}

# bats test_tags=developer,login2fa
@test "alks developer login2fa" {
    echo "# should save a refresh token" >&3

    run expect scripts/login2fa.exp
    [ "$status" -eq 0 ]
    assert_output --partial "Refresh token validated!"
    assert_output --partial "Refresh token saved!"
}

# bats test_tags=developer,accounts
@test "alks developer accounts -o json" {
    echo "# should output a list of AWS accounts in JSON format" >&3

    run alks developer accounts -o json
    [ "$status" -eq 0 ]
    assert_output --partial "]}}"
}
