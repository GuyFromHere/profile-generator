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
    .then(function (response) {
        const color = response.color;
        axios
            .get(`https://api.github.com/users/${response.username}`)
            .then(res => {
                const username = res.data.login;
                const profile = res.data.html_url;
                const followers = res.data.followers_url;
                const bio = res.data.bio;
                const pic = res.data.html_url + ".png";
                console.log(res.data);

                const page = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>${username}</title>
      <style>
          body {
              font-family: "Noto Sans, sans-serif";
          }
  
          .highlight {
              background-color: ${color};
              color: white;
              text-align: center;
              border-radius: 2rem;
              font-family: "Noto Sans, sans-serif";
          }
  
          .headerContainer {
              background-color: grey;
          }
  
          .header {
              /* position: relative; */
              /* font-family: "Noto Sans, sans-serif"; */
              display: flex;
              flex-direction: row;
              /* width: 80%; */
              /* right: 20%; */
              /*  bottom: 20%; */
              overflow: hidden;
              padding: 30px;
              border-radius: 2rem;
          }
  
          .imageContainer {
              position: relative;
              border-radius: 50%;
              /* left: -30%; */
              /* overflow: hidden; */
              /* text-align: center; */
          }
  
          #profilePic {
              border: 2px solid white;
              width: 300px;
              border-radius: 50%;
          }
  
          a {
              text-decoration: none;
              color: black;
          }
  
          li {
              float: left;
              list-style-type: none;
              padding: 5px;
              color: black;
          }
  
  
          .row {
              display: flex;
              flex-direction: row;
              /* margin: auto 0; */
          }
  
          .card {
              height: 100px;
              width: 200px;
              border: 1px solid white;
              border-radius: 5px;
              padding: 20px;
              margin: 10px;
          }
      </style>
  </head>
  
  <body>
  
      <div class="headerContainer">
          <div class="highlight header">
              <div class="imageContainer">
                  <img width="128" id="profilePic" src="${pic}" />
                  <ul class="headerLinks">
                      <li>Location</li>
                      <li>
                          <a href="${profile}" target="_blank">GitHub Profile</a>
                      </li>
                      <li>Blog</li>
                  </ul>
              </div>
              <div>
                  <h1>${username}</h1>
                  <h4>Status here</h4>
                  <span class="bio">${bio}</span>
              </div>
              <div class="main">
  
                  <div class="row">
                      <div class="highlight card">GitHub Repositories</div>
                      <div class="highlight card">GitHub Stars</div>
                  </div>
                  <div class="row">
                      <div class="highlight card"><a href="${followers}" target="_blank">Followers</a></div>
                      <div class="highlight card">Following</div>
                  </div>
              </div>
          </div>
      </div>
  
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


