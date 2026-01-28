#!/bin/bash
#
# Test script for ALKS metadata server
# This script verifies that the metadata server is working correctly
#

set -e

echo "========================================"
echo "ALKS Metadata Server Test Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Function to print info
print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}Error: This script only works on macOS${NC}"
    exit 1
fi

# Build the project
echo "Building project..."
npm run build > /dev/null 2>&1
print_status $? "Project built successfully"
echo ""

# Start the metadata server
echo "Starting metadata server..."
node dist/src/bin/alks.js server start &
SERVER_PID=$!
sleep 3

# Check if metadata server process is running
if ps -p $SERVER_PID > /dev/null 2>&1; then
    print_status 0 "Metadata server process is running (PID: $SERVER_PID)"
else
    print_status 1 "Metadata server process failed to start"
    exit 1
fi
echo ""

# Check if IP alias exists
echo "Checking network configuration..."
if ifconfig lo0 | grep -q "169.254.169.254"; then
    print_status 0 "IP alias 169.254.169.254 is configured on lo0"
else
    print_status 1 "IP alias 169.254.169.254 is NOT configured"
fi

# Check if pf anchor rules are loaded
if sudo pfctl -a com.coxautodev.alks -s rules 2>/dev/null | grep -q "169.254.169.254"; then
    print_status 0 "PF anchor rules are loaded"
else
    print_status 1 "PF anchor rules are NOT loaded"
fi

# Check if launch daemon is running
if sudo launchctl list | grep -q "com.coxautodev.alks.Ec2MetaDataFirewall"; then
    print_status 0 "Launch daemon is running"
else
    print_status 1 "Launch daemon is NOT running"
fi
echo ""

# Test the metadata server endpoints
echo "Testing metadata server endpoints..."

# Test 1: Basic endpoint
print_info "Testing: http://169.254.169.254/latest/meta-data/iam/security-credentials/"
RESPONSE=$(curl -s -m 5 http://169.254.169.254/latest/meta-data/iam/security-credentials/ 2>&1)
if [ "$RESPONSE" = "alks" ]; then
    print_status 0 "Basic endpoint returned 'alks'"
else
    print_status 1 "Basic endpoint failed (got: '$RESPONSE')"
fi

# Test 2: Localhost endpoint
print_info "Testing: http://127.0.0.1:45000/latest/meta-data/iam/security-credentials/"
RESPONSE=$(curl -s -m 5 http://127.0.0.1:45000/latest/meta-data/iam/security-credentials/ 2>&1)
if [ "$RESPONSE" = "alks" ]; then
    print_status 0 "Localhost endpoint returned 'alks'"
else
    print_status 1 "Localhost endpoint failed (got: '$RESPONSE')"
fi

# Test 3: Instance identity document
print_info "Testing: http://169.254.169.254/latest/dynamic/instance-identity/document"
RESPONSE=$(curl -s -m 5 http://169.254.169.254/latest/dynamic/instance-identity/document 2>&1)
if echo "$RESPONSE" | grep -q "us-east-1"; then
    print_status 0 "Instance identity endpoint returned region"
else
    print_status 1 "Instance identity endpoint failed"
fi

echo ""
echo "========================================"
echo "Test completed!"
echo "========================================"
echo ""
echo "To stop the metadata server, run:"
echo "  node dist/src/bin/alks.js server stop"
