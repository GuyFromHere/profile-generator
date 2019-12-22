const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const page = require('./page.js').page;
//const generateHTML = require('./generateHTML.js')

inquirer
    .prompt([{
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
        /* const color = response.color; */
        const color = 'red';
        axios
            //.get(`https://api.github.com/users/${response.username}`)
            .get(`https://api.github.com/users/guyfromhere`)
            .then(res => {
                /* const getData = {
                    color: 'red',
                    username: 'GuyFromHere',
                    profile: 'https://github.com/GuyFromHere',
                    followers: 'https://api.github.com/users/GuyFromHere/followers',
                    bio: 'IT guy and aspiring web developer. Currently enrolled in UO\'s Full Stack Coding Bootcamp.',
                    pic: 'https://github.com/GuyFromHere.png'
                } */
                const getData = {
                    color: color,
                    username: res.data.login,
                    profile: res.data.html_url,
                    followers: res.data.followers_url,
                    bio: res.data.bio,
                    pic: res.data.html_url + ".png"
                }
                console.log(getData);

                const newPage = page(getData)
                fs.writeFile("index.html", newPage, err => {
                    if (err) throw err;
                });
            })
            .catch(err => {
                console.log(err);
            });
    });