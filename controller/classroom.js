'use strict'

const fetch = require('node-fetch');
const atob = require('atob');

var controller = {

    getAllResults: function(req, res) {
        var classroom = "https://api.github.com/orgs/servicioSocialUady";
        var apiReps = "https://api.github.com/repos/servicioSocialUady/sample-assignment-individual-";

        fetch(classroom + "/members").then((res)=> {
                return res.json();
            }).then((json)=>{
                let students = new Array();
                json.forEach(element => {
                    students.push(element.login);
                });
                return students;
            }).then((students)=>{
                return res.status(200).send({
                    students
                });

            });
    },

    validateCode: function(req, res) {
        const urlStudentRep = "https://api.github.com/repos/servicioSocialUady/sample-assignment-individual-";
        const student = req.params.student;

        fetch(urlStudentRep + student + "/contents").then((res)=> {
                return res.json();
            }).then((json)=> {
                let urlStudentGit;
                let extension;
                json.forEach((element) => {
                    extension = element.name.split('.').pop();
                    if(extension == "java") {
                        urlStudentGit = element.git_url
                    }
                });
                return fetch(urlStudentGit);
            }).then((response)=> {
                return response.json();
            }).then((response)=> {
                let codigo = atob(response.content);
                return res.status(200).send({
                    codigo
                });
            });
    }

};

function omegaUpValidator() {
    console.log("hello");
}

module.exports = controller;