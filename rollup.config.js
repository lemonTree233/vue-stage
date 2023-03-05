import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
export default {
    input: './src/index.js',
    output: {
        file: './dist/vue.js',  //出口
        name: 'Vue',
        format: 'umd', //esm es6 commonjs iife自执行函数 umd
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        resolve()
    ]
}