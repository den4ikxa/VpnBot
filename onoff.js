export async function offTrafic(ip){
    const response = await fetch('http://77.105.140.71:3000/execute_limit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip })
    })
    const data = await response.json();
    if (response.ok) {
        console.log('Успешно',data)
    } else {
        console.log('Не успешно')
    }
}
export async function onTrafic(ip){
    const response = await fetch('http://77.105.140.71:3000/execute_remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ip })
    })
    const data = await response.json();
    if (response.ok) {
        console.log('Успешно',data)
    } else {
        console.log('Не успешно')
    }
}