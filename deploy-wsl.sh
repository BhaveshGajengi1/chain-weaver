#!/bin/bash

# Deploy script for Stylus contract in WSL2
# This avoids Windows linker issues by building and deploying in Linux

set -e

echo "🚀 Deploying DataLoom Stylus Contract..."

# Create build directory in Linux home
BUILD_DIR=~/chain-weaver-build
echo "📁 Creating build directory: $BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Copy project files
echo "📋 Copying project files..."
rsync -av --exclude='target' --exclude='node_modules' --exclude='dist' \
  "/mnt/c/Users/Bhavesh Gajengi/chain-weaver/" "$BUILD_DIR/"

# Navigate to build directory
cd "$BUILD_DIR"

# Clean any existing build artifacts
echo "🧹 Cleaning previous build artifacts..."
rm -rf target

# Source Rust environment
echo "🦀 Loading Rust environment..."
source ~/.cargo/env

# Deploy the contract
echo "🔨 Deploying contract to Arbitrum Sepolia..."
cargo stylus deploy \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --private-key "$1" \
  --no-verify

echo ""
echo "🎉 Contract deployed successfully!"
