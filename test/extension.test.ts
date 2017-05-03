import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

suite("Extension Tests", () => {

    test("buildGithubURL", () => {

        assert.equal("https://github.com/t-mrt/gocha/blob/aaaa//t/test.t/#L2-L3", myExtension.buildGithubURL({
            domain:"github.com",
            commit: "aaaa", 
            repository: "t-mrt/gocha",
            filePath: "/t/test.t", 
            line: {start: 2, end: 3}
        }));
    });


    test("parseGitRemoteStdout", () => {
        assert.deepEqual({
            domain: 'github.com',
            repository: 't-mrt/gocha',
            sha1: "54c5e13a35ea88bd914284b99254e32afb34672d",
        }, myExtension.parseStdout(`
origin  git@github.com:t-mrt/gocha.git (fetch)
origin  git@github.com:t-mrt/gocha.git (push)
54c5e13a35ea88bd914284b99254e32afb34672d
`));

        assert.equal(null, myExtension.parseStdout(''));
    });

});