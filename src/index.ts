import fs from "fs";
import ExcelJS from "exceljs";
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

  static writeJsonToExcelFile = (data: HashtagSearchResult[], filePath: string) => {
    const excelData = data[0].data?.top?.sections?.reduce<ExportedExcel[]>((acc, section) => {
      const sectionMedias = section.layout_content?.medias;
      const renderingData = sectionMedias?.map((x) => ({
        caption: x.media.caption?.text,
        author: x.media.user?.full_name,
        commentCount: x.media.comment_count,
        likeCount: x.media.like_count,
        isCaptionEdited: x.media.caption_is_edited,
      }));
      return renderingData ? [...acc, ...renderingData] : acc;
    }, []);
    if (excelData && Array.isArray(excelData) && excelData.length > 0) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
      const columns = Object.keys(excelData[0]);
      worksheet.columns = columns.map((key) => ({ header: key, key, width: 15 }));
      excelData.forEach((item) => {
        worksheet.addRow(item);
      });

      workbook.xlsx
        .writeFile(filePath)
        .then(() => {
          console.log("Excel file saved:", filePath);
        })
        .catch((err) => {
          console.error("Error saving Excel file:", err);
        });
    }
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

      const interceptedResponse = (await Main.getInterceptedResponse(driver)).map(
        (x) => JSON.parse(x.response as string) as HashtagSearchResult
      );
      Main.writeJsonToFile(JSON.stringify(interceptedResponse, null, 2), Constants.XhrLogsPath);
      Main.writeJsonToExcelFile(interceptedResponse, Constants.XhrLogsExcelPath);

      await driver.quit();
    } catch (error) {
      console.error(error);
    }
  };
}

Main.start();
