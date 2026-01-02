#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use stylus_sdk::{
    alloy_primitives::U256,
    prelude::*,
    stylus_proc::sol_storage,
};

sol_storage! {
    #[entrypoint]
    pub struct Counter {
        uint256 number;
    }
}

#[public]
impl Counter {
    pub fn get(&self) -> U256 {
        self.number.get()
    }

    pub fn set(&mut self, value: U256) {
        self.number.set(value);
    }
}
