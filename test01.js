var webdriver = require('selenium-webdriver')
var chrome = require('selenium-webdriver/chrome')
var chai = require('chai')
var expect = chai.expect
var until = webdriver.until
var By = webdriver.By

var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

var TEST_URL = 'http://localhost:3333#/'

function pageTransition () {
  return new Promise(function (res) {
    setTimeout(res, 1500)
  })
}

async function menuButtonClick (url) {
  var findButton = await driver.findElement(By.css('a[href=\'#'+ url +'\']'))
  findButton.click()
  return await pageTransition()
}

describe('Menu', function() {
  this.timeout(50000)

  before(async function() {
    driver.get(TEST_URL)
  })

  beforeEach(async function() {
    // reset to clean state
    driver.executeScript('window.localStorage.clear();')
    driver.executeScript('localStorage.Settings=1;localStorage[\'Settings-1\']=\'{"id":1,"language":"de","accepted":true,"user":null,"sound":true,"transitions":true,"external_browser":false}\'')
    driver.get(TEST_URL)
    await pageTransition()
  })

  after(function() {
    return driver.quit()
  })

  it('should show the correct index page', async function () {
    var headerImage = await driver.findElement(By.css('.header.index img'))
    var headerSrc = await headerImage.getAttribute('src')
    expect(headerSrc).to.include('img/index/ab_logo.svg')
    var buttons = await driver.findElements(By.css('.button-menu-item'))
    expect(buttons.length).to.equal(6)
  })

  it('should show the correct settings page', async function () {
    await menuButtonClick('settings')
    var headerText = await driver.findElement(By.css('.header h1')).getText()
    expect(headerText).to.equal('EINSTELLUNGEN')
  })

  it('should load an private bound', async function () {
    await menuButtonClick('find')
    await menuButtonClick('private')
    var codeInput = await driver.findElement(By.id('code'))
    codeInput.sendKeys('so36')
    var startButton = await driver.findElement(By.css('.start-private'))
    startButton.click()
    await pageTransition()
    var headerText = await driver.findElement(By.css('.header h1')).getText()
    expect(headerText).to.equal('BERLIN KREUZB')
  })
})

