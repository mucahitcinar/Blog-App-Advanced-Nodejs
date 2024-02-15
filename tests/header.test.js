const puppeteer = require("puppeteer")
const Page=require("./helpers/page.js")
jest.setTimeout(30000)
let page 

beforeEach(async () => {
     page=await Page.build()
})

afterEach(async () => {

    await page.close()
})


test("Testing Oauth", async () => {

    await page.goto("http://127.0.0.1:3000")

    await page.click('.right a')

    const url = await page.url()

    expect(url.includes('accounts.google.com')).toBe(true)

})


test("Wait for the login and show logout button", async () => {
    
   await page.login()
    

    const text= await page.getContent('a[href="/auth/logout"]')
   
    expect(text).toEqual('Logout')
})


