import path from 'path';
import fg from 'fast-glob';
import replaceInFile from 'replace-in-file';
import fs from 'fs/promises';
import fsx from 'fs-extra';
import less from 'less';

const pkgPath = path.resolve(__dirname, '..');
const distDir = path.resolve(__dirname, './dist');
const matchDir = `${pkgPath}/(extension-*|theme)`;

let lessFiles = [];

/**
 * 查找所有 less 文件
 */
async function findAndCopyLessFiles() {
  const packages = await fg([matchDir], { onlyDirectories: true });
  for (const pkg of packages) {
    const files = await fg([`${pkg}/src/**/*.less`], {
      onlyFiles: true,
    });
    lessFiles = [...lessFiles, ...files];
  }

  for (const f of lessFiles) {
    const distFile = path.resolve(distDir, path.basename(f));
    // 复制到 dist
    await fsx.copy(f, distFile);
  }
}

/**
 * 替换 @import
 */
async function replaceImport() {
  const options = {
    files: `${distDir}/*.less`,
    from: new RegExp('^@import.+', 'g'),
    to: '',
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await replaceInFile(options);
}

/**
 * 生成 bundled.less
 */
async function generateBundledFile() {
  const fileNames = lessFiles.map((f) => path.basename(f));
  const compareFn = (a, b) => {
    if (a.indexOf('variable.less') > -1) {
      return -1;
    }
    if (b.indexOf('variable.less') > -1) {
      return 1;
    }
    return 0;
  };

  const content = fileNames.sort(compareFn).reduce((acc, cur) => {
    return acc + `@import "./${cur}";` + '\r\n';
  }, '');

  await fsx.outputFile(`${distDir}/bundled.less`, content);
}

/**
 * 生成 extensions.less
 */
async function generateExtensionsFile() {
  const fileNames = lessFiles
    .map((f) => path.basename(f))
    .filter((f) => f !== 'variable.less');

  const content = fileNames.reduce((acc, cur) => {
    return acc + `@import "./${cur}";` + '\r\n';
  }, '');

  await fsx.outputFile(`${distDir}/extensions.less`, content);
}

/**
 * 编译出 css
 */
async function compile() {
  const compileFiles = ['bundled', 'variable'];
  for (const filename of compileFiles) {
    const lessContent = await fs.readFile(`${distDir}/${filename}.less`, {
      encoding: 'utf-8',
    });
    const code = await less.render(lessContent, {
      paths: [distDir],
    });
    await fsx.outputFile(`${distDir}/${filename}.css`, code.css);
  }
}

async function buildLess() {
  await findAndCopyLessFiles();
  await replaceImport();
  await generateBundledFile();
  await generateExtensionsFile();
  await compile();
}

buildLess().catch((e) => {
  console.log(e);
});
