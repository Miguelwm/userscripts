// ==UserScript==
// @name         Quickly make a weekly summary
// @namespace    https://github.com/Miguelwm
// @version      0.1
// @description  Simple userscript quickly makes a weekly summary
// @author       Mikasonwar
// @match        *://wmproject.cityfy.pt/sprints*
// @icon         https://github.com/Miguelwm/Miguelwm/raw/main/img/logo_wm.jpg
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  let $ = window.jQuery;

  function createResultDiv() {
    let div = document.createElement("div");
    div.className = "";
    div.style = "margin: 10px;";
    $(".task_labels.well").parent().append(div);
    return div;
  }

  function parseTasks() {
    return $(".days .task").map(function() {
      let task = {};
      let $this = $(this);
      // Title, Operational Area, Project, Customer
      task.title = $this.find(".title > a").attr("data-original-title");
      let project = $this.find(".project").text();

      project = project.split("|").map((s) => s.trim());

      task.operational_area = project[0];
      task.client = project[1];
      task.project = project.slice(2).join(' | ');

      if(['WM','IDI','Operacional'].includes(task.operational_area)) {
        switch(task.operational_area) {
          case 'WM':
            task.operational_area = 'Geral';
            break;
          case 'IDI':
            task.operational_area = task.project;
            break;
          case 'Operacional':
            task.operational_area = task.project;
            break;
        }
      }

      if(task.operational_area.toLowerCase().substring(0,4) == 'wire') {
        task.operational_area = task.operational_area.substring(4);
      }

      return task;
    }).toArray()
      .filter(t => t.title !== undefined); // Remove tasks without title
  }

  function isTaskEqual(task1, task2) {
    let attrs = ['title','operational_area', 'client', 'project'];
    return attrs.every((attr) => {
      return task1[attr] == task2[attr];
    })
  }

  function parseSummary() {
    let div = createResultDiv();
    div.innerHTML = "";
    let tasks = parseTasks();
    let summary = [];

    // Get unique tasks
    tasks = tasks.filter((val, idx, self) => self.findIndex(t => isTaskEqual(val, t)) === idx)

    tasks.forEach((task) => {
      let operational_area = task.operational_area;
      summary[operational_area] = summary[operational_area] || [];
      let task_desc = task.title;
      if(!['WM', 'Wiremaze'].includes(task.client)) {
        task_desc = `${task.client} - ${task_desc}`;
      }
      summary[operational_area].push(task_desc);
    })
    let resultList = document.createElement("ul");
    Object.entries(summary).forEach(([key, val]) => {
      let resultItem = document.createElement("li");
      resultItem.innerHTML = key;

      let operationalList = document.createElement("ul");
      val.forEach((title) => {
        let taskLi = document.createElement("li");
        taskLi.innerHTML = title;
        operationalList.appendChild(taskLi);
      })
      resultItem.appendChild(operationalList);
      resultList.appendChild(resultItem);
    })

    div.appendChild(resultList);
  }

  let btn = document.createElement("button");
  btn.innerHTML = "(Custom) Fazer Resumo Rápido";
  btn.className = "btn btn-primary";
  btn.style = "float: right;";
  btn.onclick = parseSummary;
  $(".task_labels.well").append(btn);
})();