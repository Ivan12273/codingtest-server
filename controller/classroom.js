'use strict'

const fetch = require('node-fetch');
const atob = require('atob');

var controller = {

    getAllResults: function(req, res) {
        var classroom = 'https://api.github.com/orgs/servicioSocialUady';
        var apiReps = 'https://api.github.com/repos/servicioSocialUady/sample-assignment-individual-';

        fetch(classroom + '/members').then((res)=> {
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
        let params = req.body;

        const organization = params.organization;
        const assignment = params.assignment;
        const student = params.student;
        const problemAlias = params.problemAlias; // 'Fibonacci-Primo' 'MCD-Euclides'
        const language = params.language; // 'java' 'c11-gcc'
        const executionTime = params.executionTime;

        getStudentCode(student, organization, assignment)
        .then((codigo)=> {
            const usernameOrEmail = 'd.a.alvarez.ramirez';
            const password = 'qwertypoiu';
            
            startSessionOnOmegaUp(usernameOrEmail, password)
            .then((json)=> {
                const source = codigo;
                const userToken = json.auth_token;

                testingWithOmegaUp(problemAlias, language, source, userToken)
                .then(()=> {

                    async function waitFunction() {

                        userResult(problemAlias, userToken)
                        .then((json)=> {
                            
                            return res.status(200).send({
                                score: json.score
                            });
                        });
                    }
                    setTimeout(waitFunction, executionTime);
                });
            });
        });
    }
};

// GITHUB
// DETALLE IMPORTANTE: Tanto los repositorios como la visibilidad del usuario en la organización deben ser públicos 
function getStudentCode(student, organization, assignment) {
    assignment = assignment.toLowerCase();
    assignment = assignment.replace(/\ /g, '-'); 
    const urlStudentRep = 'https://api.github.com/repos/'+ organization + '/' + assignment + '-';

    return fetch(urlStudentRep + student + "/contents").then((res)=> {
        return res.json();
    }).then((json)=> {
        let urlStudentGit;
        let extension;
        json.forEach((element) => {
            extension = element.name.split('.').pop();
            if(extension == "java") { // language
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

// OMEGAUP
function startSessionOnOmegaUp(usernameOrEmail, password) {
    const urlUserLogin = 'https://omegaup.com/api/user/login?';

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

function testingWithOmegaUp(problemAlias, language, source, userToken) {
    const urlRunCreate = 'https://omegaup.com/api/run/create?';
    let sourceURI = encodeURIComponent(source); 

    return fetch(urlRunCreate
        +'problem_alias='+ problemAlias
        +'&language='+ language
        +'&source='+ sourceURI
        +'&ouat='+ userToken, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
    });
}

function userResult(problemAlias, userToken) {
    const urlProblemDetails = 'https://omegaup.com/api/problem/details?problem_alias=' + problemAlias + '&ouat='+ userToken;

    return fetch(urlProblemDetails, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
    })
    .then((response)=> {
        return response.json();
    });
}

module.exports = controller;