'use strict'

const fetch = require('node-fetch');

var controller = {

    test: function(req, res) {
        const urlUserLogin = 'https://omegaup.com/api/user/login?';
        const urlRunCreate = 'https://omegaup.com/api/run/create?';
        const usernameOrEmail = 'd.a.alvarez.ramirez';
        const password = 'qwertypoiu';
        
        fetch(urlUserLogin
                +'usernameOrEmail='+ usernameOrEmail 
                +'&password='+ password, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then((json)=> {
            const problemAlias = 'MCD-Euclides';
            const contestAlias = 'LAAP_OMI_LMY_';
            const language = 'c11-gcc';
            const source = 'solution';
            const userToken = json.auth_token;

            return fetch(urlRunCreate
                        +'problem_alias='+ problemAlias
                        +'&contest_alias='+ contestAlias
                        +'&language='+ language
                        +'&source='+ source
                        +'&ouat='+ userToken, {
                    method: 'post',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                });
            }).then((response)=> {
                return response.json();
            }).then((json)=> {
                return res.status(200).send({
                    json
                });
            });
        

        /*
        const problemAlias = 'MCD-Euclides';
        const contestAlias = 'LAAP_OMI_LMY_';
        const language = 'c11-gcc';
        const source = 'solution';
        const token = '9abb386f934e66edbb35231b619a9e-135458-835b29128e8a5272f6d883c4531c817e465cb6f665a3a2e4c9de9da782815edc';

        fetch('https://omegaup.com/api/run/create?'
                +'problem_alias='+problemAlias
                +'&contest_alias='+contestAlias
                +'&language='+language
                +'&source='+source
                +'&ouat='+token, {
            method: 'post',
            headers: { 
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(json => console.log(json));
        */

    }

};

module.exports = controller;