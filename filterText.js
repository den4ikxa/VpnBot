export function filterText(text){
    const arrayText = text.split(' ')
    
    if(arrayText.length<=2){
        if(arrayText.length!=1){
            return {
                name:arrayText[0],
                ip:arrayText[1]
            }
        }
        else{
            return 'Что то не указали,например:\nДенис 10.7.03.33'
        }
    }
    else{
        return 'ввели что то лишнее,например:\nДенис 10.7.03.33'
    }
    
}