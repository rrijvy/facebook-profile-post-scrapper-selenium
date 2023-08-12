import fs from "fs";
import { WebDriver, Builder, By } from "selenium-webdriver";
import { Constants, XPaths } from "./constants";
import { Cookie } from "./types/cookie";

class Main {
  static waitForDOMLoad = async (driver: WebDriver, timeout: number) => {
    await driver.wait(async () => {
      const readyState = await driver.executeScript("return document.readyState");
      return readyState === "complete";
    }, timeout);
  };

  static injectXhr = async (driver: WebDriver) => {
    await driver.executeScript(await fs.promises.readFile(Constants.XhrInjectionScriptPath, "utf8"));
  };

  static getInterceptedResponse = async (driver: WebDriver): Promise<XhrLog[]> => {
    return await driver.executeScript("return window.xhrLog");
  };

  static writeJsonToFile = (jsonData: string, filePath: string) => {
    fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
      } else {
        console.log(`JSON data has been written to ${filePath}`);
      }
    });
  };

  static start = async () => {
    try {
      const driver: WebDriver = new Builder().forBrowser("chrome").build();
      await driver.get("https://www.instagram.com");
      const jsonCookie = await fs.promises.readFile(Constants.CookiePath, "utf8");
      const cookies: Cookie[] = JSON.parse(jsonCookie);
      for (const x of cookies) {
        await driver.manage().addCookie({
          name: x.name,
          value: x.value,
          domain: x.domain,
          expiry: x.expirationDate,
          httpOnly: x.httpOnly,
          path: x.path,
          secure: x.secure,
        });
      }
      await driver.navigate().refresh();
      await Main.waitForDOMLoad(driver, 10000);
      await driver.findElement(By.xpath(XPaths.popupNotnowButton)).click();
      await driver.sleep(2000);
      await driver.findElement(By.xpath(XPaths.searchBoxOpeningButton)).click();
      await driver.sleep(2000);
      await driver.findElement(By.xpath(XPaths.searchInputBox)).sendKeys("#shakib75");
      await Main.injectXhr(driver);
      await driver.sleep(4000);
      await driver.findElement(By.xpath(XPaths.firstSearchSuggestion)).click();
      await driver.sleep(8000);

      const interceptedResponse = (await Main.getInterceptedResponse(driver)).map((x) => JSON.parse(x.response as string));
      console.log(interceptedResponse);
      Main.writeJsonToFile(JSON.stringify(interceptedResponse, null, 2), Constants.XhrLogsPath);

      await driver.quit();
    } catch (error) {
      console.error(error);
    }
  };
}

Main.start();
