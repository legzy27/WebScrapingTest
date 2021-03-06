const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();



let scrapeData = async () => {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();


    


  await page.setViewport({ width: 1366, height: 768 });
  await page.goto('https://my.wonderbill.com/login', {waitUntil: 'networkidle2'})
  .catch(e => console.error(e)); //The snippet throws an error that you can catch with .catch() promise method.
  
  
  await page.click('#_evidon-accept-button');
 
  //Enter email and password
  await page.type('input[type=email]', process.env.email)
  await page.type('input[type="password"]', process.env.password)

  //login button
  await page.click('#page-wrapper > div > div > div > section > form > button')
  await page.waitFor(1000);
  await page.click('section > .\_1aUg5 > .\_1mm64:nth-child(1) > .\_1MwNx > .\_2u4DS')

  await page.waitForSelector('div > div > .\_2RfCm > .TiUAv > .\_2y6-o')
  await page.click('div > div > .\_2RfCm > .TiUAv > .\_2y6-o')
  await page.waitFor(5000);




  
  //Generate image and pdf 
  await page.screenshot({ path: './image.jpg', fullPage: true });
 // await page.pdf({ path: "./page.pdf", format: "A4", printBackground: true });


 
 // handler picks up errors in the page by itself
  page.on('requestfailed', err => console.error('REQUEST_FAILED:\n' + util.inspect(err)))
  
  

  const accounts = await page.evaluate(() => {
    let accountName = document.querySelector('#accountName').value;
    let amountPaidEachMonth = document.querySelector('#amount').value;
    let datePaid = document.querySelector('#datePaid').value;
  

    return  [{
      

      accountName,
      amountPaidEachMonth,
      datePaid
   
    }]

    
    
  })

  return accounts

 
}





scrapeData().then((value) => {
  console.log(value);
  
  async() => {
    await browser.close()
  }

    

  fs.appendFile('accounts.json', JSON.stringify(value), function (err) {
    if (err) throw err;
    
   

  });
  

  
  


});


