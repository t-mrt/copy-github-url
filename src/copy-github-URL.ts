import * as child_process from 'child_process';
import * as fs from 'fs';
import * as url from "url";
import * as cp from 'copy-paste';

export function copyGithubURL(args: {
    execGitCommand: (rootDir: string) => string,
    copy: (url: string) => void,
    rootDir: string,
    filePath: string,
    line: { start: number, end: number },
    showInformationMessage: (message: string) => void,
}) {

    let stdout = args.execGitCommand(args.rootDir);

    let p = parseStdout(stdout);
    if (!p) {
        return
    }

    let url = buildGithubURL({
        domain: p.domain,
        commit: p.sha1,
        repository: p.repository,
        filePath: args.filePath,
        line: args.line
    })
    if (!url) {
        return
    }
    args.copy(url);
    args.showInformationMessage("copy! " + url);
}

export function buildGithubURL(args: {
    "domain": string,
    "commit": string,
    "repository": string,
    "filePath": string,
    "line": { start: number, end: number }
}) {

    let L = args.line.start === args.line.end ? `L${args.line.start}` : `L${args.line.start}-L${args.line.end}`
    let u = url.parse(`https://${args.domain}/${args.repository}/blob/${args.commit}/${args.filePath}/#${L}`);
    return u.href
}

export function parseStdout(stdout: string) {

    let m = stdout.match(/^origin(.*)@(.*):(.*)\.git\s\(fetch\)$/m);
    let sha1 = stdout.match(/^([a-z0-9]{40})$/m);

    if (sha1 !== null && sha1[1] && m !== null && m[0] && m[1] && m[2] && m[3]) {
        return { domain: m![2], repository: m![3], sha1: sha1[1] }
    } else {
        return null
    }
}

export function execGitCommand(rootDir: string): string {

    let stdoutOrNull = null;
    let out = child_process.execSync(`cd ${rootDir}; git remote -v; git rev-parse HEAD`).toString();
    return out;
}