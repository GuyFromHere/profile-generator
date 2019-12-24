const path = require("path");
const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const generateHTML = require("./generateHTML.js").generateHTML;
const puppeteer = require("puppeteer");
const maps_api = require("./api.js").maps_api;

const questions = [
  {
    type: "input",
    message: "What is your GitHub username?",
    name: "username"
  },
  {
    type: "input",
    message: "What is your favorite color?",
    name: "color"
  }
];

inquirer.prompt(questions).then(function(response) {
  const color = response.color;
  axios
    .get(`https://api.github.com/users/${response.username}`)
    .then(res => {
      const getData = {
        color: color,
        name: res.data.name,
        username: res.data.login,
        location: res.data.location,
        profile: res.data.html_url,
        followers: res.data.followers,
        following: res.data.following,
        bio: res.data.bio,
        pic: res.data.html_url + ".png",
        company: res.data.company,
        blog: res.data.blog,
        publicRepos: res.data.public_repos,
        reposUrl: res.data.repos_url,
        watchers: 0
      };
      axios
        .get(getData.reposUrl)
        .then(res => {
          res.data.forEach(element => {
            getData.watchers += element.watchers;
          });
          fs.writeFile("profile.html", generateHTML(getData), err => {
            if (err) throw err;
            (async () => {
              const browser = await puppeteer.launch();
              const page = await browser.newPage();
              await page.goto(path.resolve("./profile.html"));
              await page.pdf({ path: `${getData.username}.pdf`, format: "A4" });
              await browser.close();
            })();
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});
