import { getCookie } from "../utils.js";

const filterParams = getCookie('filtering parameters') || {};

export function apllyFilters(operations){
    if(!filterParams) return operations;

      let copy = [...operations];
    
      if (filterParams.type >= 0) {
        copy.filter((op) => op.type === filterParams.type);
      }
    
      copy.filter((op) =>
        filterParams.currencies.includes(op.currency.code)
      );
      // filtered = filtered.filter(op => op.amount >= filterParams.minAmount && op.amount <= filterParams.maxAmount);
    
      // filtered = filtered.filter(op => op.amount >= filterParams.minAmount && op.amount <= filterParams.maxAmount);
      console.log(copy)
      return copy;
}