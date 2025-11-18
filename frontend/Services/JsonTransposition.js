import { operations } from "../Repositories/operations";

export function exportToJson(){
    if(!operations){
        alert('Local storage is empty')
    }
}