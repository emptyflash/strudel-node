import * as WebAudio from 'node-web-audio-api';
Object.assign(global, WebAudio)

import { controls, repl, evalScope } from '@strudel/core';
import { samples, getAudioContext, webaudioOutput, initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import readline from 'readline';

//process.env['WEB_AUDIO_LATENCY'] = 'playback';
const ctx = getAudioContext();

const { evaluate } = repl({
  defaultOutput: webaudioOutput,
  getTime: () => ctx.currentTime,
  transpiler,
});

await evalScope(
  controls,
  import('@strudel/mini/dist/index.mjs'),
  import('@strudel/webaudio/dist/index.mjs'),
);

await samples('github:tidalcycles/Dirt-Samples/master')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("close", function() {
    process.exit(0);
});

function prompt() {
    rl.question("strudel> ", (code) => {
        if (code) {
            try {
                evaluate(code);
            } catch (e) {
                console.error(e);
            }
        }
        prompt();
    });
}

prompt();
