    const puppeteer = require('puppeteer'); 
    var basePage = 'https://www.amazon.com';
    var searchString = 'samsung galaxy s10';
    //var webPageToVisit = basePage;
    //var basePage;
    
    (async () => {

      /* Initiate the Puppeteer browser*/ 
      var browser = await puppeteer.launch({headless : false});
      var page = await browser.newPage();
      /* Go to the IMDB Movie page and wait for it to load*/ 
      await page.goto(basePage, { waitUntil: 'networkidle0', timeout : 0});
      await page.type('#twotabsearchtextbox', searchString);
      await page.click('.nav-search-submit > input:nth-child(2)');
      await page.waitForSelector('span.a-size-medium');  
      /* Run javascript inside of the page */
      //basePage = page.url(); 
      
      let data = await page.evaluate((searchString) => {
        console.log('In page evaluate');
        //const list = $('span:contains(^Apple iPhone XR$)');
        var linkList = new Array();
        const list = document.querySelectorAll('span.a-size-medium');
        
        for(var i = 0; i < list.length; i++){
          //if((titleString.toLocaleLowerCase).startsWith())  {
          if(list[i].innerText.toLowerCase().startsWith(searchString.toLowerCase())){
                linkList.push(list[i].parentElement.getAttribute('href'));
                // const page1 = browser.newPage();
                //page.goto(list[i].parentElement.getAttribute('href'));
                //visitLinks(list[i], basePage);
            }
        }
        return linkList;
      }, searchString);
      console.log(data);
      for(const link of data){
        //await visitLinks(link, basePage);
        var page = await browser.newPage();
        var pageToVisit = basePage + link;
        console.log('Visiting page : ' + pageToVisit);
        //await page.click('a[href =' + '\"' + link + '\"' + ']', { waitUntil: 'networkidle0', timeout : 0} );

        await page.goto(pageToVisit, { waitUntil: 'networkidle0', timeout : 0});
        //await page.waitForSelector('li.a-spacing-small:nth-child(4) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(2) > img:nth-child(1)');
        console.log('Evaluating product page');
        let pageData = await page.evaluate((pageToVisit) =>{
          console.log('Reading javascript');
          var productTitle = document.querySelector('span#productTitle').innerText;
          var productPrice = document.querySelector('#priceblock_ourprice').innerHTML;
          var imageLink = document.querySelector('li.a-spacing-small:nth-child(4) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(2) > img:nth-child(1)').getAttribute('src');
          var productLink = pageToVisit;
          var productSite = 'Amazon';
          console.log('Returning scraped data');
          return productTitle + '\n' + productPrice + '\n' + imageLink + '\n' + productLink + '\n' + productSite + '\n';
          // console.log(product); 
          //return product;
        }, pageToVisit);
        
        console.log(pageData);
        await page.close();
        //await page.goBack();
        //await page.waitForSelector('span.a-size-medium')
    }
      console.log('Done');
      browser.close();
    })();


