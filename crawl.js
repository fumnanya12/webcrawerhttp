const{JSDOM} = require('jsdom')
//crawling a single page 
async function crawlPagesingle(currentURL){
    console.log(`actively crawling: ${currentURL}`)
    try {
        const resp=await fetch(currentURL)

        if( resp.status>399){
            console.log(`error infetch with status code: ${resp.status} on page: ${currentURL} `)
            return
        }

        const contentType= resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`non html response, content type: ${contentType}, on page: ${currentURL}`)
            return
        }
        console.log(await resp.text())
    } catch (error) {
        console.log(`error in fetch:${error.message},on page: ${currentURL}`)
    }
    
}

async function crawlPage(baseURL,currentURL, pages){

    const baseURLobj=new URL(baseURL)
    const currentURLobj= new URL(currentURL)
    // if(baseURLobj.hostname!==currentURLobj.hostname){
    //     return pages
    // }
    const normalizedCurrentURL= normalizeURLslice(currentURL)
    if(pages[normalizedCurrentURL]>0){
        pages[normalizedCurrentURL]++
        return pages
    }
    pages[normalizedCurrentURL] =1

    console.log(`actively crawling: ${currentURL}`)

    try {
        const resp=await fetch(currentURL)

        if( resp.status>399){
            console.log(`error infetch with status code: ${resp.status} on page: ${currentURL} `)
            return pages
        }

        const contentType= resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`non html response, content type: ${contentType}, on page: ${currentURL}`)
            return pages
        }

       const htmlBody= await resp.text()

       const nextURLs= getURLsFromHTMLerror(htmlBody,baseURL)
       for(const nextURL of nextURLs){
        pages = await crawlPage(baseURL,nextURL,pages)
       }
    } catch (error) {
        console.log(`error in fetch:${error.message},on page: ${currentURL}`)
    }
    return pages
    
}


async function crawlimagePage(baseURL, pages){

   

    console.log(`actively crawling: ${baseURL}`)

    try {
        const resp=await fetch(baseURL)

        

       const htmlBody= await resp.text()

       const nextURLs= getimageFromHTMLerror(htmlBody)
       for(const nextURL of nextURLs){
    console.log(`Name of image: ${nextURL} `)
       }
    } catch (error) {
        console.log(`error in fetch:${error.message},on page: ${baseURL}`)
    }
    return pages
    
}


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
            if (linkElement.href!==""){
            url.push(linkElement.href)
            }
        }
    }
    return url
}

function getURLsFromHTMLerror( htmlBody, baseURL){
    const url=[]
    const dom =new JSDOM(htmlBody)
    const linkElements= dom.window.document.querySelectorAll('a')

    for (const linkElement of linkElements){
        // console.log(`WHat is inside:  ${linkElement}`)
        // console.log(`***********`)

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
              
                console.log(`URLname that cause the error:  ${linkElement}`)
                console.log(`error with Absolute url: ${err.message}`)
                console.log()
            }
        }

    }

    return url
}


function getimageFromHTMLerror( htmlBody){
    const url=[]
    const dom =new JSDOM(htmlBody)
    const linkElements= dom.window.document.querySelectorAll('img')

    for (const linkElement of linkElements){
        // console.log(`WHat is inside:  ${linkElement}`)
        // console.log(`***********`)

        
                url.push(linkElement.src)
               
            

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
    getURLsFromHTMLerror,
    crawlPage,
    crawlPagesingle,
    crawlimagePage
}