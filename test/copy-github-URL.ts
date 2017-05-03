import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../src/copy-github-url';

suite("copyGithubUR", () => {

    test("correct message", () => {
        const stdout = `
origin  git@github.com:t-mrt/copy-github-url.git (fetch)
origin  git@github.com:t-mrt/copy-github-url.git (push)
7332779b314e5aed7496bbacda35514655ef6399
`
        let message;

        myExtension.copyGithubURL({
            execGitCommand: (rootDir: string) => { return stdout },
            copy: (url: string) => { },
            rootDir: "/User/test/test",
            filePath: "test/test/test.pl",
            line: {
                start: 2,
                end: 5
            },
            showInformationMessage: (m: string) => { message = m }
        });
        assert.equal("copy! https://github.com/t-mrt/copy-github-url/blob/7332779b314e5aed7496bbacda35514655ef6399/test/test/test.pl/#L2-L5", message);
    });
});

suite("buildGithubURL", () => {

    test("multi line", () => {

        assert.equal("https://github.com/t-mrt/copy-github-url/blob/7332779b314e5aed7496bbacda35514655ef6399//t/test.t/#L2-L3", myExtension.buildGithubURL({
            domain: "github.com",
            commit: "7332779b314e5aed7496bbacda35514655ef6399",
            repository: "t-mrt/copy-github-url",
            filePath: "/t/test.t",
            line: { start: 2, end: 3 }
        }));
    });

    test("single line", () => {


        assert.equal("https://github.com/t-mrt/copy-github-url/blob/7332779b314e5aed7496bbacda35514655ef6399//t/test.t/#L2", myExtension.buildGithubURL({
            domain: "github.com",
            commit: "7332779b314e5aed7496bbacda35514655ef6399",
            repository: "t-mrt/copy-github-url",
            filePath: "/t/test.t",
            line: { start: 2, end: 2 }
        }));

    });

});


suite("parseGitRemoteStdout", () => {

    test("git protocol", () => {
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

        test("https protocol", () => {
        assert.deepEqual({
            domain: 'github.com',
            repository: 't-mrt/gocha',
            sha1: "54c5e13a35ea88bd914284b99254e32afb34672d",
        }, myExtension.parseStdout(`
origin  https://github.com/t-mrt/gocha.git (fetch)
origin  https://github.com/t-mrt/gocha.git (push)
54c5e13a35ea88bd914284b99254e32afb34672d
`));

        assert.equal(null, myExtension.parseStdout(''));
    });


});