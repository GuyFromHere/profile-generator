const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const generateHTML = require("./generateHTML.js").generateHTML;
const puppeteer = require("puppeteer");

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
  /* const color = response.color; */
  const color = "red";
  axios
    //.get(`https://api.github.com/users/${response.username}`)
    .get(`https://api.github.com/users/guyfromhere`)
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
        reposUrl: res.data.repos_url
      };
      //console.log(res);
      axios
        .get(getData.reposUrl)
        .then(res => {
          let counter = 0;
          res.data.forEach(element => {
            counter += element.watchers;
          });
          getData.watchers = counter;
          const newPage = generateHTML(getData);
          fs.writeFile("index.html", newPage, err => {
            if (err) throw err;
            (async () => {
              const browser = await puppeteer.launch();
              const page = await browser.newPage();
              await page.goto(
                "file:///C:/documents/github/profile-generator/index.html"
              );
              await page.pdf({ path: `${getData.username}.pdf`, format: "A4" });
              await browser.close();
            })();
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});
