import {spawnSync} from 'child_process'


export function exe(yamlPath: string) {
    spawnSync('kubectl', ['create', '-f', yamlPath]);
}