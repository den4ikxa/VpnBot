import { json } from "express";

export async function updateUser(telegramId,name,array,ip){
    array.forEach(element => {
        if(ip===element.ip){
            fetch(`http://77.105.140.71:3000/posts/${element.id}`,{
            method:'PATCH',
            body: JSON.stringify({
            name:name,
            telegramId:telegramId
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"	
          }
        }).then((respone)=>json(respone))
            }
        }
        
    );
    
}
