import { Component, HostListener } from '@angular/core';
import { Observable } from "rxjs/Rx";

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	padding: number;
	hobby: string;

	constructor(){
		this.onResize(undefined);

		this.bindHobby();
	}

	private bindHobby(){
		let hobbies = ["developer", "entusiast", "writer"];
		let time = 2200;
		let charsPause = 6;

		Observable.timer(0, time)
			.mergeMap(x => {
				let sum = "";
				let hobby = hobbies[x % hobbies.length];
				return Observable.interval(time / (hobby.length + charsPause))
					.take(hobby.length)
					.mergeMap(charIdx => {
						sum += hobby[charIdx];
						this.hobby = sum + "|";
						return sum;
					});

			}).subscribe();
	}

	ngOnInit() {
		this.onResize(undefined);
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		let centerContent = document.getElementById("center-content");
		if(centerContent != null){
			this.padding = (window.innerHeight - centerContent.children[0].clientHeight - 70) / 2;
		}
	}
}
