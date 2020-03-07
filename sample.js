'use strict';

const puppeteer = require('puppeteer'); 
//const path = require('path');
const db = require('./db');
const Products = require('./models/products');  
var basePages = {'amazon' : 'https://www.amazon.com', 'walmart' : 'https://www.walmart.com', 'ebay' : 'https://www.ebay.com'};
var searchString = 'apple iphone xr 64gb';

(async ()=>{
try{
    //Function to search the database for data use await---
  var browser = await puppeteer.launch({headless : true});
  //let amazonScrapper = await scrapeAmazon(browser, searchString);
  let walmartScrapper = await scrapeWalmart(browser, searchString);
  let ebayScrapper = await scrapeEbay(browser, searchString);
  
  //let amazonResult = amazonScrapper;
  let walmartResult = walmartScrapper;
  let ebayResult = ebayScrapper;

  //let promises = [scrapeAmazon(browser), scrapeWalmart(browser), scrapeEbay(browser)];
  ///let results = promises.map(async (job) => await job);
  //await browser.close();
  //await updateDatabase(amazonResult);
  await updateDatabase(walmartResult);
  await updateDatabase(ebayResult);
  //for(const result of results){
    //await updateDatabase(result);
  //}

  //await db.collection.close();  
  
}catch(err){
    console.log(err);
  }
  finally{
    await browser.close();
  }

})();


//Amazon Scrapper

async function scrapeAmazon(browser, searchString){
  try{
    console.log('Scrapping Amazon.com');
    var productArrayAmazon = new Array();    
    var basePage = basePages['amazon'];
    // Initiate the Puppeteer browser 
    
    var page = await browser.newPage();
    // Go to the website page and wait for it to load 
    
    await page.setRequestInterception(true);
    await page.on('request', (req) => {
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
          req.abort();
      }
      else {
          req.continue();
      }
    });
  
  
    await page.goto(basePage, { waitUntil: 'networkidle2', timeout : 0});
    //await page.waitForSelector('#twotabsearchtextbox');
    //Search for search box and enter product name
    await page.type('#twotabsearchtextbox', searchString);
    await page.click('.nav-search-submit > input:nth-child(2)');
    //Wait for page to load with results
    await page.waitForSelector('span.a-size-medium');  
    // Run javascript inside of the page 
    let data = await page.evaluate((searchString) => {
      //console.log('In page evaluate');
      //const list = $('span:contains(^Apple iPhone XR$)');
      var linkList = new Array();
      const list = document.querySelectorAll('span.a-size-medium');
      
        for(var i = 0; i < list.length; i++){
        //if((titleString.toLocaleLowerCase).startsWith())  {
          var flag = true;
          var string = list[i].innerText.toLowerCase();
          for(str of searchString.split(' ')){
              if(string.includes(str)){
                ;
              }
              else{
                flag = false;
                break;  
              }
          }
          if(flag)
            linkList.push(list[i].parentElement.getAttribute('href'));  
        }
      return linkList;
    }, searchString);
    console.log(data);
    for(const link of data){
try{
      if(link == null)
        continue;
      //await visitLinks(link, basePage);
      var page = await browser.newPage();
      var pageToVisit = basePage + link;
      console.log('Visiting page : ' + pageToVisit);
      //await page.click('a[href =' + '\"' + link + '\"' + ']', { waitUntil: 'networkidle0', timeout : 0} );
  
      await page.setRequestInterception(true);
  
      await page.on('request', (req) => {
          if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
              req.abort();
          }
          else {
              req.continue();
          }
      });
  
      await page.goto(pageToVisit/*, { waitUntil: 'networkidle2', timeout : 0}*/);
      await page.waitForSelector('#landingImage');
      console.log('Evaluating product page');
      let pageData = await page.evaluate((pageToVisit) =>{
        //console.log('Reading javascript');
        var productTitle = document.querySelector('span#productTitle').innerText;
        var productPrice = document.querySelector('#priceblock_ourprice').innerHTML;
        var imageLink = "Product Image";//document.querySelector('#landingImage').getAttribute('src');
        var productLink = pageToVisit;
        var productSite = 'Amazon';
        //console.log('Returning scraped data');
        return productTitle + '\n' + productPrice + '\n' + imageLink + '\n' + productLink + '\n' + productSite;
        // console.log(product); 
        //return product;
      }, pageToVisit);
      //Function call to Save data to database
      await productArrayAmazon.push(createDataObject(pageData));
      await page.close();
    }catch(err){
      console.log(err);
    }
  }
  
  console.log('Done');
}catch(err){
  console.log(err + ' In amazon scrapping');
}finally{
  return productArrayAmazon;
}
  
  };
  
//Scrape Walmart
async function scrapeWalmart(browser, searchString){

  try{
    console.log('Scrapping Walmart.com');
  var productArrayWalmart = new Array();
  var basePage = basePages['walmart'];        
  //Initiate the Puppeteer browser 
  //var browser = await puppeteer.launch({headless : true});
  var page = await browser.newPage();
  // Go to the IMDB Movie page and wait for it to load 

  await page.setRequestInterception(true);

  await page.on('request', (req) => {
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
          req.abort();
      }
      else {
          req.continue();
      }
  });


  await page.goto(basePage, { waitUntil: 'networkidle2', timeout : 0});
  //await page.waitForSelector('#global-search-input');
  await page.type('#global-search-input', searchString);
  await page.click('#global-search-submit > span > span');
  await page.waitForSelector('a.product-title-link');  
  // Run javascript inside of the page 
  //basePage = page.url(); 
  
  let data = await page.evaluate((searchString) => {
    console.log('In page evaluate');
    //const list = $('span:contains(^Apple iPhone XR$)');
    var linkList = new Array();
    const list = document.querySelectorAll('a.product-title-link');
    for(var i = 0; i < list.length; i++){
      //if((titleString.toLocaleLowerCase).startsWith())  {
        var flag = true;
        var string = list[i].innerText.toLowerCase();
        for(str of searchString.split(' ')){
            if(string.includes(str)){
              ;
            }
            else{
              flag = false;
              break;  
            }
        }
        if(flag)
          linkList.push(list[i].parentElement.getAttribute('href'));  
      }
  return linkList;
  }, searchString);
  console.log(data);
  for(const link of data){
    try{
    if(link == null)
    continue;

    //await visitLinks(link, basePage);
    var page = await browser.newPage();
    var pageToVisit = basePage + link;
   // console.log('Visiting page : ' + pageToVisit);
    //await page.click('a[href =' + '\"' + link + '\"' + ']', { waitUntil: 'networkidle0', timeout : 0} );

    await page.setRequestInterception(true);

    await page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto(pageToVisit/*, { waitUntil: 'networkidle0', timeout : 0}*/);
    await page.waitForSelector('body > div.js-content > div > div > div.js-body-content > div > div.atf-content > div > div.atf-content > div > div > div > div > div.Grid > div.Grid > div:nth-child(1) > div.product-image-carousel-container.product-image-mweb-container > div > div > div > div > div.prod-hero-image > button > span > div.hover-zoom-container > div.hover-zoom-hero-image-container > img');
    console.log('Evaluating product page');
    let pageData = await page.evaluate((pageToVisit) =>{
      console.log('Reading javascript');
      var productTitle = document.querySelector('h1').innerText;
      var productPrice = document.querySelector('.price-characteristic').innerText;
      var imageLink = "Product Image";//document.querySelector('body > div.js-content > div > div > div.js-body-content > div > div.atf-content > div > div.atf-content > div > div > div > div > div.Grid > div.Grid > div:nth-child(1) > div.product-image-carousel-container.product-image-mweb-container > div > div > div > div > div.prod-hero-image > button > span > div.hover-zoom-container > div.hover-zoom-hero-image-container > img').getAttribute('src');
      var productLink = pageToVisit;
      var productSite = 'Walmart';
      console.log('Returning scraped data');
      return productTitle + '\n' + productPrice + '\n' + imageLink + '\n' + productLink + '\n' + productSite;
      // console.log(product); 
      //return product;
    }, pageToVisit);
    

    productArrayWalmart.push(createDataObject(pageData));
    //console.log(pageData);
    await page.close();
  }catch(err){
    console.log(err);
  }
}
  console.log('Done');
}catch(err){
  console.log(err + ' In Scrapping Walmart');
}
finally{
  return productArrayWalmart;
}
  
};


/*Ebay code*/

async function scrapeEbay(browser, searchString){
  try{
    console.log('Scrapping Ebay.com');
  var productArrayEbay = new Array();
  var basePage = basePages['ebay'];
  //Initiate the Puppeteer browser 
  //var browser = await puppeteer.launch({headless : true});
  var page = await browser.newPage();
  
  await page.setRequestInterception(true);
  
  await page.on('request', (req) => {
    if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
        req.abort();
    }
    else {
        req.continue();
    }
  });
  
  
  await page.goto(basePage, { waitUntil: 'networkidle2', timeout : 0});
  //await page.waitForSelector('#gh-ac');
  await page.type('#gh-ac', searchString);
  await page.click('#gh-btn');
  await page.waitForSelector('span.BOLD');  
  // Run javascript inside of the page 
  //basePage = page.url(); 
  
  let data = await page.evaluate((searchString) => {
  console.log('In page evaluate');
  //const list = $('span:contains(^Apple iPhone XR$)');
  
  const list = document.querySelectorAll('h3');
  console.log(list);
  var linkList = new Array();
  for(var i = 0; i < list.length; i++){
    //if((titleString.toLocaleLowerCase).startsWith())  {
      var flag = true;
      var string = list[i].innerText.toLowerCase();
      for(str of searchString.split(' ')){
          if(string.includes(str)){
            ;
          }
          else{
            flag = false;
            break;  
          }
      }
      if(flag)
        linkList.push(list[i].parentElement.getAttribute('href'));  
    }
    return linkList;
}, searchString);
  console.log(data);
  //var arr = new Array();
  
  for(const link of data){
    try{
    if(link == null)
    continue;

    //await visitLinks(link, basePage);
  var page = await browser.newPage();
  var pageToVisit = basePage + link;
  //console.log('Visiting page : ' + pageToVisit);
  //await page.click('a[href =' + '\"' + link + '\"' + ']', { waitUntil: 'networkidle0', timeout : 0} );
  
  
  await page.setRequestInterception(true);
  
  await page.on('request', (req) => {
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
          req.abort();
      }
      else {
          req.continue();
      }
  });
  
  
  await page.goto(pageToVisit/*, { waitUntil: 'networkidle0', timeout : 0}*/);
  await page.waitForSelector('#icImg');
  //console.log('Evaluating product page');
  
    let pageData = await page.evaluate((pageToVisit) =>{
    console.log('Reading javascript');
    var productTitles = document.querySelector('h1').cloneNode(true);
    productTitles.removeChild(productTitles.firstChild);
     var productTitle = productTitles.innerText;
    var productPrice = document.querySelector('span.notranslate').innerHTML;
    var imageLink = "Product Image";//document.querySelector('#icImg').getAttribute('src');
    var productLink = pageToVisit;
    var productSite = 'Ebay';
    
    console.log('Returning scraped data');
    return productTitle + '\n' + productPrice + '\n' + imageLink + '\n' + productLink + '\n' + productSite + '\n';
    // console.log(product); 
    //return product;
  }, pageToVisit);
  
  //console.log(pageData);
  productArrayEbay.push(createDataObject(pageData));
  await page.close();
}catch(err){
  console.log(err);
}
  }
  
}catch(err){
  console.log(err + 'in scraping ebay');
}
finally{
  console.log('Done');
  return productArrayEbay;
}
};
  
  

function updateDatabase(productArray){
  console.log(productArray);
  Products.collection.insertMany(productArray, function(err){
  if(err){
    console.log('Unable to save the product to database');
  }
  else{
    console.log('Product saved successfully');
  }
 });
}


function createDataObject(pageData){
  var productDetails = pageData.split("\n");
  console.log(productDetails);
  var prodObj = {
    productTitle : productDetails[0],
    productPrice : productDetails[1],
    productLink : productDetails[3],
    productImageLink : productDetails[2],
    productSite : productDetails[4] 
  };

  return prodObj;

}
