
const puppeteer = require("puppeteer")
const Page = require("./helpers/page.js")


jest.setTimeout(30000)

let page

beforeEach(async () => {
    page = await Page.build()
})

afterEach(async () => {

    await page.close()
})




describe("when logged in", () => {
    beforeEach(async () => {
        await page.login()
        await page.click('a.btn-floating')
    })

    test("can see add blog page", async () => {
        const context = await page.getContent(".title label")
        expect(context).toEqual("Blog Title")
    })


    describe("When user uses valid input", () => {
        beforeEach(async () => {
            await page.type(".title input", "My Test Title")
            await page.type(".content input", "My Test Content")
            await page.click("form button")
        })




        test("Submitting takes user to confirm screen", async () => {

            const text = await page.getContent('h5')
            expect(text).toEqual("Please confirm your entries")
        })


        test("Submitting adds blog to index and displays to user",async  () => {
                await page.click('.green')
                await page.waitForSelector('.card')
                const title=await page.getContent('.card-title')
                const content=await page.getContent('p')


                expect(title).toEqual("My Test Title")
                expect(content).toEqual("My Test Content")

            })


    })


    describe("When user uses invalid input", () => {
        beforeEach(async () => {
            await page.click('form button');

        })


        test("Must see error message", async () => {
            const blogErr = await page.getContent('.title .red-text')
            const contentErr = await page.getContent('.content .red-text')
            expect(blogErr).toEqual("You must provide a value")
            expect(contentErr).toEqual("You must provide a value")

        })
    })
})



    // test("Cannot post a blog", async () => {
    //     const res = await page.evaluate(async () => {
    //         const response = await fetch("http://localhost:3000/api/blogs", {
    //             method: "POST",
    //             credentials: "same-origin",
    //             headers: {
    //                 'Content-type': 'application/json'
    //             },
    //             body: JSON.stringify({title: "MY TITLE", content: "MY CONTENT"})
    //         });
    //         return response.json(); 
    //     });

    //     console.log(res); 
    // });

 

    describe("When not logged in", () => {
        test('User cannot get a list of posts', async () => {

          
            const result = await page.evaluate(() => {
                return fetch('http://127.0.0.1:3000/api/blogs', {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json());
            });
    
            expect(result.error).toEqual("You must log in!")
        });

        test('User cannot post a blog', async () => {

          
            const result = await page.evaluate(() => {
                return fetch('http://127.0.0.1:3000/api/blogs', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({title:"MY TITLE",content:"MY CONTENT"})
                }).then(res => res.json());
            });
    
            expect(result.error).toEqual("You must log in!")
        });
    });



