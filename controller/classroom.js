'use strict'

const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const atob = require('atob');
const fs = require('fs');

var FormData = require('form-data');

var controller = {
   
    calification: function(req, res) {
        let params = req.params;

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
    },

    problem: function(req, res) {
        let params = req.params;

        const student = params.student;
        const organization = params.organization;
        const assignment = params.assignment;

        getProblemInstructions(student, organization, assignment)
        .then((response)=> {
            return res.status(200).send({
                instructions: response
            });
        });
    },

    createProblem: function(req, res) {
        const params = req.body;

        const authorUsername = params.authorUsername;
        const title = params.title;
        const alias = params.problem_alias;
        const source = params.source;
        const isPublic = params.isPublic;
        const validator = params.validator;
        const timeLimit = params.timeLimit;
        // const memoryLimit = params.memoryLimit;      //parece ser opcional
        // const order = params.order;                  //parece ser opcional
        const problemContents = req.file;

        console.log(req.file);                
        //const problemContents = req.file;                                                                                 

        const usernameOrEmail = 'd.a.alvarez.ramirez';
        const password = 'qwertypoiu';
        
        startSessionOnOmegaUp(usernameOrEmail, password)
        .then((json)=> {
            const userToken = json.auth_token;
            
                createProblemOnOmegaUp(authorUsername, title, alias, source, isPublic, validator, timeLimit, problemContents, userToken)
                .then((json)=> {                                
                    
                    return res.status(200).send({
                        json                   
                    });                
                });      
        });                
    }
};

// GITHUB
// DETALLE IMPORTANTE: Tanto los repositorios como la visibilidad del usuario en la organización deben ser públicos 
// Esto debe sustituirse para que entre sin necesidad de cambiar la visibilidad a público
// Para mas información:
function getStudentCode(student, organization, assignment) {
    assignment = assignment.toLowerCase();
    assignment = assignment.replace(/\ /g, '-'); 
    const urlStudentRep = 'https://api.github.com/repos/' + organization + '/' + assignment + '-';

    return fetch(urlStudentRep + student + '/contents').then((res)=> {
        return res.json();
    }).then((json)=> {
        let urlStudentGit;
        let extension;
        json.forEach((element) => {
            extension = element.name.split('.').pop();
            if(extension == 'java') { // language
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

function getProblemInstructions(user, organization, assignment) {
    assignment = assignment.toLowerCase();
    assignment = assignment.replace(/\ /g, '-');
    const urlProblemReadme = 'https://api.github.com/repos/' + organization + '/' + assignment + '-';

    return fetch(urlProblemReadme + user + '/contents/README.md').then((res)=> {
        return res.json();
    }).then((response)=> {
        let instructions = atob(response.content);
        return instructions;
    });

}

// OMEGAUP
function startSessionOnOmegaUp(usernameOrEmail, password) {
    const urlUserLogin = 'https://omegaup.com/api/user/login';
    
    const params = new URLSearchParams();
    params.append('usernameOrEmail', usernameOrEmail);
    params.append('password', password);

    return fetch(urlUserLogin, {
        method: 'post',
        body: params,
    })
    .then((res)=> {
        return res.json();
    });
 }

function testingWithOmegaUp(problemAlias, language, source, userToken) {
    const urlRunCreate = 'https://omegaup.com/api/run/create';
    
    const params = new URLSearchParams();
    params.append('problem_alias', problemAlias);
    params.append('language', language);
    params.append('source', source);
    params.append('ouat', userToken);

    return fetch(urlRunCreate, {
        method: 'post',
        body: params,
    });
}

function userResult(problemAlias, userToken) {
    const urlProblemDetails = 'https://omegaup.com/api/problem/details';

    const params = new URLSearchParams();
    params.append('problem_alias', problemAlias);
    params.append('ouat', userToken);

    return fetch(urlProblemDetails, {
            method: 'post',
            body: params,
    })
    .then((response)=> {
        return response.json();
    });
}


function createProblemOnOmegaUp(authorUsername, title, alias, source, isPublic, validator, timeLimit, problemContents, userToken){
    const urlProblemCreate = 'https://omegaup.com/api/problem/create';

    var formdata = new URLSearchParams();

    formdata.append("author_username", authorUsername);
    formdata.append("title", title);
    formdata.append("problem_alias", alias);
    formdata.append("source", source);
    formdata.append("public", isPublic);
    formdata.append("validator", validator);
    formdata.append("time_limit", timeLimit);
    formdata.append("problem_contents", problemContents, "uploads/1dbac6ea4989f2366ff972a9118f196e");
    formdata.append("ouat", userToken);
    
    console.log(userToken);

    return fetch(urlProblemCreate, {
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',
            'auth_token': userToken,
            'Cookie': 'ouat=' + userToken
        },
        body: formdata,
    })
    .then((response)=> {
        return response.json();
    });
}

module.exports = controller;