import { Component, Input } from '@angular/core';

@Component({
	selector: "skillbox",
	templateUrl: './skillbox.component.html',
	styleUrls: ['./skillbox.component.scss']
})
export class SkillBoxComponent {
	@Input() title: string;
	@Input() text: string;
	@Input() image: string

	constructor(){
	}
}
