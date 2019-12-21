const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");

// requirements:
/*
The user will be prompted for a favorite color, which will be used as the background color for cards.
The PDF will be populated with the following:
Profile image
User name
Links to the following:
    User location via Google Maps
    User GitHub profile
    User blog
    User bio
Number of public repositories
Number of followers
Number of GitHub stars
Number of users following

Minimum Requirements:
Functional, deployed application.
GitHub repository with a unique name and a README describing project.
The application generates a PDF resume from the user provided GitHub profile.
The generated resume includes a bio image from the user's GitHub profile.
The generated resume includes the user's location and a link to their GitHub profile.
The generated resume includes the number of: public repositories, followers, GitHub stars and following count.
The background color of the generated PDF matches the color that the user provides.
*/

inquirer
  .prompt([
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
  ])
  .then(function(response) {
    const color = response.color;
    axios
      .get(`https://api.github.com/users/${response.username}`)
      .then(res => {
        const username = res.data.login;
        const profile = res.data.html_url;
        const followers = res.data.followers_url;
        const bio = res.data.bio;
        const pic = res.data.html_url + ".png";
        // console.log(res.data);
        console.log(profile);
        console.log(followers);
        console.log(bio);
        console.log(pic);

        const page = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
                <style>
                    body {
                        background-color: ${color};
                        color: white;
                    }
                    a {
                        text-decoration: none;
                        color: white;
                    }
                </style>
            </head>
            <body>
            <h1>${username}</h1>
            <img src='${pic}'>
            <ul>
                <li><a href='${profile}' target='_blank'>GitHub Profile</a></li>
            </ul>
            </body>
            </html>
            `;
        fs.writeFile("index.html", page, err => {
          if (err) throw err;
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
