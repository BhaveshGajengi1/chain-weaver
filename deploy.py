"""
Deploy Stylus WASM contract to Arbitrum Sepolia
This uses web3.py to send a deployment transaction
"""
from web3 import Web3
import sys

def deploy_contract():
    # Connect to Arbitrum Sepolia
    rpc_url = "https://sepolia-rollup.arbitrum.io/rpc"
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if not w3.is_connected():
        print("❌ Failed to connect to Arbitrum Sepolia")
        return
    
    print(f"✅ Connected to Arbitrum Sepolia")
    print(f"📊 Chain ID: {w3.eth.chain_id}")
    
    # Setup account
    private_key = sys.argv[1] if len(sys.argv) > 1 else None
    if not private_key:
        print("❌ Private key not provided")
        return
    
    if not private_key.startswith('0x'):
        private_key = '0x' + private_key
    
    account = w3.eth.account.from_key(private_key)
    print(f"📍 Deploying from: {account.address}")
    
    # Check balance
    balance = w3.eth.get_balance(account.address)
    print(f"💰 Balance: {w3.from_wei(balance, 'ether')} ETH")
    
    if balance == 0:
        print("❌ Insufficient balance")
        return
    
    # Read WASM file
    wasm_path = "target/wasm32-unknown-unknown/release/dataloom.wasm"
    try:
        with open(wasm_path, 'rb') as f:
            wasm_bytes = f.read()
        print(f"📦 WASM size: {len(wasm_bytes)} bytes")
    except FileNotFoundError:
        print(f"❌ WASM file not found at {wasm_path}")
        return
    
    # Prepare deployment transaction
    print("\n🔨 Preparing deployment transaction...")
    
    nonce = w3.eth.get_transaction_count(account.address)
    
    # Build transaction
    transaction = {
        'from': account.address,
        'data': '0x' + wasm_bytes.hex(),
        'nonce': nonce,
        'gas': 10000000,  # 10M gas
        'maxFeePerGas': w3.eth.gas_price * 2,
        'maxPriorityFeePerGas': w3.to_wei(0.1, 'gwei'),
        'chainId': w3.eth.chain_id,
    }
    
    # Estimate gas
    try:
        estimated_gas = w3.eth.estimate_gas(transaction)
        transaction['gas'] = int(estimated_gas * 1.2)  # Add 20% buffer
        print(f"⛽ Estimated gas: {estimated_gas}")
    except Exception as e:
        print(f"⚠️  Gas estimation failed: {e}")
        print("Using default gas limit...")
    
    # Sign transaction
    print("✍️  Signing transaction...")
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key)
    
    # Send transaction
    print("📤 Sending transaction...")
    try:
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        print(f"📝 Transaction hash: {tx_hash.hex()}")
        print("⏳ Waiting for confirmation...")
        
        # Wait for receipt
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=300)
        
        if receipt['status'] == 1:
            contract_address = receipt['contractAddress']
            print(f"\n✅ Contract deployed successfully!")
            print(f"📍 Contract address: {contract_address}")
            print(f"🔗 View on Arbiscan: https://sepolia.arbiscan.io/address/{contract_address}")
            
            # Save address
            with open('deployed-address.txt', 'w') as f:
                f.write(contract_address)
            
            return contract_address
        else:
            print("❌ Transaction failed")
            return None
            
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        return None

if __name__ == "__main__":
    deploy_contract()
