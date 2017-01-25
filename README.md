# gulp-i18n-lint

> A [gulp](http://gulpjs.com/) plugin that lints your templates for hardcoded texts

## Installation

[Use npm](https://docs.npmjs.com/cli/install).

```sh
npm install gulp-i18n-lint
```

## Usage

```javascript
const gulp = require('gulp');
const i18nLint = require('gulp-i18n-lint');

gulp.task('i18n-lint', () => {
    return gulp.src(['**/*.html'])
        .pipe(i18nLint())
        .pipe(i18nLint.reporter());
});
