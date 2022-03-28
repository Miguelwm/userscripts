// ==UserScript==
// @name         Close all tasks in view
// @namespace    https://github.com/Miguelwm
// @version      0.1
// @description  Simple userscript that closes all tasks in view
// @author       Mikasonwar
// @match        *://wmproject.cityfy.pt/sprints*
// @icon         https://github.com/Miguelwm/Miguelwm/raw/main/img/logo_wm.jpg
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const closeTasks = () => { $(".days .task .close_task a").each(function() {this.click();}) };
  let btn = document.createElement("button");
  btn.innerHTML = "(Custom) Fechar Todas as tarefas";
  btn.className = "btn btn-primary";
  btn.style = "float: right;";
  btn.onclick = closeTasks;
  $(".task_labels.well").append(btn);
})();