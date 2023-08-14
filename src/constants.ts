import path from "path";

export class Constants {
  static AppRootPath = path.join(__dirname, "..");
  static ChromeExecutablePath = path.join(Constants.AppRootPath, "assets", "chromedriver.exe");
  static CookiePath = path.join(Constants.AppRootPath, "assets", "cookiebro-domaincookies-.instagram.com.json");
  static XhrInjectionScriptPath = path.join(Constants.AppRootPath, "src", "injectedScripts", "xhrInjection.js");
  static XhrLogsPath = path.join(Constants.AppRootPath, "assets", "xhrLogs.json");
  static XhrLogsExcelPath = path.join(Constants.AppRootPath, "assets", "xhrLogs.xlsx");
}

export class XPaths {
  static searchBoxOpeningButton = `//span[text()='Search']/ancestor::a[1]`;
  static popupNotnowButton = `//button[text()="Not Now"]`;
  static searchInputBox = `//input[@aria-label="Search input"]`;
  static firstSearchSuggestion = `//input[@aria-label="Search input"]/following::hr/following::div//a[starts-with(@href,"/explore/tags")]`;
}
