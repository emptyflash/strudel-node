import { AudioContext } from 'node-web-audio-api';
global.AudioContext = AudioContext

import { controls, repl, evalScope } from '@strudel.cycles/core/dist/index.mjs';
import { samples, getAudioContext, webaudioOutput, initAudioOnFirstClick } from '@strudel.cycles/webaudio/dist/index.mjs';
import { transpiler } from '@strudel.cycles/transpiler/dist/index.mjs';
import readline from 'readline';

process.env['WEB_AUDIO_LATENCY'] = 'playback';
const ctx = getAudioContext();

const { evaluate } = repl({
  defaultOutput: webaudioOutput,
  getTime: () => ctx.currentTime,
  transpiler,
});

await evalScope(
  controls,
  import('@strudel.cycles/mini/dist/index.mjs'),
  import('@strudel.cycles/webaudio/dist/index.mjs'),
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
