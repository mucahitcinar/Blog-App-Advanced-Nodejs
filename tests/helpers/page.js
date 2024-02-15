const puppeteer = require("puppeteer")
const sesssionFactory=require("./../factories/sessionFactory")
const userFactory=require("./../factories/userFactory")



class CustomPage {
    static async build() {

        const browser = await puppeteer.launch({
            headless: false
        })

        const page = await browser.newPage()

        const customPage = new CustomPage(page)

        return new Proxy(customPage,
            {
                get: function (target, props) {
                    return customPage[props] || browser[props] || page[props]
                }
            })
    }

  
    constructor(page)
    {
        this.page=page
    }

    async login() {
        const user = await userFactory()
        const { session, sig } = sesssionFactory(user)
        await this.page.setCookie({ name: 'session', value: session, domain: "127.0.0.1" })
        await this.page.setCookie({ name: 'session.sig', value: sig, domain: "127.0.0.1" })
        await this.page.goto("http://127.0.0.1:3000/blogs")
        await this.page.waitForSelector('a[href="/auth/logout"]');

    }


    async getContent(selector)
    {
       return this.page.$eval(selector,el=>el.innerHTML)
    }

}


module.exports = CustomPage