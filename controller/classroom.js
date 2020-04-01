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

        getStudentCode(urlStudentRep, student)
        .then((codigo)=> {
            const urlUserLogin = 'https://omegaup.com/api/user/login?';
            const usernameOrEmail = 'd.a.alvarez.ramirez';
            const password = 'qwertypoiu';
            
            startSessionWithOmegaUp(urlUserLogin, usernameOrEmail, password)
            .then((json)=> {
                const urlRunCreate = 'https://omegaup.com/api/run/create?';
                const problemAlias = 'MCD-Euclides';
                const language = 'c11-gcc';
                const source = codigo;
                const userToken = json.auth_token;
    
                testingWithOmegaUp(urlRunCreate, problemAlias, language, source, userToken)
                .then((json)=> {
                    return res.status(200).send({
                        json
                    });
                });
            });
        });

    }

};

// CONSULTAS A GITHUB Y A OMEGAUP

function getStudentCode(urlStudentRep, student) {
    return fetch(urlStudentRep + student + "/contents").then((res)=> {
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
        return codigo;
    });
}

function startSessionWithOmegaUp(urlUserLogin, usernameOrEmail, password) {
    return fetch(urlUserLogin
        +'usernameOrEmail='+ usernameOrEmail 
        +'&password='+ password, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
    })
    .then((res)=> {
        return res.json();
    });
 }

function testingWithOmegaUp(urlRunCreate, problemAlias, language, source, userToken) {
    return fetch(urlRunCreate
                +'problem_alias='+ problemAlias
                +'&language='+ language
                +'&source='+ source
                +'&ouat='+ userToken, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
    })
    .then((response)=> {
        return response.json();
    });
}

module.exports = controller;