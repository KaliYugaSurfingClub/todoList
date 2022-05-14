

import { Note } from "./Note.js";


export class TodoList {

  constructor() {
    this.data = new Map(JSON.parse(localStorage.getItem("JSONData")));

    this.listElem = document.querySelector(".todo-list");

    this.form = document.querySelector(".form-create");
    this.form.onsubmit = this.create.bind(this);

    document.onclick = this.onClick.bind(this);
  }

  init() {
    let todoListText = "";

    this.data.forEach(({ title, text, id }) => {
      todoListText += `
          <article class="note" data-id="${id}">
            <div class="note__wrapper">
            
              <h2 class="note__title">${title}</h2>
  
              <p class="note__text">${text}</p>
                  
              <div class="note__control" data-hidden="true">
              
                 <button class="note__open-control">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <use xlink:href="/sprite.svg#svg--icon-three-dots"></use>
                  </svg>
                </button>
                  
                <ul class="note__buttons">
                  <li>
                    <button class="note__btn" data-todo-action="remove">Удалить</button>
                  </li
    
                  <li>
                    <button class="note__btn" data-todo-action="edit">Редактировать</button>
                  </li>
                </ul>
             
              </div>
            
            </div>
          </article>
      `
    });

    this.listElem.innerHTML = todoListText;
  }

  create() {
    let noteObj = {
      title: this.form.elements["note-title"].value,
      text: this.form.elements["note-text"].value,
      id: this.getRandomID(),
    }

    this.data.set(`${noteObj.id}`, new Note(noteObj));
    this.save();
    this.init();

    return false;
  }

  save() {
    const JSONData = JSON.stringify(Array.from(this.data));
    localStorage.setItem("JSONData", JSONData);
  }

  remove(note) {
    const id = note.dataset.id;

    this.data.delete(id);

    this.save();
    this.init();
  }

  edit(note) {
    note.innerHTML = `
         <form class="note__form" name="edit" action="">

           <label for="note-title">
             <input name="note-title" id="note-title" type="text">
           </label>

           <label for="note-text">
             <input name="note-text" id="note-text" type="text">
           </label>
            
            <button class="note-edit__submit" type="submit">Сохранить</button>
            <button type="submit">Назад</button>
         </form>
    `

    const noteFormElem = note.querySelector(".note__form");
    noteFormElem.addEventListener("click", () => {
      console.log(123)
    });

    let noteObj = this.data.get(`${note.dataset.id}`);
    noteFormElem.addEventListener("submit", () => {
      const newTitle = noteFormElem.elements["note-title"].value;
      const newText = noteFormElem.elements["note-text"].value;

      noteObj.title = newTitle;
      noteObj.text = newText;

      this.save();
      this.init();

      return false;
    });

  }

  getRandomID = this.makeRandomNum(6);
  makeRandomNum(length) {
    let used = []

    return function getNum() {
      const num = `${Math.random().toFixed(length)}`.slice(3, length + 2);

      if (used.includes(num)) {
        getNum();
      } else {
        used.push(num);
        return num;
      }

    }
  }

  onClick(event) {
    if (!event.target.closest("[data-todo-action]")) return;

    const note = event.target.closest(".note");
    const action = event.target.closest("[data-todo-action]").dataset.todoAction;

    this[action](note);
  }
}