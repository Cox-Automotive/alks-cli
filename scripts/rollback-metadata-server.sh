#!/bin/bash
#
# Rollback script for ALKS metadata server
# This script removes all metadata server components to restore a clean state
#

echo "========================================"
echo "ALKS Metadata Server Rollback Script"
echo "========================================"
echo ""
echo "This script will remove all metadata server components:"
echo "  - Stop the metadata server process"
echo "  - Unload the launch daemon"
echo "  - Remove plist file from /Library/LaunchDaemons/"
echo "  - Remove pf anchor file from /etc/pf.anchors/"
echo "  - Flush pf anchor rules"
echo "  - Remove IP alias 169.254.169.254"
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This script only works on macOS"
    exit 1
fi

# Prompt for confirmation
read -p "Do you want to continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled."
    exit 0
fi

echo ""
echo "Rolling back metadata server state..."
echo ""

# Stop the metadata server
echo "→ Stopping metadata server..."
if [ -f "dist/src/bin/alks.js" ]; then
    node dist/src/bin/alks.js server stop 2>/dev/null || true
else
    echo "  (alks.js not found, skipping)"
fi

# Kill any running metadata server processes
echo "→ Killing any lingering metadata server processes..."
pkill -f "metadata-server.js" 2>/dev/null || true
pkill -f "forever.*metadata" 2>/dev/null || true

# Unload the launch daemon (try both modern and legacy commands)
echo "→ Unloading launch daemon..."
sudo launchctl bootout system/com.coxautodev.alks.Ec2MetaDataFirewall 2>/dev/null || true
sudo launchctl unload /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist 2>/dev/null || true

# Remove the plist file
echo "→ Removing launch daemon plist..."
if [ -f "/Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist" ]; then
    sudo rm -f /Library/LaunchDaemons/com.coxautodev.alks.Ec2MetaDataFirewall.plist
    echo "  ✓ Removed plist file"
else
    echo "  (plist file not found)"
fi

# Remove the pf anchor file
echo "→ Removing pf anchor file..."
if [ -f "/etc/pf.anchors/com.coxautodev.alks" ]; then
    sudo rm -f /etc/pf.anchors/com.coxautodev.alks
    echo "  ✓ Removed anchor file"
else
    echo "  (anchor file not found)"
fi

# Flush the pf anchor rules
echo "→ Flushing pf anchor rules..."
sudo pfctl -a com.coxautodev.alks -F all 2>/dev/null || true
echo "  ✓ Flushed anchor rules"

# Remove the IP alias
echo "→ Removing IP alias 169.254.169.254..."
if ifconfig lo0 | grep -q "169.254.169.254"; then
    sudo ifconfig lo0 -alias 169.254.169.254 2>/dev/null || true
    echo "  ✓ Removed IP alias"
else
    echo "  (IP alias not configured)"
fi

echo ""
echo "========================================"
echo "Rollback complete!"
echo "========================================"
echo ""
echo "The metadata server has been completely removed."
echo "You can now test a fresh installation with:"
echo "  node dist/src/bin/alks.js server start"
echo ""
