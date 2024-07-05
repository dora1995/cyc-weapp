export function tranferStr (str?: string) {
    if (!str) return ''
    // const strList = str.split('/n')
    // const list = strList.filter(item => item !== '')

    return str.replace(/\n/g, '<br>');
    // return list.map(item => {
    //     return `<p>${item}</p>`
    // }).join('')
}