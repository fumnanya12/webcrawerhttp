
const{crawlimagePage}=require('./crawl.js') 
const{crawlPage}=require('./crawl.js') 
const{crawlPagesingle}=require('./crawl.js')
const { printReport } = require('./report.js')
async function main(){
if (process.argv.length<3){
    console.log(" no website provided")
    process.exit(1)
}
if (process.argv.length>3){
    console.log("too many commandline args")
    process.exit(1)
}

const baseURL= process.argv[2]

console.log(`starting crawl of ${baseURL}`)
//crawlPagesingle(baseURL)
//const pages=await crawlPage(baseURL,baseURL,{})
//printReport(pages)
crawlimagePage(baseURL)

}

main()