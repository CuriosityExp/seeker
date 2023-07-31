const puppeteer = require("puppeteer");

class Scrap {
  static glintsUrl(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        let urls = await page.evaluate(() => {
          let results = [];
          let items = document.querySelectorAll("div.compact_job_card > div");
          items.forEach((item) => {
            results.push(
              "https://glints.com" + item.children[0].getAttribute("href")
            );
          });
          return results;
        });
        browser.close();
        return resolve(urls);
      } catch (e) {
        return reject(e);
      }
    });
  }

  static glintsDetail(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle0" });
        await page.waitForSelector("main");
        let detail = await page.evaluate(() => {
          const description = document.getElementsByClassName(
            "Opportunitysc__Main-sc-gb4ubh-3"
          )[0].innerText;
          return description;
        });
        browser.close();
        return resolve(detail);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static async kalibrrUrl(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `https://www.kalibrr.com/id-ID/job-board/te/${query}/si/monthly/co/Indonesia/1`;
        const browser = await puppeteer.launch({
          headless: true,
          userDataDir: "./dataBrowser",
        });
        const page = await browser.newPage();
        await page.goto(url);
        let urls = await page.evaluate(() => {
          let results = [];
          let items = document.querySelectorAll("div.css-1b4vug6");
          console.log(items, "ini items")
          items.forEach((item) => {
            const jobDesc = item.children[3].innerText.split("\n");
            results.push({
              url:
                "https://www.kalibrr.com" +
                item.children[1].children[0].children[0].getAttribute("href"),
              logo: item.children[0].children[0].children[0].src,
              jobTitle: item.children[1].innerText,
              companyName: jobDesc[0],
              companyLocation: jobDesc[1],
              salary: jobDesc[3],
            });
          });
          return results;
        });
        browser.close();
        return resolve(urls);
      } catch (e) {
        return reject(e);
      }
    });
  }

  static kalibrrDetail(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        let detail = await page.evaluate(() => {
          const jobTitle =
            document.getElementsByClassName("k-text-title")[0].innerText;
          const logo = document
            .querySelectorAll("img.k-block")[0]
            .getAttribute("src");
          const companyName =
            document.getElementsByClassName("k-inline-block")[0].innerText;
          const jobDesc = document
            .getElementsByClassName("k-mb-4 css-q0v7oq")[0]
            .innerText.split("\n")
            .slice(1);
          const minimumSkills = document
            .getElementsByClassName("k-mb-4 css-q0v7oq")[1]
            .innerText.split("\n");
          return {
            logo,
            jobTitle,
            companyName,
            jobDesc,
            minimumSkills,
          };
        });
        browser.close();
        return resolve(detail);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static karirUrl(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        let urls = await page.evaluate(() => {
          let results = [];
          let items = document.querySelectorAll("li.opportunity");
          items.forEach((item) => {
            results.push(item.children[0].children[2].children[0].href);
          });
          return results;
        });
        browser.close();
        return resolve(urls);
      } catch (e) {
        return reject(e);
      }
    });
  }

  static karirDetail(url) {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url);
        let urls = await page.evaluate(() => {
          const data = document.getElementsByClassName(
            "b-opportunity-show__aside"
          )[0].innerText;
          return { data };
        });
        browser.close();
        return resolve(urls);
      } catch (e) {
        return reject(e);
      }
    });
  }
}

module.exports = Scrap;
