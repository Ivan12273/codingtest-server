'use strict'

const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
const atob = require('atob');
const fs = require('fs');                        //dependencia de prueba
//var fileupload = require('express-fileupload');


var FormData = require('form-data');

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
    
    calification: function(req, res) {
        let params = req.params; //cambiarlo a parametros

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
        const alias = params.alias;
        const source = params.source;
        const isPublic = params.isPublic;
        const validator = params.validator;
        const timeLimit = params.timeLimit;
        // const memoryLimit = params.memoryLimit;      //parece ser opcional
        // const order = params.order;                  //parece ser opcional
        const problemContents = req.files.problemContents;

        console.log(req.files.problemContents);                
        const problemContents = req.file;                                                                                 

        const usernameOrEmail = 'd.a.alvarez.ramirez';
        const password = 'qwertypoiu';                

        startSessionOnOmegaUp(usernameOrEmail, password)
        .then((json)=> {
            const userToken = json.auth_token;
            
            async function waitFunction(){

                createProblemOnOmegaUp(authorUsername, title, alias, source, isPublic, validator, timeLimit, problemContents, userToken)
                .then((json)=> {                                
                    
                    return res.status(200).send({
                        status: json.status,
                        uploaded_files: json.uploaded_files                    
                    });                
                });
            }
            setTimeout(waitFunction, 2000);               
        });                
    }
};

// GITHUB
// DETALLE IMPORTANTE: Tanto los repositorios como la visibilidad del usuario en la organización deben ser públicos 
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
    // let sourceURI = encodeURIComponent(source); 
    
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

    var formData = new FormData();          

    formData.append('author_username', authorUsername);    
    formData.append('title', title);    
    formData.append('problem_alias', alias);    
    formData.append('source', source);    
    formData.append('public', isPublic);    
    formData.append('validator', validator);    
    formData.append('time_limit', timeLimit);    
    formData.append('problem_contents', problemContents);
    //formData.append('problem_contents', fs.createReadStream('/uploads/' + problemContents.filename + '.zip'));
    formData.append('ouat', userToken);

    return fetch(urlProblemCreate ,{                
        method: 'post', 
        body: formData,        
    })
    .then((response) => {        
        return response.json();                
    })
    .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });    
}

module.exports = controller;