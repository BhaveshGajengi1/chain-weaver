#!/bin/bash

# Build script for Stylus contract in WSL2
# This avoids permission issues by building in Linux filesystem

set -e

echo "🚀 Building DataLoom Stylus Contract..."

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

# Build the contract
echo "🔨 Building contract..."
cargo build --target wasm32-unknown-unknown --release

# Check if build was successful
if [ -f "target/wasm32-unknown-unknown/release/dataloom.wasm" ]; then
    echo "✅ Build successful!"
    
    # Copy the compiled WASM back to Windows
    echo "📦 Copying WASM file back to Windows..."
    cp target/wasm32-unknown-unknown/release/dataloom.wasm \
       "/mnt/c/Users/Bhavesh Gajengi/chain-weaver/"
    
    # Show file size
    SIZE=$(ls -lh target/wasm32-unknown-unknown/release/dataloom.wasm | awk '{print $5}')
    echo "📊 WASM file size: $SIZE"
    echo ""
    echo "🎉 Contract compiled successfully!"
    echo "📍 Location: C:\\Users\\Bhavesh Gajengi\\chain-weaver\\dataloom.wasm"
else
    echo "❌ Build failed!"
    exit 1
fi
