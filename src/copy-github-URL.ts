import * as child_process from "child_process";
import * as url from "url";

export function copyGithubURL(args: {
    execGitCommand: (rootDir: string) => string,
    copy: (url: string) => void,
    rootDir: string,
    filePath: string,
    line: { start: number, end: number },
    showInformationMessage: (message: string) => void,
}) {

    const stdout = args.execGitCommand(args.rootDir);

    const p = parseStdout(stdout);
    if (!p) {
        return;
    }

    const url = buildGithubURL({
        commit: p.sha1,
        domain: p.domain,
        filePath: args.filePath,
        line: args.line,
        repository: p.repository,
    });
    if (!url) {
        return;
    }
    args.copy(url);
    args.showInformationMessage("copy! " + url);
}

export function buildGithubURL(args: {
    "domain": string,
    "commit": string,
    "repository": string,
    "filePath": string,
    "line": { start: number, end: number },
}) {

    const L = args.line.start === args.line.end ? `L${args.line.start}` : `L${args.line.start}-L${args.line.end}`;
    const u = url.parse(`https://${args.domain}/${args.repository}/blob/${args.commit}/${args.filePath}/#${L}`);
    return u.href;
}

export function parseStdout(stdout: string) {

    const ret = {sha1: "", domain: "", repository: ""};

    const sha1 = stdout.match(/^([a-z0-9]{40})$/m);
    if (sha1 !== null && sha1[1]) {
        ret.sha1 = sha1[1];
    } else {
        return null;
    }

    const isHTTP = stdout.match(/^origin\s+https(.*)\s+\(fetch\)$/m);

    if (isHTTP) {
        const m = stdout.match(/^origin\s+https?:\/\/([^\/]+)\/(.*)\.git\s+\(fetch\)$/m);

        if (m !== null && m[0] && m[1] && m[2]) {
            ret.domain = m[1];
            ret.repository = m[2];
            return ret;
        } else {
            return null;
        }

    } else {
        const m = stdout.match(/^origin(.*)@(.*):(.*)\.git\s+\(fetch\)$/m);

        if (m !== null && m[0] && m[1] && m[2] && m[3]) {
            ret.domain = m[2];
            ret.repository = m[3];
            return ret;
        } else {
            return null;
        }
    }
}

export function execGitCommand(rootDir: string): string {

    const out = child_process.execSync(`cd ${rootDir}; git remote -v; git rev-parse HEAD`).toString();
    return out;
}
