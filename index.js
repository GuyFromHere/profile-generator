const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const generateHTML = require('./generateHTML.js')

const questions = [{
        type: "input",
        message: "What is your GitHub username?",
        name: "username"
    },
    {
        type: "input",
        message: "What is your favorite color?",
        name: "color"
    }
]

const getRepos = function (url) {
    axios.get(url).then(res => {
            let x = 0;
            /* res.data.forEach(item =>
                x += item.watchers
            ) */
            res.data.forEach(element => {
                console.log(element.name);
                console.log(element.watchers);
                x += element.watchers;
            });
            console.log('x = ' + x)
            return x;
        })
        .catch(err =>
            console.log(err))
}

inquirer
    .prompt(questions)
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
                    name: res.data.name,
                    username: res.data.login,
                    profile: res.data.html_url,
                    followers: res.data.followers,
                    following: res.data.following,
                    starred: res.data.starred_url,
                    bio: res.data.bio,
                    pic: res.data.html_url + ".png",
                    company: res.data.company,
                    blog: res.data.blog,
                    publicRepos: res.data.public_repos
                }
                //console.log(res);
                let stars = getRepos('https://api.github.com/users/GuyFromHere/repos')
                console.log('stars = ' + stars)
                const newPage = generateHTML.generateHTML(getData)
                fs.writeFile("index.html", newPage, err => {
                    if (err) throw err;
                });
            })
            .catch(err => {
                console.log(err);
            });
    });