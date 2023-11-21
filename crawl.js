const{JSDOM} = require('jsdom')

function getURLsFromHTML( htmlBody, baseURL){
    const url=[]
    const dom =new JSDOM(htmlBody)
    const linkElements= dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements){
        if(linkElement.href.slice(0, 1) === '/') {// if the 1st character of the string is a slash the is it a relative 
            // relative 
            url.push(`${baseURL}${linkElement.href}`)
        }
        else{
            //absolute 
            url.push(linkElement.href)
        }
    }
    return url
}

function getURLsFromHTMLerror( htmlBody, baseURL){
    const url=[]
    const dom =new JSDOM(htmlBody)
    const linkElements= dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements){
        if(linkElement.href.slice(0, 1) === '/') {// if the 1st character of the string is a slash the is it a relative 
            // relative 
            try {
                const urlobj=new URL(`${baseURL}${linkElement.href}`)
                url.push(urlobj.href)
            } catch (err) {
                console.log(`error with relative url: ${err.message}`)
            }
           
        }
        else{
            //absolute 
            try {
                const urlobj=new URL(linkElement.href)
                url.push(urlobj.href)
            } catch (err) {
                console.log(`error with Absolute url: ${err.message}`)
            }
        }
    }
    return url
}

//testrun



function normalizeURL(urlString){
    const urlObj= new URL(urlString)
    return `${urlObj.hostname}${urlObj.pathname}`
}
//if it has a slash at the end 
function normalizeURLslice(urlString){
    const urlObj= new URL(urlString)
    const hostpath= `${urlObj.hostname}${urlObj.pathname}`
    if(hostpath.length>0&&hostpath.slice(-1)==='/'){
        return hostpath.slice(0,-1)
    }
    return hostpath

}


module.exports = {
    normalizeURL,
    normalizeURLslice,
    getURLsFromHTML,
    getURLsFromHTMLerror
}