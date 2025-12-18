#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use alloc::string::String;
use alloc::vec::Vec;
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    block, msg, prelude::*,
    stylus_proc::sol_storage,
};

sol_storage! {
    #[entrypoint]
    pub struct DataLoom {
        uint256 canvas_count;
        mapping(uint256 => bytes) pixel_data;
        mapping(uint256 => string) metadata;
        mapping(uint256 => address) creators;
        mapping(uint256 => uint256) timestamps;
        mapping(address => uint256[]) creator_canvases;
    }
}

#[external]
impl DataLoom {
    pub fn store_pixels(&mut self, pixel_data: Vec<u8>, metadata: String) -> U256 {
        let caller = msg::sender();
        let timestamp = U256::from(block::timestamp());
        
        let canvas_id = self.canvas_count.get() + U256::from(1);
        self.canvas_count.set(canvas_id);
        
        self.pixel_data.setter(canvas_id).set_bytes(pixel_data);
        self.metadata.setter(canvas_id).set_str(&metadata);
        self.creators.setter(canvas_id).set(caller);
        self.timestamps.setter(canvas_id).set(timestamp);
        
        let mut creator_list = self.creator_canvases.setter(caller);
        creator_list.push(canvas_id);
        
        canvas_id
    }

    
    pub fn get_canvas(&self, canvas_id: U256) -> (Vec<u8>, String, Address, U256) {
        let pixel_data = self.pixel_data.get(canvas_id).get_bytes();
        let metadata = self.metadata.get(canvas_id).get_string();
        let creator = self.creators.get(canvas_id);
        let timestamp = self.timestamps.get(canvas_id);
        
        (pixel_data, metadata, creator, timestamp)
    }
    
    pub fn get_canvas_count(&self) -> U256 {
        self.canvas_count.get()
    }
    
    pub fn get_canvases_by_creator(&self, creator: Address) -> Vec<U256> {
        let list = self.creator_canvases.get(creator);
        let len = list.len();
        let mut result = Vec::with_capacity(len);
        
        for i in 0..len {
            if let Some(id) = list.get(i) {
                result.push(id);
            }
        }
        
        result
    }
}
