const puppeeter = require('puppeteer');
const amazonSearch = 'https://www.amazon.com/s?k=';
var searchString = 'iphone+xr+64gb+red';
var webPageToVisit = amazonSearch + searchString;

(async () => {

console.log("Visiting page " + webPageToVisit);
const browser = await puppeeter.launch();
const page = await browser.newPage();

await page.goto(webPageToVisit);


var result = await page.$eval('span.a-size-medium', (childList) => {
        return Promise.resolve(childList);
    
}).then(()=>{
    for(var i = 0; i < result.length; i++){
        console.log(result[i].innerHTML);
    }
    
});




/*let data = await page.evaluate(() => {
    console.log('Evaluating webpage');    
    var linkList = new Array();
    var childList = document.querySelectorAll('span.a-size-medium'); 
/*    for(var i=0; i < childList.length; i++){
        if(childList[i].innerHTML.includes('iphone xr 64gb red')){
            linkList.push(childList[i].parentElement.getAttribute('href'));
        }
    }    
    for(var i=0; i < linkList.length; i++){
        console.log(linkList[i]);
    }

    for(var i = 0; i < childList.length; i++){
        console.log(childList[i].innerHTML);
    }


    if(err){
        return Promise.reject(err);
    }
    else{
        return Promise.resolve(childList);
    }
});

for(var i = 0; i < data.length; i++){
    console.log(data[i].innerHTML);
}*/

await browser.close();
})();

