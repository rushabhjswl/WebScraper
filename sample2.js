    
const puppeteer = require('puppeteer'); 
//const path = require('path');
const db = require('./db');
const Product = require('./models/products');  
var basePages = {'amazon' : 'https://www.amazon.com', 'walmart' : 'https://www.walmart.com', 'ebay' : 'https://www.ebay.com'};
var searchString = 'apple iphone xr';

(async () => {
  var basePage = basePages['amazon'];
  // Initiate the Puppeteer browser 
  var browser = await puppeteer.launch({headless : true});
  var page = await browser.newPage();
  // Go to the website page and wait for it to load 
  
  await page.goto(basePage/*, { waitUntil: 'networkidle2', timeout : 0}*/);
  await page.waitForSelector('#twotabsearchtextbox');
  //Search for search box and enter product name
  await page.type('#twotabsearchtextbox', searchString);
  await page.click('.nav-search-submit > input:nth-child(2)');
  //Wait for page to load with results
  await page.waitForSelector('span.a-size-medium');  
  // Run javascript inside of the page 
  let data = await page.evaluate((searchString) => {
    console.log('In page evaluate');
    //const list = $('span:contains(^Apple iPhone XR$)');
    var linkList = new Array();
    const list = document.querySelectorAll('span.a-size-medium');
    
    for(var i = 0; i < list.length; i++){
      //if((titleString.toLocaleLowerCase).startsWith())  {
      if(list[i].innerText.toLowerCase().startsWith(searchString.toLowerCase())){
            linkList.push(list[i].parentElement.getAttribute('href'));
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

    await page.goto(pageToVisit, { waitUntil: 'networkidle2', timeout : 0});
    //await page.waitForSelector('li.a-spacing-small:nth-child(4) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(2) > img:nth-child(1)');
    console.log('Evaluating product page');
    let pageData = await page.evaluate((pageToVisit) =>{
      //console.log('Reading javascript');
      var productTitle = document.querySelector('span#productTitle').innerText;
      var productPrice = document.querySelector('#priceblock_ourprice').innerHTML;
      var imageLink = document.querySelector('li.a-spacing-small:nth-child(4) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(2) > img:nth-child(1)').getAttribute('src');
      var productLink = pageToVisit;
      var productSite = 'Amazon';
      //console.log('Returning scraped data');
      return productTitle + '\n' + productPrice + '\n' + imageLink + '\n' + productLink + '\n' + productSite;
      // console.log(product); 
      //return product;
    }, pageToVisit);
    //Function call to Save data to database
    updateDatabase(pageData);
    /*
    var productDetails = pageData.split("\n");
    console.log(productDetails);
    var prodObj = {
      productTitle : productDetails[0],
      productPrice : productDetails[1],
      productLink : productDetails[3],
      productImageLink : productDetails[2],
      productSite : productDetails[4] 
    };

    //var newProduct = new Product(prodObj);
    Product.findOneAndUpdate({productTitle : prodObj.productTitle, productPrice : {$ne : prodObj.productPrice}}, {productTitle : prodObj.productTitle, productPrice : prodObj.productPrice, productLink : prodObj.productLink, productImageLink : prodObj.productImageLink, productSite : prodObj.productSite }, {upsert : false}, function(err){
      if(err){
        console.log('Unable to save the product to database');
      }
      else{
        console.log('Product saved successfully');
      }

    });       
*/    
    await page.close();
}
  console.log('Done');
  browser.close();
})();

  //Walmart code

  (async () => {
    var basePage = basePages['walmart'];        
    //Initiate the Puppeteer browser 
    var browser = await puppeteer.launch({headless : true});
    var page = await browser.newPage();
    // Go to the IMDB Movie page and wait for it to load 
    await page.goto(basePage/*, { waitUntil: 'networkidle2', timeout : 0}*/);
    await page.waitForSelector('#global-search-input');
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
        if(list[i].innerText.toLowerCase().includes(searchString.toLowerCase())){
              linkList.push(list[i].getAttribute('href'));
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
        var productTitle = document.querySelector('h1').innerText;
        var productPrice = document.querySelector('.price-characteristic').innerText;
        var imageLink = document.querySelector('body > div.js-content > div > div > div.js-body-content > div > div.atf-content > div > div.atf-content > div > div > div > div > div.Grid > div.Grid > div:nth-child(1) > div.product-image-carousel-container.product-image-mweb-container > div > div > div > div > div.prod-hero-image > button > span > div.hover-zoom-container > div.hover-zoom-hero-image-container > img').getAttribute('src');
        var productLink = pageToVisit;
        var productSite = 'Walmart';
        console.log('Returning scraped data');
        return productTitle + '\n' + productPrice + '\n' + imageLink + '\n' + productLink + '\n' + productSite + '\n';
        // console.log(product); 
        //return product;
      }, pageToVisit);
      

      updateDatabase(pageData);
      //console.log(pageData);
      await page.close();
  }
    console.log('Done');
    browser.close();
  })();

/*Ebay code*/

(async () => {
var basePage = basePages['ebay'];
//Initiate the Puppeteer browser 
var browser = await puppeteer.launch({headless : true});
var page = await browser.newPage();
// Go to the IMDB Movie page and wait for it to load 
await page.goto(basePage/*, { waitUntil: 'networkidle2', timeout : 0}*/);
await page.waitForSelector('#gh-ac');
await page.type('#gh-ac', searchString);
await page.click('#gh-btn');
await page.waitForSelector('span.BOLD');  
// Run javascript inside of the page 
//basePage = page.url(); 

let data = await page.evaluate((searchString) => {
console.log('In page evaluate');
//const list = $('span:contains(^Apple iPhone XR$)');
var linkList = new Array();
const list = document.querySelectorAll('h3');

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
//var arr = new Array();

for(const link of data){
//await visitLinks(link, basePage);
var page = await browser.newPage();
var pageToVisit = link;
console.log('Visiting page : ' + pageToVisit);
//await page.click('a[href =' + '\"' + link + '\"' + ']', { waitUntil: 'networkidle0', timeout : 0} );

await page.goto(pageToVisit, { waitUntil: 'networkidle0', timeout : 0});
//await page.waitForSelector('li.a-spacing-small:nth-child(4) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(2) > img:nth-child(1)');
console.log('Evaluating product page');

  let pageData = await page.evaluate((pageToVisit) =>{
  console.log('Reading javascript');
  var productTitles = document.querySelector('h1').cloneNode(true);
  productTitles.removeChild(productTitles.firstChild);
   var productTitle = productTitles.innerText;
  var productPrice = document.querySelector('span.notranslate').innerHTML;
  var imageLink = document.querySelector('#icImg').getAttribute('src');
  var productLink = pageToVisit;
  var productSite = 'Ebay';
  
  console.log('Returning scraped data');
  return productTitle + '\n' + productPrice + '\n' + imageLink + '\n' + productLink + '\n' + productSite + '\n';
  // console.log(product); 
  //return product;
}, pageToVisit);


console.log(pageData);
updateDatabase(pageData);
await page.close();
}
console.log('Done');
browser.close();

})();


function updateDatabase(pageData){
var productDetails = pageData.split("\n");
console.log(productDetails);
var prodObj = {
productTitle : productDetails[0],
productPrice : productDetails[1],
productLink : productDetails[3],
productImageLink : productDetails[2],
productSite : productDetails[4] 
};

//var newProduct = new Product(prodObj);

Product.findOneAndUpdate({productTitle : prodObj.productTitle}, {productPrice : prodObj.productPrice}, {upsert : false}, function(err){
if(err){
  console.log('Unable to save the product to database');
}
else{
  console.log('Product saved successfully');
}

});  


}