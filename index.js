const puppeteer = require('puppeteer');
const URL = 'https://www.flipkart.com';

puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(async browser => {
    const page = await browser.newPage();
//    await page.setViewport({width: 320, height: 600})
  //  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1')

    //await page.goto(URL, {waitUntil: 'networkidle0'});
    await page.waitForSelector('body');
    //await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})

    const result = await page.evaluate(() => {
        try {
            var data = [];
                $('a').each(function(){
                var link = $(this).attr('href');
                //console.log(link);
                //if(link.toString().startsWith('')){
                  //  console.log('In if');
                    linkCount = allLinks.push(link);            
                //}
            });

            return allLinks; // Return our data array
        } catch(err) {
            reject(err.toString());
        }
    });

    // let's close the browser
    await browser.close();

    // ok, let's log blog titles...
    for(var i = 0; i < result.length; i++) {
        console.log(result[i]);
    }
    process.exit();
}).catch(function(error) {
    console.log(error);
    console.error('No way Praveen!');
    process.exit();
});