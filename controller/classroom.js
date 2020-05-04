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
        const student = req.params.student;

        getStudentCode(student)
        .then((codigo)=> {
            const usernameOrEmail = 'd.a.alvarez.ramirez';
            const password = 'qwertypoiu';
            
            startSessionOnOmegaUp(usernameOrEmail, password)
            .then((json)=> {
                const problemAlias = 'Fibonacci-Primo'; //'MCD-Euclides'
                const language = 'java'; //'c11-gcc'
                const source = codigo;
                const userToken = json.auth_token;

                testingWithOmegaUp(problemAlias, language, source, userToken)
                .then((json)=> {
                    return res.status(200).send({
                        score: json.score
                    });
                });
            });
        });

    }

};

// CONSULTAS A GITHUB Y A OMEGAUP

// GITHUB
function getStudentCode(student) {
    const urlStudentRep = "https://api.github.com/repos/servicioSocialUady/sample-assignment-individual-";

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
    //source = source.replace(/\&/g, "%26"); // Error con el caracter &, solución temporal
    //source = source.replace(/\+/g, "%2B"); // Error con el caracter +, solución temporal

    let sourceURI = encodeURIComponent(source); // Esta función reemplaza todos los caracteres reservados

    console.log(sourceURI);

    return fetch(urlRunCreate
        +'problem_alias='+ problemAlias
        +'&language='+ language
        +'&source='+ sourceURI
        +'&ouat='+ userToken, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    })
    .then((response)=> {
        return response.json();
    }).then(()=> { //response
        //return response.json();
        const urlProblemDetails = 'https://omegaup.com/api/problem/details?problem_alias=' + problemAlias + '&ouat='+ userToken;
        return fetch(urlProblemDetails, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
        })
        .then((response)=> {
            return response.json();
        });
    });

    /*
    const body = {
        problem_alias: problemAliasR,
        language: languageR,
        source: sourceR,
        ouat: userTokenR
    }

    return fetch(urlRunCreate, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
    })
    .then((response)=> {
        return response.json();
    });
    */
}

module.exports = controller;