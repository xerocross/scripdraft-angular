# ScripDraft

ScripDraft is a widget for typing text, such as an email, with an
undo/redo system inspired by Git commits, though much simpler. The 
idea is just that you can *choose* the snapshots at which you 
want to be able to browse backward and then forward again. My imagined
use of this app is for someone who is agonizing over writing exactly 
the right email to his boss or something like that.


## Technology and Background

ScripDraft is a one-man Angular 2+ project I wrote mainly circa 2021 in 
TypeScript. I used the Angular CLI to bootstrap the app. It does not have a backend service for storage. At the time I wrote this, I was still primarily
if not exclusively a frontend developer. Therefore, it uses the
browser's local storage, which means you cannot access your texts
from other devices. On the plus side, there is no registering or signing in.

I used the technology stack suggested/imposed by the Angular CLI since
this was one of my first Angular 2+ projects.

## Draft-React

Compare this app with my other app https://github.com/xerocross/draft-react. Draft-react is simpler and older, and it is built on React/Redux.


## Code Inspection Circa 2023

It's June 2023 and I'm reviewing this code I wrote in 2021. I see
imperfections, but I will probably leave this code as-is as a museum
piece. It works, and nothing about it is particularly 
embarrassing given the time it was written.

I don't really remember my motivations for the choices I made in this
app. If you examine the code, you will find that I did not use a global
state engine like Redux. Instead, each component individually manages state at its own level of granularity.

## Angular CLI Boilerplate 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.10.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
