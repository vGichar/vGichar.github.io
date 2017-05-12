import { Component } from '@angular/core';

class Section{
	public name: string;
	public items: SectionItem[];

	constructor(name: string, items: SectionItem[] = []){
		this.name = name;
		this.items = items;
	}

	public addItem(item: SectionItem){
		this.items.push(item);
	}
}

class SectionItem{
	public title: string;
	public text: string;
	public image: string;

	constructor(title: string, text: string, image: string){
		this.title = title;
		this.text = text;
		this.image = image;
	}
}

@Component({
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent {
	sections: Section[] = [];

	constructor(){
		this.sections = [];

		let databases = new Section("Databases");
		this.sections.push(databases);

		databases.addItem(new SectionItem("MySql", "Hello mysql", "https://uploads.toptal.io/blog/category/logo/44/mysql.png"));
		databases.addItem(new SectionItem("PostgreSql", "Hello postgre", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png"));
		databases.addItem(new SectionItem("MS Sql", "Hello ms sql", "https://uploads.toptal.io/blog/category/logo/43/mssql.png"));


		let languages = new Section("Programming Languages");
		this.sections.push(languages);
	}
}
