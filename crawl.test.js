const{normalizeURL}=require('./crawl.js')
const{normalizeURLslice}=require('./crawl.js')
const{getURLsFromHTML}=require('./crawl.js')
const{getURLsFromHTMLerror}=require('./crawl.js')

const {test, expect}= require('@jest/globals')

test('normalizeURL strip protocol', () => {
const input=  'https://blog.boot.dev/path'
const actual = normalizeURL(input)
const expected= 'blog.boot.dev/path'
expect(actual).toEqual(expected)

})

test('normalizeURL strip trailing slash ', () => {
    const input=  'https://blog.boot.dev/path/'
    const actual = normalizeURLslice(input)
    const expected= 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
    
})

test('normalizeURL capitals ', () => {
    const input=  'https://Blog.boot.dev/path/'
    const actual = normalizeURLslice(input)
    const expected= 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
    
})
test('normalizeURL strip http ', () => {
    const input=  'http://Blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected= 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
    
})

test('getURLsFromHTML absolute', () => {
    const inputHTMLBody=  `
    <html>
      <body>
         <a href="https://blog.boot.dev/">
            Boot.dev Blog
          </a>
      </body>
    </html>
    `
    const inputBaseURL="https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody,inputBaseURL)
    const expected= ["https://blog.boot.dev/"]
    expect(actual).toEqual(expected)
    
})

test('getURLsFromHTML relative ', () => {
    const inputHTMLBody=  `
    <html>
      <body>
         <a href="/path/">
            Boot.dev Blog
          </a>
      </body>
    </html>
    `
    const inputBaseURL="https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody,inputBaseURL)
    const expected= ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
    
})
test('getURLsFromHTML both ', () => {
  const inputHTMLBody=  `
  <html>
    <body>
    <a href="https://blog.boot.dev/path1/">
          Boot.dev Blog path one
        </a>
       <a href="/path2/">
          Boot.dev Blog path two
        </a>
    </body>
  </html>
  `
  const inputBaseURL="https://blog.boot.dev"
  const actual = getURLsFromHTML(inputHTMLBody,inputBaseURL)
  const expected= ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"]
  expect(actual).toEqual(expected)
  
})


test('getURLsFromHTML invalid  ', () => {
  const inputHTMLBody=  `
  <html>
    <body>
       <a href="invalid ">
          invalid url 
        </a>
    </body>
  </html>
  `
  const inputBaseURL="https://blog.boot.dev"
  const actual = getURLsFromHTMLerror(inputHTMLBody,inputBaseURL)
  const expected= []
  expect(actual).toEqual(expected)
  
})